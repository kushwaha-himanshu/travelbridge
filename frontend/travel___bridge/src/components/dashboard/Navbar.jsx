import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, ChevronDown, Menu, Search, LogOut, Settings, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const getInitials = (name) => {
    if (!name) return 'GB';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  const handleLogoutClick = async () => {
    await logout()
    navigate('/login')
  }

  const notifications = [
    { id: 1, title: "🌎 Language Pack Complete", desc: "Spanish offline pack is ready for download.", time: "5m ago" },
    { id: 2, title: "✈️ Trip Saved", desc: "Your Paris itinerary was successfully saved.", time: "1h ago" },
    { id: 3, title: "⭐ Premium Active", desc: "All TravelBridge premium features are unlocked.", time: "2h ago" },
  ]

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl"
    >
      <div className="flex h-20 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>

        <div className="flex flex-1 items-center gap-4">
          <div className="relative max-w-[520px] flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="h-12 w-full rounded-full border border-slate-200 bg-white pl-11 pr-24 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-200 focus:ring-4 focus:ring-blue-100"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500 shadow-sm">
              Ctrl K
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 relative">
          <button className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 sm:flex">
            <span className="text-base">🇺🇸</span>
            English
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button 
              onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}
              className={`relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 ${notificationsOpen ? 'bg-slate-50 border-slate-300 ring-2 ring-slate-100' : ''}`}
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 z-50 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                      <h4 className="font-semibold text-slate-800 text-sm">Notifications</h4>
                      <span className="text-xs text-blue-500 font-semibold cursor-pointer">Mark all as read</span>
                    </div>
                    <div className="space-y-1">
                      {notifications.map(notif => (
                        <div key={notif.id} className="p-2 rounded-xl hover:bg-slate-50 transition text-left cursor-pointer">
                          <p className="text-xs font-bold text-slate-800">{notif.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{notif.desc}</p>
                          <span className="text-[9px] text-slate-400 mt-1 block">{notif.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }}
              className="flex items-center gap-1 focus:outline-none"
            >
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-gradient-to-br from-slate-900 to-blue-700 text-sm font-semibold text-white shadow-sm hover:scale-105 transition cursor-pointer select-none">
                {getInitials(user?.fullname)}
              </div>
            </button>

            <AnimatePresence>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
                  >
                    <div className="px-3 py-2.5 border-b border-slate-100 text-left">
                      <p className="truncate text-sm font-bold text-slate-800">{user?.fullname || 'Guest User'}</p>
                      <p className="truncate text-xs text-slate-500 mt-0.5">{user?.email || 'guest@travelbridge.com'}</p>
                    </div>

                    <div className="p-1 space-y-0.5">
                      <button
                        onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <User className="h-4 w-4 text-slate-400" />
                        Profile Settings
                      </button>
                      <button
                        onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <Settings className="h-4 w-4 text-slate-400" />
                        Preferences
                      </button>
                      <button
                        onClick={handleLogoutClick}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50/70 transition"
                      >
                        <LogOut className="h-4 w-4 text-rose-500" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Navbar