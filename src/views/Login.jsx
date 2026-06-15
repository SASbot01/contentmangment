import React, { useState } from 'react'
import { LogIn, UserPlus, Loader2 } from 'lucide-react'

export default function Login({ onLogin, onRegister }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isRegister = mode === 'register'

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isRegister) await onRegister(username.trim(), password, name.trim())
      else await onLogin(username.trim(), password)
    } catch (err) {
      setError(err.message || 'No se pudo completar la operación')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setMode(isRegister ? 'login' : 'register')
    setError('')
  }

  return (
    <div className="min-h-full flex items-center justify-center p-6 pt-safe pb-safe bg-gradient-to-br from-brand-50 via-white to-brand-100">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mb-3 shadow-glow">
            <svg viewBox="0 0 32 32" className="w-9 h-9"><path d="M9 10l3 4-2 8 6-4 6 4-2-8 3-4-5 1-2-4-2 4-5-1z" fill="#fff"/></svg>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800">ContentForge</h1>
          <p className="text-sm text-slate-500">{isRegister ? 'Crea tu cuenta para empezar' : 'CRM de Contenido · accede a tu cuenta'}</p>
        </div>

        {/* selector login / registro */}
        <div className="flex bg-white border border-slate-200 rounded-xl p-1 mb-4 shadow-soft">
          <button onClick={() => { setMode('login'); setError('') }} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${!isRegister ? 'bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-glow' : 'text-slate-500 hover:text-brand-700'}`}>Entrar</button>
          <button onClick={() => { setMode('register'); setError('') }} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${isRegister ? 'bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-glow' : 'text-slate-500 hover:text-brand-700'}`}>Registrarse</button>
        </div>

        <form onSubmit={submit} className="card p-6 space-y-4">
          {isRegister && (
            <div>
              <label className="label">Nombre</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre o marca" autoFocus />
            </div>
          )}
          <div>
            <label className="label">Usuario</label>
            <input
              className="input" value={username} onChange={(e) => setUsername(e.target.value)}
              placeholder="tu usuario" autoComplete="username" autoFocus={!isRegister}
            />
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input
              type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" autoComplete={isRegister ? 'new-password' : 'current-password'}
            />
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 size={18} className="animate-spin" /> : (isRegister ? <UserPlus size={18} /> : <LogIn size={18} />)}
            {loading ? 'Procesando…' : (isRegister ? 'Crear cuenta' : 'Entrar')}
          </button>

          <p className="text-center text-xs text-slate-500">
            {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
            <button type="button" onClick={switchMode} className="font-semibold text-brand-600 hover:underline">
              {isRegister ? 'Inicia sesión' : 'Regístrate aquí'}
            </button>
          </p>
        </form>

        <p className="text-center text-xs text-slate-400 mt-4">© ContentForge · BlackWolf</p>
      </div>
    </div>
  )
}
