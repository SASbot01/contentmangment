// ─────────────────────────────────────────────────────────────
//  Modelo de datos, constantes y datos de ejemplo (seed)
// ─────────────────────────────────────────────────────────────

// Pipeline de producción de contenido (estados del Kanban)
export const STAGES = [
  { id: 'idea',       label: 'Idea',        color: '#94a3b8' },
  { id: 'guion',      label: 'Guion',       color: '#f59e0b' },
  { id: 'grabacion',  label: 'Grabación',   color: '#ec4899' },
  { id: 'edicion',    label: 'Edición',     color: '#8b5cf6' },
  { id: 'revision',   label: 'Revisión',    color: '#3b82f6' },
  { id: 'listo',      label: 'Listo',       color: '#10b981' },
  { id: 'publicado',  label: 'Publicado',   color: '#0ea5e9' },
]

export const stageById = (id) => STAGES.find((s) => s.id === id) || STAGES[0]

// Tipos de pieza de contenido
export const CONTENT_TYPES = [
  'Reel', 'Short', 'TikTok', 'Carrusel', 'Post', 'Story',
  'Vídeo largo', 'Live', 'Newsletter', 'Creativo Ad',
]

// Plataformas
export const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', color: '#d6249f' },
  { id: 'tiktok',    label: 'TikTok',    color: '#000000' },
  { id: 'youtube',   label: 'YouTube',   color: '#ff0000' },
  { id: 'meta-ads',  label: 'Meta Ads',  color: '#1877f2' },
  { id: 'youtube-ads', label: 'YouTube Ads', color: '#cc0000' },
  { id: 'tiktok-ads', label: 'TikTok Ads', color: '#25f4ee' },
  { id: 'email',     label: 'Email',     color: '#6366f1' },
  { id: 'web',       label: 'Web / Funnel', color: '#0ea5e9' },
]

export const platformById = (id) => PLATFORMS.find((p) => p.id === id) || PLATFORMS[0]

// Categoría: orgánico vs ads
export const CATEGORIES = [
  { id: 'organico', label: 'Orgánico', color: '#10b981' },
  { id: 'ads',      label: 'Ads',      color: '#f97316' },
]

// Estados de campañas de ads
export const CAMPAIGN_STATUS = [
  { id: 'borrador',   label: 'Borrador',   color: '#94a3b8' },
  { id: 'revision',   label: 'En revisión', color: '#f59e0b' },
  { id: 'activa',     label: 'Activa',     color: '#10b981' },
  { id: 'pausada',    label: 'Pausada',    color: '#ef4444' },
  { id: 'finalizada', label: 'Finalizada', color: '#64748b' },
]
export const campaignStatusById = (id) => CAMPAIGN_STATUS.find((s) => s.id === id) || CAMPAIGN_STATUS[0]

export const OBJECTIVES = ['Reconocimiento', 'Tráfico', 'Leads', 'Ventas', 'Retargeting', 'Lanzamiento']

const uid = () => Math.random().toString(36).slice(2, 10)
const today = new Date()
const day = (offset) => {
  const d = new Date(today)
  d.setDate(d.getDate() + offset)
  return d.toISOString().slice(0, 10)
}

// ── Infoproductores / creadores (clientes) ──
export const SEED_CREATORS = [
  { id: 'c1', name: 'Laura Méndez',  brand: 'Mindset Millonario', niche: 'Mentalidad & finanzas', avatar: 'LM', color: '#2563eb' },
  { id: 'c2', name: 'Dani Ferrer',   brand: 'FitCode',           niche: 'Fitness & hábitos',     avatar: 'DF', color: '#ec4899' },
  { id: 'c3', name: 'Sofía Reyes',   brand: 'Closer Academy',    niche: 'Ventas high-ticket',    avatar: 'SR', color: '#0ea5e9' },
]

// ── Contenido ──
export const SEED_CONTENT = [
  { id: uid(), creatorId: 'c1', title: 'Reel — 3 errores al invertir tus primeros 1.000€', type: 'Reel', platform: 'instagram', category: 'organico', stage: 'idea', date: day(2), owner: 'Laura', hook: '"Si tienes 1.000€ parados, estás perdiendo dinero"', cta: 'Guarda este reel', notes: 'Grabar en exteriores, formato a cámara.' },
  { id: uid(), creatorId: 'c1', title: 'Carrusel — Presupuesto 50/30/20 explicado', type: 'Carrusel', platform: 'instagram', category: 'organico', stage: 'guion', date: day(4), owner: 'Equipo edición', hook: 'Cómo reparto mi sueldo cada mes', cta: 'Link en bio: plantilla gratis', notes: '8 slides, diseño en plantilla morada.' },
  { id: uid(), creatorId: 'c1', title: 'Creativo Ad — VSL lanzamiento curso', type: 'Creativo Ad', platform: 'meta-ads', category: 'ads', stage: 'edicion', date: day(1), owner: 'Editor Joan', hook: 'De 0 a tu primera cartera de inversión', cta: 'Apúntate a la masterclass', notes: 'Versión 45s + versión 15s para retargeting.' },
  { id: uid(), creatorId: 'c2', title: 'Short — Rutina de 4 min sin equipo', type: 'Short', platform: 'youtube', category: 'organico', stage: 'grabacion', date: day(3), owner: 'Dani', hook: '"Sin tiempo para el gym? Mira esto"', cta: 'Suscríbete', notes: '' },
  { id: uid(), creatorId: 'c2', title: 'TikTok — Lo que como en un día (cutting)', type: 'TikTok', platform: 'tiktok', category: 'organico', stage: 'revision', date: day(0), owner: 'Dani', hook: 'Full day of eating en definición', cta: 'Sígueme para más', notes: 'Pendiente aprobar subtítulos.' },
  { id: uid(), creatorId: 'c2', title: 'Creativo Ad — Testimonio cliente -12kg', type: 'Creativo Ad', platform: 'meta-ads', category: 'ads', stage: 'listo', date: day(-1), owner: 'Editor Joan', hook: 'Perdió 12kg en 90 días con el método', cta: 'Reserva tu plaza', notes: 'UGC real, con permiso firmado.' },
  { id: uid(), creatorId: 'c3', title: 'Reel — Cómo cerrar una venta de 5.000€', type: 'Reel', platform: 'instagram', category: 'organico', stage: 'publicado', date: day(-3), owner: 'Sofía', hook: '"La objeción del precio no existe"', cta: 'Comenta CLOSER', notes: 'Buen rendimiento, replicar formato.' },
  { id: uid(), creatorId: 'c3', title: 'Vídeo largo — Masterclass setting & closing', type: 'Vídeo largo', platform: 'youtube', category: 'organico', stage: 'edicion', date: day(6), owner: 'Editor externo', hook: 'El sistema de ventas high-ticket completo', cta: 'Agenda llamada', notes: '22 min, capítulos marcados.' },
  { id: uid(), creatorId: 'c3', title: 'Creativo Ad — Hook agresivo "deja tu trabajo"', type: 'Creativo Ad', platform: 'tiktok-ads', category: 'ads', stage: 'guion', date: day(5), owner: 'Copy Marta', hook: '"Deja de cambiar horas por dinero"', cta: 'Solicita info', notes: '3 variantes de hook para testear.' },
]

// ── Campañas de ads ──
export const SEED_CAMPAIGNS = [
  { id: uid(), creatorId: 'c1', name: 'Lanzamiento Masterclass Inversión', objective: 'Lanzamiento', platform: 'meta-ads', status: 'activa', budget: 3000, spent: 1240, leads: 320, roas: 2.8, start: day(-7), end: day(7), notes: 'Carrusel + VSL. Escalar el conjunto de anuncios ganador.' },
  { id: uid(), creatorId: 'c2', name: 'Captación Reto 90 días', objective: 'Leads', platform: 'meta-ads', status: 'activa', budget: 2000, spent: 860, leads: 210, roas: 3.4, start: day(-4), end: day(10), notes: 'El testimonio UGC está rindiendo mejor que el creativo de marca.' },
  { id: uid(), creatorId: 'c3', name: 'Retargeting webinar closing', objective: 'Retargeting', platform: 'youtube-ads', status: 'revision', budget: 1500, spent: 0, leads: 0, roas: 0, start: day(3), end: day(20), notes: 'Pendiente aprobar creativos antes de activar.' },
  { id: uid(), creatorId: 'c1', name: 'Awareness marca personal Q2', objective: 'Reconocimiento', platform: 'tiktok-ads', status: 'pausada', budget: 1200, spent: 740, leads: 40, roas: 1.1, start: day(-20), end: day(-2), notes: 'CPA alto, pausada para revisar segmentación.' },
]
