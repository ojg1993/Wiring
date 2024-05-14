import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "./templates/PrimaryAppBar";
import PrimaryDraw from "./templates/PrimaryDraw";
import SecondaryDraw from "./templates/SecondaryDraw";
import Main from "./templates/Main";
import PopularServers from "../components/PrimaryDraw/PopularServers";

const Home = () => {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <PrimaryAppBar />
        <PrimaryDraw>
          <PopularServers />
        </PrimaryDraw>
        <SecondaryDraw />
        <Main />
      </Box>
    </>
  );
};

export default Home;
