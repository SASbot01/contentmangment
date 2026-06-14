# ContentForge · CRM de Contenido

CRM de contenido para infoproductores: organiza contenido orgánico, creativos de ads y campañas de anuncios por marca, con pipeline de producción tipo Kanban, calendario y panel de administración.

## Stack
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node + Express (API REST)
- **Base de datos:** SQLite (better-sqlite3)
- **Auth:** registro/login con tokens de sesión, contraseñas hasheadas (scrypt)

## Funcionalidades
- 🔐 Registro y login directo en la web + rol **admin** que ve todos los perfiles
- 📊 Dashboard con KPIs (producción, inversión en ads, leads, ROAS)
- 🗂️ Contenido en tablero Kanban (Idea → Guion → Grabación → Edición → Revisión → Listo → Publicado) y vista lista
- 📅 Calendario de publicaciones
- 📣 Campañas de ads con presupuesto, leads, ROAS y creativos
- 👥 Multi-marca (varios infoproductores)

## Desarrollo
```bash
npm install
npm run dev:full      # API (3001) + frontend (5180) con hot-reload
```

## Producción
```bash
npm install
npm run build         # compila el frontend a /dist
npm run server        # sirve API + app en un solo proceso (puerto 5180)
```
Variable `PORT` para cambiar el puerto (por defecto `5180`).

## Usuarios
- Admin por defecto al arrancar: **admin / admin123** (cámbialo).
- Crear usuario por CLI: `node server/seed.js user <usuario> <contraseña> "<Nombre>"`

## Cuenta de administrador
El rol `admin` ve la pestaña **Perfiles** con todos los usuarios registrados y puede eliminarlos.
