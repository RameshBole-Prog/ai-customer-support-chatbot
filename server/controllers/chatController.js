const Chat = require("../models/Chat");
const axios = require("axios");

exports.sendMessage = async (req, res) => {
  try {
    const { message, chatId } = req.body;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant"
          },
          {
            role: "user",
            content: message
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const botReply = response.data.choices[0].message.content;

    const chat = new Chat({
      chatId,
      userMessage: message,
      botReply
    });

    await chat.save();

    res.json({ reply: botReply });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "AI error" });
  }
};

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find();

    // group by chatId
    const grouped = {};

    chats.forEach(chat => {
      if (!grouped[chat.chatId]) {
        grouped[chat.chatId] = [];
      }
      grouped[chat.chatId].push(chat);
    });

    res.json(grouped);

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};