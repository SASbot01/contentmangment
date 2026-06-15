import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Avatar } from '../components/ui'
import { stageById, platformById } from '../data'

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export default function Calendar({ content, creators, onOpen, onNew }) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date(); d.setDate(1); return d
  })

  const creatorOf = (id) => creators.find((c) => c.id === id)
  const year = cursor.getFullYear()
  const month = cursor.getMonth()

  const first = new Date(year, month, 1)
  const startOffset = (first.getDay() + 6) % 7 // lunes = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayStr = new Date().toISOString().slice(0, 10)

  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = new Date(year, month, d).toISOString().slice(0, 10)
    cells.push({ d, dateStr, items: content.filter((c) => c.date === dateStr) })
  }

  const monthLabel = cursor.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  const go = (n) => setCursor(new Date(year, month + n, 1))

  return (
    <div className="card p-3 sm:p-5">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <button onClick={() => go(-1)} className="btn-ghost p-2"><ChevronLeft size={18} /></button>
          <h3 className="font-bold text-slate-800 capitalize w-28 sm:w-44 text-center text-sm sm:text-base truncate">{monthLabel}</h3>
          <button onClick={() => go(1)} className="btn-ghost p-2"><ChevronRight size={18} /></button>
          <button onClick={() => setCursor(() => { const d = new Date(); d.setDate(1); return d })} className="btn-ghost text-sm ml-1 hidden sm:inline-flex">Hoy</button>
        </div>
        <button onClick={onNew} className="btn-primary !px-3 sm:!px-4"><Plus size={18} /> <span className="hidden sm:inline">Nueva pieza</span></button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
        {WEEKDAYS.map((w) => (
          <div key={w} className="bg-slate-50 py-2 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wide text-slate-400">{w}</div>
        ))}
        {cells.map((cell, i) => (
          <div key={i} className={`bg-white min-h-[68px] sm:min-h-[110px] p-1 sm:p-1.5 ${!cell ? 'bg-slate-50/40' : ''}`}>
            {cell && (
              <>
                <div className={`text-[11px] sm:text-xs font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full ${cell.dateStr === todayStr ? 'bg-brand-600 text-white' : 'text-slate-400'}`}>
                  {cell.d}
                </div>
                <div className="space-y-1">
                  {cell.items.slice(0, 3).map((item) => {
                    const st = stageById(item.stage)
                    const plat = platformById(item.platform)
                    return (
                      <button
                        key={item.id} onClick={() => onOpen(item)}
                        className="w-full text-left rounded-md px-1.5 py-1 text-[11px] font-medium truncate hover:opacity-80 flex items-center gap-1"
                        style={{ backgroundColor: st.color + '1a', color: st.color }}
                        title={item.title}
                      >
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: plat.color }} />
                        <span className="truncate">{item.title}</span>
                      </button>
                    )
                  })}
                  {cell.items.length > 3 && <p className="text-[10px] text-slate-400 px-1">+{cell.items.length - 3} más</p>}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
