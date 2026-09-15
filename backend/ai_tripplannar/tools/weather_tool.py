import requests


def get_weather(
    latitude: float,
    longitude: float,
    forecast_days: int = 7
):

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
        "forecast_days": forecast_days,
        "timezone": "auto"
    }

    response = requests.get(
        url,
        params=params,
        timeout=20
    )

    response.raise_for_status()

    data = response.json()

    daily = data.get("daily", {})

    weather = []

    dates = daily.get("time", [])

    for i, date in enumerate(dates):

        weather.append({
            "date": date,

            "weather_code": daily.get(
                "weather_code", []
            )[i],

            "temperature_max": daily.get(
                "temperature_2m_max", []
            )[i],

            "temperature_min": daily.get(
                "temperature_2m_min", []
            )[i],

            "precipitation_probability": daily.get(
                "precipitation_probability_max", []
            )[i],

            "precipitation_sum": daily.get(
                "precipitation_sum", []
            )[i]
        })

    return weather



def weather_description(code):

    descriptions = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Foggy",
        48: "Foggy",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Light rain",
        63: "Moderate rain",
        65: "Heavy rain",
        80: "Rain showers",
        81: "Moderate rain showers",
        82: "Heavy rain showers",
        95: "Thunderstorm",
        96: "Thunderstorm with hail",
        99: "Thunderstorm with heavy hail"
    }

    return descriptions.get(
        code,
        "Unknown weather"
    )

    

 