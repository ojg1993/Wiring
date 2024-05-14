import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "./templates/PrimaryAppBar";
import PrimaryDraw from "./templates/PrimaryDraw";
import SecondaryDraw from "./templates/SecondaryDraw";
import Main from "./templates/Main";
import PopularServers from "../components/PrimaryDraw/PopularServers";
import ExploreCategories from "../components/SecondaryDraw/ExploreCategories";

const Home = () => {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <PrimaryAppBar />
        <PrimaryDraw>
          <PopularServers open={false} />
        </PrimaryDraw>
        <SecondaryDraw>
          <ExploreCategories />
        </SecondaryDraw>
        <Main />
      </Box>
    </>
  );
};

export default Home;
