import { useState, useEffect, useRef } from 'react'
import {
  ArrowLeftRight,
  Bookmark,
  ChevronDown,
  Copy,
  Menu,
  Share2,
  Volume2,
  X,
  Loader2,
  Sparkles,
  History,
  Star,
  Trash2,
  Check,
  WifiOff,
  StarOff,
  CopyCheck
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../components/dashboard/Sidebar'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const languages = [
  { code: 'auto', name: 'Detect Language', flag: '🔍' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' }
]

const getSidebarInitialState = () => {
  if (typeof window === 'undefined') return false
  return window.sessionStorage.getItem('travelbridge-translate-sidebar-open') === '1'
}

const TextTranslate = () => {
  const { showToast } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(getSidebarInitialState)
  
  // Translation States
  const [sourceLang, setSourceLang] = useState('auto')
  const [targetLang, setTargetLang] = useState('es')
  const [sourceText, setSourceText] = useState('Where is the train station?')
  const [translatedText, setTranslatedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confidence, setConfidence] = useState(null)
  const [detectedLangCode, setDetectedLangCode] = useState(null)

  // Copy success status
  const [copiedSource, setCopiedSource] = useState(false)
  const [copiedTarget, setCopiedTarget] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  // Dropdown & Drawer toggles
  const [srcDropdownOpen, setSrcDropdownOpen] = useState(false)
  const [tgtDropdownOpen, setTgtDropdownOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)

  // Cache & Refs
  const localCache = useRef(new Map())
  const textareaRef = useRef(null)

  // Lists
  const [historyList, setHistoryList] = useState([])
  const [favoritesList, setFavoritesList] = useState([])

  const openSidebar = () => {
    setSidebarOpen(true)
    window.sessionStorage.setItem('travelbridge-translate-sidebar-open', '1')
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
    window.sessionStorage.setItem('travelbridge-translate-sidebar-open', '0')
  }

  // Load cache, history, and network listeners
  useEffect(() => {
    const savedHist = localStorage.getItem('travelbridge-translations')
    const savedFavs = localStorage.getItem('travelbridge-favorites')
    if (savedHist) setHistoryList(JSON.parse(savedHist))
    if (savedFavs) setFavoritesList(JSON.parse(savedFavs))

    const handleConnection = () => setIsOffline(!navigator.onLine)
    window.addEventListener('online', handleConnection)
    window.addEventListener('offline', handleConnection)
    return () => {
      window.removeEventListener('online', handleConnection)
      window.removeEventListener('offline', handleConnection)
    }
  }, [])

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [sourceText])

  // Instant Translation logic with 500ms debounce
  useEffect(() => {
    if (!sourceText.trim()) {
      setTranslatedText('')
      setError('')
      setConfidence(null)
      setDetectedLangCode(null)
      return
    }

    const cacheKey = `${sourceLang}:${targetLang}:${sourceText.trim()}`
    
    // Check local client cache
    if (localCache.current.has(cacheKey)) {
      const cached = localCache.current.get(cacheKey)
      setTranslatedText(cached.translation)
      setConfidence(cached.confidence || 0.95)
      setDetectedLangCode(cached.detectedLanguage || null)
      setError('')
      return
    }

    setLoading(true)
    setError('')

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      if (!navigator.onLine) {
        setError("Offline Mode: Using local fallback. Uncached queries require internet.")
        setLoading(false)
        return
      }

      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
        const response = await axios.post(`${API_URL}/api/translate/text`, {
          text: sourceText,
          sourceLang,
          targetLang
        }, {
          signal: controller.signal,
          withCredentials: true
        })

        if (response.data && response.data.success) {
          const { translation, detectedLanguage, confidence: conf } = response.data
          setTranslatedText(translation)
          setConfidence(conf)
          if (detectedLanguage) {
            setDetectedLangCode(detectedLanguage)
          }

          localCache.current.set(cacheKey, {
            translation,
            detectedLanguage,
            confidence: conf
          })

          const savedHist = localStorage.getItem('travelbridge-translations')
          if (savedHist) setHistoryList(JSON.parse(savedHist))
        }
      } catch (err) {
        if (axios.isCancel(err)) return
        console.error("Translation request failed:", err)
        
        // Final resilient direct google single fallback
        try {
          const sl = sourceLang === 'auto' ? 'auto' : sourceLang
          const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${targetLang}&dt=t&q=${encodeURIComponent(sourceText)}`
          const res = await axios.get(googleUrl)
          if (res.data && res.data[0]) {
            const fallbackVal = res.data[0].map(s => s[0]).join('')
            setTranslatedText(fallbackVal)
            setDetectedLangCode(res.data[2] || null)
            setConfidence(0.85)
            setError('')
          }
        } catch (fbErr) {
          setError("Translation failed. Server is unreachable.")
        }
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [sourceText, sourceLang, targetLang])

  const handleSwap = () => {
    if (sourceLang === 'auto' && !detectedLangCode) return
    setIsSwapping(true)
    setTimeout(() => setIsSwapping(false), 500)

    const finalSource = sourceLang === 'auto' ? (detectedLangCode || 'en') : sourceLang
    const finalTarget = targetLang

    setSourceLang(finalTarget)
    setTargetLang(finalSource)

    const tempText = sourceText
    setSourceText(translatedText || tempText)
    setTranslatedText(tempText)
  }

  const handleClear = () => {
    setSourceText('')
    setTranslatedText('')
    setError('')
    setConfidence(null)
    setDetectedLangCode(null)
  }

  const handleCopy = (text, type) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    if (type === 'source') {
      setCopiedSource(true)
      setTimeout(() => setCopiedSource(false), 1500)
    } else {
      setCopiedTarget(true)
      setTimeout(() => setCopiedTarget(false), 1500)
    }
    showToast('Copied to clipboard!', 'success')
  }

  const handleSpeak = (text, langCode) => {
    if (!text) return
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = langCode === 'auto' ? (detectedLangCode || 'en') : langCode
      window.speechSynthesis.speak(utterance)
      showToast('Speaking...', 'success')
    } else {
      showToast('Speech synthesis not supported in this browser.', 'error')
    }
  }

  const handleShare = async () => {
    if (!translatedText) return
    const shareText = `Original (${sourceLang.toUpperCase()}): "${sourceText}"\nTranslated (${targetLang.toUpperCase()}): "${translatedText}"`
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TravelBridge Translation',
          text: shareText
        })
        showToast('Shared successfully!', 'success')
      } catch (err) {
        console.error("Share error:", err)
      }
    } else {
      handleCopy(shareText, 'Translation share text')
    }
  }

  const handleSaveFavorite = () => {
    if (!sourceText.trim() || !translatedText) return
    
    const srcLangObj = languages.find(l => l.code === sourceLang) || { name: 'Detected' }
    const tgtLangObj = languages.find(l => l.code === targetLang)

    const isFav = favoritesList.some(item => item.original === sourceText)
    let updated = []

    if (isFav) {
      updated = favoritesList.filter(item => item.original !== sourceText)
      showToast('Removed from favorites', 'success')
    } else {
      const newItem = {
        original: sourceText,
        translation: `${srcLangObj.name} → ${tgtLangObj.name}`,
        translatedText: translatedText,
        sourceLang,
        targetLang,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      updated = [newItem, ...favoritesList]
      showToast('Added to favorites!', 'success')
    }

    setFavoritesList(updated)
    localStorage.setItem('travelbridge-favorites', JSON.stringify(updated))
  }

  const loadHistoryItem = (item) => {
    setSourceLang(item.sourceLang || 'auto')
    setTargetLang(item.targetLang || 'es')
    setSourceText(item.original)
    setHistoryOpen(false)
  }

  const activeSrcLang = languages.find(l => l.code === sourceLang) || languages[0]
  const activeTgtLang = languages.find(l => l.code === targetLang) || languages[1]
  const activeDetectedLang = languages.find(l => l.code === detectedLangCode)

  const isFavorited = favoritesList.some(item => item.original === sourceText)

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />
      
      <div className="min-h-screen bg-[#F5F7FB] px-4 py-5 sm:px-6 md:py-8 lg:pl-68 xl:pl-72 text-slate-900 transition-all duration-300">
        <main className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6 md:max-w-lg relative overflow-hidden">
          
          {/* Header */}
          <header className="mb-5 flex items-center justify-between">
            <button
              type="button"
              onClick={openSidebar}
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>🌐</span> Text Translate
            </h1>

            <button
              type="button"
              onClick={() => setHistoryOpen(!historyOpen)}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                historyOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Recent translations"
            >
              <History className="h-5 w-5" />
            </button>
          </header>

          {/* Offline Mode Banner */}
          {isOffline && (
            <div className="mb-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 p-3 rounded-2xl flex items-center gap-2 text-xs font-semibold animate-pulse">
              <WifiOff className="h-4 w-4 shrink-0" />
              <span>Offline Mode: Using cached translations.</span>
            </div>
          )}

          {/* Language Selectors */}
          <section className="mb-5 flex items-center gap-2 relative z-20">
            {/* Source Selector */}
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => { setSrcDropdownOpen(!srcDropdownOpen); setTgtDropdownOpen(false); }}
                className="flex h-13 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 shadow-sm hover:bg-slate-50 transition"
              >
                <span className="flex items-center gap-2.5 truncate">
                  <span className="text-lg leading-none">{activeSrcLang.flag}</span>
                  <span className="truncate">{activeSrcLang.name}</span>
                  {sourceLang === 'auto' && detectedLangCode && activeDetectedLang && (
                    <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-bold">
                      ({activeDetectedLang.name})
                    </span>
                  )}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              <AnimatePresence>
                {srcDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setSrcDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute left-0 mt-2 z-20 w-full rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl max-h-60 overflow-auto"
                    >
                      {languages.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => { setSourceLang(lang.code); setSrcDropdownOpen(false); }}
                          className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-semibold hover:bg-slate-50 transition ${lang.code === sourceLang ? 'bg-blue-50/70 text-[#2563EB]' : 'text-slate-705'}`}
                        >
                          <span className="text-base">{lang.flag}</span>
                          {lang.name}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Swap Button */}
            <motion.button
              type="button"
              onClick={handleSwap}
              animate={isSwapping ? { rotate: 180 } : { rotate: 0 }}
              transition={{ duration: 0.4 }}
              disabled={sourceLang === 'auto'}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-550 shadow-sm hover:bg-slate-50 hover:text-blue-600 transition active:scale-95 disabled:opacity-40"
              aria-label="Swap languages"
            >
              <ArrowLeftRight className="h-4.5 w-4.5" />
            </motion.button>

            {/* Target Selector */}
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => { setTgtDropdownOpen(!tgtDropdownOpen); setSrcDropdownOpen(false); }}
                className="flex h-13 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 shadow-sm hover:bg-slate-50 transition"
              >
                <span className="flex items-center gap-2.5 truncate">
                  <span className="text-lg leading-none">{activeTgtLang.flag}</span>
                  <span className="truncate">{activeTgtLang.name}</span>
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              <AnimatePresence>
                {tgtDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setTgtDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 z-20 w-full rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl max-h-60 overflow-auto"
                    >
                      {languages.filter(l => l.code !== 'auto').map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => { setTargetLang(lang.code); setTgtDropdownOpen(false); }}
                          className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-semibold hover:bg-slate-50 transition ${lang.code === targetLang ? 'bg-blue-50/70 text-[#2563EB]' : 'text-slate-705'}`}
                        >
                          <span className="text-base">{lang.flag}</span>
                          {lang.name}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Input Box */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-sm focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50 transition">
            <div className="flex justify-between items-start">
              <textarea
                ref={textareaRef}
                rows={4}
                value={sourceText}
                maxLength={5000}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Enter text to translate..."
                className="w-full resize-none border-0 bg-transparent text-[1.05rem] font-medium leading-relaxed text-slate-800 outline-none placeholder:text-slate-400"
              />
              {sourceText && (
                <button
                  onClick={handleClear}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                  title="Clear text"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between text-slate-400 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSpeak(sourceText, sourceLang)}
                  className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition"
                  title="Speak input"
                >
                  <Volume2 className="h-4.5 w-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(sourceText, 'source')}
                  className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition"
                  title="Copy input text"
                >
                  {copiedSource ? <Check className="h-4.5 w-4.5 text-emerald-500" /> : <Copy className="h-4.5 w-4.5" />}
                </button>
              </div>

              <span className="text-xs font-semibold text-slate-400">{sourceText.length} / 5000</span>
            </div>
          </section>

          {/* Error Alert */}
          {error && (
            <p className="mt-4 text-xs text-rose-500 font-semibold bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
              ⚠️ {error}
            </p>
          )}

          {/* Output Box */}
          <section className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-4.5 shadow-sm min-h-36 flex flex-col justify-between">
            {loading ? (
              <div className="space-y-2 animate-pulse w-full py-2">
                <div className="h-4 bg-slate-200 rounded-full w-[90%]" />
                <div className="h-4 bg-slate-200 rounded-full w-[75%]" />
                <div className="h-4 bg-slate-200 rounded-full w-[40%]" />
              </div>
            ) : translatedText ? (
              <>
                <div>
                  {confidence && (
                    <div className="flex items-center gap-1 mb-2">
                      <Sparkles className="h-3.5 w-3.5 text-amber-505" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Confidence: {Math.round(confidence * 100)}%
                      </span>
                    </div>
                  )}
                  <p className="text-[1.05rem] leading-relaxed font-bold text-slate-800 break-words">{translatedText}</p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-200/60 pt-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSpeak(translatedText, targetLang)}
                      className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition"
                      title="Speak translation"
                    >
                      <Volume2 className="h-4.5 w-4.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(translatedText, 'target')}
                      className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition"
                      title="Copy translation"
                    >
                      {copiedTarget ? <Check className="h-4.5 w-4.5 text-emerald-500" /> : <Copy className="h-4.5 w-4.5" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handleSaveFavorite}
                      className={`flex items-center gap-1 rounded-xl px-2.5 py-2 text-xs font-bold transition ${
                        isFavorited 
                          ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20' 
                          : 'text-slate-655 hover:bg-slate-100 hover:text-blue-650'
                      }`}
                    >
                      <Star className={`h-4 w-4 ${isFavorited ? 'fill-current text-amber-500' : ''}`} />
                      {isFavorited ? 'Saved' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="flex items-center gap-1 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-655 hover:bg-slate-100 hover:text-blue-600 transition"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-24 text-slate-400 font-medium text-sm">
                Translation will appear here
              </div>
            )}
          </section>

          {/* Expandable Recent Translations Drawer inside Card */}
          <AnimatePresence>
            {historyOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 border-t border-slate-100 pt-4 overflow-hidden"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <History className="h-3.5 w-3.5" /> Recent Scans
                  </h3>
                  {historyList.length > 0 && (
                    <button 
                      onClick={() => { localStorage.removeItem('travelbridge-translations'); setHistoryList([]); showToast('History cleared', 'success'); }}
                      className="text-[10px] font-bold text-rose-500 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {historyList.length === 0 ? (
                    <p className="text-xs text-slate-400 font-medium text-center py-4">No recent translations</p>
                  ) : (
                    historyList.slice(0, 5).map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => loadHistoryItem(item)}
                        className="p-2.5 rounded-xl border border-slate-100 hover:border-blue-500/25 bg-slate-50/40 cursor-pointer transition flex flex-col gap-0.5 text-left"
                      >
                        <div className="flex justify-between items-center text-[9px] font-bold text-blue-600">
                          <span>{item.translation}</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-700 truncate">"{item.original}"</p>
                        <p className="text-xs font-bold text-slate-900 truncate">"{item.translatedText}"</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </main>
      </div>
    </>
  )
}

export default TextTranslate
