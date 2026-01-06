import { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom';
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  TablePagination,
  Avatar,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  GetApp as GetAppIcon,
} from "@mui/icons-material";
import axios from "axios";
import PageWrapper from "../components/PageWrapper.jsx";

const ApplicationsManagement = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5600/api/admin/applications",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setApplications(response.data.applications || []);
    } catch (err) {
      setError("Failed to fetch applications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (application) => {
    setSelectedApplication(application);
    setOpenDialog(true);
  };

  const handleDelete = async (applicationId) => {
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5600/api/admin/applications/${applicationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      fetchApplications();
    } catch (err) {
      setError("Failed to delete application");
      console.error(err);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5600/api/admin/applications/${applicationId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      fetchApplications();
    } catch (err) {
      setError("Failed to update application status");
      console.error(err);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job?.company?.companyName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "hired":
        return "success";
      case "rejected":
        return "error";
      case "interviewed":
        return "warning";
      case "pending":
        return "info";
      default:
        return "default";
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

  const downloadResume = async () => {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(
      `http://localhost:5600/api/uploads/${selectedApplication.id}/resume`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob"
      }
    );
    // Creating a download link
    const fileURL = window.URL.createObjectURL(data);
    window.open(fileURL, "_blank");
  }

  return (
    <PageWrapper>
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin")}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Manage Applications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage all job applications
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <TextField
              placeholder="Search applications..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
              sx={{ minWidth: 300 }}
            />
            <TextField
              select
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="applied">Pending</MenuItem>
              <MenuItem value="interviewed">Interviewed</MenuItem>
              <MenuItem value="hired">Hired</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </TextField>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Applicant</TableCell>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Applied Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApplications
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((application) => (
                    <TableRow key={application._id} hover>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar>
                            {application.user?.fullName?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography fontWeight="medium">
                              {application.user?.fullName || "N/A"}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {application.user?.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{application.job?.title || "N/A"}</TableCell>
                      <TableCell>
                        {application.job?.Company?.companyName || "N/A"}
                      </TableCell>
                      <TableCell>
                        <TextField
                          select
                          size="small"
                          value={application.status}
                          onChange={(e) =>
                            handleStatusChange(application._id, e.target.value)
                          }
                          sx={{ minWidth: 120 }}
                        >
                          <MenuItem value="applied">Applied</MenuItem>
                          <MenuItem value="interviewed">Interviewed</MenuItem>
                          <MenuItem value="hired">Hired</MenuItem>
                          <MenuItem value="rejected">Rejected</MenuItem>
                        </TextField>
                      </TableCell>
                      <TableCell>
                        {new Date(application.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleView(application)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(application._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                {filteredApplications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No applications found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredApplications.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Application Details</DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}
            >
              {/* Applicant Info */}
              <Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Applicant Information
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Avatar sx={{ width: 60, height: 60 }}>
                    {selectedApplication.user?.fullName?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {selectedApplication.user?.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedApplication.user?.email}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Job Info */}
              <Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Job Information
                </Typography>
                <Typography variant="body1">
                  <strong>Position:</strong> {selectedApplication.job?.title}
                </Typography>
                <Typography variant="body1">
                  <strong>Company:</strong>{" "}
                  {selectedApplication.job?.Company?.companyName}
                </Typography>
                <Typography variant="body1">
                  <strong>Location:</strong> {selectedApplication.job?.location}
                </Typography>
              </Box>

              {/* Application Status */}
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Application Status
                </Typography>
                <Chip
                  label={selectedApplication.status}
                  color={getStatusColor(selectedApplication.status)}
                  sx={{ textTransform: "capitalize" }}
                />
              </Box>

              {/* Cover Letter */}
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Cover Letter
                </Typography>
                <Typography>
                  {selectedApplication.coverLetter ||
                    "No cover letter provided"}
                </Typography>
              </Box>

              {/* Resume */}
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Resume
                </Typography>
                {selectedApplication.resume ? (
                  <Button
                    variant="outlined"
                    startIcon={<GetAppIcon />}
                    onClick={downloadResume}
                  >
                    Download Resume
                  </Button>
                ) : (
                  <Typography>No resume uploaded</Typography>
                )}
              </Box>

              {/* Application Date */}
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Applied On
                </Typography>
                <Typography>
                  {new Date(selectedApplication.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
    </PageWrapper>
  );
};

export default ApplicationsManagement;
