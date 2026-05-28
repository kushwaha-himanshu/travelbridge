import { motion } from 'framer-motion'
import { MoreVertical, Play, ScrollText, Volume2 } from 'lucide-react'
import { translations } from './dashboardData'

const RecentTranslations = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-[30px] bg-white p-5 shadow-lg ring-1 ring-slate-100"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Recent Translations</h2>
          <p className="mt-1 text-sm text-slate-500">A modern list of your latest language sessions.</p>
        </div>
        <button className="text-sm font-medium text-[#2563EB] transition hover:text-blue-700">See all</button>
      </div>

      <div className="max-h-[430px] space-y-3 overflow-auto pr-1">
        {translations.map((item, index) => (
          <div
            key={`${item.original}-${index}`}
            className="flex items-start justify-between rounded-[22px] border border-slate-100 bg-slate-50/80 px-4 py-4 transition hover:bg-white"
          >
            <div className="min-w-0 flex-1 pr-3">
              <p className="truncate text-sm font-medium text-slate-900">{item.original}</p>
              <p className="mt-1 text-xs font-medium text-emerald-600">{item.translation}</p>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <ScrollText className="h-3.5 w-3.5" />
                {item.time}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:text-[#2563EB]">
                <Volume2 className="h-4 w-4" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:text-[#2563EB]">
                <Play className="h-4 w-4 fill-current" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:text-slate-800">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  )
}

export default RecentTranslations