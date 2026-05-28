import { motion } from 'framer-motion'
import { Bot, Send, Sparkles, Wand2 } from 'lucide-react'
import { assistantPrompts, aiArtwork } from './dashboardData'

const AIAssistant = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08 }}
      className="rounded-[30px] bg-white p-5 shadow-lg ring-1 ring-slate-100"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">AI Travel Assistant</h2>
          <p className="mt-1 text-sm text-slate-500">Friendly planning help with translation-aware context.</p>
        </div>
        <Sparkles className="h-4.5 w-4.5 text-[#2563EB]" />
      </div>

      <div className="relative overflow-hidden rounded-[26px] bg-[radial-gradient(circle_at_top,#eff6ff_0%,#f8fbff_45%,#ffffff_100%)] p-4 ring-1 ring-slate-100">
        <div className="absolute right-4 top-4 h-28 w-28 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-blue-400 text-white shadow-lg shadow-blue-200/70">
            <Bot className="h-8 w-8" />
          </div>
          <div className="flex-1 rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <p className="text-sm font-semibold text-slate-900">Hi John! 👋</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              How can I help you plan your trip today?
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {assistantPrompts.map((prompt) => (
            <button
              key={prompt}
              className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-[#2563EB]"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <Wand2 className="h-4 w-4 text-[#2563EB]" />
          <input
            type="text"
            placeholder="Ask me anything..."
            className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2563EB] text-white shadow-md shadow-blue-200 transition hover:bg-blue-700">
            <Send className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex items-end justify-between gap-4">
          <div className="max-w-[170px] text-xs text-slate-500">
            Suggests routes, phrase tips, and local guidance for any destination.
          </div>
          <img src={aiArtwork} alt="AI assistant visual" className="h-28 w-28 object-contain opacity-95" />
        </div>
      </div>
    </motion.section>
  )
}

export default AIAssistant