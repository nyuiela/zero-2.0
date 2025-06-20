import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import GavelIcon from "@mui/icons-material/Gavel";

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Car Auction Platform
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<DirectionsCarIcon />}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/cars"
            startIcon={<DirectionsCarIcon />}
          >
            Cars
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/auctions"
            startIcon={<GavelIcon />}
          >
            Auctions
          </Button>
          <Button color="inherit" component={RouterLink} to="/login">
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
