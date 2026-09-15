from graph.state import TripState
from typing import List, Dict, Any

def time_to_minutes(time_str: str) -> int:
    try:
        parts = time_str.strip().split(":")
        return int(parts[0]) * 60 + int(parts[1])
    except Exception:
        return 0

def conflict_checker(state: TripState):
    print("===== [NODE] CONFLICT CHECKER =====")
    itinerary = state.get("itinerary", [])
    errors: List[str] = []

    if not isinstance(itinerary, list) or len(itinerary) == 0:
        return {
            "validation_errors": ["Itinerary is empty."],
            "is_valid": False
        }

    for day in itinerary:
        if not isinstance(day, dict):
            continue
        day_num = day.get("day", 1)
        activities = day.get("activities", [])
        
        for i in range(len(activities) - 1):
            curr = activities[i]
            nxt = activities[i + 1]
            if not isinstance(curr, dict) or not isinstance(nxt, dict):
                continue
            
            c_end = curr.get("end_time")
            n_start = nxt.get("start_time")
            
            if c_end and n_start:
                c_mins = time_to_minutes(c_end)
                n_mins = time_to_minutes(n_start)
                if c_mins > n_mins:
                    errors.append(
                        f"Day {day_num}: Activity '{curr.get('name')}' (ends {c_end}) overlaps with '{nxt.get('name')}' (starts {n_start})."
                    )

    is_valid = len(errors) == 0
    print(f"[Conflict Checker] Validation result: {is_valid} (Conflicts: {len(errors)})")

    # Combine with existing validation errors if any
    existing_errs = state.get("validation_errors", [])
    all_errors = list(existing_errs) + errors

    return {
        "validation_errors": all_errors,
        "is_valid": is_valid
    }