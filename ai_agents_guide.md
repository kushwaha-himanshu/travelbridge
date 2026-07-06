# 🤖 Building AI Agents — Complete Guide
### Stack: LangGraph + LangChain + Google Gemini + FastAPI
### Project: Itinera (AI Multi-Agent Travel Planner)

---

## Table of Contents

1. [What Is an AI Agent?](#1-what-is-an-ai-agent)
2. [Mental Model — How All Agents Work](#2-mental-model)
3. [Prerequisites & Installation](#3-prerequisites--installation)
4. [Shared State — TravelState](#4-shared-state--travelstate)
5. [Agent 1 — Orchestrator](#5-agent-1--orchestrator)
6. [Agent 2 — Weather Agent](#6-agent-2--weather-agent)
7. [Agent 3 — Maps Agent](#7-agent-3--maps-agent)
8. [Agent 4 — Budget Agent](#8-agent-4--budget-agent)
9. [Agent 5 — Events Agent](#9-agent-5--events-agent)
10. [Agent 6 — Synthesizer](#10-agent-6--synthesizer)
11. [Wiring All Agents into LangGraph](#11-wiring-all-agents-into-langgraph)
12. [Running the Graph from FastAPI](#12-running-the-graph-from-fastapi)
13. [WebSocket Event Protocol](#13-websocket-event-protocol)
14. [Refinement Loop](#14-refinement-loop)
15. [Redis Caching Layer](#15-redis-caching-layer)
16. [Testing Each Agent Individually](#16-testing-each-agent-individually)
17. [Common Errors & Fixes](#17-common-errors--fixes)
18. [Build Order Checklist](#18-build-order-checklist)

---

## 1. What Is an AI Agent?

An AI agent is a function that:
- **Receives** a shared state object
- **Does work** — calls an API, calls an LLM, or both
- **Returns** a partial update to that state
- **Optionally emits** a real-time event (WebSocket)

That's it. There is no magic. Every agent in this project is an `async` Python function.

```
Input: TravelState (read)
          ↓
    Do work (API / LLM)
          ↓
Output: dict (partial state update)
```

---

## 2. Mental Model

### The 3 Types of Agents in This Project

| Type | Does What | Agents |
|------|-----------|--------|
| **Tool-calling** | Calls an external API, returns structured data | Weather, Maps, Events |
| **LLM-only** | Calls Gemini, gets back text or JSON | Budget, Synthesizer |
| **Hybrid** | Calls both an API and an LLM | Orchestrator |

### How State Flows Through the Graph

```
User submits trip form
        ↓
[Orchestrator] ── geocodes destination, classifies intent
        ↓
   ┌────┼────┐
   ↓    ↓    ↓        ← these 3 run in PARALLEL
[Weather] [Maps] [Events]
   ↓    ↓    ↓
   └────┼────┘
        ↓
   [Budget] ← needs Maps result (distance)
        ↓
  [Synthesizer] ← needs ALL results
        ↓
   Final itinerary stored in DB
```

### Why TypedDict State?

Every agent reads from and writes to one `TravelState` object.
No passing 10 arguments. No global variables. Clean, typed, inspectable.

---

## 3. Prerequisites & Installation

### Required packages

```bash
pip install \
  langchain \
  langchain-google-genai \
  langgraph \
  httpx \
  fastapi \
  uvicorn \
  pydantic-settings \
  supabase \
  upstash-redis
```

### Pin your versions (important — LangGraph changes fast)

```txt
# requirements.txt
langchain==0.3.x
langchain-google-genai==2.x.x
langgraph==0.2.x
httpx==0.27.x
fastapi==0.115.x
```

### Environment variables needed

```env
# backend/.env
GEMINI_API_KEY=your_key_here
ORS_API_KEY=your_key_here
TICKETMASTER_API_KEY=your_key_here
SUPABASE_URL=your_url_here
SUPABASE_SERVICE_KEY=your_key_here
UPSTASH_REDIS_REST_URL=your_url_here
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

### Get your API keys

| API | Where | Free? |
|-----|-------|-------|
| Gemini | aistudio.google.com | Yes — 15 RPM |
| OpenRouteService | openrouteservice.org | Yes — 2,000 req/day |
| Ticketmaster | developer.ticketmaster.com | Yes — 5,000 req/day |
| Open-Meteo | open-meteo.com | Yes — no key needed |
| Nominatim | Built-in OSM | Yes — no key needed |

---

## 4. Shared State — TravelState

This is the single most important file. Every agent reads from and writes to this object.
Create this before writing any agent.

```python
# backend/app/agents/state.py

from typing import TypedDict, Optional, Annotated
from langgraph.graph.message import add_messages


class TravelState(TypedDict):
    # ── Input (set once at graph start) ──────────────────────────
    trip_id: str
    session_id: str
    destination: str
    origin: Optional[str]
    start_date: str                   # "YYYY-MM-DD"
    end_date: str                     # "YYYY-MM-DD"
    budget_inr: Optional[int]
    travelers: int
    preferences: list[str]

    # ── Conversation (for refinement loop) ───────────────────────
    messages: Annotated[list, add_messages]
    refinement_request: Optional[str]

    # ── Agent Outputs (filled as each agent completes) ────────────
    destination_coords: Optional[dict]    # { "lat": 15.2, "lon": 73.9 }
    trip_intent: Optional[str]            # "leisure" | "adventure" | "business"
    weather_result: Optional[dict]        # { forecast: [...], summary: "..." }
    route_result: Optional[dict]          # { distance_km: 580, duration_hours: 11 }
    budget_result: Optional[dict]         # { transport: 5000, hotel: 8000, ... }
    events_result: Optional[list]         # [ { name, date, venue, url } ]

    # ── Final Output ──────────────────────────────────────────────
    itinerary_markdown: Optional[str]
    day_plans: Optional[list]

    # ── Control Flow ──────────────────────────────────────────────
    agent_status: dict                    # { "weather": "done", "maps": "running" }
    error: Optional[str]
    needs_refinement: bool
```

### How to initialize state when starting a new trip

```python
initial_state: TravelState = {
    "trip_id": trip_id,
    "session_id": session_id,
    "destination": "Goa, India",
    "origin": "Delhi, India",
    "start_date": "2025-07-10",
    "end_date": "2025-07-14",
    "budget_inr": 30000,
    "travelers": 2,
    "preferences": ["beaches", "nightlife", "seafood"],
    "messages": [],
    "refinement_request": None,
    "destination_coords": None,
    "trip_intent": None,
    "weather_result": None,
    "route_result": None,
    "budget_result": None,
    "events_result": None,
    "itinerary_markdown": None,
    "day_plans": None,
    "agent_status": {
        "orchestrator": "pending",
        "weather": "pending",
        "maps": "pending",
        "budget": "pending",
        "events": "pending",
        "synthesizer": "pending"
    },
    "error": None,
    "needs_refinement": False
}
```

---

## 5. Agent 1 — Orchestrator

**Role:** Entry point. Geocode the destination, classify trip intent.
**Depends on:** Nothing (runs first)
**Produces:** `destination_coords`, `trip_intent`

```python
# backend/app/agents/orchestrator.py

import os
from langchain_google_genai import ChatGoogleGenerativeAI
from app.agents.state import TravelState
from app.tools.maps_tools import geocode_destination
from app.api.websocket import emit_ws

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    google_api_key=os.getenv("GEMINI_API_KEY")
)


async def orchestrator_node(state: TravelState) -> dict:
    await emit_ws(state["session_id"], {
        "type": "agent_update",
        "agent": "orchestrator",
        "status": "running",
        "message": "Parsing your trip details..."
    })

    # Step 1: Geocode the destination
    try:
        coords = await geocode_destination(state["destination"])
    except Exception as e:
        return {"error": f"Could not find destination: {state['destination']}"}

    # Step 2: Classify trip intent
    response = await llm.ainvoke([
        (
            "system",
            "You classify travel intent. Reply with exactly one word: leisure, adventure, or business. Nothing else."
        ),
        (
            "human",
            f"Destination: {state['destination']}. Preferences: {', '.join(state.get('preferences', []))}."
        )
    ])
    intent = response.content.strip().lower()
    if intent not in ["leisure", "adventure", "business"]:
        intent = "leisure"  # safe default

    await emit_ws(state["session_id"], {
        "type": "agent_update",
        "agent": "orchestrator",
        "status": "done"
    })

    return {
        "destination_coords": coords,
        "trip_intent": intent,
        "agent_status": {**state["agent_status"], "orchestrator": "done"}
    }
```

### Geocoding tool (used by both Orchestrator and Maps Agent)

```python
# backend/app/tools/maps_tools.py

import httpx


async def geocode_destination(place: str) -> dict:
    """
    Convert a place name to lat/lon using Nominatim (OpenStreetMap).
    Free, no API key, but requires a User-Agent header.
    Rate limit: 1 request/second — add a sleep if calling in a loop.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://nominatim.openstreetmap.org/search",
            params={
                "q": place,
                "format": "json",
                "limit": 1
            },
            headers={
                "User-Agent": "itinera-travel-app/1.0"   # required by Nominatim
            },
            timeout=10.0
        )
        response.raise_for_status()
        data = response.json()

        if not data:
            raise ValueError(f"Could not geocode: {place}")

        return {
            "lat": float(data[0]["lat"]),
            "lon": float(data[0]["lon"]),
            "display_name": data[0]["display_name"]
        }
```

---

## 6. Agent 2 — Weather Agent

**Role:** Fetch weather forecast for travel dates.
**Depends on:** `destination_coords` from Orchestrator
**Produces:** `weather_result`

```python
# backend/app/agents/weather_agent.py

import httpx
from app.agents.state import TravelState
from app.api.websocket import emit_ws
from app.cache.redis_client import get_cache, set_cache

# WMO weather code → human readable description
WEATHER_CODES = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Foggy", 48: "Icy fog", 51: "Light drizzle", 53: "Moderate drizzle",
    61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
    71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
    80: "Slight showers", 81: "Moderate showers", 82: "Violent showers",
    95: "Thunderstorm", 96: "Thunderstorm with hail"
}


async def weather_agent_node(state: TravelState) -> dict:
    await emit_ws(state["session_id"], {
        "type": "agent_update",
        "agent": "weather",
        "status": "running",
        "message": "Checking weather forecast..."
    })

    coords = state["destination_coords"]
    cache_key = f"weather:{coords['lat']:.2f}:{coords['lon']:.2f}:{state['start_date']}:{state['end_date']}"

    # Check Redis cache first
    cached = await get_cache(cache_key)
    if cached:
        await emit_ws(state["session_id"], {"type": "agent_update", "agent": "weather", "status": "done"})
        return {
            "weather_result": cached,
            "agent_status": {**state["agent_status"], "weather": "done"}
        }

    # Fetch from Open-Meteo (no API key needed)
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.open-meteo.com/v1/forecast",
            params={
                "latitude": coords["lat"],
                "longitude": coords["lon"],
                "daily": "temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum",
                "start_date": state["start_date"],
                "end_date": state["end_date"],
                "timezone": "auto"
            },
            timeout=10.0
        )
        response.raise_for_status()

    raw = response.json()["daily"]
    forecast = []

    for i in range(len(raw["time"])):
        code = raw["weathercode"][i]
        forecast.append({
            "date": raw["time"][i],
            "max_temp_c": raw["temperature_2m_max"][i],
            "min_temp_c": raw["temperature_2m_min"][i],
            "description": WEATHER_CODES.get(code, "Variable weather"),
            "rain_mm": raw["precipitation_sum"][i]
        })

    # Build a plain-English summary
    avg_max = sum(d["max_temp_c"] for d in forecast) / len(forecast)
    rainy_days = sum(1 for d in forecast if d["rain_mm"] > 2)
    summary = (
        f"Average high {avg_max:.0f}°C over {len(forecast)} days. "
        f"{rainy_days} day(s) with significant rain expected."
    )

    result = {"forecast": forecast, "summary": summary}

    # Cache for 6 hours (weather doesn't change that fast)
    await set_cache(cache_key, result, ttl=21600)

    await emit_ws(state["session_id"], {"type": "agent_update", "agent": "weather", "status": "done"})

    return {
        "weather_result": result,
        "agent_status": {**state["agent_status"], "weather": "done"}
    }
```

---

## 7. Agent 3 — Maps Agent

**Role:** Calculate travel distance and duration from origin to destination.
**Depends on:** `destination_coords` from Orchestrator
**Produces:** `route_result`

```python
# backend/app/agents/maps_agent.py

import os, httpx
from app.agents.state import TravelState
from app.api.websocket import emit_ws
from app.tools.maps_tools import geocode_destination
from app.cache.redis_client import get_cache, set_cache

ORS_KEY = os.getenv("ORS_API_KEY")


async def maps_agent_node(state: TravelState) -> dict:
    await emit_ws(state["session_id"], {
        "type": "agent_update",
        "agent": "maps",
        "status": "running",
        "message": "Calculating your route..."
    })

    # If no origin provided, skip gracefully
    if not state.get("origin"):
        await emit_ws(state["session_id"], {"type": "agent_update", "agent": "maps", "status": "skipped"})
        return {
            "route_result": None,
            "agent_status": {**state["agent_status"], "maps": "skipped"}
        }

    dest_coords = state["destination_coords"]

    cache_key = f"route:{state['origin']}:{state['destination']}"
    cached = await get_cache(cache_key)
    if cached:
        await emit_ws(state["session_id"], {"type": "agent_update", "agent": "maps", "status": "done"})
        return {
            "route_result": cached,
            "agent_status": {**state["agent_status"], "maps": "done"}
        }

    # Geocode origin
    origin_coords = await geocode_destination(state["origin"])

    # Call OpenRouteService
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.openrouteservice.org/v2/directions/driving-car/json",
            headers={
                "Authorization": ORS_KEY,
                "Content-Type": "application/json"
            },
            json={
                "coordinates": [
                    [origin_coords["lon"], origin_coords["lat"]],    # ORS uses [lon, lat] order
                    [dest_coords["lon"], dest_coords["lat"]]
                ]
            },
            timeout=15.0
        )
        response.raise_for_status()

    summary = response.json()["routes"][0]["summary"]
    result = {
        "distance_km": round(summary["distance"] / 1000, 1),
        "duration_hours": round(summary["duration"] / 3600, 1),
        "origin_coords": origin_coords,
        "dest_coords": dest_coords
    }

    # Cache route for 24 hours (roads don't change)
    await set_cache(cache_key, result, ttl=86400)

    await emit_ws(state["session_id"], {"type": "agent_update", "agent": "maps", "status": "done"})

    return {
        "route_result": result,
        "agent_status": {**state["agent_status"], "maps": "done"}
    }
```

> ⚠️ **ORS coordinate order:** OpenRouteService uses `[longitude, latitude]` — the reverse of what most people expect. Easy bug to miss.

---

## 8. Agent 4 — Budget Agent

**Role:** Estimate trip cost breakdown using Gemini (no external API).
**Depends on:** `route_result` from Maps Agent (for distance context)
**Produces:** `budget_result`

```python
# backend/app/agents/budget_agent.py

import os, json
from datetime import date
from langchain_google_genai import ChatGoogleGenerativeAI
from app.agents.state import TravelState
from app.api.websocket import emit_ws

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    google_api_key=os.getenv("GEMINI_API_KEY"),
    temperature=0.3    # low temperature = more consistent numbers
)

BUDGET_PROMPT = """
You are a travel budget estimator specializing in Indian travel costs.
Using the trip details below, estimate realistic costs in INR.

RULES:
- Use real-world Indian price ranges (not global averages)
- Do NOT invent or exaggerate numbers
- Respond ONLY with a valid JSON object — no markdown, no explanation, no preamble

REQUIRED JSON FORMAT:
{{
  "transport": <number>,
  "accommodation": <number>,
  "food": <number>,
  "activities": <number>,
  "misc": <number>,
  "total": <number>,
  "per_person_per_day": <number>,
  "budget_feasibility": "comfortable" | "tight" | "over_budget",
  "tips": "<one practical money-saving tip>"
}}

TRIP DETAILS:
- Destination: {destination}
- Origin: {origin}
- Duration: {days} days
- Travelers: {travelers} people
- User's stated budget: ₹{budget}
- Travel distance: {distance}
- Preferences: {preferences}
"""


async def budget_agent_node(state: TravelState) -> dict:
    await emit_ws(state["session_id"], {
        "type": "agent_update",
        "agent": "budget",
        "status": "running",
        "message": "Estimating your budget..."
    })

    # Calculate trip duration
    start = date.fromisoformat(state["start_date"])
    end = date.fromisoformat(state["end_date"])
    days = (end - start).days + 1

    # Get distance from Maps agent result (if available)
    distance_str = "unknown"
    if state.get("route_result"):
        distance_str = f"{state['route_result']['distance_km']} km by road"

    prompt = BUDGET_PROMPT.format(
        destination=state["destination"],
        origin=state.get("origin", "not specified"),
        days=days,
        travelers=state["travelers"],
        budget=state.get("budget_inr", "not specified"),
        distance=distance_str,
        preferences=", ".join(state.get("preferences", []))
    )

    response = await llm.ainvoke([("human", prompt)])

    # Safe JSON parse — Gemini sometimes adds ```json fences despite instructions
    raw_text = response.content.strip()
    if raw_text.startswith("```"):
        raw_text = raw_text.split("```")[1]
        if raw_text.startswith("json"):
            raw_text = raw_text[4:]
        raw_text = raw_text.strip()

    try:
        budget_data = json.loads(raw_text)
    except json.JSONDecodeError as e:
        # Fallback: return a safe default rather than crashing the whole graph
        budget_data = {
            "transport": 0, "accommodation": 0, "food": 0,
            "activities": 0, "misc": 0, "total": 0,
            "per_person_per_day": 0,
            "budget_feasibility": "unknown",
            "tips": "Could not estimate budget — please check manually",
            "parse_error": str(e)
        }

    await emit_ws(state["session_id"], {"type": "agent_update", "agent": "budget", "status": "done"})

    return {
        "budget_result": budget_data,
        "agent_status": {**state["agent_status"], "budget": "done"}
    }
```

---

## 9. Agent 5 — Events Agent

**Role:** Find real events at the destination during travel dates.
**Depends on:** Nothing (runs in parallel with Weather and Maps)
**Produces:** `events_result`

```python
# backend/app/agents/events_agent.py

import os, httpx
from app.agents.state import TravelState
from app.api.websocket import emit_ws
from app.cache.redis_client import get_cache, set_cache

TICKETMASTER_KEY = os.getenv("TICKETMASTER_API_KEY")


async def events_agent_node(state: TravelState) -> dict:
    await emit_ws(state["session_id"], {
        "type": "agent_update",
        "agent": "events",
        "status": "running",
        "message": "Finding local events..."
    })

    # Ticketmaster uses city name, not coordinates
    city = state["destination"].split(",")[0].strip()
    cache_key = f"events:{city}:{state['start_date']}:{state['end_date']}"

    cached = await get_cache(cache_key)
    if cached:
        await emit_ws(state["session_id"], {"type": "agent_update", "agent": "events", "status": "done"})
        return {
            "events_result": cached,
            "agent_status": {**state["agent_status"], "events": "done"}
        }

    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://app.ticketmaster.com/discovery/v2/events.json",
            params={
                "apikey": TICKETMASTER_KEY,
                "city": city,
                "startDateTime": f"{state['start_date']}T00:00:00Z",
                "endDateTime": f"{state['end_date']}T23:59:59Z",
                "size": 8,
                "sort": "date,asc",
                "locale": "*"
            },
            timeout=10.0
        )

    events = []

    # Ticketmaster returns 200 even with no results, check for _embedded
    if response.status_code == 200 and "_embedded" in response.json():
        for e in response.json()["_embedded"]["events"]:
            try:
                events.append({
                    "name": e["name"],
                    "date": e["dates"]["start"]["localDate"],
                    "time": e["dates"]["start"].get("localTime", "TBD"),
                    "venue": e["_embedded"]["venues"][0]["name"],
                    "url": e["url"],
                    "genre": e.get("classifications", [{}])[0]
                             .get("segment", {}).get("name", "Event"),
                    "price_range": e.get("priceRanges", [{}])[0]
                                    .get("min", None)
                })
            except (KeyError, IndexError):
                continue    # skip malformed event entries

    # Cache for 12 hours
    await set_cache(cache_key, events, ttl=43200)

    await emit_ws(state["session_id"], {"type": "agent_update", "agent": "events", "status": "done"})

    return {
        "events_result": events,
        "agent_status": {**state["agent_status"], "events": "done"}
    }
```

---

## 10. Agent 6 — Synthesizer

**Role:** Combine all agent outputs into a complete itinerary using Gemini.
**Depends on:** ALL other agents (runs last)
**Produces:** `itinerary_markdown`, `day_plans`

This is the most important agent. The quality of your prompt directly determines the quality of the itinerary.

```python
# backend/app/agents/synthesizer.py

import os, json
from langchain_google_genai import ChatGoogleGenerativeAI
from app.agents.state import TravelState
from app.api.websocket import emit_ws
from app.db.crud import save_itinerary

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    google_api_key=os.getenv("GEMINI_API_KEY"),
    temperature=0.7    # higher temperature = more creative itinerary
)

SYNTHESIZER_PROMPT = """
You are an expert travel planner creating a personalized itinerary.
Use ONLY the data provided below. Do NOT invent prices, distances, or events not listed.

═══════════════════════════════════════════
TRIP DETAILS
═══════════════════════════════════════════
Destination : {destination}
Origin      : {origin}
Dates       : {start_date} → {end_date}
Travelers   : {travelers} people
Preferences : {preferences}
Trip style  : {trip_intent}

═══════════════════════════════════════════
WEATHER DATA
═══════════════════════════════════════════
{weather}

═══════════════════════════════════════════
TRAVEL ROUTE
═══════════════════════════════════════════
{route}

═══════════════════════════════════════════
BUDGET BREAKDOWN
═══════════════════════════════════════════
{budget}

═══════════════════════════════════════════
LOCAL EVENTS DURING YOUR TRIP
═══════════════════════════════════════════
{events}

═══════════════════════════════════════════
INSTRUCTIONS
═══════════════════════════════════════════
1. Write a markdown itinerary with one section per day (## Day 1 — Date, etc.)
2. For each day include: morning / afternoon / evening activities, meal suggestions, travel tips
3. Reference actual weather data per day (e.g. "it'll be 32°C and partly cloudy")
4. Mention relevant events from the events list on the correct dates
5. End with a ## Budget Summary section using the budget data
6. After the markdown, write a JSON block labeled ```day_plans with this exact structure:

[
  {{
    "day": 1,
    "date": "YYYY-MM-DD",
    "title": "Arrival & Beach Day",
    "weather_note": "32°C, partly cloudy",
    "activities": ["activity 1", "activity 2", "activity 3"],
    "meals": ["Breakfast at X", "Lunch at Y", "Dinner at Z"],
    "events": ["Event name if any"],
    "budget_tip": "practical tip for today"
  }}
]
"""


async def synthesizer_node(state: TravelState) -> dict:
    await emit_ws(state["session_id"], {
        "type": "agent_update",
        "agent": "synthesizer",
        "status": "running",
        "message": "Writing your itinerary..."
    })

    prompt = SYNTHESIZER_PROMPT.format(
        destination=state["destination"],
        origin=state.get("origin", "not specified"),
        start_date=state["start_date"],
        end_date=state["end_date"],
        travelers=state["travelers"],
        preferences=", ".join(state.get("preferences", [])),
        trip_intent=state.get("trip_intent", "leisure"),
        weather=json.dumps(state.get("weather_result"), indent=2) if state.get("weather_result") else "Not available",
        route=json.dumps(state.get("route_result"), indent=2) if state.get("route_result") else "Not available",
        budget=json.dumps(state.get("budget_result"), indent=2) if state.get("budget_result") else "Not available",
        events=json.dumps(state.get("events_result"), indent=2) if state.get("events_result") else "No events found"
    )

    # Add refinement context if this is a re-run
    messages = [("human", prompt)]
    if state.get("refinement_request"):
        messages.append(("human", f"REFINEMENT REQUEST: {state['refinement_request']}"))

    response = await llm.ainvoke(messages)
    full_output = response.content

    # Split markdown itinerary from day_plans JSON
    markdown_part = full_output
    day_plans = []

    if "```day_plans" in full_output:
        parts = full_output.split("```day_plans")
        markdown_part = parts[0].strip()
        json_raw = parts[1].replace("```", "").strip()
        try:
            day_plans = json.loads(json_raw)
        except json.JSONDecodeError:
            day_plans = []    # itinerary still works without structured day_plans

    # Save to database
    await save_itinerary(
        trip_id=state["trip_id"],
        weather_data=state.get("weather_result"),
        route_data=state.get("route_result"),
        budget_data=state.get("budget_result"),
        events_data=state.get("events_result"),
        day_plans=day_plans,
        ai_summary=markdown_part,
        raw_llm_output=full_output
    )

    await emit_ws(state["session_id"], {
        "type": "agent_update",
        "agent": "synthesizer",
        "status": "done",
        "message": "Your itinerary is ready!"
    })

    await emit_ws(state["session_id"], {
        "type": "planning_complete",
        "trip_id": state["trip_id"]
    })

    return {
        "itinerary_markdown": markdown_part,
        "day_plans": day_plans,
        "agent_status": {**state["agent_status"], "synthesizer": "done"}
    }
```

---

## 11. Wiring All Agents into LangGraph

```python
# backend/app/agents/graph.py

from langgraph.graph import StateGraph, END
from app.agents.state import TravelState
from app.agents.orchestrator import orchestrator_node
from app.agents.weather_agent import weather_agent_node
from app.agents.maps_agent import maps_agent_node
from app.agents.budget_agent import budget_agent_node
from app.agents.events_agent import events_agent_node
from app.agents.synthesizer import synthesizer_node


def should_refine(state: TravelState) -> str:
    """
    Conditional edge: if this is a refinement request,
    skip straight to the synthesizer. Otherwise run all agents.
    """
    if state.get("needs_refinement"):
        return "synthesizer"
    return "weather"


def build_travel_graph():
    graph = StateGraph(TravelState)

    # Register all nodes
    graph.add_node("orchestrator", orchestrator_node)
    graph.add_node("weather", weather_agent_node)
    graph.add_node("maps", maps_agent_node)
    graph.add_node("budget", budget_agent_node)
    graph.add_node("events", events_agent_node)
    graph.add_node("synthesizer", synthesizer_node)

    # Entry point
    graph.set_entry_point("orchestrator")

    # After orchestrator: branch based on refinement or fresh plan
    graph.add_conditional_edges(
        "orchestrator",
        should_refine,
        {
            "weather": "weather",       # fresh plan → run all agents
            "synthesizer": "synthesizer" # refinement → skip to synthesizer
        }
    )

    # Weather, Maps, Events run in parallel (no edges between them)
    graph.add_edge("weather", "synthesizer")
    graph.add_edge("maps", "budget")      # budget needs maps result
    graph.add_edge("budget", "synthesizer")
    graph.add_edge("events", "synthesizer")

    # End
    graph.add_edge("synthesizer", END)

    return graph.compile()


# Singleton — build once, reuse across requests
travel_graph = build_travel_graph()
```

---

## 12. Running the Graph from FastAPI

```python
# backend/app/api/v1/plan.py

from fastapi import APIRouter, BackgroundTasks, Depends
from app.agents.graph import travel_graph
from app.agents.state import TravelState
from app.dependencies import get_current_user

router = APIRouter()


async def run_planning_graph(state: TravelState):
    """
    Runs in a FastAPI background task.
    The graph streams via WebSocket — no return value needed here.
    """
    try:
        await travel_graph.ainvoke(state)
    except Exception as e:
        from app.api.websocket import emit_ws
        await emit_ws(state["session_id"], {
            "type": "error",
            "message": str(e)
        })


@router.post("/trips")
async def create_trip(
    trip_data: TripCreateRequest,
    background_tasks: BackgroundTasks,
    user=Depends(get_current_user)
):
    import uuid

    trip_id = str(uuid.uuid4())
    session_id = str(uuid.uuid4())

    # Save trip to DB first
    await crud.create_trip(trip_id=trip_id, user_id=user.id, **trip_data.dict())

    # Build initial state
    initial_state: TravelState = {
        "trip_id": trip_id,
        "session_id": session_id,
        "destination": trip_data.destination,
        "origin": trip_data.origin,
        "start_date": trip_data.start_date,
        "end_date": trip_data.end_date,
        "budget_inr": trip_data.budget_inr,
        "travelers": trip_data.travelers,
        "preferences": trip_data.preferences,
        "messages": [],
        "refinement_request": None,
        "destination_coords": None,
        "trip_intent": None,
        "weather_result": None,
        "route_result": None,
        "budget_result": None,
        "events_result": None,
        "itinerary_markdown": None,
        "day_plans": None,
        "agent_status": {
            k: "pending" for k in
            ["orchestrator", "weather", "maps", "budget", "events", "synthesizer"]
        },
        "error": None,
        "needs_refinement": False
    }

    # Fire graph in background — WebSocket handles streaming
    background_tasks.add_task(run_planning_graph, initial_state)

    return {"trip_id": trip_id, "session_id": session_id, "status": "planning"}
```

---

## 13. WebSocket Event Protocol

Every agent emits events in this shape. The frontend reads `type` to decide what to render.

```python
# backend/app/api/websocket.py

from fastapi import WebSocket
from typing import Dict
import json

# In-memory session store (replace with Redis for multi-instance)
active_connections: Dict[str, WebSocket] = {}


async def emit_ws(session_id: str, event: dict):
    ws = active_connections.get(session_id)
    if ws:
        try:
            await ws.send_json(event)
        except Exception:
            pass    # connection may have dropped — don't crash the agent


@router.websocket("/ws/plan/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    active_connections[session_id] = websocket
    try:
        while True:
            await websocket.receive_text()    # keep connection alive
    except:
        del active_connections[session_id]
```

### Event Types Reference

```json
// Agent running
{ "type": "agent_update", "agent": "weather", "status": "running", "message": "Checking forecast..." }

// Agent done
{ "type": "agent_update", "agent": "weather", "status": "done" }

// Agent skipped (e.g. no origin for maps)
{ "type": "agent_update", "agent": "maps", "status": "skipped" }

// Full planning complete
{ "type": "planning_complete", "trip_id": "uuid-here" }

// Error
{ "type": "error", "message": "Could not find destination" }
```

---

## 14. Refinement Loop

When the user sends a refinement message ("make Day 2 cheaper"), you re-run the graph but skip directly to the Synthesizer with existing agent data.

```python
@router.post("/plan/{trip_id}/refine")
async def refine_trip(
    trip_id: str,
    body: RefineRequest,
    background_tasks: BackgroundTasks,
    user=Depends(get_current_user)
):
    # Load existing itinerary from DB
    existing = await crud.get_trip_with_itinerary(trip_id)

    # Rebuild state with existing agent outputs + refinement flag
    state: TravelState = {
        **existing.to_state_dict(),
        "refinement_request": body.message,
        "needs_refinement": True,    # ← this triggers the conditional edge
        "session_id": str(uuid.uuid4())
    }

    background_tasks.add_task(run_planning_graph, state)

    return {"status": "refining", "session_id": state["session_id"]}
```

---

## 15. Redis Caching Layer

```python
# backend/app/cache/redis_client.py

import os, json
from upstash_redis import Redis

redis = Redis(
    url=os.getenv("UPSTASH_REDIS_REST_URL"),
    token=os.getenv("UPSTASH_REDIS_REST_TOKEN")
)


async def get_cache(key: str) -> dict | None:
    try:
        value = redis.get(key)
        if value:
            return json.loads(value)
    except Exception:
        pass
    return None


async def set_cache(key: str, value: dict, ttl: int = 3600):
    try:
        redis.setex(key, ttl, json.dumps(value))
    except Exception:
        pass    # caching failure should never crash an agent


async def delete_cache(key: str):
    try:
        redis.delete(key)
    except Exception:
        pass
```

### What to cache and for how long

| Data | TTL | Reason |
|------|-----|--------|
| Weather forecast | 6 hours | Changes slowly |
| Route/distance | 24 hours | Roads don't change |
| Events list | 12 hours | Events are updated occasionally |
| Geocoding result | 7 days | Cities don't move |
| Budget estimate | Do NOT cache | Depends on live state |

---

## 16. Testing Each Agent Individually

Before wiring everything into LangGraph, test each agent standalone.

```python
# tests/test_agents.py

import asyncio
from app.agents.state import TravelState

# Minimal state for testing
def mock_state(overrides: dict = {}) -> TravelState:
    base = {
        "trip_id": "test-123",
        "session_id": "sess-123",
        "destination": "Goa, India",
        "origin": "Delhi, India",
        "start_date": "2025-07-10",
        "end_date": "2025-07-14",
        "budget_inr": 30000,
        "travelers": 2,
        "preferences": ["beaches", "seafood"],
        "messages": [],
        "refinement_request": None,
        "destination_coords": {"lat": 15.2993, "lon": 74.1240},
        "trip_intent": "leisure",
        "weather_result": None,
        "route_result": None,
        "budget_result": None,
        "events_result": None,
        "itinerary_markdown": None,
        "day_plans": None,
        "agent_status": {},
        "error": None,
        "needs_refinement": False
    }
    return {**base, **overrides}


async def test_weather_agent():
    from app.agents.weather_agent import weather_agent_node
    state = mock_state()
    result = await weather_agent_node(state)
    assert "weather_result" in result
    assert "forecast" in result["weather_result"]
    print("✅ Weather agent passed")
    print(result["weather_result"]["summary"])


async def test_budget_agent():
    from app.agents.budget_agent import budget_agent_node
    state = mock_state({
        "route_result": {"distance_km": 1900, "duration_hours": 28}
    })
    result = await budget_agent_node(state)
    assert "budget_result" in result
    assert "total" in result["budget_result"]
    print("✅ Budget agent passed")
    print(f"Total: ₹{result['budget_result']['total']}")


if __name__ == "__main__":
    asyncio.run(test_weather_agent())
    asyncio.run(test_budget_agent())
```

Run with:
```bash
cd backend
python -m tests.test_agents
```

---

## 17. Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `KeyError: destination_coords` | Agent ran before Orchestrator completed | Check graph edge order; Orchestrator must always be `set_entry_point` |
| `JSONDecodeError` from Budget Agent | Gemini wrapped response in ```json | Strip fences before `json.loads()` — see Budget Agent code |
| `422` from ORS API | Coordinates in wrong order | ORS wants `[lon, lat]` not `[lat, lon]` |
| Nominatim returns empty list | Place name too specific or misspelled | Try with just city name, add country |
| `RecursionError` in LangGraph | Graph has a cycle with no exit condition | Add `recursion_limit=10` to `graph.compile()` |
| Ticketmaster returns no events | City name doesn't match their index | Try English name without state (e.g. "Goa" not "Goa, India") |
| WS event not received on frontend | `session_id` mismatch | Confirm `session_id` from `POST /trips` response is used in WS URL |
| Gemini `ResourceExhausted` | Hit 15 RPM free tier limit | Add `asyncio.sleep(4)` between LLM calls; cache aggressively |

---

## 18. Build Order Checklist

Build in this exact sequence — each step depends on the previous.

```
Phase 1 — Foundation
[ ] state.py — TravelState TypedDict
[ ] redis_client.py — get_cache, set_cache helpers
[ ] websocket.py — emit_ws, connection store
[ ] maps_tools.py — geocode_destination (used by 2 agents)

Phase 2 — Tool-Calling Agents (no LLM, easiest)
[ ] weather_agent.py — Open-Meteo
[ ] maps_agent.py — OpenRouteService
[ ] events_agent.py — Ticketmaster

Phase 3 — LLM Agents
[ ] orchestrator.py — Gemini + geocoding
[ ] budget_agent.py — Gemini structured output
[ ] synthesizer.py — Gemini full itinerary

Phase 4 — Graph Assembly
[ ] graph.py — wire all 6 nodes + edges
[ ] Test full graph locally with asyncio.run(travel_graph.ainvoke(initial_state))

Phase 5 — FastAPI Integration
[ ] plan.py — POST /trips triggers background task
[ ] plan.py — POST /plan/{id}/refine for refinement loop
[ ] Test with Postman: create trip → connect WS → watch agents fire

Phase 6 — Frontend Connection
[ ] useWebSocket.ts hook reads agent events
[ ] AgentProgressBar renders real-time status
[ ] Full end-to-end test
```

---

*Guide written for Itinera — AI Multi-Agent Travel Planner.*  
*Stack: LangGraph 0.2.x · LangChain 0.3.x · Gemini 1.5 Flash · FastAPI · Upstash Redis*
