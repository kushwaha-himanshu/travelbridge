import React from "react";
import { Hotel, Star, MapPin, ExternalLink, ShieldCheck, Moon, DollarSign, Navigation } from "lucide-react";

export const HotelCards = ({ hotels = [], currency = "INR" }) => {
  if (!hotels || hotels.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
        <Hotel className="w-8 h-8 mx-auto mb-3 text-slate-600 opacity-60" />
        <h4 className="text-white font-semibold text-sm mb-1">No Accommodations Found</h4>
        <p className="text-xs text-slate-500">
          No specific hotels were returned for the given criteria. You can explore stays directly through your preferred booking provider.
        </p>
      </div>
    );
  }

  const formatCurrency = (val, curr) => {
    if (val === undefined || val === null || isNaN(val)) return null;
    const c = curr || currency || "EUR";
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: c,
        maximumFractionDigits: 0,
      }).format(val);
    } catch {
      return `${c} ${val}`;
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Hotel className="w-5 h-5 text-blue-500" /> Recommended Accommodations
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Vetted properties matching your travel profile and style</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {hotels.map((hotel, idx) => {
          const rating = hotel.rating || 4.5;
          const loc = hotel.location;
          const displayAddress = loc?.address || (loc?.city ? `${loc.city}${loc.country ? `, ${loc.country}` : ""}` : (typeof loc === "string" ? loc : "Central location"));
          const hasCoords = loc?.lat != null && loc?.lng != null;
          const mapLink = hasCoords
            ? `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`
            : (displayAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayAddress)}` : null);

          const price = hotel.price;
          const curr = price?.currency || currency;
          const nightlyFormatted = price?.nightly ? formatCurrency(price.nightly, curr) : null;
          const totalFormatted = price?.total ? formatCurrency(price.total, curr) : null;
          const nights = price?.nights || null;

          const directUrl = hotel.booking_url || hotel.url || price?.booking_url;

          return (
            <div
              key={hotel.id || idx}
              className="bg-slate-900/60 border border-slate-850 hover:border-slate-750 rounded-3xl p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-950/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Hotel className="w-5 h-5" />
                  </div>
                  {rating && (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {rating}
                    </span>
                  )}
                </div>

                <h4 className="text-lg font-bold text-white tracking-tight leading-snug">
                  {hotel.name || "Featured Property"}
                </h4>

                {/* Structured Location */}
                <div className="flex items-start gap-1.5 text-xs text-slate-400 mt-2.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="line-clamp-2">{displayAddress}</span>
                    {mapLink && (
                      <a
                        href={mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 mt-1 hover:underline"
                      >
                        <Navigation className="w-3 h-3" /> View on Map
                      </a>
                    )}
                  </div>
                </div>

                {/* Structured Price Details */}
                {(nightlyFormatted || totalFormatted) && (
                  <div className="mt-4 p-3 bg-slate-950/40 rounded-2xl border border-slate-800/80">
                    <div className="flex items-baseline justify-between">
                      {nightlyFormatted ? (
                        <div>
                          <span className="text-lg font-bold text-emerald-400">{nightlyFormatted}</span>
                          <span className="text-[11px] text-slate-400 font-medium"> / night</span>
                        </div>
                      ) : (
                        <div />
                      )}
                      {totalFormatted && (
                        <div className="text-right">
                          <span className="text-xs text-slate-400 font-medium block">
                            {nights ? `Total (${nights} night${nights > 1 ? "s" : ""})` : "Est. Total"}
                          </span>
                          <span className="text-sm font-semibold text-slate-200">{totalFormatted}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-850 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-slate-500 font-bold block">Provider</span>
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> {price?.platform || hotel.platform || "Verified"}
                  </span>
                </div>

                {directUrl ? (
                  <a
                    href={directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5"
                  >
                    <span>View Deal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-500">Inquire locally</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
