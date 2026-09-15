from llm.model import llm
from graph.state import TripState
from tools.geocode_tool import geocode_destination

def trip_research(state: TripState):
    print("===== [NODE] TRIP RESEARCH & GEOCODING =====")
    destination = state.get("destination", "")
    days = state.get("days", 3)
    travelers = state.get("travelers", 2)
    interests = state.get("interests", [])
    travel_style = state.get("travel_style", "moderate")

    # 1. Dynamic Geocoding
    geo_data = geocode_destination(destination)
    latitude = geo_data.get("latitude")
    longitude = geo_data.get("longitude")
    country = geo_data.get("country", "")

    print(f"[Trip Research] Destination: {destination} -> Lat: {latitude}, Lng: {longitude}, Country: {country}")

    # 2. Expert Travel Research via LLM
    prompt = f"""
You are an expert global travel researcher.
Provide essential travel intelligence for:
Destination: {destination}
Duration: {days} days
Travelers: {travelers}
Interests: {', '.join(interests) if interests else 'General sightseeing'}
Travel style: {travel_style}

Include:
1. Top landmark areas and scenic zones to explore
2. Cultural highlights and local etiquette
3. Recommended rhythm for a {days}-day visit
4. Practical local transit and walking advice

Keep it concise, vivid, and structured. Avoid markdown tables or code blocks.
"""
    try:
        response = llm.invoke(prompt)
        content = response.content
        if isinstance(content, list):
            research_text = "".join(item.get("text", "") for item in content if isinstance(item, dict))
        else:
            research_text = str(content)
    except Exception as e:
        print(f"[Trip Research] LLM invoke error: {e}")
        research_text = f"Explore the vibrant culture, iconic sights, and scenic landscapes of {destination}."

    # Extract 2-sentence summary
    summary_lines = [l.strip() for l in research_text.split("\n") if l.strip() and not l.strip().startswith("#")]
    summary = " ".join(summary_lines[:2]) if summary_lines else f"Discover the best of {destination}."

    return {
        "destination_info": {
            "name": destination,
            "latitude": latitude,
            "longitude": longitude,
            "country": country,
            "research": research_text.strip(),
            "summary": summary[:280]
        }
    }