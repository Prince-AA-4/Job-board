import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Avatar,
  Paper,
} from "@mui/material";
import {
  ArrowBack,
  LocationOn,
  Business,
  Language as WebsiteIcon,
  Work as WorkIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import axios from "axios";
import PageWrapper from "../components/PageWrapper.jsx";

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchCompanyDetails();
  }, [id]);

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5600/api/companies/${id}`
      );
      setCompany(response.data.company);
    } catch (err) {
      setError("Failed to load company details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this company? All associated jobs will be deleted."
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5600/api/companies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      navigate("/companies");
    } catch (err) {
      setError("Failed to delete company");
    }
  };

  const canEdit = () => {
    return (
      user &&
      (user.role === "admin" ||
        (user.role === "employer" && company?.userId === user.id))
    );
  };

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

  if (error || !company) {
    return (
      <PageWrapper>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || "Company not found"}</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/companies")}
          sx={{ mt: 2 }}
        >
          Back to Companies
        </Button>
      </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/companies")}
        sx={{ mb: 3 }}
      >
        Back to Companies
      </Button>
      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column - Company Info */}
        <Grid
          size={{
            xs: 12,
            md: 8
          }}>
          <Card>
            <CardContent>
              {/* Header */}
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "primary.main",
                    fontSize: "2rem",
                    fontWeight: "bold",
                    mr: 3,
                  }}
                >
                  {getInitials(company.companyName)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h4"
                    component="h1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {company.companyName}
                  </Typography>
                  <Chip label={company.industry} color="primary" />
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Company Info */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Company Information
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationOn color="action" />
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Location
                      </Typography>
                      <Typography variant="body1">
                        {company.location}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Business color="action" />
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Industry
                      </Typography>
                      <Typography variant="body1">
                        {company.industry}
                      </Typography>
                    </Box>
                  </Box>

                  {company.website && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <WebsiteIcon color="action" />
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          Website
                        </Typography>
                        <Typography
                          variant="body1"
                          component="a"
                          href={company.website}
                          target="_blank"
                          color="primary"
                          sx={{
                            textDecoration: "none",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          {company.website}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>

              {company.description && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Box>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      About {company.companyName}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ whiteSpace: "pre-line" }}
                    >
                      {company.description}
                    </Typography>
                  </Box>
                </>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Contact Person */}
              {company.User && (
                <Box>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Contact Person
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {company.User.fullName || company.User.userName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {company.User.email}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Actions & Jobs */}
        <Grid
          size={{
            xs: 12,
            md: 4
          }}>
          {/* Actions Card */}
          {canEdit() && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Manage Company
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<EditIcon />}
                  onClick={() => navigate("/my-companies")}
                >
                  Edit Company
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                >
                  Delete Company
                </Button>
              </Box>
            </Paper>
          )}

          {/* Open Positions */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Open Positions
            </Typography>

            {company.jobs && company.jobs.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {company.jobs
                  .filter((job) => job.status === "active")
                  .map((job) => (
                    <Card
                      key={job.id}
                      sx={{
                        cursor: "pointer",
                        transition: "box-shadow 0.2s",
                        "&:hover": { boxShadow: 2 },
                      }}
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          gutterBottom
                        >
                          {job.title}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                          <Chip
                            label={job.jobType}
                            size="small"
                            color="primary"
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <LocationOn sx={{ fontSize: 16 }} color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {job.location}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}

                <Button
                  variant="text"
                  fullWidth
                  onClick={() =>
                    navigate("/jobs", { state: { companyId: id } })
                  }
                >
                  View All Jobs
                </Button>
              </Box>
            ) : (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <WorkIcon
                  sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  No open positions at the moment
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Stats Card */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Statistics
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                  {company.jobs?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Job Posts
                </Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  {company.jobs?.filter((j) => j.status === "active").length ||
                    0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Jobs
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
    </PageWrapper>
  );
};

export default CompanyDetails;
