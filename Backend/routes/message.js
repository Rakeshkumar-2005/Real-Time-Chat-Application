import express from "express";
import { sendMessage,getMessages} from "../controllers/messagerouteController.js";
// import { getUserBySearch } from "../controllers/userhandlerController.js";
import isLogin from "../middleware/isLogin.js";

const router = express.Router();
// router.get("/users", isLogin, getUserBySearch);
// router.get("/currentchatters", isLogin, getCurrentChatters);

router.post("/send/:id", isLogin, sendMessage);
router.get("/:id", isLogin, getMessages);


export default router;

