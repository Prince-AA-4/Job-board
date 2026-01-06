import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  ManageAccounts as ManageAccountsIcon,
} from "@mui/icons-material";
import axios from "axios";
import PageWrapper from "../components/PageWrapper.jsx";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5600/api/admin/dashboard",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setStats(response.data.stats);
    } catch (err) {
      setError("Failed to fetch dashboard statistics");
      console.error(err);
    } finally {
      setLoading(false);
    }
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <PageWrapper>
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of your job board platform
        </Typography>
      </Box>

      {/* Overview Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{xs:12, sm:6, md:3}}>
          <Card sx={{ bgcolor: "primary.main", color: "white" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats?.overview?.totalUsers || 0}
                  </Typography>
                  <Typography variant="body2">Total Users</Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 50, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs:12, sm:6, md:3}}>
          <Card sx={{ bgcolor: "success.main", color: "white" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats?.overview?.totalCompanies || 0}
                  </Typography>
                  <Typography variant="body2">Companies</Typography>
                </Box>
                <BusinessIcon sx={{ fontSize: 50, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs:12, sm:6, md:3}}>
          <Card sx={{ bgcolor: "warning.main", color: "white" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats?.overview?.totalJobs || 0}
                  </Typography>
                  <Typography variant="body2">Total Jobs</Typography>
                </Box>
                <WorkIcon sx={{ fontSize: 50, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs:12, sm:6, md:3}}>
          <Card sx={{ bgcolor: "info.main", color: "white" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats?.overview?.totalApplications || 0}
                  </Typography>
                  <Typography variant="body2">Applications</Typography>
                </Box>
                <AssignmentIcon sx={{ fontSize: 50, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{xs:12, md:4}}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Recent Activity (30 days)
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    New Users
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    {stats?.recentActivity?.newUsers || 0}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    New Jobs
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="success.main"
                  >
                    {stats?.recentActivity?.newJobs || 0}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    New Applications
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="info.main">
                    {stats?.recentActivity?.newApplications || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Users by Role */}
        <Grid size={{xs:12, md:4}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Users by Role
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    {stats?.usersByRole?.map((item) => (
                      <TableRow key={item.role}>
                        <TableCell>
                          <Chip
                            label={item.role}
                            size="small"
                            color={
                              item.role === "admin"
                                ? "error"
                                : item.role === "employer"
                                ? "primary"
                                : "success"
                            }
                            sx={{ textTransform: "capitalize" }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="h6" fontWeight="bold">
                            {item.count}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Jobs by Status */}
        <Grid size={{xs:12, md: 4}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Jobs by Status
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    {stats?.jobsByStatus?.map((item) => (
                      <TableRow key={item.status}>
                        <TableCell>
                          <Chip
                            label={item.status}
                            size="small"
                            color={
                              item.status === "active" ? "success" : "default"
                            }
                            sx={{ textTransform: "capitalize" }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="h6" fontWeight="bold">
                            {item.count}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Job Types and Application Status */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{xs:12, md:6}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Jobs by Type
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Job Type</TableCell>
                      <TableCell align="right">Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats?.jobsByType?.map((item) => (
                      <TableRow key={item.type}>
                        <TableCell>
                          <Chip
                            label={item.type}
                            size="small"
                            color={
                              item.type === "Full-Time"
                                ? "primary"
                                : item.type === "Part-Time"
                                ? "secondary"
                                : "info"
                            }
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="h6" fontWeight="bold">
                            {item.count}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs:12, md:6}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Applications by Status
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats?.applicationsByStatus?.map((item) => (
                      <TableRow key={item.status}>
                        <TableCell>
                          <Chip
                            label={item.status}
                            size="small"
                            color={
                              item.status === "hired"
                                ? "success"
                                : item.status === "rejected"
                                ? "error"
                                : item.status === "interviewed"
                                ? "warning"
                                : "info"
                            }
                            sx={{ textTransform: "capitalize" }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="h6" fontWeight="bold">
                            {item.count}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Quick Actions
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              startIcon={<ManageAccountsIcon />}
              onClick={() => navigate("/admin/users")}
            >
              Manage Users
            </Button>
            <Button
              variant="contained"
              startIcon={<BusinessIcon />}
              onClick={() => navigate("/admin/companies")}
            >
              Manage Companies
            </Button>
            <Button
              variant="contained"
              startIcon={<WorkIcon />}
              onClick={() => navigate("/admin/jobs")}
            >
              Manage Jobs
            </Button>
            <Button
              variant="contained"
              startIcon={<AssignmentIcon />}
              onClick={() => navigate("/admin/applications")}
            >
              Manage Applications
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
    </PageWrapper>
  );
};

export default AdminDashboard;
