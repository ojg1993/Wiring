import { useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { WS_ROOT } from "../../config";

const MessageInterface = () => {
  const [newMessage, setNewMessage] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const { serverId, channelId } = useParams();

  const socketUrl = channelId ? `${WS_ROOT}/${serverId}/${channelId}/` : null;

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log("Connected"),
    onClose: () => console.log("Disconnected"),
    onError: (event) => console.error("error:", event),
    onMessage: (msg) => {
      const data = JSON.parse(msg.data);
      setNewMessage((prev_msg) => [...prev_msg, data.new_message]);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendJsonMessage({ type: "message", message });
    setMessage("");
  };

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
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
};

export default MessageInterface;
