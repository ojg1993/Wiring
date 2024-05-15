import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "./templates/PrimaryAppBar";
import PrimaryDraw from "./templates/PrimaryDraw";
import SecondaryDraw from "./templates/SecondaryDraw";
import Main from "./templates/Main";
import PopularServers from "../components/PrimaryDraw/PopularServers";
import ExploreCategories from "../components/SecondaryDraw/ExploreCategories";
import ExploreServers from "../components/Main/ExploreServers";

const Explore = () => {
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
        <Main>
          <ExploreServers />
        </Main>
      </Box>
    </>
  );
};

export default Explore;
