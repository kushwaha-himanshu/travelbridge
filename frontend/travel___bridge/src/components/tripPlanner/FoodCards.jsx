import React from "react";
import { Utensils, Star, MapPin, ExternalLink } from "lucide-react";

export const FoodCards = ({ restaurants = [] }) => {
  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
        No specific restaurants identified. Explore regional food markets and central dining squares.
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Utensils className="w-5 h-5 text-amber-500" /> Culinary Highlights & Dining
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">Top-rated regional eateries and culinary experiences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {restaurants.map((rest, idx) => {
          const rating = rest.rating || 4.5;
          const address = typeof rest.address === "string" ? rest.address : rest.location?.address || "City Center";

          return (
            <div
              key={rest.id || idx}
              className="bg-slate-900/60 border border-slate-850 hover:border-slate-750 rounded-3xl p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-amber-950/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                      {rest.price_level || "$$"}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {rating}
                    </span>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-white tracking-tight leading-snug">
                  {rest.name || "Dining Spot"}
                </h4>

                <span className="inline-block mt-1 text-xs font-semibold text-amber-400/90">
                  {rest.cuisine || "Authentic Local"}
                </span>

                <div className="flex items-start gap-1.5 text-xs text-slate-400 mt-3">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{address}</span>
                </div>
              </div>

              {rest.google_maps_url && (
                <div className="mt-6 pt-4 border-t border-slate-850">
                  <a
                    href={rest.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>Directions & Reviews</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
