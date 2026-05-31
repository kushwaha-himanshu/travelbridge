import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../components/dashboard/Sidebar'
import Navbar from '../components/dashboard/Navbar'
import HeroBanner from '../components/dashboard/HeroBanner'
import PremiumCard from '../components/dashboard/PremiumCard'
import QuickActions from '../components/dashboard/QuickActions'
import RecentTranslations from '../components/dashboard/RecentTranslations'
import AIAssistant from '../components/dashboard/AIAssistant'
import TripsCard from '../components/dashboard/TripsCard'
import OfflineEssentials from '../components/dashboard/OfflineEssentials'
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton'

const Dashboard = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const timer = window.setTimeout(() => setIsLoading(false), 700)
		return () => window.clearTimeout(timer)
	}, [])

	return (
		<div className="min-h-screen bg-[#F5F7FB] text-slate-900">
			<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

			<div className="lg:pl-68 xl:pl-72">
				<Navbar onMenuClick={() => setSidebarOpen(true)} />

				<main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
					{isLoading ? (
						<DashboardSkeleton />
					) : (
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="space-y-5">
							<div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
								<HeroBanner />
								<PremiumCard />

								
							</div>

							<QuickActions />

							<div className="grid gap-5 xl:grid-cols-[1.1fr_1fr_0.9fr]">
								<RecentTranslations />
								<AIAssistant />
								<TripsCard />
							</div>

							<OfflineEssentials />
						</motion.div>
					)}
				</main>
			</div>
		</div>
	)
}

export default Dashboard
