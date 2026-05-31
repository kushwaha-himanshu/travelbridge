import { motion } from 'framer-motion'
import { ArrowRight, Languages, MapPin, Sparkles } from 'lucide-react'
import { heroArtwork } from './dashboardData'

const HeroBanner = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
       className="group rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="absolute -right-10 top-6 h-36 w-36 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute -left-8 bottom-0 h-40 w-40 rounded-full bg-white/70 blur-3xl" />

      <div className="relative grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-white/80 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-blue-600" />
            AI travel translation workspace
          </div>

          <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
            Explore the world
            <br />
            Without <span className="text-[#2563EB]">Language Barriers</span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 md:text-lg">
            Translate, communicate and travel with confidence. A premium AI assistant for voice, text and camera-based language support.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button className="inline-flex items-center gap-2 rounded-2xl bg-[#2563EB] px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-300/60 transition hover:-translate-y-0.5 hover:bg-blue-700">
              Translate Now
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50">
              Plan a Trip
            </button>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <div className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 shadow-sm ring-1 ring-white/80">
              <Languages className="h-4 w-4 text-blue-600" />
              100+ Languages
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 shadow-sm ring-1 ring-white/80">
              <MapPin className="h-4 w-4 text-emerald-600" />
              Instant travel context
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center lg:justify-end">
          <motion.img
            src={heroArtwork}
            alt="Travel translation illustration"
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.55 }}
            className="w-full max-w-[590px] select-none object-contain drop-shadow-[0_24px_40px_rgba(37,99,235,0.12)]"
          />
        </div>
      </div>
    </motion.section>
  )
}

export default HeroBanner