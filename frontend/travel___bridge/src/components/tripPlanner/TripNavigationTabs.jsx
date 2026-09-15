import React from "react";
import { Calendar, DollarSign, CloudSun, Hotel, Compass, Utensils, Route } from "lucide-react";

export const TripNavigationTabs = ({ activeTab, onChangeTab, counts = {} }) => {
  const tabs = [
    { id: "itinerary", label: "Itinerary", icon: Calendar, count: counts.days },
    { id: "budget", label: "Budget & Costs", icon: DollarSign },
    { id: "weather", label: "Weather", icon: CloudSun, count: counts.weather },
    { id: "hotels", label: "Stays", icon: Hotel, count: counts.hotels },
    { id: "activities", label: "Attractions", icon: Compass, count: counts.activities },
    { id: "restaurants", label: "Dining", icon: Utensils, count: counts.restaurants },
    { id: "routes", label: "Routes", icon: Route, count: counts.routes },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChangeTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 select-none ${
              isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 border border-blue-500"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800"
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-extrabold ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
