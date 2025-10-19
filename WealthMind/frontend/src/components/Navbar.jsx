import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiHome, FiTrendingUp, FiBriefcase, FiUser, FiLogOut } from 'react-icons/fi'

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="bg-primary-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl">
              W
            </div>
            <span className="text-xl font-bold text-gray-800">WealthMind</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/dashboard"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive('/dashboard')}`}
            >
              <FiHome className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>
            
            <Link
              to="/market"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive('/market')}`}
            >
              <FiTrendingUp className="w-5 h-5" />
              <span className="font-medium">Market</span>
            </Link>
            
            <Link
              to="/portfolio"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive('/portfolio')}`}
            >
              <FiBriefcase className="w-5 h-5" />
              <span className="font-medium">Portfolio</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Link
              to="/profile"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive('/profile')}`}
            >
              <FiUser className="w-5 h-5" />
              <span className="font-medium hidden md:inline">{user?.name}</span>
            </Link>
            
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-danger hover:bg-red-50 transition-colors"
            >
              <FiLogOut className="w-5 h-5" />
              <span className="font-medium hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t">
        <div className="flex justify-around py-2">
          <Link to="/dashboard" className={`flex flex-col items-center py-2 px-4 ${isActive('/dashboard')}`}>
            <FiHome className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link to="/market" className={`flex flex-col items-center py-2 px-4 ${isActive('/market')}`}>
            <FiTrendingUp className="w-6 h-6" />
            <span className="text-xs mt-1">Market</span>
          </Link>
          <Link to="/portfolio" className={`flex flex-col items-center py-2 px-4 ${isActive('/portfolio')}`}>
            <FiBriefcase className="w-6 h-6" />
            <span className="text-xs mt-1">Portfolio</span>
          </Link>
          <Link to="/profile" className={`flex flex-col items-center py-2 px-4 ${isActive('/profile')}`}>
            <FiUser className="w-6 h-6" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
