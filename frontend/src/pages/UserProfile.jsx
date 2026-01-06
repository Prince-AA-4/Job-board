import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import axios from "axios";
import PageWrapper from "../components/PageWrapper.jsx";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    contact: "",
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setFormData({
          fullName: userData.fullName || "",
          userName: userData.userName || "",
          email: userData.email || "",
          contact: userData.contact || "",
        });
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to load user data");
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Cancel edit - reset form data
      setFormData({
        fullName: user.fullName || "",
        userName: user.userName || "",
        email: user.email || "",
        contact: user.contact || "",
      });
    }
    setEditMode(!editMode);
    setError("");
    setSuccess("");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5600/api/users/${user.id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      // Update localStorage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setSuccess("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: "error",
      employer: "primary",
      applicant: "success",
    };
    return colors[role] || "default";
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

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">User data not found. Please login again.</Alert>
      </Container>
    );
  }

  return (
    <PageWrapper>
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account information
        </Typography>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}
      {/* Profile Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {/* Avatar and Basic Info */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                fontSize: "2.5rem",
                bgcolor: "primary.main",
                mr: 3,
              }}
            >
              {user.fullName?.charAt(0).toUpperCase() ||
                user.userName?.charAt(0).toUpperCase() ||
                "U"}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {user.fullName || user.userName}
              </Typography>
              <Chip
                label={user.role}
                color={getRoleBadgeColor(user.role)}
                size="small"
                sx={{ textTransform: "capitalize", fontWeight: "bold" }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Member since{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Edit/Save Buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            {!editMode ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEditToggle}
              >
                Edit Profile
              </Button>
            ) : (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleEditToggle}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </Box>
            )}
          </Box>

          {/* Profile Information */}
          <Grid container spacing={3}>
            <Grid size={12}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Full Name
                </Typography>
              </Box>
              {editMode ? (
                <TextField
                  fullWidth
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  variant="outlined"
                />
              ) : (
                <Typography variant="body1" fontWeight="500">
                  {user.fullName || "Not provided"}
                </Typography>
              )}
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 6
              }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Username
                </Typography>
              </Box>
              {editMode ? (
                <TextField
                  fullWidth
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  variant="outlined"
                />
              ) : (
                <Typography variant="body1" fontWeight="500">
                  {user.userName}
                </Typography>
              )}
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 6
              }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <WorkIcon sx={{ mr: 1, color: "text.secondary" }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Role
                </Typography>
              </Box>
              <Typography
                variant="body1"
                fontWeight="500"
                sx={{ textTransform: "capitalize" }}
              >
                {user.role}
              </Typography>
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 6
              }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
              </Box>
              {editMode ? (
                <TextField
                  fullWidth
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                />
              ) : (
                <Typography variant="body1" fontWeight="500">
                  {user.email}
                </Typography>
              )}
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 6
              }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <PhoneIcon sx={{ mr: 1, color: "text.secondary" }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Contact
                </Typography>
              </Box>
              {editMode ? (
                <TextField
                  fullWidth
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="Enter contact number"
                />
              ) : (
                <Typography variant="body1" fontWeight="500">
                  {user.contact || "Not provided"}
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {/* Account Information */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Account Information
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid
              size={{
                xs: 12,
                sm: 6
              }}>
              <Typography variant="body2" color="text.secondary">
                Account ID
              </Typography>
              <Typography variant="body1" fontWeight="500">
                #{user.id}
              </Typography>
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6
              }}>
              <Typography variant="body2" color="text.secondary">
                Account Created
              </Typography>
              <Typography variant="body1" fontWeight="500">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6
              }}>
              <Typography variant="body2" color="text.secondary">
                Last Updated
              </Typography>
              <Typography variant="body1" fontWeight="500">
                {new Date(user.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6
              }}>
              <Typography variant="body2" color="text.secondary">
                Account Status
              </Typography>
              <Chip
                label="Active"
                color="success"
                size="small"
                sx={{ fontWeight: "bold" }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
    </PageWrapper>
  );
};

export default UserProfile;
