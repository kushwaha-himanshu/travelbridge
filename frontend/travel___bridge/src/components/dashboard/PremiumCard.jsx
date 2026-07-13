// import { motion } from 'framer-motion'
// import { CheckCircle2, Crown } from 'lucide-react'

// const premiumFeatures = ['Unlimited Translations', 'AI Trip Planner', 'Offline Packs', 'Priority Support']

// const PremiumCard = () => {
//   return (
//     <motion.aside
//       initial={{ opacity: 0, y: 12 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.35, delay: 0.05 }}
//       className="rounded-3xl bg-linear-to-br from-[#2563EB] via-[#2F6EF2] to-[#1E40AF] p-4 text-white shadow-md shadow-blue-200/70 ring-1 ring-blue-200/40 sm:p-5"
//     >
//       <div className="rounded-3xl bg-white/8 p-4 backdrop-blur-[1px] sm:p-5">
//         <div className="flex items-center gap-2 text-sm font-semibold sm:text-[15px]">
//           <Crown className="h-4.5 w-4.5 text-amber-300" />
//           Premium Plan
//         </div>

//         <div className="mt-2 text-xs text-white/80 sm:text-sm">Valid till 24 May 2025</div>

//         <div className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
//           {premiumFeatures.map((feature) => (
//             <div key={feature} className="flex items-center gap-2.5 text-sm text-white/95 sm:text-[15px]">
//               <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
//               {feature}
//             </div>
//           ))}
//         </div>

//         <button className="mt-5 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#2563EB] shadow-sm transition hover:bg-blue-50 sm:mt-6">
//           Manage Plan
//         </button>
//       </div>
//     </motion.aside>
//   )
// }

// export default PremiumCard