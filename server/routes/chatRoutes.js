const express = require("express");
const router = express.Router();

const { sendMessage, getChats } = require("../controllers/chatController");

router.post("/chat", sendMessage);
router.get("/chats", getChats);

module.exports = router;