import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Home, TrendingUp, Wallet, User, LogOut } from 'lucide-react'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'ETF Market', href: '/market', icon: TrendingUp },
    { name: 'My Holdings', href: '/holdings', icon: Wallet },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Vegais ETF</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="text-sm text-gray-700">
                    Balance: <span className="font-semibold">${user.balance.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Sidebar */}
          {user && (
            <div className="w-64 mr-8">
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium ${
                        isActive
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout 