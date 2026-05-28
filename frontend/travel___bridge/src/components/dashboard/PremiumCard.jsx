import { motion } from 'framer-motion'
import { CheckCircle2, Crown } from 'lucide-react'

const premiumFeatures = ['Unlimited Translations', 'AI Trip Planner', 'Offline Packs', 'Priority Support']

const PremiumCard = () => {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 }}
      className="rounded-[30px] bg-white p-4 shadow-lg ring-1 ring-slate-100"
    >
      <div className="rounded-[26px] bg-gradient-to-br from-[#2563EB] via-[#2f6ef2] to-[#1e40af] p-4 text-white shadow-md shadow-blue-200/70">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Crown className="h-4.5 w-4.5 text-amber-300" />
          Premium Plan
        </div>

        <div className="mt-2 text-xs text-white/75">Valid till 24 May 2025</div>

        <div className="mt-4 space-y-2.5">
          {premiumFeatures.map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-sm text-white/95">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              {feature}
            </div>
          ))}
        </div>

        <button className="mt-5 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#2563EB] shadow-sm transition hover:bg-blue-50">
          Manage Plan
        </button>
      </div>
    </motion.aside>
  )
}

export default PremiumCard