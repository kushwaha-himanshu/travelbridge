import React, { useState } from "react";
import { Clock, MapPin, Tag, Compass, Sparkles, ChevronRight } from "lucide-react";

export const ItineraryTimeline = ({ itinerary = [] }) => {
  const [selectedDay, setSelectedDay] = useState(1);

  if (!itinerary || itinerary.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
        No itinerary days available.
      </div>
    );
  }

  const activeDayData = itinerary.find((d) => d.day === selectedDay) || itinerary[0];

  const getCategoryColor = (cat = "") => {
    const c = cat.toLowerCase();
    if (c.includes("culture") || c.includes("history")) return "bg-purple-500/15 text-purple-300 border-purple-500/30";
    if (c.includes("food") || c.includes("dining") || c.includes("culinary")) return "bg-amber-500/15 text-amber-300 border-amber-500/30";
    if (c.includes("nature") || c.includes("outdoor")) return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    if (c.includes("adventure")) return "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";
    return "bg-blue-500/15 text-blue-300 border-blue-500/30";
  };

  return (
    <div className="space-y-6 text-left">
      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {itinerary.map((day) => {
          const isSelected = selectedDay === day.day;
          return (
            <button
              key={day.day}
              type="button"
              onClick={() => setSelectedDay(day.day)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                isSelected
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/20 border border-blue-400/40 scale-[1.02]"
                  : "bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-850"
              }`}
            >
              <span>Day {day.day}</span>
              {day.title && <span className="opacity-70 font-normal hidden md:inline truncate max-w-[120px]">• {day.title.replace(/^Day \d+:\s*/, "")}</span>}
            </button>
          );
        })}
      </div>

      {/* Active Day Overview Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Day {activeDayData.day} Timeline
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {activeDayData.title || `Day ${activeDayData.day}`}
            </h2>
          </div>
          {activeDayData.location && (
            <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>{activeDayData.location}</span>
            </div>
          )}
        </div>

        {activeDayData.description && (
          <p className="text-sm text-slate-300 pt-4 leading-relaxed">
            {activeDayData.description}
          </p>
        )}

        {/* Chronological Timeline Activities */}
        <div className="mt-8 relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-[11px] sm:before:left-[15px] before:top-3 before:bottom-3 before:w-[2px] before:bg-gradient-to-b before:from-blue-500 before:via-cyan-500 before:to-indigo-600">
          {activeDayData.activities?.map((activity, idx) => {
            const isObj = typeof activity === "object" && activity !== null;
            const name = isObj ? activity.name : activity;
            const startTime = isObj ? activity.start_time : null;
            const endTime = isObj ? activity.end_time : null;
            const duration = isObj ? activity.duration_minutes : null;
            const category = isObj ? activity.category || "sightseeing" : "general";
            const location = isObj ? activity.location : null;
            const description = isObj ? activity.description : null;

            return (
              <div key={idx} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[29px] sm:-left-[37px] top-1.5 w-5 h-5 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-125 transition-transform">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                </div>

                {/* Activity Card */}
                <div className="bg-slate-950/70 border border-slate-850 hover:border-slate-750 p-5 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/10">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    
                    {/* Time & Duration */}
                    {startTime && (
                      <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{startTime} {endTime ? `– ${endTime}` : ""}</span>
                        {duration && (
                          <span className="text-[10px] text-slate-500 font-mono">({duration}m)</span>
                        )}
                      </div>
                    )}

                    {/* Category Pill */}
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getCategoryColor(category)}`}>
                      {category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {name}
                  </h3>

                  {description && (
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {description}
                    </p>
                  )}

                  {location && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-3 pt-2.5 border-t border-slate-850">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{location}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
