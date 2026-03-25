const Chat = require("../models/Chat");

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    // Dummy bot response (we will replace with AI later)
    const botReply = "This is a dummy chatbot response";

    // Save to MongoDB
    const chat = new Chat({
      userMessage: message,
      botReply: botReply
    });

    await chat.save();

    res.json({
      reply: botReply
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: 1 });

    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};