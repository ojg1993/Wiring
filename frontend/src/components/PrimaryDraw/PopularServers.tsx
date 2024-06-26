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

import { useEffect } from "react";
import useCrud from "../../hooks/useCrud";
import { Link } from "react-router-dom";
import { MEDIA_URL } from "../../config";

interface Server {
  id: number;
  name: string;
  category: string;
  icon: string;
  banner: string;
  num_members: number;
}

type Props = {
  open: boolean;
};

const PopularServers: React.FC<Props> = ({ open }) => {
  const { dataCRUD, fetchData } = useCrud<Server>(
    [],
    "/servers/?with_num_members=true"
  );
  const sortedData = dataCRUD.sort((a, b) => b.num_members - a.num_members);

  useEffect(() => {
    fetchData();
  }, []);

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
          Popular Servers
        </Typography>
      </Box>
      <List>
        {sortedData.map((server) => (
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
export default PopularServers;
