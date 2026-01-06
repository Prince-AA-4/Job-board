import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Alert, Paper } from '@mui/material';
import axios from 'axios';
import PageWrapper from '../components/PageWrapper.jsx';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  // Get the token from the URL (?token=...)
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Basic Validation
    if (password !== confirmPassword) {
      return setStatus({ type: "error", msg: "Passwords do not match!" });
    }
    if (password.length < 8) {
      return setStatus({ type: "error", msg: "Password must be at least 8 characters." });
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5600/api/passwords/reset-password', {
        token,
        newPassword: password
      });

      setStatus({ type: "success", msg: response.data.message });
      
      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setStatus({ 
        type: "error", 
        msg: err.response?.data?.message || "Something went wrong." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom align="center">
            Create New Password
          </Typography>
          
          {status.msg && (
            <Alert severity={status.type} sx={{ mb: 2 }}>{status.msg}</Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              margin="normal"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              margin="normal"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              size="large"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
    </PageWrapper>
  );
};

export default ResetPassword;