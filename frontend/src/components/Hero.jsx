import React from "react";
import {
  Button,
  useTheme,
  useMediaQuery,
  Box,
  Typography,
} from "@mui/material";
import { ArrowCircleRightOutlined } from "@mui/icons-material";
import HeroSection from "./HeroCarousel.jsx";
import PageWrapper from "./PageWrapper.jsx";
// import { Link } from 'react-router-dom';

const Hero = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <PageWrapper>
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        textAlign: "center",
        px: 2,
      }}
    >
        <HeroSection />
      <Box>
        <Typography
          variant={isMobile ? "h4" : "h1"}
          sx={{
            fontWeight: 700,
            textShadow: "2px 2px 4px rgba(0,0,0,0.6)",
            mb: 0,
            display: "block",
          }}
        >
          Slightly Used Jobs
        </Typography>
        <Typography
          variant={isMobile ? "h5" : "h6"}
          sx={{
            fontWeight: 700,
            color: "#00070bff",
            textShadow: "2px 2px 4px rgba(0,0,0,0.6)",
            mb: 2
          }}
        >
          Find your next career opportunity with us.
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 2,
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "blue",
            "&:hover": { backgroundColor: "#f4511e" },
            boxShadow: 3,
            animation: "bounce 1.5s infinite",
            "@keyframes bounce": {
              "0%, 100%": { transform: "translateY(0)" },
              "50%": { transform: "translateY(-8px)" },
            },
          }}
        >
          Get Started
            <ArrowCircleRightOutlined sx={{ ml: 1 }} />
        </Button>
      </Box>
    </Box>
    </PageWrapper>
  );
};

export default Hero;
