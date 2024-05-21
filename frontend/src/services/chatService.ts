import { WS_ROOT } from "../config";
import { useState } from "react";
import { useAuthService } from "../services/AuthServices";
import useWebSocket from "react-use-websocket";
import useCrud from "../hooks/useCrud";
import { Server } from "../@types/server";

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

const useChatWebSocket = (serverId: string, channelId: string) => {
    const [newMessage, setNewMessage] = useState<Message[]>([]);
    const [message, setMessage] = useState("");
    const { logout, refreshAccessToken } = useAuthService();
    const { fetchData } = useCrud<Server>(
        [],
        `/messages/?channel_id=${channelId}`
    );
    
    const socketUrl = channelId
        ? `${WS_ROOT}/${serverId}/${channelId}/`
        : null;

    const [reconnectionCount, setReconnectionCount] = useState(0);
    const maxConnectionAttempts = 3;

    const { sendJsonMessage } = useWebSocket(socketUrl, {
        onOpen: async () => {
            try {
                const data = await fetchData();
                setNewMessage([]);
                setNewMessage(Array.isArray(data) ? data : []);
                console.log("Connected");
            } catch (error) {
                console.log("Error:", error);
            }
        },
        onClose: (event) => {
            if (event.code === 4001) {
                console.log("Authentication Failed");
                refreshAccessToken().catch((error) => {
                    if (error.response && error.response.status === 401) {
                        logout();
                    }
                });
            }
            console.log("Disconnected");
            setReconnectionCount((prev) => prev + 1);
        },
        onError: (event) => console.error("error:", event),
        onMessage: (msg) => {
            const data = JSON.parse(msg.data);
            setNewMessage((prev_msg) => [...prev_msg, data.new_message]);
            setMessage("");
        },
        shouldReconnect: (closeEvent) => {
            if (
                closeEvent.code === 4001 &&
                reconnectionCount >= maxConnectionAttempts
            ) {
                setReconnectionCount(0);
                return false;
            } else {
                return true;
            }
        },
        reconnectInterval: 1000,
    });

    return {newMessage, message, setMessage, sendJsonMessage}
}

export default useChatWebSocket;