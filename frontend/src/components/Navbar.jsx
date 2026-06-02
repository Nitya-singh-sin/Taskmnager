import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        <div className="navbar-logo-icon">✦</div>
        <h1>TaskFlow</h1>
      </Link>
      <div className="navbar-right">
        {user && (
          <>
            <div className="navbar-avatar">{user.name.charAt(0).toUpperCase()}</div>
            <span className="navbar-username">{user.name}</span>
          </>
        )}
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  )
}
export default Navbar
