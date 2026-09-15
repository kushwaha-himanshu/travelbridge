import React from "react";
import { MapPin, Calendar, Users, Compass, DollarSign, ArrowRight, RotateCcw, AlertTriangle, Printer } from "lucide-react";

export const TripOverviewHeader = ({ tripData, onPlanNew }) => {
  if (!tripData) return null;

  const trip = tripData.trip || {};
  const destination = tripData.destination || {};
  const budget = tripData.budget || {};
  const currency = trip.currency || "INR";

  const isOverBudget = budget.is_over_budget || false;
  const userBudget = budget.user_budget || trip.budget || 0;
  const estimatedCost = budget.estimated_cost || 0;
  const remaining = budget.remaining_budget ?? (userBudget - estimatedCost);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl relative overflow-hidden text-left">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left: Destination & Core Metadata */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> AI Verified Plan
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-slate-800 text-slate-300 border border-slate-700">
              {trip.travel_style || "Moderate"} Style
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <MapPin className="w-8 h-8 text-blue-500 shrink-0" />
            <span>{destination.name || trip.destination}</span>
          </h1>

          {destination.summary && (
            <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">
              {destination.summary}
            </p>
          )}

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300 pt-1">
            <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-850">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>{trip.days || 3} Days Itinerary</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-850">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>{trip.travelers || 2} Travelers</span>
            </div>
            {trip.check_in && trip.check_out && (
              <div className="text-slate-400 hidden sm:block">
                {trip.check_in} → {trip.check_out}
              </div>
            )}
          </div>
        </div>

        {/* Right: Budget Gauge Card & Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-4 shrink-0">
          
          {/* Financial Summary Pill */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl min-w-[240px] text-left">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Budget Overview</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isOverBudget ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              }`}>
                {isOverBudget ? "Over Budget" : "On Target"}
              </span>
            </div>

            <div className="flex items-baseline justify-between gap-4 mt-2">
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Estimated Spend</span>
                <span className="text-xl font-black text-white">
                  {currency} {Number(estimatedCost).toLocaleString()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Target</span>
                <span className="text-sm font-bold text-slate-400">
                  {currency} {Number(userBudget).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-2 text-[11px] flex justify-between text-slate-400 pt-2 border-t border-slate-850">
              <span>Remaining Balance:</span>
              <span className={`font-bold ${remaining >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {currency} {Number(remaining).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => window.print()}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 flex items-center justify-center"
              title="Print or Save PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onPlanNew}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Plan Another Trip
            </button>
          </div>

        </div>

      </div>

      {/* Over Budget Notice */}
      {isOverBudget && (
        <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>Notice: Estimated activities and lodging slightly exceed your target budget. You can use the Rechat assistant below to ask to "Make this trip cheaper".</span>
        </div>
      )}
    </div>
  );
};
