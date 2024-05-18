import { useState } from "react";
import useWebSocket from "react-use-websocket";

const socketUrl = "ws://localhost:8000/ws/test/";

const Server = () => {
  const [newMessage, setNewMessage] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log("Connected"),
    onClose: () => console.log("Disconnected"),
    onError: (event) => console.error("error:", event),
    onMessage: (msg) => {
      const data = JSON.parse(msg.data);
      setNewMessage((prev_msg) => [...prev_msg, data.new_message]);
      setMessage("");
    },
  });

  return (
    <div>
      {newMessage.map((msg, index) => {
        return (
          <div key={index}>
            <p>{msg.content}</p>
          </div>
        );
      })}
      <form>
        <label>
          Enter Message:
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
      </form>
      <button onClick={sendJsonMessage({ type: "message", message })}>
        Send
      </button>
    </div>
  );
};

export default Server;
