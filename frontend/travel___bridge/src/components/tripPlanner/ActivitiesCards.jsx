import React from "react";
import { Compass, Star, MapPin, Clock } from "lucide-react";

export const ActivitiesCards = ({ activities = [] }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
        No specific individual attraction entries found. Check daily itinerary timeline.
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-purple-400" /> Featured Attractions & Activities
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">Top-ranked landmarks and cultural experiences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {activities.map((act, idx) => {
          const rating = act.rating || 4.7;
          const location = typeof act.location === "string" ? act.location : act.location?.address || "Central landmark";

          return (
            <div
              key={act.id || idx}
              className="bg-slate-900/60 border border-slate-850 hover:border-slate-750 rounded-3xl p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-purple-950/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                  {rating && (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {rating}
                    </span>
                  )}
                </div>

                <h4 className="text-lg font-bold text-white tracking-tight leading-snug">
                  {act.name || "Attraction"}
                </h4>

                <span className="inline-block mt-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {act.category || "Sightseeing"}
                </span>

                {act.description && (
                  <p className="text-xs text-slate-300 mt-2.5 leading-relaxed line-clamp-3">
                    {act.description}
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-850 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{location}</span>
                </div>
                {act.duration_minutes && (
                  <span className="flex items-center gap-1 font-mono text-[11px] text-cyan-400 shrink-0">
                    <Clock className="w-3.5 h-3.5" /> {act.duration_minutes}m
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
