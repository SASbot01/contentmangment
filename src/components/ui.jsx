import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export function Badge({ color = '#64748b', children, soft = true }) {
  const style = soft
    ? { color, backgroundColor: color + '1a' }
    : { color: '#fff', backgroundColor: color }
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap"
      style={style}
    >
      {children}
    </span>
  )
}

export function Dot({ color }) {
  return <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
}

export function Avatar({ creator, size = 32 }) {
  if (!creator) return null
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-bold text-white shrink-0"
      style={{ width: size, height: size, backgroundColor: creator.color, fontSize: size * 0.4 }}
      title={creator.name + ' · ' + creator.brand}
    >
      {creator.avatar}
    </span>
  )
}

export function Modal({ open, onClose, title, children, footer, wide }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center overflow-y-auto bg-ink-900/40 backdrop-blur-sm sm:p-8 animate-fadeIn"
    >
      <div
        className={`bg-white w-full ${wide ? 'sm:max-w-3xl' : 'sm:max-w-xl'} shadow-2xl flex flex-col max-h-[92svh] sm:max-h-[88vh]
          rounded-t-3xl sm:rounded-2xl border border-slate-200/70
          animate-sheetUp sm:animate-scaleIn`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* tirador (móvil) */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-1 shrink-0">
          <span className="w-10 h-1.5 rounded-full bg-slate-300" />
        </div>
        <div className="flex items-center justify-between px-5 sm:px-6 py-3 sm:py-4 border-b border-slate-100 shrink-0">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 rounded-lg p-1.5 hover:bg-slate-100 active:scale-90 transition">
            <X size={20} />
          </button>
        </div>
        <div className="px-5 sm:px-6 py-5 overflow-y-auto">{children}</div>
        {footer && <div className="flex justify-end gap-2 px-5 sm:px-6 py-3.5 sm:py-4 border-t border-slate-100 bg-slate-50/60 rounded-b-3xl sm:rounded-b-2xl shrink-0 pb-safe sm:pb-4">{footer}</div>}
      </div>
    </div>
  )
}

export function Field({ label, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  )
}

export function EmptyState({ icon: Icon, title, hint }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        {Icon && <Icon size={26} />}
      </div>
      <p className="font-semibold text-slate-700">{title}</p>
      {hint && <p className="text-sm text-slate-400 mt-1 max-w-xs">{hint}</p>}
    </div>
  )
}
