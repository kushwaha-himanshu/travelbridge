import { motion } from 'framer-motion'
import { Bell, ChevronDown, Menu, Search } from 'lucide-react'

const Navbar = ({ onMenuClick }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="sticky top-0 z-30 border-b border-white/70 bg-white/90 backdrop-blur-xl"
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

        <div className="flex items-center gap-3 sm:gap-4">
          <button className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 sm:flex">
            <span className="text-base">🇺🇸</span>
            English
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          <button className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
          </button>

          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-gradient-to-br from-slate-900 to-blue-700 text-sm font-semibold text-white shadow-sm">
            JD
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Navbar