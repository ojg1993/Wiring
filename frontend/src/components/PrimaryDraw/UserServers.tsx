import {
  List,
  ListItem,
  ListItemButton,
  Box,
  Typography,
  Avatar,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { Link } from "react-router-dom";
import { MEDIA_URL } from "../../config";
import { Server } from "../../@types/server.d";

interface UserServersProps {
  data: Server[];
}

type Props = {
  open: boolean;
};

const UserServers: React.FC<Props & UserServersProps> = ({ open, data }) => {
  return (
    <>
      <Box
        sx={{
          height: 50,
          p: 2,
          display: "flex",
          alighnItems: "center",
          flex: "1 1 100%",
        }}
      >
        <Typography sx={{ display: open ? "block" : "none" }}>
          Current Servers
        </Typography>
      </Box>
      <List>
        {data.map((server) => (
          <ListItem
            key={server.id}
            disablePadding
            sx={{ display: "block" }}
            dense={true}
          >
            <Link
              to={`/servers/${server.id}/`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton sx={{ minHeight: 0 }}>
                <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                  <ListItemAvatar sx={{ minWidth: "50" }}>
                    <Avatar
                      alt="Server Icon"
                      src={`${MEDIA_URL}${server.icon}`}
                    />
                  </ListItemAvatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        lineHeight: 1.2,
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {server.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        lineHeight: 1.2,
                        color: "textSecondary",
                      }}
                    >
                      {server.category}
                    </Typography>
                  }
                  sx={{ opacity: open ? 1 : 0 }}
                  primaryTypographyProps={{
                    sx: {
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    },
                  }}
                ></ListItemText>
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </>
  );
};
export default UserServers;
