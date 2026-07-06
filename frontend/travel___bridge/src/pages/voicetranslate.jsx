import { useState, useEffect, useRef } from 'react'
import { ArrowLeftRight, ChevronDown, Mic, Settings2, Volume2, X, Play, Square, AlertCircle, RefreshCw, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import Sidebar from '../components/dashboard/Sidebar'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const languages = [
  { code: 'en-US', name: 'English', flag: '🇺🇸', speechCode: 'en-US' },
  { code: 'es-ES', name: 'Spanish', flag: '🇪🇸', speechCode: 'es-ES' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷', speechCode: 'fr-FR' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳', speechCode: 'hi-IN' },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵', speechCode: 'ja-JP' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪', speechCode: 'de-DE' }
]

const getSidebarInitialState = () => {
  if (typeof window === 'undefined') return false
  return window.sessionStorage.getItem('travelbridge-translate-sidebar-open') === '1'
}

const VoiceTranslate = () => {
  const { showToast } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(getSidebarInitialState)

  // Language selection
  const [sourceLang, setSourceLang] = useState('en-US')
  const [targetLang, setTargetLang] = useState('es-ES')
  const [srcDropdownOpen, setSrcDropdownOpen] = useState(false)
  const [tgtDropdownOpen, setTgtDropdownOpen] = useState(false)

  // Recording states
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [permissionError, setPermissionError] = useState(false)

  // Translation flows
  const [transcript, setTranscript] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Audio Playback states
  const [userAudioUrl, setUserAudioUrl] = useState(null)
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false)

  // Waveform height values
  const [waveform, setWaveform] = useState(Array(20).fill(15))

  // Refs
  const recognitionRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const timerRef = useRef(null)
  const audioRef = useRef(new Audio())

  const openSidebar = () => {
    setSidebarOpen(true)
    window.sessionStorage.setItem('travelbridge-translate-sidebar-open', '1')
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
    window.sessionStorage.setItem('travelbridge-translate-sidebar-open', '0')
  }

  const stopRecordingState = () => {
    setIsRecording(false)
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    setRecordingTime(0)
    setWaveform(Array(20).fill(15))
  }

  const saveToHistory = (orig, trans) => {
    const saved = localStorage.getItem('travelbridge-translations')
    const list = saved ? JSON.parse(saved) : []
    const srcLangObj = languages.find(l => l.code === sourceLang)
    const tgtLangObj = languages.find(l => l.code === targetLang)

    const newItem = {
      original: orig,
      translation: `${srcLangObj.name} → ${tgtLangObj.name}`,
      translatedText: trans,
      time: 'Voice Session'
    }
    localStorage.setItem('travelbridge-translations', JSON.stringify([newItem, ...list.filter(item => item.original !== orig)]))
  }

  const speakText = (text, langCode) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel() // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = langCode
      window.speechSynthesis.speak(utterance)
      showToast('Speaking translation...', 'success')
    }
  }

  const handleTranslateSpeech = async (text) => {
    if (!text) return
    setIsLoading(true)
    try {
      const srcCode = sourceLang.split('-')[0]
      const tgtCode = targetLang.split('-')[0]
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${srcCode}&tl=${tgtCode}&dt=t&q=${encodeURIComponent(text)}`
      const res = await axios.get(url)

      if (res.data && res.data[0]) {
        const result = res.data[0].map(s => s[0]).join('')
        setTranslatedText(result)

        // Save to translation history
        saveToHistory(text, result)

        // Automatically speak translated text
        speakText(result, targetLang)
      }
    } catch (err) {
      console.error("Speech translation error:", err)
      showToast('Speech translation failed.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Set up Speech Recognition on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const rec = new SpeechRecognition()
      rec.continuous = false
      rec.interimResults = false

      rec.onresult = async (event) => {
        const resultText = event.results[0][0].transcript
        setTranscript(resultText)
        await handleTranslateSpeech(resultText)
      }

      rec.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        if (event.error === 'not-allowed') {
          setPermissionError(true)
          showToast('Microphone access denied.', 'error')
        } else {
          showToast('Speech recognition failed. Try speaking closer to your mic.', 'error')
        }
        stopRecordingState()
      }

      rec.onend = () => {
        setIsRecording(false)
      }

      recognitionRef.current = rec
    } else {
      console.warn("SpeechRecognition not supported in this browser.")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceLang, targetLang])

  // Timer effect
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
        // Simulate waveform movement
        setWaveform(prev => prev.map(() => Math.floor(Math.random() * 60) + 12))
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [isRecording])

  const startRecording = async () => {
    setPermissionError(false)
    setTranscript('')
    setTranslatedText('')
    setUserAudioUrl(null)
    setRecordingTime(0)
    setWaveform(Array(20).fill(15))

    if (!recognitionRef.current) {
      showToast('Speech recognition is not supported in this browser.', 'error')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Initialize media recorder for audio playback
      const mediaRecorder = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        setUserAudioUrl(audioUrl)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current = mediaRecorder

      // Start recording processes
      recognitionRef.current.lang = sourceLang
      recognitionRef.current.start()
      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error("Mic access error:", err)
      setPermissionError(true)
      showToast('Could not access microphone.', 'error')
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    setIsRecording(false)
    setRecordingTime(0)
    setWaveform(Array(20).fill(15))
  }

  const playRecordedAudio = () => {
    if (!userAudioUrl) return
    setIsPlayingUserAudio(true)
    audioRef.current.src = userAudioUrl
    audioRef.current.play()
    audioRef.current.onended = () => {
      setIsPlayingUserAudio(false)
    }
  }

  const stopUserAudio = () => {
    audioRef.current.pause()
    setIsPlayingUserAudio(false)
  }

  const handleSwap = () => {
    const temp = sourceLang
    setSourceLang(targetLang)
    setTargetLang(temp)
    setTranscript('')
    setTranslatedText('')
    setUserAudioUrl(null)
  }

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const activeSrcLang = languages.find(l => l.code === sourceLang) || languages[0]
  const activeTgtLang = languages.find(l => l.code === targetLang) || languages[1]

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />
      <div className="min-h-screen bg-[#F5F7FB] px-4 py-5 sm:px-6 md:py-8 lg:pl-68 xl:pl-72 text-slate-900">
        <main className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6 md:max-w-lg">

          {/* Header */}
          <header className="mb-5 flex items-center justify-between">
            <button
              type="button"
              onClick={openSidebar}
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 lg:hidden"
              aria-label="Open sidebar"
            >
              <X className="h-5 w-5" />
            </button>

            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>🎙️</span> Voice Translate
            </h1>

            <button
              type="button"
              onClick={() => showToast('Voice settings selected', 'success')}
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100"
              aria-label="Settings"
            >
              <Settings2 className="h-5 w-5" />
            </button>
          </header>

          {/* Language Selectors */}
          <section className="mb-5 flex items-center gap-2 relative z-10">
            {/* Source Lang */}
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

            <button
              type="button"
              onClick={handleSwap}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-655 shadow-sm hover:bg-slate-50 transition active:scale-95"
              aria-label="Swap languages"
            >
              <ArrowLeftRight className="h-4.5 w-4.5" />
            </button>

            {/* Target Lang */}
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

          {/* Microphone Permission Warning */}
          {permissionError && (
            <div className="mb-4 flex items-start gap-3 rounded-2xl bg-rose-50 border border-rose-100 p-4 text-rose-700">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold">Microphone Access Denied</p>
                <p className="text-xs text-rose-600 mt-1 leading-relaxed">
                  TravelBridge needs microphone permissions to translate voice. Please check your browser settings and allow mic access.
                </p>
                <button
                  onClick={startRecording}
                  className="mt-3 flex items-center gap-1.5 text-xs font-bold bg-white border border-rose-200 px-3.5 py-2 rounded-xl hover:bg-rose-100/50 transition"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Try Again
                </button>
              </div>
            </div>
          )}

          {/* Recording Visual Card */}
          <section className="rounded-3xl border border-slate-200 bg-white px-4 py-6 shadow-sm sm:px-6 relative">
            <div className="flex items-end justify-between gap-3">
              <div className="flex-1 flex flex-col items-center">
                {/* Waveform visualizer */}
                <div className="flex h-36 items-center justify-center gap-1.5 overflow-hidden rounded-2xl bg-slate-50/60 w-full px-4 sm:h-40 border border-slate-100">
                  {waveform.map((height, index) => (
                    <motion.span
                      key={index}
                      animate={isRecording ? { height: [`${height}px`, `${height * 1.5}px`, `${height}px`] } : { height: '14px' }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: index * 0.03 }}
                      className={`w-1.5 rounded-full ${isRecording ? (index % 2 === 0 ? 'bg-blue-600' : 'bg-cyan-500') : 'bg-slate-300/80'}`}
                      style={{ height: `${height}px` }}
                    />
                  ))}
                </div>

                <div className="mt-5 text-center">
                  <div className="text-3xl font-bold tracking-tight text-slate-800">{formatTime(recordingTime)}</div>
                  <div className="mt-1.5 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    {isRecording ? 'Listening...' : 'Tap Mic to Start'}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center items-center gap-4">
              {/* Playback Button */}
              {userAudioUrl && !isRecording && (
                <button
                  type="button"
                  onClick={isPlayingUserAudio ? stopUserAudio : playRecordedAudio}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border shadow-sm transition hover:scale-105 ${isPlayingUserAudio ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  title="Play original speech"
                >
                  {isPlayingUserAudio ? <Square className="h-4.5 w-4.5 fill-current" /> : <Play className="h-4.5 w-4.5 fill-current ml-0.5" />}
                </button>
              )}

              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg transition active:scale-95 ${isRecording
                    ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-200 ring-4 ring-rose-100 animate-pulse'
                    : 'bg-[#2563EB] hover:bg-blue-700 shadow-blue-200 hover:-translate-y-0.5'
                  }`}
                aria-label="Toggle voice input"
              >
                {isRecording ? <Square className="h-7 w-7" /> : <Mic className="h-8 w-8" />}
              </button>

              <div className="w-12 h-12 flex items-center justify-center" /> {/* symmetry balance */}
            </div>
          </section>

          {/* Translation Output Card */}
          {(transcript || translatedText || isLoading) && (
            <section className="mt-5 rounded-3xl border border-emerald-100 bg-[#E8F8F1] p-5 shadow-sm">
              {isLoading ? (
                <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                  <Loader2 className="h-4.5 w-4.5 animate-spin" /> Translating spoken audio...
                </div>
              ) : (
                <>
                  <div className="border-b border-emerald-200/50 pb-3 mb-3">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block mb-1">You Spoke ({activeSrcLang.name})</span>
                    <p className="text-[1.02rem] leading-relaxed text-slate-800 font-semibold">{transcript}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block mb-1">Translation ({activeTgtLang.name})</span>
                    <p className="text-[1.05rem] leading-relaxed text-emerald-950 font-bold">{translatedText}</p>
                  </div>

                  <div className="mt-5 flex items-center justify-end gap-2 border-t border-emerald-200/40 pt-2 text-emerald-800">
                    <button
                      type="button"
                      onClick={() => speakText(translatedText, targetLang)}
                      className="rounded-xl p-2.5 transition hover:bg-white/60 hover:text-emerald-950"
                      aria-label="Listen translation"
                      title="Play translation"
                    >
                      <Volume2 className="h-4.5 w-4.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => { navigator.clipboard.writeText(translatedText); showToast('Translation copied!', 'success'); }}
                      className="rounded-xl p-2.5 transition hover:bg-white/60 hover:text-emerald-950"
                      aria-label="Copy translation"
                      title="Copy text"
                    >
                      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </section>
          )}
        </main>
      </div>
    </>
  )
}

export default VoiceTranslate
