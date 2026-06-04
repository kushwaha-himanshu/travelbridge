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
  Loader2
} from 'lucide-react'
import Sidebar from '../components/dashboard/Sidebar'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const languages = [
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
  const [sourceLang, setSourceLang] = useState('en')
  const [targetLang, setTargetLang] = useState('es')
  const [sourceText, setSourceText] = useState('Where is the train station?')
  const [translatedText, setTranslatedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Language Dropdown toggles
  const [srcDropdownOpen, setSrcDropdownOpen] = useState(false)
  const [tgtDropdownOpen, setTgtDropdownOpen] = useState(false)

  const textareaRef = useRef(null)

	const openSidebar = () => {
		setSidebarOpen(true)
		window.sessionStorage.setItem('travelbridge-translate-sidebar-open', '1')
	}

	const closeSidebar = () => {
		setSidebarOpen(false)
		window.sessionStorage.setItem('travelbridge-translate-sidebar-open', '0')
	}

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [sourceText])

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setError("Please enter some text to translate.")
      return
    }

    setLoading(true)
    setError('')
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(sourceText)}`;
      const res = await axios.get(url)
      if (res.data && res.data[0]) {
        const result = res.data[0].map(s => s[0]).join('')
        setTranslatedText(result)
      } else {
        throw new Error("Invalid translation response")
      }
    } catch (err) {
      console.error("Translation API error:", err)
      setError("Translation failed. Please check your network connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  // Initial translation on load
  useEffect(() => {
    const timer = setTimeout(() => {
      handleTranslate()
    }, 0)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSwap = () => {
    const tempLang = sourceLang
    setSourceLang(targetLang)
    setTargetLang(tempLang)
    
    const tempText = sourceText
    setSourceText(translatedText || tempText)
    setTranslatedText(tempText)
  }

  const handleClear = () => {
    setSourceText('')
    setTranslatedText('')
    setError('')
  }

  const handleCopy = (text, label) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    showToast(`${label} copied to clipboard!`, 'success')
  }

  const handleSpeak = (text, langCode) => {
    if (!text) return
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      // Map basic ISO codes
      utterance.lang = langCode
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
      // Fallback
      handleCopy(shareText, 'Translation share text')
    }
  }

  const handleSave = () => {
    if (!sourceText.trim() || !translatedText) return
    
    const saved = localStorage.getItem('travelbridge-translations')
    const list = saved ? JSON.parse(saved) : []
    
    const srcLangObj = languages.find(l => l.code === sourceLang)
    const tgtLangObj = languages.find(l => l.code === targetLang)

    const newItem = {
      original: sourceText,
      translation: `${srcLangObj.name} → ${tgtLangObj.name}`,
      translatedText: translatedText,
      time: 'Just now'
    }

    // Prepend to prevent duplicating key listings
    const updated = [newItem, ...list.filter(item => item.original !== sourceText)]
    localStorage.setItem('travelbridge-translations', JSON.stringify(updated))
    showToast('Translation saved to your history!', 'success')
  }

  const activeSrcLang = languages.find(l => l.code === sourceLang) || languages[0]
  const activeTgtLang = languages.find(l => l.code === targetLang) || languages[1]

	return (
		<>
			<Sidebar open={sidebarOpen} onClose={closeSidebar} />
			<div className="min-h-screen bg-[#F5F7FB] px-4 py-5 sm:px-6 md:py-8 lg:pl-68 xl:pl-72 text-slate-900">
				<main className="mx-auto w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6">
					
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

						<div className="w-10 h-10 hidden lg:block" /> {/* Spacer for symmetry on desktop */}
					</header>

					{/* Language Selectors */}
					<section className="mb-5 flex items-center gap-2 relative z-10">
						{/* Source Selector */}
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => { setSrcDropdownOpen(!srcDropdownOpen); setTgtDropdownOpen(false); }}
                className="flex h-13 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 shadow-sm hover:bg-slate-50 transition"
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-lg leading-none">{activeSrcLang.flag}</span>
                  {activeSrcLang.name}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              {srcDropdownOpen && (
                <>
                  <div className="fixed inset-0" onClick={() => setSrcDropdownOpen(false)} />
                  <div className="absolute left-0 mt-2 z-20 w-full rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl max-h-60 overflow-auto">
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
                  </div>
                </>
              )}
            </div>

            {/* Swap Button */}
						<button
							type="button"
              onClick={handleSwap}
							className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-550 shadow-sm hover:bg-slate-50 hover:text-blue-600 transition active:scale-95"
							aria-label="Swap languages"
						>
							<ArrowLeftRight className="h-4.5 w-4.5" />
						</button>

            {/* Target Selector */}
						<div className="relative flex-1">
              <button
                type="button"
                onClick={() => { setTgtDropdownOpen(!tgtDropdownOpen); setSrcDropdownOpen(false); }}
                className="flex h-13 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 shadow-sm hover:bg-slate-50 transition"
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-lg leading-none">{activeTgtLang.flag}</span>
                  {activeTgtLang.name}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              {tgtDropdownOpen && (
                <>
                  <div className="fixed inset-0" onClick={() => setTgtDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 z-20 w-full rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl max-h-60 overflow-auto">
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => { setTargetLang(lang.code); setTgtDropdownOpen(false); }}
                        className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-semibold hover:bg-slate-50 transition ${lang.code === targetLang ? 'bg-blue-50/70 text-[#2563EB]' : 'text-slate-705'}`}
                      >
                        <span className="text-base">{lang.flag}</span>
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
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
							</div>

							<span className="text-xs font-semibold text-slate-400">{sourceText.length} / 5000</span>
						</div>
					</section>

          {/* Translate Button */}
					<button
						type="button"
            disabled={loading || !sourceText.trim()}
            onClick={handleTranslate}
						className="mt-4 h-13 w-full rounded-2xl bg-[#2563EB] text-sm font-bold text-white shadow-lg shadow-blue-200/80 transition hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-xl active:scale-[0.99]"
					>
						{loading ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                Translating...
              </>
            ) : (
              "Translate"
            )}
					</button>

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
                <p className="text-[1.05rem] leading-relaxed font-bold text-slate-800 break-words">{translatedText}</p>
                
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
                      onClick={() => handleCopy(translatedText, 'Translation')}
                      className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition" 
                      title="Copy translation"
                    >
                      <Copy className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-slate-655 hover:bg-slate-100 hover:text-blue-600 transition"
                    >
                      <Bookmark className="h-4 w-4" />
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-slate-655 hover:bg-slate-100 hover:text-blue-600 transition"
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
				</main>
			</div>
		</>
	)
}

export default TextTranslate
