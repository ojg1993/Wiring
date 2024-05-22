import { AccountCircle } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import DarkModeSwitch from "./DarkMode/DarkModeSwitch";
import { useState } from "react";

const AccountButton = () => {
  const [anchorEl, setanchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setanchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setanchorEl(null);
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={isMenuOpen}
      keepMounted
      onClose={handleProfileMenuClose}
    >
      <MenuItem>
        <DarkModeSwitch />
      </MenuItem>
      <MenuItem>
        <Button fullWidth>
          <Link href="/register">
            <Typography color="grey">Register</Typography>
          </Link>
        </Button>
      </MenuItem>
      <MenuItem>
        <Button fullWidth>
          <Link href="/login">
            <Typography color="grey">Login</Typography>
          </Link>
        </Button>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ display: { xs: "flex" } }}>
      <IconButton edge="end" color="inherit" onClick={handleProfileMenuOpen}>
        <AccountCircle />
      </IconButton>
      {renderMenu}
    </Box>
  );
};

export default AccountButton;
