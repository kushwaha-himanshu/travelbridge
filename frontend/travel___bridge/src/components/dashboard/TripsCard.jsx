import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, Plus, MoreVertical, X, Globe, Trash2 } from 'lucide-react'
import { trips as defaultTrips } from './dashboardData'
import ConfirmDialog from '../shared/ConfirmDialog'
import { useAuth } from '../../context/AuthContext'

const TripsCard = () => {
  const { showToast } = useAuth()
  const [tripsList, setTripsList] = useState(() => {
    const saved = localStorage.getItem('travelbridge-trips')
    return saved ? JSON.parse(saved) : defaultTrips
  })
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [activeMenuIndex, setActiveMenuIndex] = useState(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Add Trip Form State
  const [newDest, setNewDest] = useState('')
  const [newDates, setNewDates] = useState('')
  const [newStatus, setNewStatus] = useState('Upcoming')

  const saveTrips = (updated) => {
    setTripsList(updated)
    localStorage.setItem('travelbridge-trips', JSON.stringify(updated))
  }

  const handleTripClick = (trip) => {
    // Generate detailed mock itinerary on the fly
    const itineraries = {
      'Bali, Indonesia': [
        { day: 1, title: 'Arrival & Seminyak Sunset', morning: 'Hotel check-in', afternoon: 'Relax at Seminyak Beach', evening: 'Seafood dinner at Jimbaran Bay' },
        { day: 2, title: 'Ubud Cultural Highlights', morning: 'Sacred Monkey Forest', afternoon: 'Tegallalang Rice Terraces', evening: 'Traditional Kecak Dance performance' },
        { day: 3, title: 'Nusa Penida Snorkeling', morning: 'Speedboat to Nusa Penida', afternoon: 'Snorkel with Manta Rays', evening: 'Return & spa massage treatment' },
      ],
      'Paris, France': [
        { day: 1, title: 'Eiffel Tower & Seine Cruise', morning: 'Eiffel Tower summit', afternoon: 'Walk along Champs-Élysées', evening: 'Seine River sunset cruise' },
        { day: 2, title: 'Louvre & Notre-Dame', morning: 'Guided tour of Louvre Museum', afternoon: 'Notre-Dame & Latin Quarter walk', evening: 'French dinner at a local bistro' },
        { day: 3, title: 'Montmartre Artists & Cafes', morning: 'Sacré-Cœur Basilica visit', afternoon: 'Explore Place du Tertre', evening: 'Drinks in Pigalle' },
      ]
    }

    const details = itineraries[trip.name] || [
      { day: 1, title: 'Arrival & City Walk', morning: 'Hotel Check-in', afternoon: 'Explore main streets & local sights', evening: 'Welcome dinner at top local restaurant' },
      { day: 2, title: 'Attractions & Sightseeing', morning: 'Visit famous monuments', afternoon: 'Museum guide or local tour', evening: 'Sunset viewpoint walk' },
      { day: 3, title: 'Local Food & Markets', morning: 'Stroll around food markets', afternoon: 'Souvenir shopping', evening: 'Departure setup' }
    ]

    setSelectedTrip({ ...trip, itinerary: details })
  }

  const handleDeleteClick = (e, index) => {
    e.stopPropagation()
    setDeleteIndex(index)
    setIsConfirmOpen(true)
    setActiveMenuIndex(null)
  }

  const handleConfirmDelete = () => {
    const updated = [...tripsList]
    updated.splice(deleteIndex, 1)
    saveTrips(updated)
    setIsConfirmOpen(false)
    setDeleteIndex(null)
    showToast('Trip plan deleted successfully.', 'success')
  }

  const handleAddTripSubmit = (e) => {
    e.preventDefault()
    if (!newDest || !newDates) {
      showToast('Please enter both destination and travel dates.', 'error')
      return
    }

    const newTrip = {
      name: newDest,
      dates: newDates,
      status: newStatus,
      // Fallback placeholder image
      image: tripsList[0]?.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300'
    }

    const updated = [...tripsList, newTrip]
    saveTrips(updated)
    setIsAddModalOpen(false)
    setNewDest('')
    setNewDates('')
    showToast(`${newDest} added to your travel planner!`, 'success')
  }

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="rounded-[30px] bg-white p-5 shadow-lg ring-1 ring-slate-100 flex flex-col h-full"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Your Trips</h2>
            <p className="mt-1 text-sm text-slate-500">Upcoming travel plans.</p>
          </div>
          <button 
            onClick={() => showToast('Trip Planner section selected', 'success')}
            className="text-sm font-semibold text-[#2563EB] hover:text-blue-700 transition"
          >
            See all
          </button>
        </div>

        {tripsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400 border border-dashed border-slate-200 rounded-2xl p-5">
            <Globe className="h-10 w-10 text-slate-300 stroke-1 mb-2" />
            <p className="text-sm font-semibold">No planned trips yet</p>
            <p className="text-xs text-slate-400 mt-1 text-center">Use the AI Travel assistant or click below to start planning.</p>
          </div>
        ) : (
          <div className="space-y-4 overflow-auto max-h-[380px] flex-1">
            {tripsList.map((trip, index) => (
              <div 
                key={`${trip.name}-${index}`} 
                onClick={() => handleTripClick(trip)}
                className="flex gap-3 rounded-[22px] border border-slate-100 bg-slate-50/70 p-3 hover:bg-white hover:shadow-md cursor-pointer transition relative group"
              >
                <img src={trip.image} alt={trip.name} className="h-20 w-20 rounded-[18px] object-cover shadow-sm shrink-0" />
                <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-slate-900 leading-snug group-hover:text-[#2563EB] transition">{trip.name}</h3>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                        <CalendarDays className="h-3.5 w-3.5 text-slate-350" />
                        {trip.dates}
                      </div>
                    </div>
                    
                    <div className="relative">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveMenuIndex(activeMenuIndex === index ? null : index); }}
                        className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>

                      {activeMenuIndex === index && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setActiveMenuIndex(null); }} />
                          <div className="absolute right-0 mt-1 z-20 w-28 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                            <button
                              onClick={(e) => handleDeleteClick(e, index)}
                              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50/70 transition"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-2">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      trip.status === 'Upcoming' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}>
                      {trip.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-[#2563EB] hover:bg-blue-100/70 transition"
        >
          <Plus className="h-4 w-4" />
          Plan New Trip
        </button>
      </motion.section>

      {/* Confirm Deletion */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete Trip Plan"
        message="Are you sure you want to delete this trip itinerary? All saved plans will be lost."
        onConfirm={handleConfirmDelete}
        onCancel={() => { setIsConfirmOpen(false); setDeleteIndex(null); }}
      />

      {/* Itinerary Details Modal */}
      <AnimatePresence>
        {selectedTrip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTrip(null)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl border border-slate-100 z-10 flex flex-col max-h-[85vh] overflow-hidden"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <img src={selectedTrip.image} alt={selectedTrip.name} className="h-12 w-12 rounded-xl object-cover shadow-sm" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{selectedTrip.name}</h3>
                    <p className="text-xs text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                      <CalendarDays className="h-3 w-3" />
                      {selectedTrip.dates}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedTrip(null)}
                  className="rounded-full p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-655 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 overflow-auto flex-1 pr-1 pb-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Day-by-Day Itinerary</h4>
                {selectedTrip.itinerary?.map((dayPlan) => (
                  <div key={dayPlan.day} className="border-l-2 border-blue-500 pl-4 py-1 relative">
                    <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-blue-500 border-2 border-white" />
                    <p className="text-xs font-bold text-blue-600">Day {dayPlan.day}: {dayPlan.title}</p>
                    <div className="mt-2 space-y-1 text-slate-600 text-xs font-medium">
                      <p><span className="text-slate-900 font-semibold">Morning:</span> {dayPlan.morning}</p>
                      <p><span className="text-slate-900 font-semibold">Afternoon:</span> {dayPlan.afternoon}</p>
                      <p><span className="text-slate-900 font-semibold">Evening:</span> {dayPlan.evening}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Trip Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl border border-slate-100 z-10"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-md font-bold text-slate-900">Plan New Trip</h3>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-full p-1.5 hover:bg-slate-100 text-slate-400 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddTripSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700">Destination</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rome, Italy"
                    value={newDest}
                    onChange={(e) => setNewDest(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl mt-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Travel Dates</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 15 - 22 Oct 2025"
                    value={newDates}
                    onChange={(e) => setNewDates(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl mt-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl mt-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Saved">Saved</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2563EB] text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold text-xs mt-2"
                >
                  Add Plan
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default TripsCard