import { motion } from 'framer-motion'
import { CalendarDays, Plus, MoreVertical } from 'lucide-react'
import { trips } from './dashboardData'

const TripsCard = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="rounded-[30px] bg-white p-5 shadow-lg ring-1 ring-slate-100"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Your Trips</h2>
          <p className="mt-1 text-sm text-slate-500">Upcoming destinations and saved plans.</p>
        </div>
        <button className="text-sm font-medium text-[#2563EB] transition hover:text-blue-700">See all</button>
      </div>

      <div className="space-y-4">
        {trips.map((trip) => (
          <div key={trip.name} className="flex gap-3 rounded-[22px] border border-slate-100 bg-slate-50/70 p-3">
            <img src={trip.image} alt={trip.name} className="h-24 w-24 rounded-[18px] object-cover shadow-sm" />
            <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-slate-900">{trip.name}</h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {trip.dates}
                  </div>
                </div>
                <button className="rounded-full p-1.5 text-slate-400 transition hover:bg-white hover:text-slate-700">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                  {trip.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-[#2563EB] transition hover:bg-blue-100/70">
        <Plus className="h-4 w-4" />
        Plan New Trip
      </button>
    </motion.section>
  )
}

export default TripsCard