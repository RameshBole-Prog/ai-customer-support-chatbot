const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true
  },
  userMessage: String,
  botReply: String
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);