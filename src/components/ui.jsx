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
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-900/50 backdrop-blur-sm p-4 sm:p-8">
      <div
        className={`card w-full ${wide ? 'max-w-3xl' : 'max-w-xl'} my-4 animate-[fadeIn_.15s_ease]`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 rounded-lg p-1 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/60 rounded-b-2xl">{footer}</div>}
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
