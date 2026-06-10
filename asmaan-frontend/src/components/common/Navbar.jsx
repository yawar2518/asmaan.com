import { NavLink } from 'react-router-dom'

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-md font-medium transition ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-white shadow-md px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-blue-600">Asmaan</span>
        <span className="text-sm text-gray-500 hidden sm:inline">
          Har Pata Apko Pata Hai
        </span>
      </div>

      <div className="flex gap-2">
        <NavLink to="/buy" className={linkClass}>Buy</NavLink>
        <NavLink to="/rent" className={linkClass}>Rent</NavLink>
        <NavLink to="/plots" className={linkClass}>Plots</NavLink>
      </div>
    </nav>
  )
}