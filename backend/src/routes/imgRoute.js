import express from "express"
import upload from "../middlewares/upload.js";
import { uploadImage } from "../controllers/img.controller.js";

const router =express.Router();

router.post(
    "/upload-img",
    upload.single("image"),
    uploadImage
);

export default router;