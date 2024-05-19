import {
  List,
  ListItem,
  Box,
  Typography,
  Avatar,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";

import { useEffect } from "react";
import useCrud from "../../hooks/useCrud";
import { Link, useParams } from "react-router-dom";
import { MEDIA_URL } from "../../config";

interface Server {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: string;
  banner: string;
}

const ExploreServers = () => {
  const { categoryName } = useParams();
  const url = categoryName ? `/servers/?category=${categoryName}` : "/servers/";
  const { dataCRUD, fetchData } = useCrud<Server>([], url);

  useEffect(() => {
    fetchData();
  }, [categoryName]);

  return (
    <>
      <Container maxWidth="lg">
        <Box sx={{ pt: 6 }}>
          <Typography
            variant="h3"
            noWrap
            component="h1"
            sx={{
              display: {
                sm: "block",
                fontWeight: "700",
                letterSpacing: "-2px",
                textTransform: "capitalize",
              },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            {categoryName ? categoryName : "Popular Servers"}
          </Typography>
          <Typography
            variant="h6"
            noWrap
            component="h2"
            color="textSecondary"
            sx={{
              display: {
                sm: "block",
                fontWeight: "700",
                letterSpacing: "-1px",
              },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            {categoryName
              ? `Servers related to ${categoryName}`
              : "Check out our popular servers"}
          </Typography>
        </Box>
        <Typography
          variant="h6"
          sx={{ pt: 6, pb: 1, fontWeight: 700, letterSpacing: "-1px" }}
        >
          Recommended Servers
        </Typography>
        <Grid container spacing={{ xs: 0, sm: 2 }}>
          {dataCRUD.map((server) => (
            <Grid item key={server.id} xs={12} sm={6} md={6} lg={4}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "none",
                  backgroundColor: "none",
                  borderRadius: 0,
                }}
              >
                <Link
                  to={`/servers/${server.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <CardMedia
                    component="img"
                    image={
                      server.banner
                        ? `${MEDIA_URL}${server.banner}`
                        : "https://source.unsplash.com/random"
                    }
                    alt="random"
                    sx={{ display: { xs: "none", sm: "block" } }}
                  />
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      p: 0,
                      "&: last-child": { paddingBottom: 0 },
                    }}
                  >
                    <List>
                      <ListItem disablePadding>
                        <ListItemIcon sx={{ minWidth: 0 }}>
                          <ListItemAvatar sx={{ minWidth: "50px" }}>
                            <Avatar
                              alt="server icon"
                              src={`${MEDIA_URL}${server.icon}`}
                            ></Avatar>
                          </ListItemAvatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              textAlign="start"
                              sx={{
                                fontWeight: 700,
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {server.name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2">
                              {server.category}
                            </Typography>
                          }
                        ></ListItemText>
                      </ListItem>
                    </List>
                  </CardContent>
                </Link>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default ExploreServers;
