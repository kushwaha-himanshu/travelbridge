from graph.state import TripState


def parse_duration(duration: str) -> int:
    """
    Convert Google duration like '1265s'
    into seconds.
    """
    try:
        return int(str(duration).replace("s", ""))
    except (ValueError, TypeError):
        return 0


def time_to_minutes(time_str: str) -> int:
    """
    Convert HH:MM into minutes.
    """
    try:
        hour, minute = map(int, time_str.split(":"))
        return hour * 60 + minute
    except (ValueError, AttributeError):
        return 0


def conflict_checker(state: TripState):

    print("===== CONFLICT CHECKER =====")

    itinerary = state.get("itinerary", [])
    optimized_routes = state.get("optimized_routes", [])

    print("Itinerary type:", type(itinerary))
    print("Optimized routes type:", type(optimized_routes))

    errors = []

    # ---------------------------------
    # Validate itinerary structure
    # ---------------------------------

    if not isinstance(itinerary, list):

        return {
            "validation_errors": [
                "Itinerary must be a list."
            ],
            "is_valid": False
        }

    # ---------------------------------
    # Check each day
    # ---------------------------------

    for day in itinerary:

        # Prevent "'str' object has no attribute get"
        if not isinstance(day, dict):

            errors.append(
                f"Invalid itinerary day format: {day}"
            )

            continue

        activities = day.get(
            "activities",
            []
        )

        if not isinstance(activities, list):

            errors.append(
                f"Day {day.get('day', '?')} has invalid activities format."
            )

            continue

        # ---------------------------------
        # Check activity-to-activity conflicts
        # ---------------------------------

        for i in range(len(activities) - 1):

            current = activities[i]
            next_activity = activities[i + 1]

            if not isinstance(current, dict):
                continue

            if not isinstance(next_activity, dict):
                continue

            current_start = current.get(
                "start_time"
            )

            current_end = current.get(
                "end_time"
            )

            next_start = next_activity.get(
                "start_time"
            )

            if not current_end or not next_start:
                continue

            current_end_minutes = time_to_minutes(
                current_end
            )

            next_start_minutes = time_to_minutes(
                next_start
            )

            if current_end_minutes > next_start_minutes:

                errors.append(
                    f"Day {day.get('day', '?')}: "
                    f"{current.get('name', 'Activity')} "
                    f"overlaps with "
                    f"{next_activity.get('name', 'Activity')}."
                )

        # ---------------------------------
        # Find optimized route for this day
        # ---------------------------------

        day_number = day.get("day")

        route = None

        for r in optimized_routes:

            if not isinstance(r, dict):
                continue

            if r.get("day") == day_number:

                route = r
                break

        if not route:
            continue

        legs = route.get(
            "legs",
            []
        )

        if not isinstance(legs, list):
            continue

        # ---------------------------------
        # Check travel time
        # ---------------------------------

        for i in range(
            min(
                len(activities) - 1,
                len(legs)
            )
        ):

            activity = activities[i]
            next_activity = activities[i + 1]

            if not isinstance(activity, dict):
                continue

            if not isinstance(next_activity, dict):
                continue

            if not isinstance(legs[i], dict):
                continue

            current_end = activity.get(
                "end_time"
            )

            next_start = next_activity.get(
                "start_time"
            )

            if not current_end or not next_start:
                continue

            travel_seconds = parse_duration(
                legs[i].get(
                    "duration",
                    "0s"
                )
            )

            current_end_minutes = time_to_minutes(
                current_end
            )

            next_start_minutes = time_to_minutes(
                next_start
            )

            available_minutes = (
                next_start_minutes
                - current_end_minutes
            )

            travel_minutes = (
                travel_seconds / 60
            )

            if travel_minutes > available_minutes:

                errors.append(
                    f"Day {day_number}: "
                    f"Not enough travel time between "
                    f"{activity.get('name', 'Activity')} "
                    f"and "
                    f"{next_activity.get('name', 'Activity')}."
                )

    # ---------------------------------
    # Final result
    # ---------------------------------

    is_valid = len(errors) == 0

    print("Conflicts:", len(errors))
    print("Valid:", is_valid)

    if errors:
        print("Errors:")
        for error in errors:
            print("-", error)

    return {
        "validation_errors": errors,
        "is_valid": is_valid
    }