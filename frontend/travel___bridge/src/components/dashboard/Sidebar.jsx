import { motion, AnimatePresence } from 'framer-motion'
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
  ChevronRight,
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

const SidebarContent = () => (
  <div className="flex h-full flex-col bg-gradient-to-b from-[#0F3D91] via-[#0d3a88] to-[#0B3176] text-white">
    <div className="px-5 pt-5">
      <div className="flex items-center justify-between lg:hidden">
        <div className="text-sm font-semibold tracking-wide text-white/90">TravelBridge</div>
      </div>

      <div className="flex items-center gap-3 rounded-[22px] bg-white/10 px-4 py-4 shadow-sm backdrop-blur-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 ring-4 ring-white/10">
          <span className="text-lg font-semibold">JD</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold">John Doe</p>
          <p className="text-sm text-white/75">Premium Plan ✨</p>
        </div>
        <ChevronRight className="h-4 w-4 text-white/70" />
      </div>
    </div>

    <nav className="mt-6 flex-1 px-4 pb-4">
      <div className="space-y-1">
        {sidebarItems.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard
          const active = Boolean(item.active)

          return (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-[18px] px-4 py-3 text-left text-sm font-medium transition-all duration-200 hover:bg-white/10 hover:translate-x-0.5 ${
                active ? 'bg-[#2563EB] shadow-lg shadow-blue-950/20' : 'text-white/88'
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>

    <div className="px-4 pb-5">
      <div className="rounded-[24px] bg-white/12 p-4 shadow-lg ring-1 ring-white/10 backdrop-blur-md">
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

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] lg:block">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {open ? (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed inset-y-0 left-0 z-50 w-[280px] lg:hidden"
          >
            <div className="absolute inset-0 bg-slate-950/40" onClick={onClose} />
            <div className="relative h-full w-[250px] shadow-2xl">
              <button
                onClick={onClose}
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md"
              >
                <X className="h-4 w-4" />
              </button>
              <SidebarContent />
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default Sidebar