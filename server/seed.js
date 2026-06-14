// ─────────────────────────────────────────────────────────────
//  Arranque: asegura que existe un usuario admin (sin datos demo)
// ─────────────────────────────────────────────────────────────
import { db } from './db.js'
import { createUser } from './auth.js'

// Solo garantiza el usuario admin. NO carga datos demo.
export function seedIfEmpty() {
  const userCount = db.prepare('SELECT COUNT(*) n FROM users').get().n
  if (userCount === 0) {
    createUser({ username: 'admin', password: 'admin123', name: 'Administrador', role: 'admin' })
    console.log('  ✓ Usuario admin creado  →  usuario: admin   contraseña: admin123')
  }
}

// CLI:  node server/seed.js              -> asegura admin
//       node server/seed.js user u p n   -> crear usuario
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
    console.log('✓ Listo')
  }
  process.exit(0)
}
