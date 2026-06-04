import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Languages, LibraryBig, Check, Loader2 } from 'lucide-react'
import { offlinePacks as defaultPacks } from './dashboardData'
import { useAuth } from '../../context/AuthContext'

const OfflineEssentials = () => {
  const { showToast } = useAuth()
  const [packs, setPacks] = useState(() => {
    const saved = localStorage.getItem('travelbridge-offline-packs')
    if (saved) return JSON.parse(saved)
    // Initial state: first is downloaded, others are not
    return defaultPacks.map((p, i) => ({
      ...p,
      status: i === 0 ? 'Downloaded' : 'Download',
      progress: i === 0 ? 100 : 0
    }))
  })

  const savePacks = (updated) => {
    setPacks(updated)
    localStorage.setItem('travelbridge-offline-packs', JSON.stringify(updated))
  }

  const handleDownloadClick = (langName) => {
    const pack = packs.find(p => p.language === langName)
    if (!pack || pack.status === 'Downloaded' || pack.status === 'Downloading') return

    // Start download simulation
    let progress = 0
    const updated = packs.map(p => p.language === langName ? { ...p, status: 'Downloading', progress: 0 } : p)
    savePacks(updated)

    showToast(`Starting download for ${langName} pack...`, 'success')

    const interval = setInterval(() => {
      progress += 20
      setPacks(prev => {
        const next = prev.map(p => {
          if (p.language === langName) {
            if (progress >= 100) {
              clearInterval(interval)
              setTimeout(() => {
                showToast(`${langName} pack is now available offline.`, 'success')
              }, 100)
              return { ...p, status: 'Downloaded', progress: 100 }
            }
            return { ...p, progress }
          }
          return p
        })
        localStorage.setItem('travelbridge-offline-packs', JSON.stringify(next))
        return next
      })
    }, 400)
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.12 }}
      className="rounded-[30px] bg-white p-5 shadow-lg ring-1 ring-slate-100"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <h2 className="text-lg font-semibold text-slate-900">Offline Essentials</h2>
          <p className="mt-1 text-sm text-slate-500">Download packs for airports, train stations, and low-connectivity travel.</p>
        </div>

        <button 
          onClick={() => showToast('All packs page loaded', 'success')}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-200/70 transition hover:bg-blue-700"
        >
          <LibraryBig className="h-4 w-4" />
          Download Packs
        </button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-4">
        {packs.map((pack) => (
          <div 
            key={pack.language} 
            className="flex flex-col rounded-[22px] border border-slate-200 bg-slate-50/60 p-4 shadow-sm hover:shadow-md transition hover:bg-white relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-lg shadow-sm ring-1 ring-slate-100">
                  {pack.flag}
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900">{pack.language}</p>
                  <p className="text-xs text-slate-400 font-semibold">{pack.size}</p>
                </div>
              </div>

              {pack.status === 'Downloaded' && (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm" title="Downloaded">
                  <Check className="h-4.5 w-4.5" />
                </div>
              )}

              {pack.status === 'Downloading' && (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100 shadow-sm" title={`Downloading ${pack.progress}%`}>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                </div>
              )}

              {pack.status === 'Download' && (
                <button 
                  onClick={() => handleDownloadClick(pack.language)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 hover:text-blue-600 border border-slate-200 shadow-sm hover:border-blue-100 transition"
                  title="Download pack"
                >
                  <Download className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Progress bar for downloading status */}
            {pack.status === 'Downloading' && (
              <div className="w-full mt-3">
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                    style={{ width: `${pack.progress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[9px] font-bold text-blue-600">DOWNLOADING...</span>
                  <span className="text-[9px] font-bold text-blue-600">{pack.progress}%</span>
                </div>
              </div>
            )}
            
            {pack.status === 'Downloaded' && (
              <div className="flex items-center gap-1 mt-3">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Available Offline</span>
              </div>
            )}
            
            {pack.status === 'Download' && (
              <div className="flex items-center gap-1 mt-3">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-350" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Cloud Storage</span>
              </div>
            )}
          </div>
        ))}

        <div 
          onClick={() => showToast('Offline settings page loaded', 'success')}
          className="flex items-center justify-center rounded-[22px] border border-dashed border-slate-300 bg-white p-4 text-xs font-bold text-[#2563EB] shadow-sm hover:bg-blue-50 transition cursor-pointer"
        >
          <Languages className="mr-2 h-4 w-4" />
          View All Packs
        </div>
      </div>
    </motion.section>
  )
}

export default OfflineEssentials