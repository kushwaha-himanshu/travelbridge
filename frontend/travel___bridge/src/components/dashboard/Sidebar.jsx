import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  BadgePercent,
  History,
  LayoutDashboard,
  Languages,
  Mic,
  NotebookText,
  Route,
  ScanSearch,
  Settings2,
  ShieldAlert,
  Crown,
  X,
} from 'lucide-react'
import { sidebarItems } from './dashboardData'

const iconMap = {
  LayoutDashboard,
  Languages,
  Mic,
  ScanSearch,
  Route,
  NotebookText,
  History,
  ShieldAlert,
  BadgePercent,
  Settings2,
}



import { useAuth } from '../../context/AuthContext'

const SidebarContent = ({ currentPath, onNavigate, onLogout, user }) => {
  const getInitials = (name) => {
    if (!name) return 'GB';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  return (
    <div className="flex h-full flex-col border-r border-white/10 bg-linear-to-b from-[#0F3D91] via-[#13479F] to-[#1A56B3] text-white">
      <div className="px-6 pt-6 pb-2">
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <span>🌐</span> TravelBridge
        </h1>
      </div>

      <nav className="mt-4 flex-1 px-4 pb-4">
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard
            const active = item.path ? currentPath === item.path : Boolean(item.active)

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onNavigate(item.path)}
                className={`flex w-full items-center gap-3 rounded-[18px] px-4 py-3 text-left text-sm font-medium transition-all duration-200 hover:bg-white/10 hover:translate-x-0.5 ${
                  active ? 'bg-[#2F6EF2] shadow-lg shadow-blue-950/20' : 'text-white/88'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
      
      {/* user profile and logout */}
      <div className="px-5 pt-5 mb-4">
        <div className="flex items-center justify-between lg:hidden mb-2">
          <div className="text-sm font-semibold tracking-wide text-white/90">TravelBridge</div>
        </div>

        <div className="flex items-center gap-3 rounded-[22px] bg-white/10 px-4 py-3 shadow-sm backdrop-blur-md w-full justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/20 text-xs font-semibold text-white border border-white/10 shadow-inner">
              {getInitials(user?.fullname)}
            </div>
            <div className="min-w-0 text-left">
              <p className="truncate text-xs font-bold text-white leading-tight">{user?.fullname || 'Guest User'}</p>
              <p className="truncate text-[10px] text-white/60 mt-0.5">{user?.email || 'guest@travelbridge.com'}</p>
            </div>
          </div>
          <button 
            type="button"
            className="rounded-full p-1.5 hover:bg-white/20 text-white/90 hover:text-white transition-colors shrink-0" 
            onClick={onLogout}
            title="Logout"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="px-4 pb-5">
        <div className="rounded-3xl bg-white/12 p-4 shadow-lg ring-1 ring-white/10 backdrop-blur-md">
          <div className="mb-3 flex items-center gap-2 text-white/90">
            <Crown className="h-4 w-4 text-amber-300" />
            <span className="text-sm font-semibold">Upgrade to Premium</span>
          </div>
          <p className="text-sm leading-6 text-white/75">
            Unlimited translations, offline packs, AI trip planner & more.
          </p>
          <button className="mt-4 flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#0F3D91] transition hover:bg-blue-50">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  )
}

const Sidebar = ({ open, onClose }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  
  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleNavigate = (path) => {
    if (!path) return
    navigate(path)
    if (open) onClose()
  }

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-68 lg:block xl:w-72">
        <SidebarContent currentPath={location.pathname} onNavigate={handleNavigate} onLogout={handleLogout} user={user} />
      </aside>

      <AnimatePresence>
        {open ? (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-slate-950/45 cursor-default"
              onClick={onClose}
              aria-label="Close sidebar"
            />

            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="relative h-full w-[82vw] min-w-64 max-w-72 shadow-2xl z-10"
            >
              <button
                onClick={onClose}
                className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 transition"
              >
                <X className="h-4 w-4" />
              </button>
              <SidebarContent currentPath={location.pathname} onNavigate={handleNavigate} onLogout={handleLogout} user={user} />
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default Sidebar