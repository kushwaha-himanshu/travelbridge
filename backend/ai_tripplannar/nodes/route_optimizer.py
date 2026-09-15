# from graph.state import TripState


# def route_optimizer(state: TripState):

#     print("===== ROUTE OPTIMIZER =====")

#     transport_options = state.get(
#         "transport_options",
#         []
#     )

#     if not transport_options:
#         return {
#             "optimized_routes": [],
#             "warnings": [
#                 "No transport routes available for optimization."
#             ]
#         }

#     optimized_routes = []

#     for route in transport_options:

#         optimized_routes.append({
#             "day": route.get("day"),
#             "distance_meters": route.get(
#                 "distance_meters", 0
#             ),
#             "duration": route.get(
#                 "duration", "0s"
#             ),
#             "route_order": route.get(
#                 "optimized_waypoint_order",
#                 []
#             ),
#             "legs": route.get(
#                 "legs",
#                 []
#             )
#         })

#     return {
#         "optimized_routes": optimized_routes
#     }


from graph.state import TripState


def route_optimizer(state: TripState):

    print("===== ROUTE OPTIMIZER =====")

    transport_options = state.get(
        "transport_options",
        []
    )

    print(
        "Transport options received:",
        len(transport_options)
    )

    if not transport_options:
        return {
            "optimized_routes": [],
            "warnings": [
                "No transport routes available for optimization."
            ]
        }

    optimized_routes = []

    for route in transport_options:

        optimized_routes.append({
            "success": route.get(
                "success",
                False
            ),

            "distance_meters": route.get(
                "distance_meters"
            ),

            "duration": route.get(
                "duration"
            ),

            "static_duration": route.get(
                "static_duration"
            ),

            "route_order": route.get(
                "optimized_waypoint_order",
                []
            ),

            "polyline": route.get(
                "polyline"
            ),

            "legs": route.get(
                "legs",
                []
            )
        })

    print(
        "Optimized routes:",
        len(optimized_routes)
    )

    return {
        "optimized_routes": optimized_routes
    }