import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Bot, Send, Sparkles, Wand2, User } from 'lucide-react'
import { assistantPrompts, aiArtwork } from './dashboardData'
import { useAuth } from '../../context/AuthContext'

const AIAssistant = () => {
  const { user } = useAuth()
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Hi ${user?.fullname?.split(' ')[0] || 'John'}! 👋 I am your TravelBridge AI assistant. Ask me anything about routes, itineraries, or local phrases!`
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const getAssistantResponse = (text) => {
    const query = text.toLowerCase()
    if (query.includes('tokyo')) {
      return "In Tokyo, Japan, I highly recommend visiting: \n1. **Senso-ji Temple** in Asakusa for historical vibes (use camera translate for fortunes!).\n2. **Shibuya Crossing** & **Shinjuku Gyoen National Garden**.\n3. **Akihabara** for tech and anime culture.\n*Tip: Download the Japanese offline pack!*"
    } else if (query.includes('paris')) {
      return "Here is a quick 3-day Paris itinerary:\n* **Day 1:** Eiffel Tower, Arc de Triomphe, Seine River Cruise.\n* **Day 2:** Louvre Museum, Notre-Dame Cathedral, and local cafes in Saint-Germain.\n* **Day 3:** Montmartre, Sacré-Cœur, and dinner at a local bistro.\n*Tip: Say 'Bonjour' (Hello) and 'Merci' (Thank you) to show respect!*"
    } else if (query.includes('thailand') || query.includes('budget')) {
      return "For a budget Thailand trip:\n1. **Fly into Bangkok** and stay in hostels near Sukhumvit or Khaosan Road (approx. $10-$15/night).\n2. **Eat street food** – pad thai and mango sticky rice cost less than $2.\n3. **Use trains/buses** to travel to Chiang Mai ($15 overnight train) instead of domestic flights."
    } else if (query.includes('food') || query.includes('recommendation')) {
      return "Local culinary specialties you must try:\n- **Japan:** Sushi, Tonkotsu Ramen, and Takoyaki (octopus balls).\n- **France:** Coq au Vin, Escargots, and freshly baked Croissants.\n- **Italy:** Margherita Pizza, Pasta Carbonara, and Gelato.\n- **Mexico:** Tacos al Pastor, Chilaquiles, and Mole Poblano."
    } else {
      return `That sounds like an amazing destination! As your travel assistant, I recommend checking local transport guides, preparing emergency translation cards (under the Emergency tab), and mapping out a budget of around $50-$100 per day depending on your accommodation style. Let me know if you need specific itineraries!`
    }
  }

  const handleSend = (textToSend) => {
    if (!textToSend.trim()) return

    const userMessage = { sender: 'user', text: textToSend }
    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    setTimeout(() => {
      const botResponse = {
        sender: 'bot',
        text: getAssistantResponse(textToSend)
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend(inputText)
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08 }}
      className="rounded-[30px] bg-white p-5 shadow-lg ring-1 ring-slate-100 flex flex-col h-full"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">AI Travel Assistant</h2>
          <p className="mt-1 text-sm text-slate-500">Translation-aware planning assistance.</p>
        </div>
        <Sparkles className="h-4.5 w-4.5 text-[#2563EB]" />
      </div>

      <div className="relative flex flex-col flex-1 rounded-[26px] bg-[radial-gradient(circle_at_top,#eff6ff_0%,#f8fbff_45%,#ffffff_100%)] p-4 ring-1 ring-slate-100 min-h-[380px] justify-between">
        <div className="absolute right-4 top-4 h-28 w-28 rounded-full bg-blue-100/70 blur-3xl pointer-events-none" />
        
        {/* Chat History */}
        <div className="flex-1 overflow-auto space-y-3 max-h-[220px] mb-4 pr-1 scrollbar-thin">
          {messages.map((msg, index) => (
            <div 
              key={index}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white shadow-sm ${msg.sender === 'user' ? 'bg-[#2563EB]' : 'bg-gradient-to-br from-[#2563EB] to-blue-400'}`}>
                {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`rounded-2xl p-3 text-xs leading-relaxed max-w-[80%] ${msg.sender === 'user' ? 'bg-[#2563EB] text-white rounded-tr-none' : 'bg-white text-slate-700 shadow-sm ring-1 ring-slate-150 rounded-tl-none'}`}>
                <p className="whitespace-pre-line font-medium">{msg.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-blue-400 text-white shadow-sm">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl p-3 bg-white text-slate-750 shadow-sm ring-1 ring-slate-150 rounded-tl-none">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Action Blocks */}
        <div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {assistantPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-[#2563EB]"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
            <Wand2 className="h-4 w-4 text-[#2563EB]" />
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400 font-medium"
            />
            <button 
              onClick={() => handleSend(inputText)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-white shadow-md shadow-blue-200 transition hover:bg-blue-700"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-end justify-between gap-4 border-t border-slate-100 pt-2.5">
          <div className="max-w-[170px] text-[10px] font-medium text-slate-400 leading-normal">
            Suggests routes, phrase tips, and local guidance for any destination.
          </div>
          <img src={aiArtwork} alt="AI assistant visual" className="h-14 w-14 object-contain opacity-95" />
        </div>
      </div>
    </motion.section>
  )
}

export default AIAssistant