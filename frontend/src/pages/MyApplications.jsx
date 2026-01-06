import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Work as WorkIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import axios from "axios";
import PageWrapper from "../components/PageWrapper.jsx";

const MyApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchMyApplications();
  }, [statusFilter]);

  const fetchMyApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = statusFilter
        ? `http://localhost:5600/api/applications/my-applications?status=${statusFilter}`
        : "http://localhost:5600/api/applications/my-applications";

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setApplications(response.data.applications);
    } catch (err) {
      setError("Failed to fetch applications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (applicationId) => {
    if (!window.confirm("Are you sure you want to withdraw this application?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5600/api/applications/${applicationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      fetchMyApplications();
    } catch (err) {
      setError("Failed to delete application");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      applied: "info",
      interviewed: "warning",
      hired: "success",
      rejected: "error",
    };
    return colors[status] || "default";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
          My Applications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your job applications and their status
        </Typography>
      </Box>
      {/* Filter */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, alignItems: "center" }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            label="Filter by Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="applied">Applied</MenuItem>
            <MenuItem value="interviewed">Interviewed</MenuItem>
            <MenuItem value="hired">Hired</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="body2" color="text.secondary">
          {applications.length} application(s) found
        </Typography>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {/* Applications List */}
      {applications.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <WorkIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No applications yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start applying to jobs to see your applications here
          </Typography>
          <Button variant="contained" onClick={() => navigate("/jobs")}>
            Browse Jobs
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {applications.map((application) => (
            <Grid key={application.id} size={12}>
              <Card
                sx={{
                  transition: "box-shadow 0.3s",
                  "&:hover": {
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    {/* Job Info */}
                    <Grid
                      size={{
                        xs: 12,
                        md: 6
                      }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <WorkIcon
                          sx={{ fontSize: 40, color: "primary.main", mt: 0.5 }}
                        />
                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            gutterBottom
                          >
                            {application.job?.title}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              mb: 0.5,
                            }}
                          >
                            <BusinessIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {application.job?.Company?.companyName}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <LocationIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {application.job?.location}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Status and Actions */}
                    <Grid
                      size={{
                        xs: 12,
                        md: 6
                      }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", md: "row" },
                          alignItems: { xs: "flex-start", md: "center" },
                          justifyContent: "space-between",
                          gap: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            Status
                          </Typography>
                          <Chip
                            label={application.status}
                            color={getStatusColor(application.status)}
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: "bold",
                            }}
                          />
                        </Box>

                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            Applied on
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <TimeIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {formatDate(application.createdAt)}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip title="View Job">
                            <IconButton
                              color="primary"
                              onClick={() =>
                                navigate(`/jobs/${application.job?.id}`)
                              }
                              size="small"
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Withdraw Application">
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(application.id)}
                              size="small"
                              disabled={
                                application.status === "hired" ||
                                application.status === "rejected"
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Job Details */}
                  <Box
                    sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}
                  >
                    <Chip
                      label={application.job?.jobType}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={`Salary: ${
                        application.job?.salary || "Competitive"
                      }`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={`Status: ${application.job?.status}`}
                      size="small"
                      variant="outlined"
                      color={
                        application.job?.status === "active"
                          ? "success"
                          : "default"
                      }
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {/* Statistics Summary */}
      {applications.length > 0 && (
        <Box sx={{ mt: 4, p: 3, bgcolor: "background.paper", borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Application Statistics
          </Typography>
          <Grid container spacing={2}>
            <Grid
              size={{
                xs: 6,
                sm: 3
              }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="info.main" fontWeight="bold">
                  {
                    applications.filter((app) => app.status === "applied")
                      .length
                  }
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Applied
                </Typography>
              </Box>
            </Grid>
            <Grid
              size={{
                xs: 6,
                sm: 3
              }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="warning.main" fontWeight="bold">
                  {
                    applications.filter((app) => app.status === "interviewed")
                      .length
                  }
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Interviewed
                </Typography>
              </Box>
            </Grid>
            <Grid
              size={{
                xs: 6,
                sm: 3
              }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  {applications.filter((app) => app.status === "hired").length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hired
                </Typography>
              </Box>
            </Grid>
            <Grid
              size={{
                xs: 6,
                sm: 3
              }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="error.main" fontWeight="bold">
                  {
                    applications.filter((app) => app.status === "rejected")
                      .length
                  }
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rejected
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
    </PageWrapper>
  );
};

export default MyApplications;
