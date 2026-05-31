import { useState } from 'react'
import {
	ArrowLeftRight,
	Bookmark,
	ChevronDown,
	Copy,
	Menu,
	Mic,
	Share2,
	Volume2,
	X,
} from 'lucide-react'
import Sidebar from '../components/dashboard/Sidebar'

const quickActions = [
	{ label: 'Copy', Icon: Copy },
	{ label: 'Share', Icon: Share2 },
	{ label: 'Save', Icon: Bookmark },
	{ label: 'Speak', Icon: Mic },
]

const getSidebarInitialState = () => {
	if (typeof window === 'undefined') return false
	return window.sessionStorage.getItem('travelbridge-translate-sidebar-open') === '1'
}

const TextTranslate = () => {
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
				<main className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-[#F8FAFD] p-4 shadow-sm sm:p-5">
					<header className="mb-4 flex items-center justify-between">
						<button
							type="button"
							onClick={openSidebar}
							className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-200/70"
							aria-label="Open sidebar"
						>
							<X className="h-4.5 w-4.5" />
						</button>

						<h1 className="text-lg font-semibold text-slate-900">Translate</h1>

						<button
							type="button"
							onClick={openSidebar}
							className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-200/70"
							aria-label="Open menu"
						>
							<Menu className="h-4.5 w-4.5" />
						</button>
					</header>

					<section className="mb-4 flex items-center gap-2">
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

					<section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
						<textarea
							rows={4}
							defaultValue="Where is the train station?"
							className="w-full resize-none border-0 bg-transparent text-[1.06rem] font-medium leading-7 text-slate-800 outline-none"
						/>

						<div className="mt-6 flex items-center justify-between text-slate-500">
							<div className="flex items-center gap-3">
								<button type="button" className="rounded-md p-1.5 transition hover:bg-slate-100" aria-label="Voice input">
									<Mic className="h-4.5 w-4.5" />
								</button>
								<button type="button" className="rounded-md p-1.5 transition hover:bg-slate-100" aria-label="Listen source text">
									<Volume2 className="h-4.5 w-4.5" />
								</button>
							</div>

							<span className="text-sm font-medium">30 / 5000</span>
						</div>
					</section>

					<button
						type="button"
						className="mt-4 h-11 w-full rounded-xl bg-[#2563EB] text-sm font-semibold text-white shadow-md shadow-blue-300/50 transition hover:bg-blue-700"
					>
						Translate
					</button>

					<section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
						<p className="min-h-21 text-[1.06rem] leading-7 text-slate-800">¿Dónde está la estación de tren?</p>

						<div className="mt-4 flex items-center gap-2 text-slate-600">
							<button type="button" className="rounded-md p-1.5 transition hover:bg-slate-100" aria-label="Listen translation">
								<Volume2 className="h-4.5 w-4.5" />
							</button>
							<button type="button" className="rounded-md p-1.5 transition hover:bg-slate-100" aria-label="Copy translation">
								<Copy className="h-4.5 w-4.5" />
							</button>
							<button type="button" className="rounded-md p-1.5 transition hover:bg-slate-100" aria-label="Copy translation alternative">
								<Copy className="h-4.5 w-4.5" />
							</button>
						</div>

						<div className="mt-4 grid grid-cols-4 border-t border-slate-200 pt-3">
							{quickActions.map(({ label, Icon }) => (
								<button
									key={label}
									type="button"
									className="flex flex-col items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
								>
									<Icon className="h-4.5 w-4.5" />
									{label}
								</button>
							))}
						</div>
					</section>
				</main>
			</div>
		</>
	)
}

export default TextTranslate
