import express from"express";
import {createPaymentOrder }from "../controllers/paymen.controller.js"
import    {verifyPayment,getPaymentdetails} from "../controllers/paymen.controller.js"
import { verifyJwt } from "../middlewares/authMiddleware.js";


    const router=express.Router();

    router.post("/create-order",createPaymentOrder)
    router.post("/verify-payment",verifyPayment)
    router.get("/payment/:id", getPaymentdetails);

    export default router