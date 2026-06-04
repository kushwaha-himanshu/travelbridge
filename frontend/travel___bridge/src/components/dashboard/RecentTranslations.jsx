import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MoreVertical, ScrollText, Volume2, Copy, Trash2, X, Globe } from 'lucide-react'
import { translations as defaultTranslations } from './dashboardData'
import { useAuth } from '../../context/AuthContext'
import ConfirmDialog from '../shared/ConfirmDialog'

const RecentTranslations = () => {
  const { showToast } = useAuth()
  const [list, setList] = useState(() => {
    const saved = localStorage.getItem('travelbridge-translations')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return defaultTranslations
      }
    } else {
      localStorage.setItem('travelbridge-translations', JSON.stringify(defaultTranslations))
      return defaultTranslations
    }
  })
  const [deleteIndex, setDeleteIndex] = useState(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [showAllModal, setShowAllModal] = useState(false)
  const [activeMenuIndex, setActiveMenuIndex] = useState(null)

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    showToast('Translation copied to clipboard!', 'success')
    setActiveMenuIndex(null)
  }

  const handleDeleteClick = (index) => {
    setDeleteIndex(index)
    setIsConfirmOpen(true)
    setActiveMenuIndex(null)
  }

  const handleConfirmDelete = () => {
    const updated = [...list]
    updated.splice(deleteIndex, 1)
    setList(updated)
    localStorage.setItem('travelbridge-translations', JSON.stringify(updated))
    setIsConfirmOpen(false)
    setDeleteIndex(null)
    showToast('Translation deleted successfully.', 'success')
  }

  const handleSpeak = (text, lang) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      // Basic language matching
      if (lang && lang.toLowerCase().includes('spanish')) {
        utterance.lang = 'es-ES';
      } else if (lang && lang.toLowerCase().includes('french')) {
        utterance.lang = 'fr-FR';
      } else if (lang && lang.toLowerCase().includes('hindi')) {
        utterance.lang = 'hi-IN';
      } else if (lang && lang.toLowerCase().includes('japanese')) {
        utterance.lang = 'ja-JP';
      } else {
        utterance.lang = 'en-US';
      }
      window.speechSynthesis.speak(utterance);
      showToast('Speaking translation...', 'success');
    } else {
      showToast('Text-to-speech not supported in this browser.', 'error');
    }
  }

  // Show only top 5 translations on the card
  const displayList = list.slice(0, 5)

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-[30px] bg-white p-5 shadow-lg ring-1 ring-slate-100 flex flex-col h-full"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Recent Translations</h2>
            <p className="mt-1 text-sm text-slate-500">Your latest language sessions.</p>
          </div>
          <button 
            onClick={() => setShowAllModal(true)}
            className="text-sm font-semibold text-[#2563EB] hover:text-blue-700 transition"
          >
            See all
          </button>
        </div>

        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400">
            <Globe className="h-10 w-10 text-slate-350 stroke-1 mb-2" />
            <p className="text-sm font-medium">No translations yet</p>
            <p className="text-xs text-slate-400 mt-1">Start translating to build history</p>
          </div>
        ) : (
          <div className="space-y-3 overflow-auto pr-1 flex-1 max-h-[390px]">
            {displayList.map((item, index) => (
              <div
                key={`${item.original}-${index}`}
                className="flex items-start justify-between rounded-[22px] border border-slate-100 bg-slate-50/80 px-4 py-3 transition hover:bg-white hover:shadow-sm relative"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-sm font-bold text-slate-800 leading-snug">{item.original}</p>
                  <p className="mt-1 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <span>{item.translation || 'Translation'}</span>
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[10px] font-medium text-slate-400">
                    <ScrollText className="h-3.5 w-3.5 text-slate-300" />
                    {item.time || 'Just now'}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-center relative">
                  <button 
                    onClick={() => handleSpeak(item.original, item.translation?.split('→')[0])}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm border border-slate-100 hover:text-[#2563EB] hover:border-blue-100 transition"
                    title="Speak original"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                  </button>
                  <button 
                    onClick={() => handleCopy(item.original)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm border border-slate-100 hover:text-[#2563EB] hover:border-blue-100 transition"
                    title="Copy"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setActiveMenuIndex(activeMenuIndex === index ? null : index)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm border border-slate-100 hover:text-slate-700 transition"
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>

                    {activeMenuIndex === index && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveMenuIndex(null)} />
                        <div className="absolute right-0 mt-1 z-20 w-28 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                          <button
                            onClick={() => handleDeleteClick(index)}
                            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50/70 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Confirm Deletion Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete Translation"
        message="Are you sure you want to delete this translation from your history?"
        onConfirm={handleConfirmDelete}
        onCancel={() => { setIsConfirmOpen(false); setDeleteIndex(null); }}
      />

      {/* See All History Modal */}
      <AnimatePresence>
        {showAllModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAllModal(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl bg-white p-5 shadow-2xl border border-slate-100 z-10 flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-lg font-bold text-slate-900">Translation History</h3>
                <button 
                  onClick={() => setShowAllModal(false)}
                  className="rounded-full p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-655 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 overflow-auto flex-1 pr-1">
                {list.map((item, index) => (
                  <div
                    key={`${item.original}-${index}`}
                    className="flex items-start justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="text-sm font-bold text-slate-800 leading-snug">{item.original}</p>
                      <p className="mt-1 text-xs font-semibold text-emerald-600">{item.translation}</p>
                      <span className="text-[10px] text-slate-400 block mt-1">{item.time || 'Just now'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => handleSpeak(item.original, item.translation?.split('→')[0])}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 hover:text-blue-600 border border-slate-100 transition"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => handleCopy(item.original)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 hover:text-blue-600 border border-slate-100 transition"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(index)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-rose-500 hover:bg-rose-50 border border-slate-100 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default RecentTranslations