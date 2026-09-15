from langgraph.graph import StateGraph, START, END

from graph.state import TripState
from nodes.trip_research import trip_research
from nodes.itinerary import trip_itinerary
from nodes.budget import calculate_budget
from nodes.validate_trip import validate_trip
from nodes.finalizer import finalizer
from nodes.hotels import hotel_research
from nodes.research_join import research_join
from nodes.activities import activities_research
from nodes.food import food_research
from nodes.transport import transport_research
from nodes.weather import weather_research
from nodes.route_optimizer import route_optimizer
from nodes.conflict_checker import conflict_checker



# def check_result(state: TripState):

#       if state.get("is_valid", False):
#         return "valid"

#       return "invalid"

def create_trip_planner_graph():
    graph= StateGraph(TripState)


   

 # node creation

    graph.add_node("trip_research", trip_research)
    graph.add_node("trip_itinerary", trip_itinerary)
    graph.add_node("calculate_budget", calculate_budget)
    graph.add_node("validate_trip", validate_trip)
    graph.add_node("finalizer", finalizer)


    graph.add_node("research_join", research_join)

    # parallel node for hotel research
    graph.add_node("hotel_research", hotel_research)

    graph.add_node("activities", activities_research)
    graph.add_node("food", food_research)
    graph.add_node("transport", transport_research)
    graph.add_node("weather", weather_research)
    graph.add_node("route_optimizer", route_optimizer)
    graph.add_node("conflict_checker", conflict_checker)

 # Connect nodes

    # =========================
# CONNECT NODES
# =========================

    graph.add_edge(START, "trip_research")

# Parallel research
    graph.add_edge("trip_research", "hotel_research")
    graph.add_edge("trip_research", "activities")
    graph.add_edge("trip_research", "food")

# Join research
    graph.add_edge("hotel_research", "research_join")
    graph.add_edge("activities", "research_join")
    graph.add_edge("food", "research_join")

# Transport
    graph.add_edge("research_join", "transport")

# Weather
    graph.add_edge("transport", "weather")

# IMPORTANT:
# Itinerary must be generated before budget
    graph.add_edge("weather", "trip_itinerary")

# Budget uses itinerary
    graph.add_edge("trip_itinerary", "calculate_budget")

# Validate after itinerary + budget
    graph.add_edge("calculate_budget", "validate_trip")

# Route optimization
    graph.add_edge("validate_trip", "route_optimizer")

# Conflict checking
    graph.add_edge("route_optimizer", "conflict_checker")

# Final plan
    graph.add_edge("conflict_checker", "finalizer")

# End
    graph.add_edge("finalizer", END)

#     graph.add_conditional_edges(
#     "conflict_checker",
#       check_result,
#     {
#         "valid": "finalizer",
#         "invalid": "finalizer"
#     }
# )
   

    return graph.compile()

trip_graph = create_trip_planner_graph()