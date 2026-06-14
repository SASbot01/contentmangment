import { useState, useEffect, useCallback } from 'react'
import { api, getToken, setToken } from './api'

const EMPTY = { creators: [], content: [], campaigns: [] }

export function useStore() {
  const [db, setDb] = useState(EMPTY)
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  const refresh = useCallback(async () => {
    const state = await api.state()
    setDb(state)
  }, [])

  // Arranque: si hay token, recuperar sesión y datos
  useEffect(() => {
    (async () => {
      if (getToken()) {
        try {
          const me = await api.me()
          setUser(me)
          await refresh()
        } catch {
          setToken(null)
        }
      }
      setReady(true)
    })()
  }, [refresh])

  const login = useCallback(async (username, password) => {
    const { token, user } = await api.login(username, password)
    setToken(token)
    setUser(user)
    await refresh()
  }, [refresh])

  const register = useCallback(async (username, password, name) => {
    const { token, user } = await api.register(username, password, name)
    setToken(token)
    setUser(user)
    await refresh()
  }, [refresh])

  const logout = useCallback(async () => {
    try { await api.logout() } catch { /* ignore */ }
    setToken(null)
    setUser(null)
    setDb(EMPTY)
  }, [])

  // ── Contenido ──
  const upsertContent = useCallback(async (item) => {
    await api.saveContent(item)
    await refresh()
  }, [refresh])

  const moveContent = useCallback(async (id, stage) => {
    setDb((d) => ({ ...d, content: d.content.map((c) => (c.id === id ? { ...c, stage } : c)) })) // optimista
    try { await api.moveContent(id, stage) } finally { refresh() }
  }, [refresh])

  const deleteContent = useCallback(async (id) => {
    setDb((d) => ({ ...d, content: d.content.filter((c) => c.id !== id) }))
    try { await api.deleteContent(id) } finally { refresh() }
  }, [refresh])

  // ── Campañas ──
  const upsertCampaign = useCallback(async (item) => {
    await api.saveCampaign(item)
    await refresh()
  }, [refresh])

  const deleteCampaign = useCallback(async (id) => {
    setDb((d) => ({ ...d, campaigns: d.campaigns.filter((c) => c.id !== id) }))
    try { await api.deleteCampaign(id) } finally { refresh() }
  }, [refresh])

  // ── Marcas / creadores ──
  const upsertCreator = useCallback(async (item) => {
    await api.saveCreator(item)
    await refresh()
  }, [refresh])

  return {
    db, user, ready,
    login, register, logout,
    upsertContent, moveContent, deleteContent,
    upsertCampaign, deleteCampaign,
    upsertCreator, refresh,
  }
}
