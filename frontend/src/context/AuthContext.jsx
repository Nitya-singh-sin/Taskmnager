import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

const API = axios.create({ baseURL: '/api' })

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`
  return config
})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  const register = async (data) => {
    const res = await API.post('/auth/register', data)
    setUser(res.data.data)
    localStorage.setItem('user', JSON.stringify(res.data.data))
    return res.data
  }

  const login = async (data) => {
    const res = await API.post('/auth/login', data)
    setUser(res.data.data)
    localStorage.setItem('user', JSON.stringify(res.data.data))
    return res.data
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export { API }
