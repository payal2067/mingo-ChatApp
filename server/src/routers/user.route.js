import express from "express";
import {
  getAllUsers,
  updateProfile,
  addContact,
  removeContact,
} from "../controllers/user.controller.js";
import { SendMessage, GetMessages } from "../controllers/message.controller.js";
import { Protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/allUsers", Protect, getAllUsers);
router.put("/profile", Protect, updateProfile);
router.post("/add-contact", Protect, addContact);
router.delete("/remove-contact/:contactUserId", Protect, removeContact);

router.post("/send-message", Protect, SendMessage);
router.get("/get-messages/:friendId", Protect, GetMessages);

export default router;
