import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";

function App() {
  // backend
  const [socket, setSocket] = useState(null);
  // fontend 
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "assistant",
      text: "Hello! I am your chat assistant. Send me a message to start the conversation.",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (event) => {
    event.preventDefault();

    const text = input.trim();
    if (!text || !socket) return;

    const newMessage = {
      id: Date.now(),
      sender: "user",
      text,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    socket.emit("ai-message", text);

    setInput("");
  };

  //backend
  
  useEffect(() => {
    const socketInstance = io("http://localhost:3000");
    setSocket(socketInstance);

    socketInstance.on("ai-message-response", (response) => {
      const botMessage = {
        id: Date.now(),
        sender: "assistant",
        text: response,
      };

      setMessages((prev) => [...prev, botMessage]);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <div className="chat-app">
      <div className="chat-window">
        <header className="chat-header">
          <div>
            <p className="eyebrow">Live chat</p>
            <h1>Support Chat</h1>
          </div>
          <span className="status">Online</span>
        </header>

        <div className="message-list">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === "user" ? "user" : "assistant"}`}
            >
              <div className="message-content">
                <span className="message-label">
                  {message.sender === "user" ? "You" : "Assistant"}
                </span>
                <div className="message-bubble">{message.text}</div>
              </div>
            </div>
          ))}
        </div>

        <form className="composer" onSubmit={handleSend}>
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type your message..."
            aria-label="Type your message"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
