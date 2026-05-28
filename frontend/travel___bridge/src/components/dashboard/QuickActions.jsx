import { motion } from 'framer-motion'
import { Camera, Languages, Mic, ShieldAlert } from 'lucide-react'
import { quickActions } from './dashboardData'

const iconMap = { Languages, Mic, Camera, ShieldAlert }

const QuickActions = () => {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between px-1">
        <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
        <button className="text-sm font-medium text-[#2563EB] transition hover:text-blue-700">See all</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((item, index) => {
          const Icon = iconMap[item.icon] || Languages
          return (
            <motion.button
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              className="group rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} shadow-sm`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-500">{item.description}</p>
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}

export default QuickActions