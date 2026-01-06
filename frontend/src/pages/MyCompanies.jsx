import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Language as WebsiteIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import axios from "axios";
import PageWrapper from "../components/PageWrapper.jsx";

const MyCompanies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [formData, setFormData] = useState({
    companyName: "",
    location: "",
    industry: "",
    website: "",
    description: "",
  });

  useEffect(() => {
    fetchMyCompanies();
  }, []);

  const fetchMyCompanies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5600/api/companies/my/companies",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setCompanies(response.data.companies);
    } catch (err) {
      setError("Failed to fetch companies");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (company = null) => {
    if (company) {
      setEditMode(true);
      setCurrentCompany(company);
      setFormData({
        companyName: company.companyName,
        location: company.location,
        industry: company.industry,
        website: company.website || "",
        description: company.description || "",
      });
    } else {
      setEditMode(false);
      setCurrentCompany(null);
      setFormData({
        companyName: "",
        location: "",
        industry: "",
        website: "",
        description: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      companyName: "",
      location: "",
      industry: "",
      website: "",
      description: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (editMode) {
        await axios.put(
          `http://localhost:5600/api/companies/${currentCompany.id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      } else {
        await axios.post("http://localhost:5600/api/companies", formData, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
      }
      fetchMyCompanies();
      handleCloseDialog();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save company");
    }
  };

  const handleDelete = async (companyId) => {
    if (!window.confirm("Are you sure you want to delete this company?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5600/api/companies/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchMyCompanies();
    } catch (err) {
      setError("Failed to delete company");
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

  return (
    <PageWrapper>
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            My Companies
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your company profiles
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          size="large"
        >
          Add Company
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {/* Companies Grid */}
      {companies.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <BusinessIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No companies yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first company profile to start posting jobs
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Create Company
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {companies.map((company) => (
            <Grid
              key={company.id}
              size={{
                xs: 12,
                md: 6
              }}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <BusinessIcon
                      sx={{ fontSize: 40, color: "primary.main", mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h5" fontWeight="bold">
                        {company.companyName}
                      </Typography>
                      <Chip
                        label={company.industry}
                        size="small"
                        color="primary"
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mb: 1,
                    }}
                  >
                    <LocationIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {company.location}
                    </Typography>
                  </Box>

                  {company.website && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mb: 1,
                      }}
                    >
                      <WebsiteIcon fontSize="small" color="action" />
                      <Typography
                        variant="body2"
                        color="primary"
                        component="a"
                        href={company.website}
                        target="_blank"
                        sx={{ textDecoration: "none" }}
                      >
                        {company.website}
                      </Typography>
                    </Box>
                  )}

                  {company.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {company.description}
                    </Typography>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 2,
                    }}
                  >
                    <WorkIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {company.jobs?.length || 0} active jobs
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions
                  sx={{ justifyContent: "space-between", px: 2, pb: 2 }}
                >
                  <Button
                    size="small"
                    onClick={() => navigate(`/companies/${company.id}`)}
                  >
                    View Details
                  </Button>
                  <Box>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(company)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(company.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editMode ? "Edit Company" : "Create New Company"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              fullWidth
              placeholder="https://example.com"
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
    </PageWrapper>
  );
};

export default MyCompanies;
