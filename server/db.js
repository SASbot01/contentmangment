// ─────────────────────────────────────────────────────────────
//  Base de datos (SQLite vía better-sqlite3) + esquema + repos
// ─────────────────────────────────────────────────────────────
import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const db = new Database(path.join(__dirname, 'data.db'))
db.pragma('journal_mode = WAL')

// ── Esquema ──
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id        TEXT PRIMARY KEY,
    username  TEXT UNIQUE NOT NULL,
    password  TEXT NOT NULL,
    name      TEXT,
    role      TEXT DEFAULT 'user',
    createdAt TEXT
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token     TEXT PRIMARY KEY,
    userId    TEXT NOT NULL,
    createdAt TEXT
  );

  CREATE TABLE IF NOT EXISTS creators (
    id     TEXT PRIMARY KEY,
    name   TEXT,
    brand  TEXT,
    niche  TEXT,
    avatar TEXT,
    color  TEXT
  );

  CREATE TABLE IF NOT EXISTS content (
    id        TEXT PRIMARY KEY,
    creatorId TEXT,
    title     TEXT,
    type      TEXT,
    platform  TEXT,
    category  TEXT,
    stage     TEXT,
    date      TEXT,
    owner     TEXT,
    hook      TEXT,
    cta       TEXT,
    notes     TEXT
  );

  CREATE TABLE IF NOT EXISTS campaigns (
    id        TEXT PRIMARY KEY,
    creatorId TEXT,
    name      TEXT,
    objective TEXT,
    platform  TEXT,
    status    TEXT,
    budget    REAL,
    spent     REAL,
    leads     INTEGER,
    roas      REAL,
    "start"   TEXT,
    "end"     TEXT,
    notes     TEXT
  );
`)

// ── Repositorio genérico para una tabla con columnas conocidas ──
export function makeRepo(table, cols) {
  const q = (c) => '"' + c + '"'
  const quoted = cols.map(q).join(', ')
  const placeholders = cols.map((c) => '@' + c).join(', ')
  const setClause = cols.filter((c) => c !== 'id').map((c) => `${q(c)}=@${c}`).join(', ')

  const stmts = {
    all: db.prepare(`SELECT * FROM ${table}`),
    get: db.prepare(`SELECT * FROM ${table} WHERE id = ?`),
    insert: db.prepare(`INSERT INTO ${table} (${quoted}) VALUES (${placeholders})`),
    update: db.prepare(`UPDATE ${table} SET ${setClause} WHERE id = @id`),
    del: db.prepare(`DELETE FROM ${table} WHERE id = ?`),
  }

  // normaliza el objeto a exactamente las columnas (evita params extra/faltantes)
  const pick = (obj) => Object.fromEntries(cols.map((c) => [c, obj[c] ?? null]))

  return {
    all: () => stmts.all.all(),
    get: (id) => stmts.get.get(id),
    insert: (obj) => { stmts.insert.run(pick(obj)); return stmts.get.get(obj.id) },
    update: (obj) => { stmts.update.run(pick(obj)); return stmts.get.get(obj.id) },
    upsert: (obj) => (stmts.get.get(obj.id) ? (stmts.update.run(pick(obj)), stmts.get.get(obj.id)) : (stmts.insert.run(pick(obj)), stmts.get.get(obj.id))),
    delete: (id) => stmts.del.run(id),
  }
}

export const Creators = makeRepo('creators', ['id', 'name', 'brand', 'niche', 'avatar', 'color'])
export const Content = makeRepo('content', ['id', 'creatorId', 'title', 'type', 'platform', 'category', 'stage', 'date', 'owner', 'hook', 'cta', 'notes'])
export const Campaigns = makeRepo('campaigns', ['id', 'creatorId', 'name', 'objective', 'platform', 'status', 'budget', 'spent', 'leads', 'roas', 'start', 'end', 'notes'])
