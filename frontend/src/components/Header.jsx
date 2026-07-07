import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, User, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">ↁ</span>
            </div>
            <span className="text-xl font-bold text-primary hidden sm:inline">Dream Blog</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-dark hover:text-primary transition">
              Home
            </Link>
            <Link to="/posts" className="text-dark hover:text-primary transition">
              Posts
            </Link>
            <Link to="/categories" className="text-dark hover:text-primary transition">
              Categories
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/create-post"
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition"
                >
                  Write
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-background transition">
                    <User size={20} className="text-primary" />
                    <span className="text-sm text-dark">{user.username}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-dark hover:bg-background transition flex items-center gap-2"
                    >
                      <User size={16} /> Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-dark hover:bg-background transition flex items-center gap-2"
                      >
                        <Settings size={16} /> Admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-dark hover:bg-background transition flex items-center gap-2"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-primary hover:bg-background rounded-lg transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

    
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t">
            <Link
              to="/"
              className="block px-4 py-2 text-dark hover:bg-background transition"
            >
              Home
            </Link>
            <Link
              to="/posts"
              className="block px-4 py-2 text-dark hover:bg-background transition"
            >
              Posts
            </Link>
            <Link
              to="/categories"
              className="block px-4 py-2 text-dark hover:bg-background transition"
            >
              Categories
            </Link>
            {user ? (
              <>
                <Link
                  to="/create-post"
                  className="block px-4 py-2 text-secondary font-semibold"
                >
                  Write
                </Link>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-dark hover:bg-background transition"
                >
                  Profile
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-dark hover:bg-background transition"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-dark hover:bg-background transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-primary font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-secondary font-semibold"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
