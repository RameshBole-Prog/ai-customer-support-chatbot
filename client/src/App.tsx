import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const App = () => {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [chatId, setChatId] = useState(Date.now().toString());
  const [chatList, setChatList] = useState<string[]>([]);
  const [allChats, setAllChats] = useState<any>({});

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch chats
  useEffect(() => {
    axios.get("https://ai-customer-support-chatbot-on9i.onrender.com/api/chats")
      .then(res => {
        const data = res.data;

        setAllChats(data); // store all chats
        setChatList(prev => {
          const backendChats = Object.keys(data);

          // merge without losing new chat
          const merged = [...new Set([...prev, ...backendChats])];

          return merged;
        });

        if (data[chatId]) {
          setChats(data[chatId]);
        } else {
          setChats([]);
        }
      });
  }, [chatId]);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const sendMessage = async () => {
    if (!message) return;

    setLoading(true);

    try {
      const res = await axios.post("https://ai-customer-support-chatbot-on9i.onrender.com/api/chat", {
        message,
        chatId
      });

      const newChats = [
        ...chats,
        { userMessage: message, botReply: res.data.reply }
      ];

      setChats(newChats);

      // update sidebar if new chat
      if (!chatList.includes(chatId)) {
        setChatList([...chatList, chatId]);
      }

      setMessage("");
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className={darkMode ? "flex h-screen bg-gray-900 text-white" : "flex h-screen bg-gray-100"}>

      {/* Sidebar */}
      <div className={darkMode ? "w-64 bg-gray-800 p-4" : "w-64 bg-white p-4 border-r"}>
        <h2 className="text-lg font-bold mb-4">Chats</h2>

        <button
          onClick={() => {
            const newId = Date.now().toString();
            setChatId(newId);
            setChats([]);
            setChatList([...chatList, newId]);
          }}
        >
          + New Chat
        </button>

        <div className="space-y-2 overflow-y-auto max-h-[70vh]">
          {chatList.map((id) => {
            const chatMessages = allChats[id];

            return (
              <div
                key={id}
                onClick={() => setChatId(id)}
                className={`p-2 rounded cursor-pointer text-sm ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                  } ${chatId === id ? "border-2 border-blue-500" : ""}`}
              >
                {chatMessages?.[0]?.userMessage?.slice(0, 25) || "New Chat"}
              </div>
            );
          })}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mt-4 w-full p-2 rounded bg-black text-white"
        >
          Toggle {darkMode ? "Light" : "Dark"} Mode
        </button>
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <div className="p-4 text-center font-bold text-xl border-b">
          AI Chatbot
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {chats.map((chat, index) => (
            <div key={index}>

              {/* User */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-end items-end gap-2"
              >
                <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-xs">
                  {chat.userMessage}
                </div>
                <div className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full">
                  👨‍💻
                </div>
              </motion.div>

              {/* Bot */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-start items-end gap-2 mt-2"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-gray-400 rounded-full">
                  🤖
                </div>
                <div className={darkMode ? "bg-gray-700 px-4 py-2 rounded-lg max-w-xs" : "bg-white px-4 py-2 rounded-lg shadow max-w-xs"}>
                  {chat.botReply}
                </div>
              </motion.div>

            </div>
          ))}

          {/* Loader */}
          {loading && (
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
            </div>
          )}

          <div ref={chatEndRef}></div>

        </div>

        {/* Input */}
        <div className="p-4 flex gap-2 border-t">
          <input
            className={darkMode
              ? "flex-1 px-4 py-2 rounded bg-gray-700 text-white"
              : "flex-1 border px-4 py-2 rounded"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
};

export default App;