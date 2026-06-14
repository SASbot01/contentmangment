// ─────────────────────────────────────────────────────────────
//  Autenticación: hashing de contraseñas + tokens de sesión
// ─────────────────────────────────────────────────────────────
import crypto from 'crypto'
import { db } from './db.js'

export const uid = () => crypto.randomBytes(6).toString('hex')

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password, stored) {
  try {
    const [salt, hash] = stored.split(':')
    const test = crypto.scryptSync(password, salt, 64).toString('hex')
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(test, 'hex'))
  } catch {
    return false
  }
}

// ── Usuarios ──
export function createUser({ username, password, name, role = 'user' }) {
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username)
  if (existing) {
    db.prepare('UPDATE users SET password=?, name=?, role=? WHERE username=?')
      .run(hashPassword(password), name || username, role, username)
    return db.prepare('SELECT id, username, name, role FROM users WHERE username=?').get(username)
  }
  const id = uid()
  db.prepare('INSERT INTO users (id, username, password, name, role, createdAt) VALUES (?,?,?,?,?,?)')
    .run(id, username, hashPassword(password), name || username, role, new Date().toISOString())
  return { id, username, name: name || username, role }
}

// Registro público: falla si el usuario ya existe (no sobreescribe)
export function registerUser({ username, password, name }) {
  username = (username || '').trim()
  if (!username || !password) throw new Error('Usuario y contraseña obligatorios')
  if (password.length < 4) throw new Error('La contraseña debe tener al menos 4 caracteres')
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username)
  if (existing) throw new Error('Ese usuario ya existe')
  const id = uid()
  db.prepare('INSERT INTO users (id, username, password, name, role, createdAt) VALUES (?,?,?,?,?,?)')
    .run(id, username, hashPassword(password), name || username, 'user', new Date().toISOString())
  return { id, username, name: name || username, role: 'user' }
}

export function listUsers() {
  return db.prepare('SELECT id, username, name, role, createdAt FROM users ORDER BY createdAt DESC').all()
}

export function deleteUser(id) {
  db.prepare('DELETE FROM sessions WHERE userId = ?').run(id)
  db.prepare('DELETE FROM users WHERE id = ?').run(id)
}

export function authenticate(username, password) {
  const u = db.prepare('SELECT * FROM users WHERE username = ?').get(username)
  if (!u || !verifyPassword(password, u.password)) return null
  return { id: u.id, username: u.username, name: u.name, role: u.role }
}

// ── Sesiones (tokens) ──
export function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex')
  db.prepare('INSERT INTO sessions (token, userId, createdAt) VALUES (?,?,?)')
    .run(token, userId, new Date().toISOString())
  return token
}

export function destroySession(token) {
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token)
}

export function userFromToken(token) {
  if (!token) return null
  const s = db.prepare('SELECT userId FROM sessions WHERE token = ?').get(token)
  if (!s) return null
  return db.prepare('SELECT id, username, name, role FROM users WHERE id = ?').get(s.userId)
}

// ── Middleware Express ──
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  const user = userFromToken(token)
  if (!user) return res.status(401).json({ error: 'No autorizado' })
  req.user = user
  req.token = token
  next()
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Solo administradores' })
  next()
}
