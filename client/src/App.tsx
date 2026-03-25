import { useState, useEffect } from "react";

const App = () => {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<any[]>([]);

  // Fetch chat history
  useEffect(() => {
    fetch("http://localhost:5000/api/chats")
      .then(res => res.json())
      .then(data => setChats(data));
  }, []);

  // Send message
  const sendMessage = async () => {
    if (!message) return;

    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    // update UI instantly
    setChats([
      ...chats,
      { userMessage: message, botReply: data.reply }
    ]);

    setMessage("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>AI Chatbot</h2>

      <div style={{ marginBottom: "20px" }}>
        {chats.map((chat, index) => (
          <div key={index}>
            <p><strong>You:</strong> {chat.userMessage}</p>
            <p><strong>Bot:</strong> {chat.botReply}</p>
            <hr />
          </div>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message"
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default App;