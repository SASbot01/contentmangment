import React, { useState } from 'react'
import { Modal, Field } from './ui'
import { CONTENT_TYPES, PLATFORMS, CATEGORIES, STAGES, CAMPAIGN_STATUS, OBJECTIVES } from '../data'

const todayStr = () => new Date().toISOString().slice(0, 10)

const BRAND_COLORS = ['#7916ff', '#ec4899', '#0ea5e9', '#10b981', '#f97316', '#f59e0b', '#ef4444', '#6366f1', '#14b8a6', '#8b5cf6']
const initialsOf = (s) => (s || '?').trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()

// ─── Formulario de marca / creador ───
export function CreatorForm({ open, onClose, onSave, initial }) {
  const blank = { brand: '', name: '', niche: '', color: BRAND_COLORS[0] }
  const [f, setF] = useState({ ...blank, ...initial })
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }))

  React.useEffect(() => { setF({ ...blank, ...initial }) }, [initial, open]) // eslint-disable-line

  const save = () => {
    if (!f.brand.trim()) return
    onSave({ ...f, avatar: initialsOf(f.brand) })
    onClose()
  }

  return (
    <Modal
      open={open} onClose={onClose}
      title={initial?.id ? 'Editar marca' : 'Nueva marca'}
      footer={
        <>
          <button onClick={onClose} className="btn-ghost">Cancelar</button>
          <button onClick={save} className="btn-primary">Guardar</button>
        </>
      }
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0" style={{ backgroundColor: f.color }}>
          {initialsOf(f.brand)}
        </span>
        <p className="text-sm text-slate-400">El avatar se genera con las iniciales de la marca.</p>
      </div>
      <div className="space-y-4">
        <Field label="Nombre de la marca">
          <input className="input" value={f.brand} onChange={set('brand')} placeholder="Ej: Mindset Millonario" autoFocus />
        </Field>
        <Field label="Responsable / Creador">
          <input className="input" value={f.name} onChange={set('name')} placeholder="Nombre del infoproductor" />
        </Field>
        <Field label="Nicho">
          <input className="input" value={f.niche} onChange={set('niche')} placeholder="Ej: Mentalidad & finanzas" />
        </Field>
        <Field label="Color">
          <div className="flex flex-wrap gap-2">
            {BRAND_COLORS.map((c) => (
              <button key={c} type="button" onClick={() => setF((p) => ({ ...p, color: c }))}
                className={`w-8 h-8 rounded-full transition ${f.color === c ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>
        </Field>
      </div>
    </Modal>
  )
}

// ─── Formulario de pieza de contenido ───
export function ContentForm({ open, onClose, onSave, onDelete, initial, creators }) {
  const blank = {
    creatorId: creators[0]?.id || '', title: '', type: 'Reel', platform: 'instagram',
    category: 'organico', stage: 'idea', date: todayStr(), owner: '', hook: '', cta: '', notes: '',
  }
  const [f, setF] = useState({ ...blank, ...initial })
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }))

  // re-sync cuando cambia initial
  React.useEffect(() => { setF({ ...blank, ...initial }) }, [initial, open]) // eslint-disable-line

  const save = () => {
    if (!f.title.trim()) return
    onSave(f)
    onClose()
  }

  return (
    <Modal
      open={open} onClose={onClose} wide
      title={initial?.id ? 'Editar contenido' : 'Nueva pieza de contenido'}
      footer={
        <>
          {initial?.id && (
            <button onClick={() => { onDelete(initial.id); onClose() }} className="btn-ghost text-red-600 border-red-200 hover:bg-red-50 mr-auto">
              Eliminar
            </button>
          )}
          <button onClick={onClose} className="btn-ghost">Cancelar</button>
          <button onClick={save} className="btn-primary">Guardar</button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Field label="Título de la pieza">
            <input className="input" value={f.title} onChange={set('title')} placeholder="Ej: Reel — 3 errores al invertir" autoFocus />
          </Field>
        </div>
        <Field label="Creador / Marca">
          <select className="input" value={f.creatorId} onChange={set('creatorId')}>
            {creators.map((c) => <option key={c.id} value={c.id}>{c.brand} · {c.name}</option>)}
          </select>
        </Field>
        <Field label="Tipo">
          <select className="input" value={f.type} onChange={set('type')}>
            {CONTENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Plataforma">
          <select className="input" value={f.platform} onChange={set('platform')}>
            {PLATFORMS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </Field>
        <Field label="Categoría">
          <select className="input" value={f.category} onChange={set('category')}>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </Field>
        <Field label="Estado / Pipeline">
          <select className="input" value={f.stage} onChange={set('stage')}>
            {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </Field>
        <Field label="Fecha planificada">
          <input type="date" className="input" value={f.date} onChange={set('date')} />
        </Field>
        <Field label="Responsable">
          <input className="input" value={f.owner} onChange={set('owner')} placeholder="Quién lo graba / edita" />
        </Field>
        <Field label="Gancho / Hook">
          <input className="input" value={f.hook} onChange={set('hook')} placeholder="Primera frase que para el scroll" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="CTA">
            <input className="input" value={f.cta} onChange={set('cta')} placeholder="Llamada a la acción" />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Notas / Guion">
            <textarea className="input min-h-[80px] resize-y" value={f.notes} onChange={set('notes')} placeholder="Ideas, guion, referencias…" />
          </Field>
        </div>
      </div>
    </Modal>
  )
}

// ─── Formulario de campaña ───
export function CampaignForm({ open, onClose, onSave, onDelete, initial, creators }) {
  const blank = {
    creatorId: creators[0]?.id || '', name: '', objective: 'Leads', platform: 'meta-ads',
    status: 'borrador', budget: 1000, spent: 0, leads: 0, roas: 0, start: todayStr(), end: todayStr(), notes: '',
  }
  const [f, setF] = useState({ ...blank, ...initial })
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }))
  const setNum = (k) => (e) => setF((p) => ({ ...p, [k]: Number(e.target.value) }))

  React.useEffect(() => { setF({ ...blank, ...initial }) }, [initial, open]) // eslint-disable-line

  const save = () => {
    if (!f.name.trim()) return
    onSave(f)
    onClose()
  }

  const adPlatforms = PLATFORMS.filter((p) => p.id.includes('ads'))

  return (
    <Modal
      open={open} onClose={onClose} wide
      title={initial?.id ? 'Editar campaña' : 'Nueva campaña de ads'}
      footer={
        <>
          {initial?.id && (
            <button onClick={() => { onDelete(initial.id); onClose() }} className="btn-ghost text-red-600 border-red-200 hover:bg-red-50 mr-auto">
              Eliminar
            </button>
          )}
          <button onClick={onClose} className="btn-ghost">Cancelar</button>
          <button onClick={save} className="btn-primary">Guardar</button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Field label="Nombre de la campaña">
            <input className="input" value={f.name} onChange={set('name')} placeholder="Ej: Lanzamiento Masterclass" autoFocus />
          </Field>
        </div>
        <Field label="Creador / Marca">
          <select className="input" value={f.creatorId} onChange={set('creatorId')}>
            {creators.map((c) => <option key={c.id} value={c.id}>{c.brand} · {c.name}</option>)}
          </select>
        </Field>
        <Field label="Objetivo">
          <select className="input" value={f.objective} onChange={set('objective')}>
            {OBJECTIVES.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Plataforma">
          <select className="input" value={f.platform} onChange={set('platform')}>
            {adPlatforms.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </Field>
        <Field label="Estado">
          <select className="input" value={f.status} onChange={set('status')}>
            {CAMPAIGN_STATUS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </Field>
        <Field label="Presupuesto (€)">
          <input type="number" className="input" value={f.budget} onChange={setNum('budget')} />
        </Field>
        <Field label="Gastado (€)">
          <input type="number" className="input" value={f.spent} onChange={setNum('spent')} />
        </Field>
        <Field label="Leads / Conversiones">
          <input type="number" className="input" value={f.leads} onChange={setNum('leads')} />
        </Field>
        <Field label="ROAS">
          <input type="number" step="0.1" className="input" value={f.roas} onChange={setNum('roas')} />
        </Field>
        <Field label="Inicio">
          <input type="date" className="input" value={f.start} onChange={set('start')} />
        </Field>
        <Field label="Fin">
          <input type="date" className="input" value={f.end} onChange={set('end')} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Notas">
            <textarea className="input min-h-[70px] resize-y" value={f.notes} onChange={set('notes')} placeholder="Aprendizajes, segmentación, creativos…" />
          </Field>
        </div>
      </div>
    </Modal>
  )
}
