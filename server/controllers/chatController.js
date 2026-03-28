const Chat = require("../models/Chat");
const axios = require("axios");

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
      {
        role: "system",
        content: "You are a helpful and accurate assistant. Give correct answers. If unsure, say you don't know."
      },
      {
        role: "user",
        content: message
      }
    ],
    temperature: 0.3
  },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const botReply = response.data.choices[0].message.content;

    // Save to DB
    const chat = new Chat({
      userMessage: message,
      botReply: botReply
    });

    await chat.save();

    res.json({ reply: botReply });

  } catch (error) {
    console.error("AI ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "AI error" });
  }
};

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: 1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};