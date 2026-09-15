import requests
from typing import List, Dict, Any

def weather_description(code: int) -> str:
    descriptions = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Foggy",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Light rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Slight snow fall",
        73: "Moderate snow fall",
        75: "Heavy snow fall",
        80: "Rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        95: "Thunderstorm",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail"
    }
    return descriptions.get(code, "Clear conditions")

def get_weather(
    latitude: float,
    longitude: float,
    forecast_days: int = 7
) -> List[Dict[str, Any]]:
    """
    Fetches real-time multi-day weather forecast from Open-Meteo API.
    """
    if latitude is None or longitude is None:
        return []

    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "daily": ",".join([
            "weather_code",
            "temperature_2m_max",
            "temperature_2m_min",
            "precipitation_probability_max",
            "precipitation_sum"
        ]),
        "forecast_days": max(1, min(forecast_days, 14)),
        "timezone": "auto"
    }

    try:
        response = requests.get(url, params=params, timeout=12)
        response.raise_for_status()
        data = response.json()
        daily = data.get("daily", {})

        dates = daily.get("time", [])
        weather_list = []

        for i, date in enumerate(dates):
            code = daily.get("weather_code", [0])[i] if i < len(daily.get("weather_code", [])) else 0
            t_max = daily.get("temperature_2m_max", [22.0])[i] if i < len(daily.get("temperature_2m_max", [])) else 22.0
            t_min = daily.get("temperature_2m_min", [15.0])[i] if i < len(daily.get("temperature_2m_min", [])) else 15.0
            precip_prob = daily.get("precipitation_probability_max", [0])[i] if i < len(daily.get("precipitation_probability_max", [])) else 0
            precip_sum = daily.get("precipitation_sum", [0.0])[i] if i < len(daily.get("precipitation_sum", [])) else 0.0

            weather_list.append({
                "date": date,
                "weather_code": code,
                "condition": weather_description(code),
                "temperature_max": round(float(t_max), 1) if t_max is not None else 22.0,
                "temperature_min": round(float(t_min), 1) if t_min is not None else 15.0,
                "precipitation_probability": float(precip_prob) if precip_prob is not None else 0.0,
                "precipitation_sum": float(precip_sum) if precip_sum is not None else 0.0
            })

        return weather_list
    except Exception as e:
        print(f"[Weather Tool] Error fetching weather: {e}")
        return []