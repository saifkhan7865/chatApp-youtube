import "./App.css";
import { io } from "socket.io-client";
const SOCKET_URL = "http://localhost:3000";
const { useEffect, useState } = require("react");

function App() {
  const MessageList = ({ messages }) => {
    return (
      <div className="message-list-container">
        <h1>Messages</h1>
        <ul className="message-list">
          {messages.map((message, index) => (
            <li
              key={index}
              className="message-item"
              style={{
                alignSelf: message.name === name ? "flex-end" : "flex-start",
              }}
            >
              <span className="message-author">{message.name}:</span>
              <span className="message-content">{message.message}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [roomText, setRoomText] = useState("");
  const [name, setName] = useState("");
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
      setInputMessage("");
    }
  };
  const socket = io.connect(SOCKET_URL, {
    // transports: ["websocket"],
  });

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("message", (msg) => {
      console.log("message: sent ", msg);

      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on("notification", (msg) => {
      alert(msg);
    });
  });

  const onSendMessage = (message) => {
    debugger;
    const newMessage = {
      name: name,
      message: message,
    };

    // emit message to the server with room

    socket.emit("messageRoom", {
      room: roomId,
      message: newMessage,
    });
  };
  const handleRoomGeneration = () => {
    // Generate a random room ID or implement your room generation logic here

    if (roomText === "" || name === "") {
      alert("Please enter a room ID and your name to join the chat room.");
      return;
    }
    socket.emit("join", {
      room: roomText,
      name: name,
    });
    setRoomId(roomText);
  };
  return (
    <div className="App">
      {roomId === "" && (
        <div className="room-container">
          <h1>Join Random chat application</h1>
          <div className="room-options">
            <input
              className="room-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />

            <input
              className="room-input"
              type="text"
              value={roomText}
              onChange={(e) => setRoomText(e.target.value)}
              placeholder="Enter your Room ID"
            />
            <button onClick={handleRoomGeneration} className="room-button">
              Join a random room
            </button>
          </div>
        </div>
      )}

      {roomId !== "" ? (
        <div className="message-area">
          <p>Hi there welcome to {roomId} find all the message over here</p>
          {console.log(messages, "wassup noobs")}
          <MessageList messages={messages} />
          <div className="message-input-container ">
            <input
              type="text"
              placeholder="Type your message here"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="message-input"
            />
            <button onClick={handleSendMessage} className="send-button">
              Send
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
export default App;
