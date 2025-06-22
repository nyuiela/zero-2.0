import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
} from "@mui/material";
import axios from "axios";

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("/api/cars");
        setCars(response.data.data || []);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Loading cars...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Available Cars
      </Typography>

      <Grid container spacing={3}>
        {cars.map((car) => (
          <Grid item xs={12} sm={6} md={4} key={car.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={
                  car.image_url && car.image_url[0]
                    ? car.image_url[0]
                    : "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                }
                alt={`${car.make} ${car.model}`}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {car.make} {car.model}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Year: {car.year} | Mileage: {car.mileage.toLocaleString()}{" "}
                  miles
                </Typography>
                <Typography variant="h6" color="primary" gutterBottom>
                  ${car.current_price.toLocaleString()}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                  <Chip
                    label={car.auction_status || "pending"}
                    color={
                      car.auction_status === "active" ? "success" : "default"
                    }
                    size="small"
                  />
                  <Chip label={car.color} size="small" variant="outlined" />
                </Box>
                <Button variant="contained" fullWidth>
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {cars.length === 0 && (
        <Typography variant="h6" align="center" color="text.secondary">
          No cars available at the moment.
        </Typography>
      )}
    </Box>
  );
};

export default Cars;
