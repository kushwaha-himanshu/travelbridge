# from graph.state import TripState


# state: TripState = {
#     "user_request": "Plan a 4 day trip to Manali",
#     "destination": "Manali",
#     "days": 4,
#     "travelers": 2,
#     "budget": 40000,
#     "currency": "INR",
#     "interests": ["nature", "adventure"],
#     "travel_style": "moderate",
# }

# print(state)



from tools.hotels_tool import search_hotels

hotels = search_hotels(
    destination="Manali",
    check_in="2026-10-10",
    check_out="2026-10-14",
    travelers=2,
    limit=5
)

print("\n===== HOTEL RESULT =====")

for hotel in hotels:
    print(hotel)