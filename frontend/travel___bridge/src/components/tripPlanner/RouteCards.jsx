import React from "react";
import { Route, Clock, Navigation, ArrowRight } from "lucide-react";

export const RouteCards = ({ routes = [] }) => {
  if (!routes || routes.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
        No specific routing coordinates computed for this itinerary.
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Route className="w-5 h-5 text-cyan-400" /> Daily Routes & Mobility
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">Optimized transit flow connecting attractions and districts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {routes.map((r, idx) => {
          const distKm = r.distance_km || (r.distance_meters ? (r.distance_meters / 1000).toFixed(1) : "12.0");
          const duration = r.duration || "25 mins";
          const order = r.route_order || [];

          return (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-850 hover:border-slate-750 rounded-3xl p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-850 mb-4">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-cyan-400" />
                  Day {r.day || idx + 1} Route
                </span>
                <div className="flex items-center gap-3 text-xs font-mono font-semibold text-slate-300">
                  <span>{distKm} km</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-cyan-400">
                    <Clock className="w-3.5 h-3.5" /> {duration}
                  </span>
                </div>
              </div>

              {order.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Optimized Waypoint Sequence
                  </span>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {order.map((place, pIdx) => (
                      <React.Fragment key={pIdx}>
                        <span className="bg-slate-950 px-3 py-1.5 rounded-xl text-slate-200 border border-slate-800 font-medium">
                          {place}
                        </span>
                        {pIdx < order.length - 1 && (
                          <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
