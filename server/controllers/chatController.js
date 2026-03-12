exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    console.log("User message:", message);

    res.json({
      reply: "This is a dummy chatbot response"
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};