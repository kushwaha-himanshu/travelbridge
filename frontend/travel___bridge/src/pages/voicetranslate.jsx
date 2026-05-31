import { useState } from 'react'
import { ArrowLeftRight, ChevronDown, Mic, Settings2, Volume2, X } from 'lucide-react'
import Sidebar from '../components/dashboard/Sidebar'

const waveformHeights = [18, 24, 32, 44, 58, 72, 92, 68, 54, 42, 30, 22, 18, 22, 30, 42, 54, 68, 92, 72, 58, 44, 32, 24, 18]

const getSidebarInitialState = () => {
	if (typeof window === 'undefined') return false
	return window.sessionStorage.getItem('travelbridge-translate-sidebar-open') === '1'
}

const VoiceTranslate = () => {
	const [sidebarOpen, setSidebarOpen] = useState(getSidebarInitialState)

	const openSidebar = () => {
		setSidebarOpen(true)
		window.sessionStorage.setItem('travelbridge-translate-sidebar-open', '1')
	}

	const closeSidebar = () => {
		setSidebarOpen(false)
		window.sessionStorage.setItem('travelbridge-translate-sidebar-open', '0')
	}

	return (
		<>
			<Sidebar open={sidebarOpen} onClose={closeSidebar} />
			<div className="min-h-screen bg-slate-100 px-4 py-5 sm:px-6 md:py-8 lg:pl-68 xl:pl-72">
				<main className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-[#F8FAFD] p-4 shadow-sm sm:p-5 md:max-w-lg">
				<header className="mb-4 flex items-center justify-between">
					<button
						type="button"
						onClick={openSidebar}
						className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-200/70"
						aria-label="Open sidebar"
					>
						<X className="h-4.5 w-4.5" />
					</button>

					<h1 className="text-lg font-semibold text-slate-900">Voice Translate</h1>

					<button
						type="button"
						onClick={openSidebar}
						className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-200/70"
						aria-label="Settings"
					>
						<Settings2 className="h-4.5 w-4.5" />
					</button>
				</header>

				<section className="mb-5 flex items-center gap-2">
					<button
						type="button"
						className="flex h-12 flex-1 items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-800 shadow-sm"
					>
						<span className="flex items-center gap-2.5">
							<span className="text-base">🇺🇸</span>
							English
						</span>
						<ChevronDown className="h-4 w-4 text-slate-500" />
					</button>

					<button
						type="button"
						className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm"
						aria-label="Swap languages"
					>
						<ArrowLeftRight className="h-4 w-4" />
					</button>

					<button
						type="button"
						className="flex h-12 flex-1 items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-800 shadow-sm"
					>
						<span className="flex items-center gap-2.5">
							<span className="text-base">🇪🇸</span>
							Spanish
						</span>
						<ChevronDown className="h-4 w-4 text-slate-500" />
					</button>
				</section>

				<section className="rounded-3xl border border-slate-200 bg-white px-4 py-5 shadow-sm sm:px-5">
					<div className="flex items-end justify-between gap-3">
						<div className="flex-1">
							  <div className="flex h-36 items-center justify-between gap-1 overflow-hidden rounded-2xl bg-linear-to-b from-slate-50 to-white px-1 sm:h-40">
								{waveformHeights.map((height, index) => (
									<span
										key={index}
										className={`w-1 rounded-full ${index < 7 ? 'bg-blue-600' : 'bg-blue-200/80'}`}
										style={{ height: `${height}px` }}
									/>
								))}
							</div>

							<div className="mt-5 text-center">
								<div className="text-2xl font-semibold tracking-tight text-slate-900">00:05</div>
								<div className="mt-1 text-sm font-medium text-slate-500">Listening...</div>
							</div>
						</div>
					</div>

					<div className="mt-6 flex justify-center">
						<button
							type="button"
							className="flex h-24 w-24 items-center justify-center rounded-full bg-[#2563EB] text-white shadow-[0_18px_40px_rgba(37,99,235,0.35)] transition hover:-translate-y-0.5 hover:bg-blue-700 sm:h-28 sm:w-28"
							aria-label="Start voice input"
						>
							<Mic className="h-10 w-10 sm:h-12 sm:w-12" />
						</button>
					</div>
				</section>

				<section className="mt-5 rounded-3xl border border-emerald-100 bg-[#E8F8F1] p-4 shadow-sm sm:p-5">
					<p className="text-[1.02rem] leading-7 text-slate-900 sm:text-[1.06rem]">¿Dónde está la estación de tren?</p>

					<div className="mt-5 flex items-center justify-end gap-2 text-slate-700">
						<button type="button" className="rounded-md p-1.5 transition hover:bg-white/70" aria-label="Listen translation">
							<Volume2 className="h-4.5 w-4.5" />
						</button>
						<button type="button" className="rounded-md p-1.5 transition hover:bg-white/70" aria-label="Copy translation">
							<span className="sr-only">Copy</span>
							<svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
								<rect x="9" y="9" width="13" height="13" rx="2" />
								<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
							</svg>
						</button>
					</div>
				</section>
				</main>
			</div>
		</>
	)
}

export default VoiceTranslate
