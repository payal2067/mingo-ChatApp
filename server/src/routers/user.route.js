import express from "express";
import { getAllUsers, updateProfile } from "../controllers/user.controller.js";
import { SendMessage, GetMessages } from "../controllers/message.controller.js";
import { Protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/allUsers", Protect, getAllUsers);
router.put("/profile", Protect, updateProfile);

router.post("/send-message", Protect, SendMessage);
router.get("/get-messages/:friendId", Protect, GetMessages);

export default router;
