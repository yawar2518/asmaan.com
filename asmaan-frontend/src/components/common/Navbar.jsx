import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, isStaff, isAgent, user, logout } = useAuth()
  const navigate = useNavigate()

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-md font-medium transition ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`

  const handleLogout = () => {
    logout()
    navigate('/buy')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-white shadow-md px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-blue-600">Asmaan</span>
        <span className="text-sm text-gray-500 hidden sm:inline">
          Har Pata Apko Pata Hai
        </span>
      </div>

      <div className="flex items-center gap-2">
        <NavLink to="/buy" className={linkClass}>Buy</NavLink>
        <NavLink to="/rent" className={linkClass}>Rent</NavLink>
        <NavLink to="/plots" className={linkClass}>Plots</NavLink>
        <NavLink to="/sell" className={linkClass}>Sell</NavLink>

        {isStaff && <NavLink to="/admin/queue" className={linkClass}>Admin</NavLink>}
        {isAgent && !isStaff && <NavLink to="/agent/dashboard" className={linkClass}>My Visits</NavLink>}

        {isAuthenticated ? (
          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
            <span className="text-sm text-gray-500 hidden md:inline">{user.username}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <NavLink to="/login" className={linkClass}>Login</NavLink>
        )}
      </div>
    </nav>
  )
}
