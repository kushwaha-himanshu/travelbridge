import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import {tools} from "./Tools.js";
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY, // Default value.
  model: "llama-3.3-70b-versatile",
});

// const message = new HumanMessage("What color is the sky?");

// const res = await model.invoke([message]);
// console.log(res);

export const modelWithTools = model.bindTools(tools);