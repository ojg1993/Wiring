import {
  List,
  ListItem,
  ListItemButton,
  Box,
  useTheme,
  Typography,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";

import { Link } from "react-router-dom";
import { MEDIA_URL } from "../../config";
import { Server } from "../../@types/server.d";
import { useState } from "react";

interface ServerChannelsProps {
  data: Server[];
}

const ServerChannels = (props: ServerChannelsProps) => {
  const { data } = props;
  const [selectedChannel, setSelectedChannel] = useState<number | null>(null);
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          height: "50px",
          display: "flex",
          alignItems: "center",
          px: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          position: "sticky",
          top: 0,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography
          variant="body1"
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          Available Channels
        </Typography>
      </Box>
      <List sx={{ py: 0 }}>
        {data.flatMap((obj) =>
          obj.channel_server.map((channel) => (
            <ListItem
              disablePadding
              key={channel.id}
              sx={{
                display: "block",
                textTransform: "capitalize",
                maxHeight: "40px",
              }}
              dense={true}
            >
              <Link
                to={`/servers/${channel.server}/${channel.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
                onClick={() => setSelectedChannel(channel.id)}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                  }}
                  selected={selectedChannel === channel.id}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        textAlign="start"
                        paddingLeft={1}
                      >
                        {channel.name}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))
        )}
      </List>
    </>
  );
};

export default ServerChannels;
