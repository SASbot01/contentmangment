import React, { useState, useEffect, useCallback } from 'react'
import { Trash2, Shield, User as UserIcon, Loader2, RefreshCw } from 'lucide-react'
import { Badge, EmptyState } from '../components/ui'
import { api } from '../api'

export default function Users({ currentUser }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try { setUsers(await api.listUsers()) } catch { /* ignore */ } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const remove = async (u) => {
    if (!window.confirm(`¿Eliminar la cuenta de "${u.name || u.username}"?`)) return
    await api.deleteUser(u.id)
    load()
  }

  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : '—')
  const initials = (u) => (u.name || u.username).slice(0, 2).toUpperCase()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{users.length} {users.length === 1 ? 'perfil registrado' : 'perfiles registrados'} · {users.filter((u) => u.role === 'admin').length} admin</p>
        <button onClick={load} className="btn-ghost"><RefreshCw size={16} /> Actualizar</button>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16 text-slate-400"><Loader2 className="animate-spin" /></div>
        ) : users.length === 0 ? (
          <EmptyState icon={UserIcon} title="Sin perfiles" hint="Aún no se ha registrado nadie." />
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100 bg-slate-50/60">
                <th className="py-3 px-4 font-semibold">Perfil</th>
                <th className="py-3 px-4 font-semibold">Usuario</th>
                <th className="py-3 px-4 font-semibold">Rol</th>
                <th className="py-3 px-4 font-semibold">Registrado</th>
                <th className="py-3 px-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">{initials(u)}</span>
                      <span className="font-semibold text-slate-700">{u.name || u.username}{u.id === currentUser.id && <span className="text-slate-400 font-normal"> · tú</span>}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-500">@{u.username}</td>
                  <td className="py-3 px-4">
                    {u.role === 'admin'
                      ? <Badge color="#2563eb"><Shield size={12} /> Admin</Badge>
                      : <Badge color="#64748b"><UserIcon size={12} /> Miembro</Badge>}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{fmtDate(u.createdAt)}</td>
                  <td className="py-3 px-4 text-right">
                    {u.id !== currentUser.id && (
                      <button onClick={() => remove(u)} className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50" title="Eliminar cuenta">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  )
}
