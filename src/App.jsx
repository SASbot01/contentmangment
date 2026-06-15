import React, { useState, useMemo } from 'react'
import {
  LayoutDashboard, KanbanSquare, CalendarDays, Megaphone, Users, ShieldCheck,
  Plus, Search, LogOut, Loader2, Pencil, X,
} from 'lucide-react'
import { useStore } from './store'
import { Avatar } from './components/ui'
import { ContentForm, CampaignForm, CreatorForm } from './components/forms'
import Dashboard from './views/Dashboard'
import ContentBoard from './views/ContentBoard'
import Calendar from './views/Calendar'
import Campaigns from './views/Campaigns'
import UsersView from './views/Users'
import Login from './views/Login'

const BASE_NAV = [
  { id: 'dashboard', label: 'Dashboard', short: 'Inicio', icon: LayoutDashboard },
  { id: 'content',   label: 'Contenido', short: 'Contenido', icon: KanbanSquare },
  { id: 'calendar',  label: 'Calendario', short: 'Agenda', icon: CalendarDays },
  { id: 'campaigns', label: 'Campañas Ads', short: 'Ads', icon: Megaphone },
]
const ADMIN_NAV = { id: 'users', label: 'Perfiles', short: 'Perfiles', icon: ShieldCheck }

const Logo = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 32 32" className={className}><path d="M9 10l3 4-2 8 6-4 6 4-2-8 3-4-5 1-2-4-2 4-5-1z" fill="#fff" /></svg>
)

export default function App() {
  const store = useStore()
  const { db } = store
  const [nav, setNav] = useState('dashboard')
  const [creatorFilter, setCreatorFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [mobileSearch, setMobileSearch] = useState(false)

  const [contentModal, setContentModal] = useState({ open: false, initial: null })
  const [campaignModal, setCampaignModal] = useState({ open: false, initial: null })
  const [creatorModal, setCreatorModal] = useState({ open: false, initial: null })

  // datos filtrados por creador + búsqueda
  const content = useMemo(() => db.content.filter((c) =>
    (creatorFilter === 'all' || c.creatorId === creatorFilter) &&
    (!search || (c.title + ' ' + (c.hook || '') + ' ' + c.type).toLowerCase().includes(search.toLowerCase()))
  ), [db.content, creatorFilter, search])

  const campaigns = useMemo(() => db.campaigns.filter((c) =>
    (creatorFilter === 'all' || c.creatorId === creatorFilter) &&
    (!search || c.name.toLowerCase().includes(search.toLowerCase()))
  ), [db.campaigns, creatorFilter, search])

  const openContent = (initial) => setContentModal({ open: true, initial: initial || { creatorId: creatorFilter !== 'all' ? creatorFilter : db.creators[0]?.id } })
  const openCampaign = (initial) => setCampaignModal({ open: true, initial: initial || { creatorId: creatorFilter !== 'all' ? creatorFilter : db.creators[0]?.id } })
  const openCreator = (initial) => setCreatorModal({ open: true, initial: initial || null })

  const isAdmin = store.user?.role === 'admin'
  const NAV = isAdmin ? [...BASE_NAV, ADMIN_NAV] : BASE_NAV
  const activeCreator = db.creators.find((c) => c.id === creatorFilter)
  const title = NAV.find((n) => n.id === nav)?.label

  // ── Guardia de autenticación ──
  if (!store.ready) {
    return (
      <div className="h-full flex items-center justify-center text-brand-500">
        <Loader2 className="animate-spin" size={28} />
      </div>
    )
  }
  if (!store.user) {
    return <Login onLogin={store.login} onRegister={store.register} />
  }

  return (
    <div className="flex h-full">
      {/* ───── Sidebar (escritorio) ───── */}
      <aside className="w-64 shrink-0 bg-white border-r border-slate-200/80 flex-col p-4 hidden md:flex">
        <div className="flex items-center gap-2.5 px-2 py-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow">
            <Logo />
          </div>
          <div>
            <p className="font-extrabold text-slate-800 leading-none">ContentForge</p>
            <p className="text-[11px] text-slate-400 mt-0.5">CRM de Contenido</p>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {NAV.map((n) => {
            const Icon = n.icon
            const active = nav === n.id
            return (
              <button
                key={n.id} onClick={() => setNav(n.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-glow' : 'text-slate-500 hover:bg-brand-50 hover:text-brand-700'}`}
              >
                <Icon size={18} /> {n.label}
              </button>
            )
          })}
        </nav>

        {/* lista de marcas */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400 font-bold flex items-center gap-1.5"><Users size={12} /> Marcas</p>
            <button onClick={() => openCreator()} title="Nueva marca" className="text-slate-400 hover:text-brand-600 p-0.5 rounded hover:bg-brand-50"><Plus size={15} /></button>
          </div>
          <button onClick={() => setCreatorFilter('all')} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${creatorFilter === 'all' ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:bg-slate-50'}`}>Todas las marcas</button>
          {db.creators.map((c) => (
            <div key={c.id} className={`group w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${creatorFilter === c.id ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:bg-slate-50'}`}>
              <button onClick={() => setCreatorFilter(c.id)} className="flex items-center gap-2.5 min-w-0 flex-1 text-left">
                <Avatar creator={c} size={24} />
                <span className="truncate font-medium">{c.brand}</span>
              </button>
              <button onClick={() => openCreator(c)} title="Editar marca" className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-brand-600 p-0.5"><Pencil size={13} /></button>
            </div>
          ))}
          {db.creators.length === 0 && (
            <button onClick={() => openCreator()} className="w-full mt-1 px-3 py-2 rounded-lg text-xs text-brand-600 hover:bg-brand-50 text-left flex items-center gap-1.5 font-medium">
              <Plus size={13} /> Crea tu primera marca
            </button>
          )}
        </div>

        {/* usuario + logout */}
        <div className="mt-2 pt-3 border-t border-slate-100 flex items-center gap-2.5 px-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {(store.user.name || store.user.username).slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-700 truncate">{store.user.name || store.user.username}</p>
            <p className="text-[11px] text-slate-400 truncate">{store.user.role === 'admin' ? 'Administrador' : 'Miembro'}</p>
          </div>
          <button onClick={store.logout} title="Cerrar sesión" className="text-slate-400 hover:text-brand-600 p-1.5 rounded-lg hover:bg-brand-50">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* ───── Main ───── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* header */}
        <header className="bg-white/85 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-8 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 shrink-0 pt-safe">
          {/* logo solo en móvil */}
          <div className="md:hidden w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow shrink-0">
            <Logo />
          </div>

          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-800 leading-tight truncate">{title}</h1>
            <p className="text-xs text-slate-400 truncate">{activeCreator ? activeCreator.brand + ' · ' + activeCreator.niche : 'Todas las marcas'}</p>
          </div>

          <div className="relative ml-auto hidden sm:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-9 w-56 lg:w-72 py-2" placeholder="Buscar contenido o campañas…"
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* buscar (móvil) */}
          <button onClick={() => setMobileSearch((v) => !v)} className="sm:hidden ml-auto w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 active:scale-95 transition">
            <Search size={18} />
          </button>

          {nav !== 'users' && (
            <button onClick={() => (nav === 'campaigns' ? openCampaign() : openContent())} className="btn-primary !px-3 sm:!px-4">
              <Plus size={18} /> <span className="hidden sm:inline">{nav === 'campaigns' ? 'Campaña' : 'Contenido'}</span>
            </button>
          )}
        </header>

        {/* búsqueda desplegable (móvil) */}
        {mobileSearch && (
          <div className="sm:hidden px-4 py-2.5 bg-white border-b border-slate-200/80 animate-fadeIn">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                autoFocus className="input pl-9 pr-9 py-2.5" placeholder="Buscar…"
                value={search} onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 p-1">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* selector de marca (móvil) */}
        <div className="md:hidden px-4 py-2.5 bg-white border-b border-slate-200/80">
          <select className="input py-2.5" value={creatorFilter} onChange={(e) => setCreatorFilter(e.target.value)}>
            <option value="all">Todas las marcas</option>
            {db.creators.map((c) => <option key={c.id} value={c.id}>{c.brand}</option>)}
          </select>
        </div>

        {/* content area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 pb-28 md:pb-8">
          {nav === 'dashboard' && <Dashboard content={content} campaigns={campaigns} creators={db.creators} onOpenContent={openContent} />}
          {nav === 'content' && <ContentBoard content={content} creators={db.creators} onMove={store.moveContent} onOpen={openContent} onNew={openContent} />}
          {nav === 'calendar' && <Calendar content={content} creators={db.creators} onOpen={openContent} onNew={openContent} />}
          {nav === 'campaigns' && <Campaigns campaigns={campaigns} content={content} creators={db.creators} onOpen={openCampaign} onNew={openCampaign} />}
          {nav === 'users' && isAdmin && <UsersView currentUser={store.user} />}
        </main>
      </div>

      {/* ───── Barra de pestañas inferior (móvil, estilo iOS) ───── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-200/80 pb-safe">
        <div className="flex items-stretch justify-around px-1">
          {NAV.map((n) => {
            const Icon = n.icon
            const active = nav === n.id
            return (
              <button
                key={n.id}
                onClick={() => setNav(n.id)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2 pt-2.5 transition-colors active:scale-95 ${active ? 'text-brand-600' : 'text-slate-400'}`}
              >
                <span className={`flex items-center justify-center w-11 h-7 rounded-full transition-colors ${active ? 'bg-brand-100' : ''}`}>
                  <Icon size={20} strokeWidth={active ? 2.4 : 2} />
                </span>
                <span className="text-[10px] font-semibold tracking-tight">{n.short}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* ───── Modales ───── */}
      <ContentForm
        open={contentModal.open}
        initial={contentModal.initial}
        creators={db.creators}
        onClose={() => setContentModal({ open: false, initial: null })}
        onSave={store.upsertContent}
        onDelete={store.deleteContent}
      />
      <CampaignForm
        open={campaignModal.open}
        initial={campaignModal.initial}
        creators={db.creators}
        onClose={() => setCampaignModal({ open: false, initial: null })}
        onSave={store.upsertCampaign}
        onDelete={store.deleteCampaign}
      />
      <CreatorForm
        open={creatorModal.open}
        initial={creatorModal.initial}
        onClose={() => setCreatorModal({ open: false, initial: null })}
        onSave={store.upsertCreator}
      />
    </div>
  )
}
