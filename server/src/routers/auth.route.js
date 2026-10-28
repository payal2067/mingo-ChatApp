import express from "express";
import { UserRegister, UserLogin, UserForgotPassword, UserVerifyOTP, UserResetPassword } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", UserRegister);
router.post("/login", UserLogin);
router.post("/forgot-password", UserForgotPassword);
router.post("/verify-otp", UserVerifyOTP);
router.post("/reset-password", UserResetPassword);

export default router;
