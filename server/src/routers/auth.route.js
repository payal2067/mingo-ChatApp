import express from "express";
import { UserRegister, UserLogin, UserForgotPassword, UserVerifyOTP } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", UserRegister);
router.post("/login", UserLogin);
router.post("/forgot-password", UserForgotPassword);
router.post("/verify-otp", UserVerifyOTP);

export default router;
