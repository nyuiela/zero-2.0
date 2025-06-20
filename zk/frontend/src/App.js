import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container, Box } from "@mui/material";
import Header from "./components/Header";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import Auctions from "./pages/Auctions";
import Login from "./pages/Login";
import "./App.css";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <Header />
          <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cars" element={<Cars />} />
              <Route path="/auctions" element={<Auctions />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
