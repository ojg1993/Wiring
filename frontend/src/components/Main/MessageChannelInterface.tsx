import {
  AppBar,
  Toolbar,
  Box,
  ListItemAvatar,
  Avatar,
  Typography,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Server } from "../../@types/server";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ServerChannels from "../SecondaryDraw/ServerChannels";
import { MEDIA_URL } from "../../config";
import JoinServerButton from "../Membership/JoinServerButton";

interface ServerChannelsProps {
  data: Server[];
}

const MessageChannelInterface = (props: ServerChannelsProps) => {
  const { data } = props;
  const theme = useTheme();
  const { serverId, channelId } = useParams();
  const [sideMenu, setSideMenu] = useState(false);

  const channelName =
    data
      ?.find((server) => server.id == Number(serverId))
      ?.channel_server?.find((channel) => channel.id == Number(channelId))
      ?.name || "home";

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setSideMenu(open);
    };

  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    if (isSmallScreen && sideMenu) {
      setSideMenu(false);
    }
  }, [isSmallScreen]);

  const channelList = () => (
    <Box
      sx={{ paddingTop: `${theme.primaryAppBar.height}px`, minWidth: 200 }}
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <ServerChannels data={data} />
    </Box>
  );
  return (
    <>
      <AppBar
        sx={{
          backgroundColor: theme.palette.background.default,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
        color="default"
        position="sticky"
        elevation={0}
      >
        <Toolbar
          variant="dense"
          sx={{
            minHeight: theme.primaryAppBar.height,
            height: theme.primaryAppBar.height,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            <ListItemAvatar sx={{ minWidth: "40px" }}>
              <Avatar
                src={`${MEDIA_URL}${data?.[0]?.icon}`}
                alt="server-icon"
                sx={{ width: "30px", height: "30px" }}
              />
            </ListItemAvatar>
          </Box>
          <Typography noWrap component="div">
            {channelName}
          </Typography>
          <Box sx={{ flexGrow: 1 }}></Box>
          <JoinServerButton />
          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            <IconButton color="inherit" edge="end" onClick={toggleDrawer(true)}>
              <MoreVertIcon />
            </IconButton>
          </Box>
          <Drawer anchor="right" open={sideMenu} onClose={toggleDrawer(false)}>
            {channelList()}
          </Drawer>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default MessageChannelInterface;
