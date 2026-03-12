const express = require("express");
const cors = require("cors");

const chatRoutes = require("./routes/chatRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", chatRoutes);

app.get("/", (req, res) => {
  res.send("Chatbot API is running...");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});