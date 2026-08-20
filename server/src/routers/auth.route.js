import express from "express";
import { UserRegister, UserLogin } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", UserRegister);
router.post("/login", UserLogin);

export default router;
