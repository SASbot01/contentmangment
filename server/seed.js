// ─────────────────────────────────────────────────────────────
//  Seed: carga datos demo y un usuario admin por defecto si está vacío
// ─────────────────────────────────────────────────────────────
import { db, Creators, Content, Campaigns } from './db.js'
import { createUser } from './auth.js'
import { SEED_CREATORS, SEED_CONTENT, SEED_CAMPAIGNS } from '../src/data.js'

export function seedIfEmpty() {
  const tx = db.transaction(() => {
    if (Creators.all().length === 0) {
      SEED_CREATORS.forEach((c) => Creators.insert(c))
      SEED_CONTENT.forEach((c) => Content.insert(c))
      SEED_CAMPAIGNS.forEach((c) => Campaigns.insert(c))
      console.log('  ✓ Datos demo cargados (creadores, contenido, campañas)')
    }
  })
  tx()

  const userCount = db.prepare('SELECT COUNT(*) n FROM users').get().n
  if (userCount === 0) {
    createUser({ username: 'admin', password: 'admin123', name: 'Administrador', role: 'admin' })
    console.log('  ✓ Usuario admin creado  →  usuario: admin   contraseña: admin123')
  }
}

// Reinicia SOLO los datos de contenido/campañas/creadores (mantiene usuarios)
export function resetDemoData() {
  const tx = db.transaction(() => {
    db.exec('DELETE FROM content; DELETE FROM campaigns; DELETE FROM creators;')
    SEED_CREATORS.forEach((c) => Creators.insert(c))
    SEED_CONTENT.forEach((c) => Content.insert(c))
    SEED_CAMPAIGNS.forEach((c) => Campaigns.insert(c))
  })
  tx()
}

// Permite ejecutar:  node server/seed.js              -> seed
//                    node server/seed.js user u p n   -> crear usuario
const isMain = process.argv[1] && process.argv[1].endsWith('seed.js')
if (isMain) {
  const [, , cmd, ...rest] = process.argv
  if (cmd === 'user') {
    const [username, password, ...nameParts] = rest
    if (!username || !password) {
      console.log('Uso: node server/seed.js user <usuario> <contraseña> [nombre]')
      process.exit(1)
    }
    const u = createUser({ username, password, name: nameParts.join(' ') || username, role: 'user' })
    console.log('✓ Usuario creado/actualizado:', u.username)
  } else {
    seedIfEmpty()
    console.log('✓ Seed completado')
  }
  process.exit(0)
}
