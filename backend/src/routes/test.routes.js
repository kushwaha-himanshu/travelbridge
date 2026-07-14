import express from "express";
import { graph } from "../tripplanner/graph.js";
import { HumanMessage } from "@langchain/core/messages";

const router = express.Router();

const app = graph.compile();

router.get("/chatcompletion", async (req, res) => {
  try {
    const result = await app.invoke({
      messages: [
        new HumanMessage(
          "tell me weather of atarra(U.P.)"
        ),
      ],
    });

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
});

export default router;