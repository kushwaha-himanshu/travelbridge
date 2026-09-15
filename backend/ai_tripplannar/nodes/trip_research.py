from llm.model import llm
from graph.state import TripState


def trip_research(state: TripState):

    destination = state["destination"]
    days = state["days"]
    travelers = state["travelers"]
    interests = state["interests"]
    travel_style = state.get("travel_style", "moderate")

    prompt = f"""
You are an expert travel researcher.

Create useful travel information for the following trip:

Destination: {destination}
Number of days: {days}
Travelers: {travelers}
Interests: {interests}
Travel style: {travel_style}

Provide:

1. Important places to visit
2. Recommended activities
3. Best areas/locations to explore
4. Suggested local experiences
5. General travel tips

Do not create a day-by-day itinerary yet.

Keep the information practical and concise.
"""

    response = llm.invoke(prompt)

    content = response.content

    if isinstance(content, list):
        research = "".join(
            item["text"]
            for item in content
            if isinstance(item, dict)
            and item.get("type") == "text"
        )
    else:
        research = content

    print("\n===== TRIP RESEARCH =====")
    print(research)

    # Preserve existing coordinates
    old_info = state.get("destination_info", {})

      # Temporary coordinates for testing
    if destination.lower() == "manali":
        latitude = 32.2396
        longitude = 77.1887

    elif destination.lower() == "prayagraj":
        latitude = 25.4358
        longitude = 81.8463

    else:
        latitude = None
        longitude = None

    print("LATITUDE:", latitude)
    print("LONGITUDE:", longitude)
    
    return {
        "destination_info": {
            **old_info,
            "research": research,
               "latitude": latitude,
               "longitude": longitude
        }
    }



# from llm.model import llm
# from graph.state import TripState


# def trip_research(state: TripState):

#     destination = state["destination"]
#     days = state["days"]
#     travelers = state["travelers"]
#     interests = state["interests"]
#     travel_style = state.get("travel_style", "moderate")

#     prompt = f"""
# You are an expert travel researcher.

# Create useful travel information for the following trip:

# Destination: {destination}
# Number of days: {days}
# Travelers: {travelers}
# Interests: {interests}
# Travel style: {travel_style}

# Provide:

# 1. Important places to visit
# 2. Recommended activities
# 3. Best areas/locations to explore
# 4. Suggested local experiences
# 5. General travel tips

# Do not create a day-by-day itinerary yet.

# Keep the information practical and concise.
# """

#     response = llm.invoke(prompt)

#     content = response.content

#     if isinstance(content, list):
#         research = "".join(
#             item["text"]
#             for item in content
#             if isinstance(item, dict)
#             and item.get("type") == "text"
#         )
#     else:
#         research = content

#     print("\n===== TRIP RESEARCH =====")
#     print(research)

#     old_info = state.get("destination_info", {})

#     # TEMPORARY TEST COORDINATES
#     if destination.lower() == "manali":
#         latitude = 32.2396
#         longitude = 77.1887

#     elif destination.lower() == "prayagraj":
#         latitude = 25.4358
#         longitude = 81.8463

#     else:
#         latitude = None
#         longitude = None

#     return {
#         "destination_info": {
#             **old_info,
#             "research": research,
#             "latitude": latitude,
#             "longitude": longitude
#         }
#     }