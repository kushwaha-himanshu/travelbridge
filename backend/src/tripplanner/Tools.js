import { TavilySearch } from "@langchain/tavily";
import dotenv from "dotenv";

dotenv.config();
import axios from "axios";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
// // Create a new instance of the TavilySearch tool.
// // Find useful travel information.
const travelytool = new TavilySearch({
    tavilapikey: process.env.TAVILY_API_KEY,
  maxResults: 2,
  // You can set other constructor parameters here, e.g.:
  // topic: "general",
  // includeAnswer: false,
  // includeRawContent: false,
  // includeImages: false,
  // searchDepth: "basic",
});

// Invoke with a query
// const results = await travelytool.invoke({
//   query: "what is leetcode",
// });

// console.log(results);


//openroutesearch

const openRouteTool = tool(
  async ({ origin, destination }) => {

    const response = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car",
      {
       coordinates: [
    [origin[1], origin[0]],
    [destination[1], destination[0]]
]
      },
      {
        headers: {
          Authorization: process.env.ORS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const summary = response.data.routes[0].summary;

    return {
      distance: summary.distance / 1000,
      duration: summary.duration / 3600,
    };

  },
  {
    name: "route_search",
    description: "Find driving distance and travel duration between two coordinates.",
    schema: z.object({
      origin: z.array(z.number()),
      destination: z.array(z.number()),
    }),
  }
);
      


//get weather
const weatherTool = tool(
  async ({ latitude, longitude }) => {

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code`;

      const response = await axios.get(url);

      return response.data.current;

  },
  {
      name: "weather",
      description: "Get current weather for a latitude and longitude.",
      schema: z.object({
          latitude: z.number(),
          longitude: z.number(),
      }),
  }
);

//geocode
const geocodeTool = tool(
  async ({ city }) => {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      city
    )}&count=1`;

    const response = await axios.get(url);

    if (!response.data.results?.length) {
      return {
        error: "Location not found",
      };
    }

    const place = response.data.results[0];

    return {
      city: place.name,
      country: place.country,
      latitude: place.latitude,
      longitude: place.longitude,
    };
  },
  {
    name: "geocode",
    description:
      "Convert a city name into latitude and longitude.",
    schema: z.object({
      city: z.string(),
    }),
  }
);

const toolsByName = {
    weather: weatherTool,
    route_search: openRouteTool,
    tavily_search: travelytool,
    geocode: geocodeTool
};


const tools = Object.values(toolsByName);
export  {tools,toolsByName};
