import { useState } from 'react'
import { ChevronDown, Flashlight, Image as ImageIcon, Mic, Repeat2, ScanSearch, Settings2, Volume2, X } from 'lucide-react'
import Sidebar from '../components/dashboard/Sidebar'

const getSidebarInitialState = () => {
	if (typeof window === 'undefined') return false
	return window.sessionStorage.getItem('travelbridge-translate-sidebar-open') === '1'
}

const CameraTranslate = () => {
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
			<div className="min-h-screen bg-slate-950 px-0 py-0 sm:bg-slate-100 sm:px-4 sm:py-6 lg:pl-68 xl:pl-72">
				<main className="mx-auto flex min-h-screen w-full flex-col overflow-hidden bg-black text-white sm:min-h-0 sm:max-w-md sm:rounded-4xl sm:border sm:border-slate-200 sm:bg-white sm:text-slate-900 sm:shadow-[0_24px_80px_rgba(15,23,42,0.18)] md:max-w-lg">
				<header className="flex items-center justify-between border-b border-white/10 bg-white px-4 py-4 text-slate-900 sm:border-slate-200">
					<button type="button" onClick={openSidebar} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100" aria-label="Open sidebar">
						<X className="h-4.5 w-4.5 rotate-45" />
					</button>

					<h1 className="text-base font-semibold sm:text-lg">Camera Translate</h1>

					<button type="button" onClick={openSidebar} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100" aria-label="Open sidebar">
						<Settings2 className="h-4.5 w-4.5" />
					</button>
				</header>

				<section className="relative flex-1 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_30%),linear-gradient(180deg,#0f172a_0%,#1f2937_45%,#0f172a_100%)] px-3 py-3 sm:bg-slate-900 sm:px-0 sm:py-0">
					<div className="relative h-full min-h-160 overflow-hidden rounded-3xl sm:min-h-190 sm:rounded-none">
						<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,15,30,0.2)_0%,rgba(8,15,30,0.22)_100%)]" />

						<div className="absolute left-0 right-0 top-0 h-[55%] bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.18),transparent_38%)]" />

						<div className="absolute left-1/2 top-10 w-[82%] -translate-x-1/2 rounded-2xl border border-white/20 bg-white/10 p-2 shadow-2xl backdrop-blur-[1px] sm:top-14 sm:w-[84%]">
							<div className="relative overflow-hidden rounded-xl border border-[#86673f]/60 bg-[#5d482e] p-2 shadow-inner">
								<div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.05),transparent_40%,rgba(0,0,0,0.12))]" />
								<div className="relative rounded-lg border-4 border-[#5b4c32] bg-[#114a9d] px-4 py-7 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)] sm:px-6 sm:py-8">
									<div className="text-[1.5rem] font-semibold leading-none text-white sm:text-[1.8rem]">नई सड़क</div>
									<div className="mt-3 text-[1.85rem] font-bold uppercase tracking-wide text-white sm:text-[2.2rem]">NAYI SADAK</div>
									<div className="mt-5 flex justify-center">
										<div className="h-3 w-24 rounded-sm bg-white/85 sm:w-28" />
										<div className="ml-2 flex h-3 items-center">
											  <div className="border-y-[7px] border-l-12 border-y-transparent border-l-white" />
										</div>
									</div>
								</div>
							</div>

							<div className="pointer-events-none absolute -inset-2 rounded-2xl ring-1 ring-white/10" />
						</div>

						<div className="absolute left-0 right-0 top-[24%] mx-3 rounded-3xl border border-slate-200 bg-white p-4 text-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.22)] sm:left-1/2 sm:mx-0 sm:w-[84%] sm:-translate-x-1/2 sm:top-[28%] sm:p-5">
							<div className="flex items-start justify-between gap-4">
								<div>
									<p className="text-base font-semibold leading-6 sm:text-[1.05rem]">Nayi Sadak</p>
									<p className="mt-1 text-sm font-medium text-slate-700 sm:text-[0.98rem]">(New Road)</p>
								</div>

								<div className="flex items-center gap-2 text-slate-700">
									<button type="button" className="rounded-md p-1.5 transition hover:bg-slate-100" aria-label="Listen translation">
										<Volume2 className="h-4.5 w-4.5" />
									</button>
									<button type="button" className="rounded-md p-1.5 transition hover:bg-slate-100" aria-label="Copy translation">
										<svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
											<rect x="9" y="9" width="13" height="13" rx="2" />
											<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
										</svg>
									</button>
								</div>
							</div>
						</div>

						<div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-[#1b1b1d] px-6 py-4 text-white sm:px-8">
							<button type="button" className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/10" aria-label="Open gallery">
								<ImageIcon className="h-5 w-5" />
							</button>

							<button
								type="button"
								className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white text-slate-900 shadow-[0_0_0_6px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] sm:h-24 sm:w-24"
								aria-label="Capture photo"
							>
								<span className="h-14 w-14 rounded-full border-2 border-slate-200 bg-white sm:h-16 sm:w-16" />
							</button>

							<button type="button" className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/10" aria-label="Flash toggle">
								<Flashlight className="h-5 w-5" />
							</button>
						</div>
					</div>
				</section>
				</main>
			</div>
		</>
	)
}

export default CameraTranslate
