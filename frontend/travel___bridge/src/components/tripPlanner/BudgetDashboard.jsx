import React from "react";
import { DollarSign, Hotel, Utensils, Car, Compass, ShoppingBag, AlertCircle, CheckCircle2 } from "lucide-react";

export const BudgetDashboard = ({ budget = {}, currency = "INR" }) => {
  const userBudget = budget.user_budget || 0;
  const estimatedCost = budget.estimated_cost || 0;
  const remaining = budget.remaining_budget ?? (userBudget - estimatedCost);
  const isOverBudget = budget.is_over_budget || false;
  const categories = budget.categories || {};
  const dailyBreakdown = budget.daily_breakdown || [];

  const categoryCards = [
    { label: "Accommodation", amount: categories.accommodation || 0, icon: Hotel, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { label: "Food & Dining", amount: categories.food || 0, icon: Utensils, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { label: "Transit & Mobility", amount: categories.transport || 0, icon: Car, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
    { label: "Activities & Sights", amount: categories.activities || 0, icon: Compass, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
    { label: "Miscellaneous & Tips", amount: categories.miscellaneous || 0, icon: ShoppingBag, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Top Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* User Target */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Target Budget
          </span>
          <div className="text-2xl font-black text-white">
            {currency} {Number(userBudget).toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Specified budget ceiling</span>
        </div>

        {/* Estimated Cost */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Estimated Cost
          </span>
          <div className="text-2xl font-black text-white">
            {currency} {Number(estimatedCost).toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            {isOverBudget ? (
              <span className="text-rose-400 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3.5 h-3.5" /> Exceeds target
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Within financial target
              </span>
            )}
          </span>
        </div>

        {/* Remaining Surplus / Deficit */}
        <div className={`border rounded-2xl p-5 backdrop-blur-xl ${
          isOverBudget ? "bg-rose-950/20 border-rose-500/30" : "bg-emerald-950/20 border-emerald-500/30"
        }`}>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            {isOverBudget ? "Budget Deficit" : "Remaining Buffer"}
          </span>
          <div className={`text-2xl font-black ${isOverBudget ? "text-rose-400" : "text-emerald-400"}`}>
            {currency} {Number(Math.abs(remaining)).toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {isOverBudget ? "Requires adjustment or budget expansion" : "Unallocated emergency reserves"}
          </span>
        </div>

      </div>

      {/* Category Spend Cards */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-cyan-400" /> Category Expenditure Breakdown
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categoryCards.map((cat, idx) => {
            const Icon = cat.icon;
            const pct = estimatedCost > 0 ? Math.round((cat.amount / estimatedCost) * 100) : 0;
            return (
              <div key={idx} className="bg-slate-950/70 border border-slate-850 p-4 rounded-2xl">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2.5 border ${cat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] text-slate-400 font-medium block truncate">{cat.label}</span>
                <span className="text-base font-bold text-white block mt-1">
                  {currency} {Number(cat.amount).toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{pct}% of total</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Day-by-Day Financial Breakdown */}
      {dailyBreakdown.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
          <h3 className="text-base font-bold text-white mb-4">Daily Budget Distribution</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyBreakdown.map((d) => (
              <div key={d.day} className="bg-slate-950/70 border border-slate-850 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-850">
                  <span className="text-sm font-bold text-white">Day {d.day}</span>
                  <span className="text-xs font-bold text-cyan-400 font-mono">
                    {currency} {Number(d.day_total).toLocaleString()}
                  </span>
                </div>
                <div className="text-[11px] space-y-1 text-slate-400">
                  <div className="flex justify-between">
                    <span>🏨 Accommodation:</span>
                    <span className="text-slate-200">{currency} {Number(d.accommodation).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🍴 Food:</span>
                    <span className="text-slate-200">{currency} {Number(d.food).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🚕 Transport:</span>
                    <span className="text-slate-200">{currency} {Number(d.transport).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🎟️ Activities:</span>
                    <span className="text-slate-200">{currency} {Number(d.activities).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🛍️ Misc:</span>
                    <span className="text-slate-200">{currency} {Number(d.miscellaneous).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
