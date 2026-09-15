from graph.state import TripState
from typing import Dict, Any, List

def calculate_budget(state: TripState):
    print("===== [NODE] PROGRAMMATIC BUDGET CALCULATION =====")
    destination = state.get("destination", "")
    days = max(1, state.get("days", 3))
    travelers = max(1, state.get("travelers", 2))
    user_budget = float(state.get("budget", 40000.0))
    currency = state.get("currency", "INR")
    travel_style = (state.get("travel_style") or "moderate").lower()
    itinerary = state.get("itinerary", [])
    warnings = state.get("warnings", [])

    # Calculate baseline estimated cost per traveler-day in base currency
    # Adjust multiplier based on travel style
    if travel_style == "budget":
        cat_weights = {
            "accommodation": 0.35,
            "food": 0.30,
            "transport": 0.15,
            "activities": 0.15,
            "miscellaneous": 0.05
        }
        cost_scale = 0.85
    elif travel_style == "luxury":
        cat_weights = {
            "accommodation": 0.55,
            "food": 0.20,
            "transport": 0.12,
            "activities": 0.08,
            "miscellaneous": 0.05
        }
        cost_scale = 1.25
    else:  # moderate
        cat_weights = {
            "accommodation": 0.45,
            "food": 0.25,
            "transport": 0.12,
            "activities": 0.13,
            "miscellaneous": 0.05
        }
        cost_scale = 1.0

    # Target total spend aligns roughly with budget but reflects realistic costs
    estimated_target = user_budget * cost_scale
    daily_target = estimated_target / days

    daily_breakdown: List[Dict[str, Any]] = []
    tot_accom = 0.0
    tot_food = 0.0
    tot_trans = 0.0
    tot_act = 0.0
    tot_misc = 0.0

    for d in range(1, days + 1):
        # Add slight variation per day (e.g. Day 1 arrival, middle days higher activities)
        day_factor = 0.95 if d == 1 else (1.05 if d == 2 else 1.0)
        
        d_accom = round(daily_target * cat_weights["accommodation"] * day_factor, 2)
        d_food = round(daily_target * cat_weights["food"] * day_factor, 2)
        d_trans = round(daily_target * cat_weights["transport"] * day_factor, 2)
        d_act = round(daily_target * cat_weights["activities"] * day_factor, 2)
        d_misc = round(daily_target * cat_weights["miscellaneous"] * day_factor, 2)

        # Exact programmatic sum
        d_total = round(d_accom + d_food + d_trans + d_act + d_misc, 2)

        daily_breakdown.append({
            "day": d,
            "accommodation": d_accom,
            "food": d_food,
            "transport": d_trans,
            "activities": d_act,
            "miscellaneous": d_misc,
            "day_total": d_total
        })

        tot_accom += d_accom
        tot_food += d_food
        tot_trans += d_trans
        tot_act += d_act
        tot_misc += d_misc

    estimated_cost = round(tot_accom + tot_food + tot_trans + tot_act + tot_misc, 2)
    remaining_budget = round(user_budget - estimated_cost, 2)
    is_over_budget = estimated_cost > user_budget

    new_warnings = list(warnings)
    if is_over_budget:
        over_amt = round(estimated_cost - user_budget, 2)
        new_warnings.append(
            f"Estimated trip expenses ({currency} {estimated_cost:,.2f}) exceed your set budget of {currency} {user_budget:,.2f} by {currency} {over_amt:,.2f}."
        )

    budget_breakdown = {
        "daily_breakdown": daily_breakdown,
        "categories": {
            "accommodation": round(tot_accom, 2),
            "food": round(tot_food, 2),
            "transport": round(tot_trans, 2),
            "activities": round(tot_act, 2),
            "miscellaneous": round(tot_misc, 2)
        },
        "user_budget": user_budget,
        "estimated_cost": estimated_cost,
        "remaining_budget": remaining_budget,
        "is_over_budget": is_over_budget,
        "currency": currency
    }

    print(f"[Budget] Estimated: {estimated_cost} {currency} vs User Budget: {user_budget} {currency} (Over: {is_over_budget})")

    return {
        "budget_breakdown": budget_breakdown,
        "warnings": new_warnings
    }