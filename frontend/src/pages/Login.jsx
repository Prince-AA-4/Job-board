import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import axios from 'axios';
import PageWrapper from '../components/PageWrapper.jsx';
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const[openForgot, setOpenForgot]= useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState({ type: '', msg: '' });
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:5600/api/users/login',
        formData,
        { withCredentials: true }
      );

      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect based on role
      const userRole = response.data.user.role;
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'employer') {
        navigate('/my-companies');
      } else {
        navigate('/jobs');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      setForgotStatus({ type: 'error', msg: 'Please enter your email.' });
      return;
    }
    setForgotLoading(true);
    setForgotStatus({ type: '', msg: '' });

    try {
      await axios.post('http://localhost:5600/api/passwords/request-reset', { 
        email: forgotEmail 
      });
      setForgotStatus({ 
        type: 'success', 
        msg: 'If that email exists, a reset link has been sent!' 
      });

      setTimeout(() => {
        setOpenForgot(false);
        setForgotStatus({ type: '', msg: '' });
      }, 3000);
    } catch (err) {
      setForgotStatus({ 
        type: 'error', 
        msg: 'Failed to send request. Please try again later.' 
      });
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <PageWrapper>
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Login
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Welcome back! Please login to your account.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
            <Box sx={{ textAlign: 'right' }}>
              <Button 
                variant="text" 
                size="small" 
                onClick={() => setOpenForgot(true)}
                sx={{ textTransform: 'none' }}
              >
                Forgot Password?
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
                  Register here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
      <Dialog open={openForgot} onClose={() => setOpenForgot(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter your email address and we'll send you a link to reset your password.
          </DialogContentText>
          
          {forgotStatus.msg && (
            <Alert severity={forgotStatus.type} sx={{ mb: 2 }}>{forgotStatus.msg}</Alert>
          )}

          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            disabled={forgotLoading}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenForgot(false)} color="inherit">Cancel</Button>
          <Button 
            onClick={handleForgotPassword} 
            variant="contained" 
            disabled={forgotLoading}
          >
            {forgotLoading ? <CircularProgress size={20} /> : "Send Link"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
    </PageWrapper>
  );
};

export default Login;