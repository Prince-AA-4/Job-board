import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Work, Business, People, TrendingUp } from "@mui/icons-material";
import HeroSection from "../components/HeroCarousel.jsx";
import PageWrapper from "../components/PageWrapper.jsx";

const Home = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
    <Box>
      {/* Hero Section with Background Image */}
      <HeroSection />
      {/* Hero Content Overlay */}
      <Box
        sx={{
          position: "relative",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
          background: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6))",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            Find Your Dream Job Today
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              fontSize: { xs: "1.2rem", md: "1.5rem" },
              textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            Connect with top employers and discover opportunities that match
            your skills
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/jobs")}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: "bold",
                boxShadow: 3,
              }}
            >
              Browse Jobs
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/register")}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: "bold",
                color: "white",
                borderColor: "white",
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>
      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          fontWeight="bold"
          sx={{ mb: 6 }}
        >
          Why Choose Us?
        </Typography>

        <Grid container spacing={3}>
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4,
              lg: 3
            }}>
            <Card
              sx={{
                height: "300",
                textAlign: "center",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ py: 4 }}>
                <Work sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Quality Jobs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Access thousands of verified job postings from top companies
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4,
              lg: 3
            }}>
            <Card
              sx={{
                height: "300",
                textAlign: "center",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ py: 4 }}>
                <Business sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Top Companies
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Connect with leading employers across various industries
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4,
              lg: 3
            }}>
            <Card
              sx={{
                height: "300",
                textAlign: "center",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ py: 4 }}>
                <People sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Easy Apply
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Simple application process with just a few clicks
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4,
              lg: 3
            }}>
            <Card
              sx={{
                height: "300",
                textAlign: "center",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ py: 4 }}>
                <TrendingUp
                  sx={{ fontSize: 60, color: "primary.main", mb: 2 }}
                />
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Career Growth
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Find opportunities that accelerate your career path
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      {/* Call to Action Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom fontWeight="bold">
            Ready to Start Your Journey?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of job seekers and find your perfect match
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/register")}
            sx={{
              bgcolor: "white",
              color: "primary.main",
              px: 5,
              py: 2,
              fontSize: "1.1rem",
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.9)",
              },
            }}
          >
            Sign Up Now
          </Button>
        </Container>
      </Box>
    </Box>
    </PageWrapper>
  );
};

export default Home;
