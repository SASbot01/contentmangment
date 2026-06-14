import React, { useState, useMemo } from 'react'
import {
  LayoutDashboard, KanbanSquare, CalendarDays, Megaphone, Users, ShieldCheck,
  Plus, Search, RotateCcw, LogOut, Loader2,
} from 'lucide-react'
import { useStore } from './store'
import { Avatar } from './components/ui'
import { ContentForm, CampaignForm } from './components/forms'
import Dashboard from './views/Dashboard'
import ContentBoard from './views/ContentBoard'
import Calendar from './views/Calendar'
import Campaigns from './views/Campaigns'
import UsersView from './views/Users'
import Login from './views/Login'

const BASE_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'content',   label: 'Contenido', icon: KanbanSquare },
  { id: 'calendar',  label: 'Calendario', icon: CalendarDays },
  { id: 'campaigns', label: 'Campañas Ads', icon: Megaphone },
]
const ADMIN_NAV = { id: 'users', label: 'Perfiles', icon: ShieldCheck }

export default function App() {
  const store = useStore()
  const { db } = store
  const [nav, setNav] = useState('dashboard')
  const [creatorFilter, setCreatorFilter] = useState('all')
  const [search, setSearch] = useState('')

  const [contentModal, setContentModal] = useState({ open: false, initial: null })
  const [campaignModal, setCampaignModal] = useState({ open: false, initial: null })

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

  const isAdmin = store.user?.role === 'admin'
  const NAV = isAdmin ? [...BASE_NAV, ADMIN_NAV] : BASE_NAV
  const activeCreator = db.creators.find((c) => c.id === creatorFilter)
  const title = NAV.find((n) => n.id === nav)?.label

  // ── Guardia de autenticación ──
  if (!store.ready) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400">
        <Loader2 className="animate-spin" />
      </div>
    )
  }
  if (!store.user) {
    return <Login onLogin={store.login} onRegister={store.register} />
  }

  return (
    <div className="flex h-full">
      {/* ───── Sidebar ───── */}
      <aside className="w-64 shrink-0 bg-ink-900 text-slate-300 flex flex-col p-4 hidden md:flex">
        <div className="flex items-center gap-2.5 px-2 py-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-5 h-5"><path d="M9 10l3 4-2 8 6-4 6 4-2-8 3-4-5 1-2-4-2 4-5-1z" fill="#fff"/></svg>
          </div>
          <div>
            <p className="font-extrabold text-white leading-none">ContentForge</p>
            <p className="text-[11px] text-slate-500 mt-0.5">CRM de Contenido</p>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {NAV.map((n) => {
            const Icon = n.icon
            const active = nav === n.id
            return (
              <button
                key={n.id} onClick={() => setNav(n.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-brand-600 text-white' : 'text-slate-400 hover:bg-ink-700 hover:text-white'}`}
              >
                <Icon size={18} /> {n.label}
              </button>
            )
          })}
        </nav>

        {/* lista de marcas */}
        <div className="mt-4 pt-4 border-t border-ink-700">
          <p className="px-3 text-[11px] uppercase tracking-wide text-slate-500 font-bold mb-2 flex items-center gap-1.5"><Users size={12} /> Marcas</p>
          <button onClick={() => setCreatorFilter('all')} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${creatorFilter === 'all' ? 'bg-ink-700 text-white' : 'text-slate-400 hover:bg-ink-700'}`}>Todas las marcas</button>
          {db.creators.map((c) => (
            <button key={c.id} onClick={() => setCreatorFilter(c.id)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm ${creatorFilter === c.id ? 'bg-ink-700 text-white' : 'text-slate-400 hover:bg-ink-700'}`}>
              <Avatar creator={c} size={24} />
              <span className="truncate">{c.brand}</span>
            </button>
          ))}
        </div>

        <button onClick={store.resetDemo} className="mt-4 flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-slate-300">
          <RotateCcw size={13} /> Restaurar datos demo
        </button>

        {/* usuario + logout */}
        <div className="mt-2 pt-3 border-t border-ink-700 flex items-center gap-2.5 px-1">
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {(store.user.name || store.user.username).slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">{store.user.name || store.user.username}</p>
            <p className="text-[11px] text-slate-500 truncate">{store.user.role === 'admin' ? 'Administrador' : 'Miembro'}</p>
          </div>
          <button onClick={store.logout} title="Cerrar sesión" className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-ink-700">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* ───── Main ───── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* header */}
        <header className="bg-white border-b border-slate-200 px-5 sm:px-8 py-4 flex items-center gap-4 shrink-0">
          <div>
            <h1 className="text-xl font-extrabold text-slate-800">{title}</h1>
            <p className="text-xs text-slate-400">{activeCreator ? activeCreator.brand + ' · ' + activeCreator.niche : 'Todas las marcas'}</p>
          </div>

          <div className="relative ml-auto hidden sm:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-9 w-56 lg:w-72 py-2" placeholder="Buscar contenido o campañas…"
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {nav !== 'users' && (
            <button onClick={() => (nav === 'campaigns' ? openCampaign() : openContent())} className="btn-primary">
              <Plus size={18} /> <span className="hidden sm:inline">{nav === 'campaigns' ? 'Campaña' : 'Contenido'}</span>
            </button>
          )}
        </header>

        {/* mobile creator selector */}
        <div className="md:hidden px-5 py-2 bg-white border-b border-slate-200">
          <select className="input py-2" value={creatorFilter} onChange={(e) => setCreatorFilter(e.target.value)}>
            <option value="all">Todas las marcas</option>
            {db.creators.map((c) => <option key={c.id} value={c.id}>{c.brand}</option>)}
          </select>
        </div>

        {/* mobile nav */}
        <div className="md:hidden flex border-b border-slate-200 bg-white overflow-x-auto">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => setNav(n.id)} className={`flex-1 px-3 py-2.5 text-xs font-semibold whitespace-nowrap ${nav === n.id ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-400'}`}>
              {n.label}
            </button>
          ))}
        </div>

        {/* content area */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-8">
          {nav === 'dashboard' && <Dashboard content={content} campaigns={campaigns} creators={db.creators} onOpenContent={openContent} />}
          {nav === 'content' && <ContentBoard content={content} creators={db.creators} onMove={store.moveContent} onOpen={openContent} onNew={openContent} />}
          {nav === 'calendar' && <Calendar content={content} creators={db.creators} onOpen={openContent} onNew={openContent} />}
          {nav === 'campaigns' && <Campaigns campaigns={campaigns} content={content} creators={db.creators} onOpen={openCampaign} onNew={openCampaign} />}
          {nav === 'users' && isAdmin && <UsersView currentUser={store.user} />}
        </main>
      </div>

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
    </div>
  )
}
