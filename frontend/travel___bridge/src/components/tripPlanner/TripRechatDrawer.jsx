import React, { useState } from "react";
import { MessageSquare, Sparkles, Send, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { refineTripPlan } from "../../services/tripService";

const QUICK_PROMPTS = [
  "Make this trip cheaper",
  "Make Day 2 less busy and more relaxed",
  "Add more authentic culinary and food spots",
  "Change trip style to luxury tier",
  "Include more outdoor and nature highlights",
];

export const TripRechatDrawer = ({ currentTrip, tripId, onUpdateTrip }) => {
  const [inputMessage, setInputMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [recentChanges, setRecentChanges] = useState(null);
  const [lastMessage, setLastMessage] = useState("");

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const cleanMsg = inputMessage.trim();
    if (!cleanMsg || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setErrorMsg("");
      setRecentChanges(null);

      const response = await refineTripPlan({
        message: cleanMsg,
        currentTrip: currentTrip,
        tripId: tripId,
      });

      if (response && response.data) {
        const updated = response.data.updated_trip || response.data;
        const changes = response.data.changes || [];
        setLastMessage(response.message || "Trip plan refined successfully.");
        setRecentChanges(changes);
        setInputMessage("");

        // Reactive in-place update of dashboard state
        if (onUpdateTrip) {
          onUpdateTrip(updated);
        }
      }
    } catch (err) {
      console.error("[TripRechat] Refine error:", err);
      setErrorMsg(err.message || "Failed to refine trip. Please try another request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickPrompt = (promptText) => {
    setInputMessage(promptText);
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden text-left">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Rechat & Refine Trip</h3>
            <p className="text-xs text-slate-400">Ask the AI assistant to modify itinerary pacing, budget, or dining</p>
          </div>
        </div>
      </div>

      {/* Quick Suggestion Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none mb-4">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleQuickPrompt(prompt)}
            disabled={isSubmitting}
            className="text-[11px] font-semibold px-3.5 py-1.5 rounded-full bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all shrink-0 hover:bg-slate-850"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="e.g. 'Make Day 2 less packed', 'Reduce total budget', 'Add a tea ceremony'..."
            disabled={isSubmitting}
            className="w-full bg-slate-950/80 border border-slate-750 focus:border-cyan-500 text-slate-100 text-xs sm:text-sm pl-4 pr-24 py-3.5 rounded-2xl focus:outline-none transition-all placeholder:text-slate-500 shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isSubmitting}
            className={`absolute right-2 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
              inputMessage.trim() && !isSubmitting
                ? "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-blue-500/20 scale-[1.02]"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Refining...</span>
              </>
            ) : (
              <>
                <span>Update</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {errorMsg && (
        <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Success Changes Feedback Box */}
      {recentChanges && (
        <div className="mt-4 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-left space-y-2 animate-fadeIn">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{lastMessage}</span>
          </div>
          {recentChanges.length > 0 && (
            <ul className="text-xs text-slate-300 pl-6 list-disc space-y-1">
              {recentChanges.map((ch, idx) => (
                <li key={idx}>{ch}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
