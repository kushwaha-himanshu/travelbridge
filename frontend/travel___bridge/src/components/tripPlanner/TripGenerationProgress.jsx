import React, { useEffect, useState } from "react";
import { Compass, CloudSun, Hotel, Sparkles, Route, DollarSign, CheckCircle2 } from "lucide-react";

const STAGES = [
  { id: 1, label: "Geocoding & Destination Intelligence", icon: Compass, desc: "Resolving destination coordinates and travel landscape..." },
  { id: 2, label: "Real-Time Weather Intelligence", icon: CloudSun, desc: "Querying multi-day temperature & precipitation forecasts..." },
  { id: 3, label: "Lodging & Culinary Exploration", icon: Hotel, desc: "Discovering verified stays, landmarks, and regional dining..." },
  { id: 4, label: "LangGraph Itinerary Architecture", icon: Sparkles, desc: "Sequencing daily activities, time buffers, and pacing..." },
  { id: 5, label: "Deterministic Budget & Route Calculations", icon: DollarSign, desc: "Validating programmatically against your financial targets..." },
];

export const TripGenerationProgress = ({ destination }) => {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 max-w-2xl mx-auto backdrop-blur-xl shadow-2xl relative overflow-hidden text-left">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500 animate-pulse" />

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
          <Sparkles className="w-5 h-5 animate-spin text-blue-400" style={{ animationDuration: "3s" }} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Orchestrating Your Trip to {destination || "Your Destination"}</h3>
          <p className="text-xs text-slate-400">LangGraph multi-agent research pipeline is executing...</p>
        </div>
      </div>

      <div className="space-y-4">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isDone = idx < activeStage;
          const isCurrent = idx === activeStage;

          return (
            <div
              key={stage.id}
              className={`flex items-start gap-3.5 p-3 rounded-2xl transition-all duration-500 ${
                isCurrent
                  ? "bg-blue-600/10 border border-blue-500/40 shadow-lg shadow-blue-500/5"
                  : isDone
                  ? "bg-slate-950/40 border border-slate-850 opacity-80"
                  : "opacity-40 border border-transparent"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isDone
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : isCurrent
                    ? "bg-blue-500 text-white animate-pulse"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-semibold ${isCurrent ? "text-blue-300" : isDone ? "text-slate-200" : "text-slate-500"}`}>
                    {stage.label}
                  </h4>
                  {isCurrent && (
                    <span className="text-[10px] font-mono uppercase bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
                      Processing
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">{stage.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
