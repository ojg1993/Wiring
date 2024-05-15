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
  Avatar,
} from "@mui/material";

import useCrud from "../../hooks/useCrud";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MEDIA_URL } from "../../config";

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
}

const ExploreCategories = () => {
  const theme = useTheme();
  const { dataCRUD, error, isLoading, fetchData } = useCrud<Category>(
    [],
    "/categories/"
  );

  useEffect(() => {
    fetchData();
  }, []);

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
        Explore
      </Box>
      <List sx={{ py: 0 }}>
        {dataCRUD.map((category) => (
          <ListItem
            disablePadding
            key={category.id}
            sx={{
              display: "block",
              textTransform: "capitalize",
            }}
            dense={true}
          >
            <Link
              to={`/servers/${category.name}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton sx={{ minHeight: 48 }}>
                <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                  <ListItemAvatar sx={{ minHeight: "0px" }}>
                    <img
                      alt="Server Icon"
                      src={`${MEDIA_URL}${category.icon}`}
                      style={{
                        width: "25px",
                        height: "25px",
                        display: "block",
                        margin: "auto",
                      }}
                    />
                  </ListItemAvatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      textAlign="start"
                      paddingLeft={1}
                    >
                      {category.name}
                    </Typography>
                  }
                />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default ExploreCategories;
