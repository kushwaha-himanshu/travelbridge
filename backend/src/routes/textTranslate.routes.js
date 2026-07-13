import { textTranslatefxn } from "../controllers/textTranslate.controller.js";

import express from "express"

const router =express.Router();

router.post(
    "/uplaod-text",
    textTranslatefxn
);

export default router;