import {
  StateSchema,
  MessagesValue,
  ReducedValue,
} from "@langchain/langgraph";
import { z } from "zod";

export const TripState = new StateSchema({

  messages: MessagesValue,

//   query: z.string(),

  source: z.string().optional(),

  destination: z.string().optional(),

  weather: z.any().optional(),

  route: z.any().optional(),

  hotels: z.array(z.any()).default([]),

  attractions: z.array(z.any()).default([]),

  itinerary: z.string().optional(),

  llmCalls: new ReducedValue(
    z.number().default(0),
    {
      reducer: (x, y) => x + y,
    }
  ),
});