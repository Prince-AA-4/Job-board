import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  InputAdornment,
  Paper,
  Chip,
  Avatar,
} from "@mui/material";
import {
  Search as SearchIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Language as WebsiteIcon,
} from "@mui/icons-material";
import axios from "axios";
import PageWrapper from "../components/PageWrapper.jsx";

const Companies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5600/api/companies");
      setCompanies(response.data.companies);
      setError("");
    } catch (err) {
      setError("Failed to fetch companies. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(
    (company) =>
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PageWrapper>
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Browse Companies
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore {companies.length} companies hiring on our platform
        </Typography>
      </Box>
      {/* Search Bar */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search companies by name, industry, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {/* Companies Grid */}
      {filteredCompanies.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <BusinessIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            {searchTerm
              ? "No companies found matching your search"
              : "No companies available"}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredCompanies.map((company) => (
            <Grid
              key={company.id}
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}>
              <Card
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
                onClick={() => navigate(`/companies/${company.id}`)}
              >
                <CardContent>
                  {/* Company Avatar */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        bgcolor: "primary.main",
                        mr: 2,
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                      }}
                    >
                      {getInitials(company.companyName)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight="bold" noWrap>
                        {company.companyName}
                      </Typography>
                      <Chip
                        label={company.industry}
                        size="small"
                        color="primary"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>

                  {/* Location */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mb: 1,
                    }}
                  >
                    <LocationIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {company.location}
                    </Typography>
                  </Box>

                  {/* Website */}
                  {company.website && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mb: 2,
                      }}
                    >
                      <WebsiteIcon fontSize="small" color="action" />
                      <Typography
                        variant="body2"
                        color="primary"
                        noWrap
                        sx={{
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        {company.website.replace(/^https?:\/\//, "")}
                      </Typography>
                    </Box>
                  )}

                  {/* Description Preview */}
                  {company.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "40px",
                      }}
                    >
                      {company.description}
                    </Typography>
                  )}

                  {/* Jobs Count */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      pt: 2,
                      borderTop: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <WorkIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {company.jobs?.length || 0} open position
                      {company.jobs?.length !== 1 ? "s" : ""}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
    </PageWrapper>
  );
};

export default Companies;
