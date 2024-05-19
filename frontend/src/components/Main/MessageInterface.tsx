import { useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { WS_ROOT } from "../../config";
import useCrud from "../../hooks/useCrud";
import { Server } from "../../@types/server";
import { Box, Typography } from "@mui/material";
import ChannelInterface from "./MessageChannelInterface";

interface ServerChannelsProps {
  data: Server[];
}

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

const MessageInterface = (props: ServerChannelsProps) => {
  const { data } = props;
  const server_name = data?.[0]?.name ?? "Server";
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
    <>
      <ChannelInterface data={data} />
      {channelId == undefined ? (
        <Box
          sx={{
            overflow: "hidden",
            p: { xs: 0 },
            height: `calc(80vh)`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h4"
              fontWeight={700}
              letterSpacing={"-0.5px"}
              sx={{ px: 5, maxWidth: "600px" }}
            >
              Welcome to {server_name}
            </Typography>
            <Typography>
              {data?.[0]?.description ?? `This is home of ${server_name}`}
            </Typography>
          </Box>
        </Box>
      ) : (
        <>
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
        </>
      )}
    </>
  );
};

export default MessageInterface;
