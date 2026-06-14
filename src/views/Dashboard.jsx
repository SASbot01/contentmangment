import React from 'react'
import { Film, Megaphone, TrendingUp, CalendarClock, ArrowUpRight, Wallet } from 'lucide-react'
import { Badge, Avatar, Dot } from '../components/ui'
import { STAGES, stageById, platformById, campaignStatusById, CATEGORIES } from '../data'

function Kpi({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: accent + '1a', color: accent }}>
          <Icon size={20} />
        </div>
        {sub && <span className="text-xs font-semibold text-slate-400">{sub}</span>}
      </div>
      <p className="text-3xl font-extrabold text-slate-800 mt-4">{value}</p>
      <p className="text-sm text-slate-500 mt-0.5">{label}</p>
    </div>
  )
}

export default function Dashboard({ content, campaigns, creators, onOpenContent }) {
  const publicado = content.filter((c) => c.stage === 'publicado').length
  const enProduccion = content.filter((c) => !['publicado', 'idea'].includes(c.stage)).length
  const activas = campaigns.filter((c) => c.status === 'activa')
  const spent = campaigns.reduce((s, c) => s + (c.spent || 0), 0)
  const leads = campaigns.reduce((s, c) => s + (c.leads || 0), 0)

  const upcoming = [...content]
    .filter((c) => c.stage !== 'publicado')
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
    .slice(0, 6)

  const creatorOf = (id) => creators.find((c) => c.id === id)

  // distribución por estado
  const maxStage = Math.max(1, ...STAGES.map((s) => content.filter((c) => c.stage === s.id).length))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi icon={Film} label="Piezas en producción" value={enProduccion} sub={`${content.length} totales`} accent="#7916ff" />
        <Kpi icon={Megaphone} label="Campañas activas" value={activas.length} sub={`${campaigns.length} totales`} accent="#f97316" />
        <Kpi icon={Wallet} label="Inversión en ads" value={`${spent.toLocaleString('es-ES')}€`} sub="acumulado" accent="#0ea5e9" />
        <Kpi icon={TrendingUp} label="Leads generados" value={leads.toLocaleString('es-ES')} sub="por campañas" accent="#10b981" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline distribución */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="font-bold text-slate-800 mb-1">Pipeline de contenido</h3>
          <p className="text-sm text-slate-400 mb-5">Piezas por fase de producción</p>
          <div className="space-y-3">
            {STAGES.map((s) => {
              const n = content.filter((c) => c.stage === s.id).length
              return (
                <div key={s.id} className="flex items-center gap-3">
                  <div className="w-24 text-sm font-medium text-slate-600 flex items-center gap-2">
                    <Dot color={s.color} /> {s.label}
                  </div>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${(n / maxStage) * 100}%`, backgroundColor: s.color }} />
                  </div>
                  <span className="w-6 text-right text-sm font-semibold text-slate-700">{n}</span>
                </div>
              )
            })}
          </div>
          <div className="flex gap-4 mt-6 pt-4 border-t border-slate-100">
            {CATEGORIES.map((cat) => {
              const n = content.filter((c) => c.category === cat.id).length
              return (
                <div key={cat.id} className="flex items-center gap-2 text-sm">
                  <Dot color={cat.color} />
                  <span className="font-semibold text-slate-700">{n}</span>
                  <span className="text-slate-400">{cat.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Próximas publicaciones */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-1">
            <CalendarClock size={18} className="text-brand-600" />
            <h3 className="font-bold text-slate-800">Próximo a publicar</h3>
          </div>
          <p className="text-sm text-slate-400 mb-4">Lo que toca grabar / sacar</p>
          <div className="space-y-2">
            {upcoming.map((c) => {
              const cr = creatorOf(c.creatorId)
              const st = stageById(c.stage)
              return (
                <button key={c.id} onClick={() => onOpenContent(c)} className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 group">
                  <Avatar creator={cr} size={34} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-700 truncate group-hover:text-brand-700">{c.title}</p>
                    <p className="text-xs text-slate-400">{new Date(c.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} · {c.type}</p>
                  </div>
                  <Badge color={st.color}>{st.label}</Badge>
                </button>
              )
            })}
            {upcoming.length === 0 && <p className="text-sm text-slate-400 py-6 text-center">Nada en cola 🎉</p>}
          </div>
        </div>
      </div>

      {/* Campañas activas */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-800 mb-4">Rendimiento de campañas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
                <th className="py-2 pr-4 font-semibold">Campaña</th>
                <th className="py-2 px-4 font-semibold">Marca</th>
                <th className="py-2 px-4 font-semibold">Estado</th>
                <th className="py-2 px-4 font-semibold text-right">Gastado</th>
                <th className="py-2 px-4 font-semibold text-right">Leads</th>
                <th className="py-2 pl-4 font-semibold text-right">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => {
                const cr = creatorOf(c.creatorId)
                const st = campaignStatusById(c.status)
                return (
                  <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                    <td className="py-3 pr-4 font-semibold text-slate-700">{c.name}</td>
                    <td className="py-3 px-4"><div className="flex items-center gap-2"><Avatar creator={cr} size={24} /><span className="text-slate-500">{cr?.brand}</span></div></td>
                    <td className="py-3 px-4"><Badge color={st.color}>{st.label}</Badge></td>
                    <td className="py-3 px-4 text-right text-slate-600">{(c.spent || 0).toLocaleString('es-ES')}€ <span className="text-slate-300">/ {(c.budget || 0).toLocaleString('es-ES')}€</span></td>
                    <td className="py-3 px-4 text-right text-slate-600">{c.leads}</td>
                    <td className="py-3 pl-4 text-right">
                      <span className={`inline-flex items-center gap-0.5 font-semibold ${c.roas >= 2 ? 'text-emerald-600' : c.roas > 0 ? 'text-amber-600' : 'text-slate-300'}`}>
                        {c.roas > 0 && <ArrowUpRight size={14} />}{c.roas ? c.roas.toFixed(1) + 'x' : '—'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
