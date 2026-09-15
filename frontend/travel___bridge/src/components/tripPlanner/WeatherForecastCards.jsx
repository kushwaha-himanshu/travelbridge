import React from "react";
import { CloudSun, Sun, CloudRain, Cloud, Droplets, Thermometer } from "lucide-react";

export const WeatherForecastCards = ({ weather = {} }) => {
  const forecast = weather.forecast || [];
  const summary = weather.summary || "Real-time forecast information available.";

  const getWeatherIcon = (condition = "") => {
    const c = condition.toLowerCase();
    if (c.includes("rain") || c.includes("drizzle") || c.includes("shower")) return CloudRain;
    if (c.includes("cloud") || c.includes("overcast")) return Cloud;
    if (c.includes("clear") || c.includes("sun")) return Sun;
    return CloudSun;
  };

  if (!forecast || forecast.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
        Live weather forecast data is currently unavailable for this destination.
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Summary Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
          <CloudSun className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Atmospheric Overview</h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{summary}</p>
        </div>
      </div>

      {/* Forecast Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {forecast.map((day, idx) => {
          const Icon = getWeatherIcon(day.condition);
          return (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-850 hover:border-slate-750 p-5 rounded-3xl backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/20"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-300">
                  {day.date ? new Date(day.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) : `Day ${idx + 1}`}
                </span>
                <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center text-cyan-400 border border-slate-800">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
                <span>{day.condition || "Clear sky"}</span>
              </div>

              {/* Temperature High / Low */}
              <div className="flex items-center justify-between text-xs py-2 border-t border-slate-850">
                <span className="text-slate-400 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-blue-400" /> High / Low
                </span>
                <span className="font-mono font-bold text-slate-200">
                  {day.temperature_max}° / {day.temperature_min}°C
                </span>
              </div>

              {/* Precipitation */}
              <div className="flex items-center justify-between text-xs py-1.5 text-slate-400">
                <span className="flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Rain Chance
                </span>
                <span className="font-mono font-semibold text-slate-300">
                  {day.precipitation_probability ?? 0}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
