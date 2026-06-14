import React, { useState, useMemo } from 'react'
import { Plus, GripVertical, LayoutGrid, List } from 'lucide-react'
import { Badge, Avatar, Dot, EmptyState } from '../components/ui'
import { STAGES, stageById, platformById, CATEGORIES, CONTENT_TYPES } from '../data'

function ContentCard({ item, creator, onOpen, onDragStart }) {
  const plat = platformById(item.platform)
  const cat = CATEGORIES.find((c) => c.id === item.category)
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item.id)}
      onClick={() => onOpen(item)}
      className="group bg-white rounded-xl border border-slate-200 p-3 shadow-sm hover:shadow-md hover:border-brand-200 cursor-pointer transition-all"
    >
      <div className="flex items-start gap-2">
        <GripVertical size={15} className="text-slate-300 mt-0.5 shrink-0 group-hover:text-slate-400" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-700 leading-snug">{item.title}</p>
          {item.hook && <p className="text-xs text-slate-400 mt-1 line-clamp-2 italic">{item.hook}</p>}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <Badge color={plat.color}>{plat.label}</Badge>
            <Badge color={cat?.color || '#64748b'}>{cat?.label}</Badge>
            <span className="text-[11px] font-medium text-slate-400">{item.type}</span>
          </div>
          <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-slate-50">
            <Avatar creator={creator} size={22} />
            <span className="text-[11px] text-slate-400">
              {item.date ? new Date(item.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ContentBoard({ content, creators, onMove, onOpen, onNew }) {
  const [view, setView] = useState('board')
  const [filterCat, setFilterCat] = useState('all')
  const [filterPlat, setFilterPlat] = useState('all')
  const [dragOver, setDragOver] = useState(null)

  const creatorOf = (id) => creators.find((c) => c.id === id)

  const filtered = useMemo(() => content.filter((c) =>
    (filterCat === 'all' || c.category === filterCat) &&
    (filterPlat === 'all' || c.platform === filterPlat)
  ), [content, filterCat, filterPlat])

  const onDragStart = (e, id) => { e.dataTransfer.setData('id', id) }
  const onDrop = (e, stage) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('id')
    if (id) onMove(id, stage)
    setDragOver(null)
  }

  return (
    <div className="space-y-4">
      {/* barra de filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
          <button onClick={() => setView('board')} className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 ${view === 'board' ? 'bg-brand-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
            <LayoutGrid size={15} /> Tablero
          </button>
          <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 ${view === 'list' ? 'bg-brand-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
            <List size={15} /> Lista
          </button>
        </div>

        <select className="input w-auto py-2" value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
          <option value="all">Todas las categorías</option>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select className="input w-auto py-2" value={filterPlat} onChange={(e) => setFilterPlat(e.target.value)}>
          <option value="all">Todas las plataformas</option>
          {[...new Set(content.map((c) => c.platform))].map((pid) => <option key={pid} value={pid}>{platformById(pid).label}</option>)}
        </select>

        <button onClick={onNew} className="btn-primary ml-auto">
          <Plus size={18} /> Nueva pieza
        </button>
      </div>

      {view === 'board' ? (
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1">
          {STAGES.map((s) => {
            const items = filtered.filter((c) => c.stage === s.id)
            return (
              <div
                key={s.id}
                onDragOver={(e) => { e.preventDefault(); setDragOver(s.id) }}
                onDragLeave={() => setDragOver((d) => (d === s.id ? null : d))}
                onDrop={(e) => onDrop(e, s.id)}
                className={`shrink-0 w-72 rounded-2xl p-2.5 transition-colors ${dragOver === s.id ? 'bg-brand-50 ring-2 ring-brand-200' : 'bg-slate-100/70'}`}
              >
                <div className="flex items-center justify-between px-2 py-1.5 mb-1">
                  <div className="flex items-center gap-2 font-semibold text-sm text-slate-600">
                    <Dot color={s.color} /> {s.label}
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-white rounded-full px-2 py-0.5">{items.length}</span>
                </div>
                <div className="space-y-2 min-h-[40px]">
                  {items.map((item) => (
                    <ContentCard key={item.id} item={item} creator={creatorOf(item.creatorId)} onOpen={onOpen} onDragStart={onDragStart} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card overflow-hidden">
          {filtered.length === 0 ? (
            <EmptyState icon={List} title="Sin contenido" hint="Crea tu primera pieza para empezar a organizar la producción." />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100 bg-slate-50/60">
                  <th className="py-3 px-4 font-semibold">Pieza</th>
                  <th className="py-3 px-4 font-semibold">Marca</th>
                  <th className="py-3 px-4 font-semibold">Tipo</th>
                  <th className="py-3 px-4 font-semibold">Plataforma</th>
                  <th className="py-3 px-4 font-semibold">Estado</th>
                  <th className="py-3 px-4 font-semibold">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const cr = creatorOf(item.creatorId)
                  const st = stageById(item.stage)
                  const plat = platformById(item.platform)
                  return (
                    <tr key={item.id} onClick={() => onOpen(item)} className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                      <td className="py-3 px-4 font-semibold text-slate-700 max-w-xs"><span className="line-clamp-1">{item.title}</span></td>
                      <td className="py-3 px-4"><div className="flex items-center gap-2"><Avatar creator={cr} size={22} /><span className="text-slate-500">{cr?.brand}</span></div></td>
                      <td className="py-3 px-4 text-slate-500">{item.type}</td>
                      <td className="py-3 px-4"><Badge color={plat.color}>{plat.label}</Badge></td>
                      <td className="py-3 px-4"><Badge color={st.color}>{st.label}</Badge></td>
                      <td className="py-3 px-4 text-slate-500">{item.date ? new Date(item.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
