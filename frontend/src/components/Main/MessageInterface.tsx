import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { Server } from "../../@types/server";
import { useTheme } from "@mui/material";
import ChannelInterface from "./MessageChannelInterface";
import Scroll from "./Scroll";
import SendIcon from "@mui/icons-material/Send";
import useChatWebSocket from "../../services/chatService";
import { useMembershipContext } from "../../context/MembeshiprContext";

interface ServerChannelsProps {
  data: Server[];
}

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

interface SendMessage {
  type: string;
  message: string;
  [key: string]: any;
}

const MessageInterface = (props: ServerChannelsProps) => {
  const { data } = props;
  const { isUserMember } = useMembershipContext();
  const theme = useTheme();
  const server_name = data?.[0]?.name ?? "Server";
  const { serverId, channelId } = useParams();
  const { newMessage, message, setMessage, sendJsonMessage } = useChatWebSocket(
    serverId || "",
    channelId || ""
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message === "") {
      return;
    } else {
      sendJsonMessage({ type: "message", message } as SendMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && message !== "") {
      e.preventDefault();
      sendJsonMessage({ type: "message", message } as SendMessage);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (message !== "") {
      e.preventDefault();
      sendJsonMessage({ type: "message", message } as SendMessage);
    }
  };

  function formatTimeStamp(timestamp: string): string {
    const date = new Date(Date.parse(timestamp));
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
    const formattedTime = date.toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return formattedDate + " " + formattedTime;
  }

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
          <Box sx={{ overflow: "hidden", p: 0, height: `calc(100vh - 100px)` }}>
            <Scroll>
              <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                {newMessage.map((msg: Message, index: number) => {
                  return (
                    <ListItem key={index} alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar alt="user img"></Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primaryTypographyProps={{
                          fontSize: "12px",
                          variant: "body2",
                        }}
                        primary={
                          <>
                            <Typography
                              component="span"
                              variant="body1"
                              color="text.primary"
                              sx={{ display: "inline", fontWeight: 600 }}
                            >
                              {msg.sender}
                            </Typography>
                            <Typography
                              component="span"
                              variant="caption"
                              color="textSecondary"
                              paddingLeft={1}
                            >
                              {formatTimeStamp(msg.timestamp)}
                            </Typography>
                          </>
                        }
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body1"
                              color="text.primary"
                              sx={{
                                overflow: "visible",
                                whiteSpace: "nomal",
                                textOverflow: "clip",
                                display: "inline",
                                lineHeight: "1.2",
                                fontWeight: 400,
                                letterSpacing: "-0.2px",
                              }}
                            >
                              {msg.content}
                            </Typography>
                          </>
                        }
                      ></ListItemText>
                    </ListItem>
                  );
                })}
              </List>
            </Scroll>
          </Box>
          <Box sx={{ position: "sticky", bottom: 0, width: "100%" }}>
            <form
              onSubmit={handleSubmit}
              style={{
                bottom: 0,
                right: 0,
                padding: "1rem",
                backgroundColor: theme.palette.background.default,
                zIndex: 1,
              }}
            >
              {isUserMember && (
                <Box sx={{ display: "flex" }}>
                  <TextField
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    fullWidth
                    multiline
                    minRows={1}
                    maxRows={4}
                    sx={{ flexGrow: 1 }}
                    onKeyDown={handleKeyDown}
                  />
                  <Button
                    sx={{
                      border: "1px solid grey",
                      borderRadius: "0.5rem",
                      ml: 1,
                    }}
                    endIcon={<SendIcon sx={{ color: "grey" }} />}
                    onClick={handleClick}
                  >
                    <Typography
                      variant="button"
                      sx={{ fontWeight: 600, color: "grey" }}
                    >
                      Send
                    </Typography>
                  </Button>
                </Box>
              )}
            </form>
          </Box>
        </>
      )}
    </>
  );
};

export default MessageInterface;
