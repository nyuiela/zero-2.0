import React from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import GavelIcon from "@mui/icons-material/Gavel";
import SecurityIcon from "@mui/icons-material/Security";

const Home = () => {
  return (
    <Box>
      <Typography variant="h2" component="h1" gutterBottom align="center">
        Welcome to Car Auction Platform
      </Typography>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        align="center"
        color="text.secondary"
      >
        Buy and sell cars with zero-knowledge proofs for enhanced security
      </Typography>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Cars"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Browse Cars
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Explore our extensive collection of vehicles available for
                auction.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Auctions"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Active Auctions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Participate in live auctions and place your bids in real-time.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Security"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Zero-Knowledge Security
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Advanced cryptographic proofs ensure transaction integrity and
                privacy.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
