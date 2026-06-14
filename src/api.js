// Cliente de la API + manejo del token de sesión
const TOKEN_KEY = 'contentforge-token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY))

async function req(method, path, body) {
  const token = getToken()
  const res = await fetch('/api' + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (res.status === 401) {
    setToken(null)
    const err = new Error('No autorizado')
    err.status = 401
    throw err
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || res.statusText)
  }
  return res.status === 204 ? null : res.json()
}

export const api = {
  login: (username, password) => req('POST', '/login', { username, password }),
  register: (username, password, name) => req('POST', '/register', { username, password, name }),
  logout: () => req('POST', '/logout'),
  me: () => req('GET', '/me'),
  state: () => req('GET', '/state'),

  listUsers: () => req('GET', '/users'),
  deleteUser: (id) => req('DELETE', '/users/' + id),

  saveContent: (c) => (c.id ? req('PUT', '/content/' + c.id, c) : req('POST', '/content', c)),
  moveContent: (id, stage) => req('PATCH', '/content/' + id + '/stage', { stage }),
  deleteContent: (id) => req('DELETE', '/content/' + id),

  saveCampaign: (c) => (c.id ? req('PUT', '/campaigns/' + c.id, c) : req('POST', '/campaigns', c)),
  deleteCampaign: (id) => req('DELETE', '/campaigns/' + id),

  reset: () => req('POST', '/reset'),
}
