import { useContext } from "react";
import { DarkModeContext } from "../../../context/DarkModeContext";
import { useTheme } from "@mui/material/styles";
import { IconButton, Typography } from "@mui/material";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import Brightness4Icon from "@mui/icons-material/Brightness4";

const DarkModeSwitch = () => {
  const theme = useTheme();
  const colorMode = useContext(DarkModeContext);

  return (
    <>
      <Brightness4Icon sx={{ marginRight: "6px", fontSize: "20px" }} />

      <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
        Dark mode
      </Typography>
      <IconButton
        sx={{ m: 0, p: 0, pl: 2 }}
        onClick={colorMode.toggleMode}
        color="inherit"
      >
        {theme.palette.mode === "dark" ? (
          <ToggleOnIcon sx={{ fontSize: "2.5rem" }} />
        ) : (
          <ToggleOffIcon sx={{ fontSize: "2.5rem", p: 0 }} />
        )}
      </IconButton>
    </>
  );
};

export default DarkModeSwitch;
