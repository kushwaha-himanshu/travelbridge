import express from "express";
import createHistory from "../controllers/history.controller.js"

const router = express.Router();

router.post(
    "/history",
    createHistory
);

export default router;

