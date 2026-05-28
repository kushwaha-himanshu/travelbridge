import { motion } from 'framer-motion'
import { Download, Languages, LibraryBig } from 'lucide-react'
import { offlinePacks } from './dashboardData'

const OfflineEssentials = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.12 }}
      className="rounded-[30px] bg-white p-4 shadow-lg ring-1 ring-slate-100"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <h2 className="text-lg font-semibold text-slate-900">Offline Essentials</h2>
          <p className="mt-1 text-sm text-slate-500">Download packs for airports, train stations, and low-connectivity travel.</p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-200/70 transition hover:bg-blue-700">
          <LibraryBig className="h-4 w-4" />
          Download Packs
        </button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-4">
        {offlinePacks.map((pack) => (
          <div key={pack.language} className="flex items-center justify-between rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm transition hover:bg-white">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-lg shadow-sm ring-1 ring-slate-200">
                {pack.flag}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">{pack.language}</p>
                <p className="text-xs text-slate-500">{pack.size}</p>
              </div>
            </div>

            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:text-[#2563EB]">
              <Download className="h-4 w-4" />
            </button>
          </div>
        ))}

        <div className="flex items-center justify-center rounded-[22px] border border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-[#2563EB] shadow-sm transition hover:bg-blue-50">
          <Languages className="mr-2 h-4 w-4" />
          View All
        </div>
      </div>
    </motion.section>
  )
}

export default OfflineEssentials