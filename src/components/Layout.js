"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Home, Activity, Calendar, Pill, Map, User, LogOut, Menu, X, Stethoscope } from "lucide-react"

const Layout = ({ children }) => {
  const { logout } = useAuth()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Symptom Checker", href: "/symptom-checker", icon: Stethoscope },
    { name: "Consultations", href: "/consultations", icon: Calendar },
    { name: "Medications", href: "/medications", icon: Pill },
    { name: "Health Metrics", href: "/health-metrics", icon: Activity },
    { name: "Resources", href: "/resources", icon: Map },
    { name: "Profile", href: "/profile", icon: User },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-white shadow-md">
        <div className="flex items-center">
          <button onClick={toggleMobileMenu} className="p-2 text-gray-600 rounded-md hover:bg-gray-100">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="ml-2 text-xl font-bold text-emerald-600">MediConnect</h1>
        </div>
      </div>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleMobileMenu}></div>
          <div className="fixed inset-y-0 left-0 flex flex-col w-64 max-w-xs bg-white shadow-xl">
            <div className="flex items-center justify-between h-16 px-6 bg-emerald-600">
              <h1 className="text-xl font-bold text-white">MediConnect</h1>
              <button onClick={toggleMobileMenu} className="p-2 text-white rounded-md hover:bg-emerald-700">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col flex-1 overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      location.pathname === item.href
                        ? "bg-emerald-100 text-emerald-700"
                        : "text-gray-600 hover:bg-gray-100"
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                    onClick={toggleMobileMenu}
                  >
                    <item.icon className="w-6 h-6 mr-3" />
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={logout}
                  className="flex items-center w-full px-2 py-2 text-base font-medium text-gray-600 rounded-md hover:bg-gray-100"
                >
                  <LogOut className="w-6 h-6 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-6 bg-emerald-600">
            <h1 className="text-xl font-bold text-white">MediConnect</h1>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? "bg-emerald-100 text-emerald-700"
                      : "text-gray-600 hover:bg-gray-100"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={logout}
                className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 pt-16 lg:pt-0">
        <main className="p-4 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}

export default Layout

