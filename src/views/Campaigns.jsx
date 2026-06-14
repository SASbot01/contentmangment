import React from 'react'
import { Plus, Target, Calendar as CalIcon, TrendingUp } from 'lucide-react'
import { Badge, Avatar, EmptyState } from '../components/ui'
import { campaignStatusById, platformById } from '../data'

function ProgressBar({ value, max, color }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  )
}

function CampaignCard({ c, creator, content, onOpen }) {
  const st = campaignStatusById(c.status)
  const plat = platformById(c.platform)
  const ads = content.filter((x) => x.creatorId === c.creatorId && x.category === 'ads')
  const fmt = (n) => (n || 0).toLocaleString('es-ES')

  return (
    <div className="card p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onOpen(c)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar creator={creator} size={40} />
          <div className="min-w-0">
            <h3 className="font-bold text-slate-800 truncate">{c.name}</h3>
            <p className="text-xs text-slate-400">{creator?.brand}</p>
          </div>
        </div>
        <Badge color={st.color} soft={false}>{st.label}</Badge>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3">
        <Badge color={plat.color}>{plat.label}</Badge>
        <span className="inline-flex items-center gap-1 text-xs text-slate-500"><Target size={13} /> {c.objective}</span>
        <span className="inline-flex items-center gap-1 text-xs text-slate-500"><CalIcon size={13} /> {new Date(c.start).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} – {new Date(c.end).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-slate-500">Presupuesto consumido</span>
          <span className="font-semibold text-slate-700">{fmt(c.spent)}€ / {fmt(c.budget)}€</span>
        </div>
        <ProgressBar value={c.spent} max={c.budget} color={st.color} />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-center">
        <div>
          <p className="text-lg font-extrabold text-slate-800">{fmt(c.leads)}</p>
          <p className="text-[11px] text-slate-400 uppercase tracking-wide">Leads</p>
        </div>
        <div>
          <p className={`text-lg font-extrabold ${c.roas >= 2 ? 'text-emerald-600' : 'text-slate-800'}`}>{c.roas ? c.roas.toFixed(1) + 'x' : '—'}</p>
          <p className="text-[11px] text-slate-400 uppercase tracking-wide">ROAS</p>
        </div>
        <div>
          <p className="text-lg font-extrabold text-slate-800">{ads.length}</p>
          <p className="text-[11px] text-slate-400 uppercase tracking-wide">Creativos</p>
        </div>
      </div>
    </div>
  )
}

export default function Campaigns({ campaigns, content, creators, onOpen, onNew }) {
  const creatorOf = (id) => creators.find((c) => c.id === id)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{campaigns.length} campañas · {campaigns.filter((c) => c.status === 'activa').length} activas</p>
        <button onClick={onNew} className="btn-primary"><Plus size={18} /> Nueva campaña</button>
      </div>

      {campaigns.length === 0 ? (
        <div className="card"><EmptyState icon={TrendingUp} title="Sin campañas todavía" hint="Crea tu primera campaña de ads para planificar la inversión y el rendimiento." /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {campaigns.map((c) => (
            <CampaignCard key={c.id} c={c} creator={creatorOf(c.creatorId)} content={content} onOpen={onOpen} />
          ))}
        </div>
      )}
    </div>
  )
}
