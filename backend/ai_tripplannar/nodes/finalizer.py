# from graph.state import TripState


# def finalizer(state: TripState):

#     final_plan = {
#         # Basic trip information
#         "destination": state.get("destination"),
#         "days": state.get("days"),
#         "travelers": state.get("travelers"),
#         "budget": state.get("budget"),
#         "currency": state.get("currency"),
#         "interests": state.get("interests"),
#         "travel_style": state.get("travel_style"),

#         # LLM research
#         "destination_info": state.get(
#             "destination_info", {}
#         ),

#         # Research from tools/APIs
#         "hotels": state.get(
#             "hotels", []
#         ),

#         "activities": state.get(
#             "activities", []
#         ),

#         "restaurants": state.get(
#             "restaurants", []
#         ),

#         "transport": state.get(
#             "transport", []
#         ),

#         "weather": state.get(
#             "weather", []
#         ),

#         # Generated itinerary
#         "itinerary": state.get(
#             "itinerary", []
#         ),

#         # Optimized routes
#         "optimized_routes": state.get(
#             "optimized_routes", []
#         ),

#         # Budget
#         "budget_breakdown": state.get(
#             "budget_breakdown", {}
#         ),

#         # Validation
#         "validation": {
#             "is_valid": state.get(
#                 "is_valid", False
#             ),
#             "errors": state.get(
#                 "validation_errors", []
#             )
#         }
#     }

#     print("\n===== FINAL PLAN =====")
#     print(final_plan)

#     return {
#         "final_plan": final_plan
#     }



from graph.state import TripState


def finalizer(state: TripState):

    final_plan = {
        # Basic trip information
        "destination": state.get("destination"),
        "days": state.get("days"),
        "travelers": state.get("travelers"),
        "budget": state.get("budget"),
        "currency": state.get("currency"),
        "interests": state.get("interests", []),
        "travel_style": state.get("travel_style"),

        # Destination research
        "destination_info": state.get(
            "destination_info", {}
        ),

        # Research results
        "hotels": state.get(
            "hotels", []
        ),

        "activities": state.get(
            "activities", []
        ),

        "restaurants": state.get(
            "restaurants", []
        ),

        # Transport
        "transport": state.get(
            "transport", []
        ),

        "transport_options": state.get(
            "transport_options", []
        ),

        # Weather
        "weather": state.get(
            "weather", []
        ),

        # Itinerary
        "itinerary": state.get(
            "itinerary", []
        ),

        # Optimized routes
        "optimized_routes": state.get(
            "optimized_routes", []
        ),

        # Budget
        "budget_breakdown": state.get(
            "budget_breakdown", {}
        ),

        # Tips and warnings
        "tips": state.get(
            "tips", []
        ),

        "warnings": state.get(
            "warnings", []
        ),

        # Validation
        "validation": {
            "is_valid": state.get(
                "is_valid", False
            ),
            "errors": state.get(
                "validation_errors", []
            )
        }
    }

    print("\n===== FINAL PLAN =====")
    print(final_plan)

    return {
        "final_plan": final_plan
    }