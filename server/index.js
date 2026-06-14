// ─────────────────────────────────────────────────────────────
//  Servidor: API REST + autenticación + servido de la app (SPA)
// ─────────────────────────────────────────────────────────────
import express from 'express'
import path from 'path'
import fs from 'fs'
import http from 'http'
import https from 'https'
import { fileURLToPath } from 'url'
import { Creators, Content, Campaigns } from './db.js'
import { authenticate, registerUser, listUsers, deleteUser, createSession, destroySession, requireAuth, requireAdmin, uid } from './auth.js'
import { seedIfEmpty } from './seed.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 5180

seedIfEmpty()

const app = express()
app.use(express.json())

// ── Auth ──
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {}
  const user = authenticate(username || '', password || '')
  if (!user) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' })
  const token = createSession(user.id)
  res.json({ token, user })
})

// Registro público (auto-login tras registrarse)
app.post('/api/register', (req, res) => {
  try {
    const { username, password, name } = req.body || {}
    const user = registerUser({ username, password, name })
    const token = createSession(user.id)
    res.status(201).json({ token, user })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.post('/api/logout', requireAuth, (req, res) => {
  destroySession(req.token)
  res.status(204).end()
})

app.get('/api/me', requireAuth, (req, res) => res.json(req.user))

// ── Gestión de usuarios (solo admin) ──
app.get('/api/users', requireAuth, requireAdmin, (req, res) => res.json(listUsers()))
app.delete('/api/users/:id', requireAuth, requireAdmin, (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta' })
  deleteUser(req.params.id)
  res.status(204).end()
})

// ── A partir de aquí, todo requiere sesión ──
app.use('/api', requireAuth)

// Estado completo en una llamada
app.get('/api/state', (req, res) => {
  res.json({
    creators: Creators.all(),
    content: Content.all(),
    campaigns: Campaigns.all(),
  })
})

// ── Contenido ──
app.post('/api/content', (req, res) => res.status(201).json(Content.insert({ ...req.body, id: uid() })))
app.put('/api/content/:id', (req, res) => res.json(Content.upsert({ ...req.body, id: req.params.id })))
app.patch('/api/content/:id/stage', (req, res) => {
  const item = Content.get(req.params.id)
  if (!item) return res.status(404).json({ error: 'No encontrado' })
  res.json(Content.update({ ...item, stage: req.body.stage }))
})
app.delete('/api/content/:id', (req, res) => { Content.delete(req.params.id); res.status(204).end() })

// ── Campañas ──
app.post('/api/campaigns', (req, res) => res.status(201).json(Campaigns.insert({ ...req.body, id: uid() })))
app.put('/api/campaigns/:id', (req, res) => res.json(Campaigns.upsert({ ...req.body, id: req.params.id })))
app.delete('/api/campaigns/:id', (req, res) => { Campaigns.delete(req.params.id); res.status(204).end() })

// ── Creadores ──
app.post('/api/creators', (req, res) => res.status(201).json(Creators.insert({ ...req.body, id: uid() })))
app.put('/api/creators/:id', (req, res) => res.json(Creators.upsert({ ...req.body, id: req.params.id })))

// ── Servir la app compilada (producción) ──
const distDir = path.join(__dirname, '..', 'dist')
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get('*', (req, res) => res.sendFile(path.join(distDir, 'index.html')))
} else {
  console.log('  ⚠ No existe /dist — ejecuta "npm run build" para servir la app desde este servidor.')
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  🐺 ContentForge corriendo en http://0.0.0.0:${PORT}`)
})

// ── HTTPS para Cloudflare (Full strict) usando el Origin Certificate ──
// Si existen los certificados, levanta HTTPS en :443 y redirige 80 → 443.
const CERT = path.join(__dirname, 'certs', 'origin.pem')
const KEY = path.join(__dirname, 'certs', 'origin.key')
if (fs.existsSync(CERT) && fs.existsSync(KEY)) {
  https.createServer({ cert: fs.readFileSync(CERT), key: fs.readFileSync(KEY) }, app)
    .listen(443, '0.0.0.0', () => console.log('  🔒 HTTPS (origin cert) en https://0.0.0.0:443\n'))

  http.createServer((req, res) => {
    res.writeHead(301, { Location: 'https://' + (req.headers.host || '') + req.url })
    res.end()
  }).listen(80, '0.0.0.0', () => console.log('  ↪ Redirección 80 → 443 activa'))
} else {
  console.log('  ℹ Sin certificados aún (server/certs/origin.pem + origin.key) → HTTPS desactivado\n')
}
