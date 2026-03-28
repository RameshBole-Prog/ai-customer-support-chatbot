import { useState, useEffect, useRef } from "react";

const App = () => {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/chats")
      .then(res => res.json())
      .then(data => setChats(data));
  }, []);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const sendMessage = async () => {
    if (!message) return;

    setLoading(true);

    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    setChats([
      ...chats,
      { userMessage: message, botReply: data.reply }
    ]);

    setMessage("");
    setLoading(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* Header */}
      <div className="bg-blue-600 text-white p-4 text-xl font-bold text-center">
        AI Chatbot
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {chats.map((chat, index) => (
          <div key={index}>

            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-xs">
                {chat.userMessage}
              </div>
            </div>

            {/* Bot Message */}
            <div className="flex justify-start mt-2">
              <div className="bg-white px-4 py-2 rounded-lg shadow max-w-xs">
                {chat.botReply}
              </div>
            </div>

          </div>
        ))}

        {/* Loader */}
        {loading && (
          <div className="text-gray-500 text-sm">Typing...</div>
        )}

        <div ref={chatEndRef}></div>

      </div>

      {/* Input */}
      <div className="p-4 bg-white flex gap-2">
        <input
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>

    </div>
  );
};

export default App;