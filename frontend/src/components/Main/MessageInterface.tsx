import { useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { WS_ROOT } from "../../config";
import useCrud from "../../hooks/useCrud";
import { Server } from "../../@types/server";

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

const MessageInterface = () => {
  const [newMessage, setNewMessage] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const { serverId, channelId } = useParams();
  const { fetchData } = useCrud<Server>(
    [],
    `/messages/?channel_id=${channelId}`
  );

  const socketUrl = channelId ? `${WS_ROOT}/${serverId}/${channelId}/` : null;

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen: async () => {
      try {
        const data = await fetchData();
        setNewMessage([]);
        setNewMessage(Array.isArray(data) ? data : []);
        console.log("Connected");
      } catch (error) {
        console.error("Error:", error);
      }
    },
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
      {newMessage.map((msg: Message, index: number) => {
        return (
          <div key={index}>
            <p>{msg.sender}</p>
            <p>{msg.content}</p>
            <p>{msg.timestamp}</p>
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
