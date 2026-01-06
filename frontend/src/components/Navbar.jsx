import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Badge
} from '@mui/material';
import {
  AccountCircle,
  Work,
  Business,
  Assignment,
  Dashboard,
  Logout,
  Login as LoginIcon,
  PersonAdd
} from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobId } = useParams();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location]); // Re-check when route changes

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    handleMenuClose();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar>
        {/* Logo */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            mr: 4
          }}
          onClick={() => navigate('/')}
        >
          <img src="/suj_logo.ico" alt="logo" width="50px" />
          <Typography
            variant="h6"
            sx={{
              ml: 1,
              fontWeight: 'bold',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            SlightlyUsed Jobs
          </Typography>
        </Box>

        {/* Navigation Links */}
        
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
        {user && (user.role === 'employer' || user.role === 'applicant') && (
          <Button
            color="inherit"
            onClick={() =>{
              const destination = user.role === 'employer' ? '/my-jobs' : '/jobs';
              navigate(destination);
            }}
            sx={{
              fontWeight: isActive('/my-jobs') || isActive('/jobs') ? 'bold' : 'normal',
              borderBottom: isActive('/my-jobs') || isActive('/jobs') ? '2px solid white' : 'none'
            }}
          >
            Jobs
          </Button>
          )}

          {/* Show Companies for Employers and Admins */}
          {user && (user.role === 'employer' || user.role === 'admin') && (
            <Button
              color="inherit"
              onClick={() => {
                const destination = user.role === 'employer' ? '/my-companies' : '/companies';
                navigate(destination);
              }}
              sx={{
                fontWeight: (isActive('/my-companies') || isActive('/companies')) ? 'bold' : 'normal',
                borderBottom: (isActive('/my-companies') || isActive('/companies')) ? '2px solid white' : 'none'
              }}
            >
              Companies
            </Button>
          )}

          {/* Show My Applications for Applicants */}
          {user && user.role === 'applicant' && (
            <Button
              color="inherit"
              startIcon={<Assignment />}
              onClick={() => navigate('/my-applications')}
              sx={{
                fontWeight: isActive('/my-applications') ? 'bold' : 'normal',
                borderBottom: isActive('/my-applications') ? '2px solid white' : 'none'
              }}
            >
              My Applications
            </Button>
          )}

          {/* Admin Dashboard */}
          {user && user.role === 'admin' && (
            <Button
              color="inherit"
              startIcon={<Dashboard />}
              onClick={() => navigate('/admin')}
              sx={{
                fontWeight: isActive('/admin') ? 'bold' : 'normal',
                borderBottom: isActive('/admin') ? '2px solid white' : 'none'
              }}
            >
              Admin
            </Button>
          )}
        </Box>

        {/* Right Side - User Menu or Login/Register */}
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* User Info */}
            <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right' }}>
              <Typography variant="body2">
                {user.fullName || user.userName || 'User'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
              </Typography>
            </Box>

            {/* User Avatar Menu */}
            <IconButton
              onClick={handleMenuOpen}
              sx={{ color: 'white' }}
            >
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.main' }}>
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.userName?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {/* Profile Header */}
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {user.fullName || user.userName || 'User'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email || 'No email'}
                </Typography>
              </Box>
              <Divider />

              {/* Applicant Menu Items */}
              {user.role === 'applicant' && (
                <>
                  <MenuItem onClick={() => handleNavigation('/my-applications')}>
                    <Assignment sx={{ mr: 1 }} fontSize="small" />
                    My Applications
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation('/profile')}>
                    <AccountCircle sx={{ mr: 1 }} fontSize="small" />
                    My Profile
                  </MenuItem>
                </>
              )}

              {/* Employer Menu Items */}
              {user.role === 'employer' && (
                <>
                  <MenuItem onClick={() => handleNavigation('/my-companies')}>
                    <Business sx={{ mr: 1 }} fontSize="small" />
                    My Companies
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation('/my-jobs')}>
                    <Work sx={{ mr: 1 }} fontSize="small" />
                    My Job Posts
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation('/profile')}>
                    <AccountCircle sx={{ mr: 1 }} fontSize="small" />
                    My Profile
                  </MenuItem>
                </>
              )}

              {/* Admin Menu Items */}
              {user.role === 'admin' && (
                <>
                  <MenuItem onClick={() => handleNavigation('/admin')}>
                    <Dashboard sx={{ mr: 1 }} fontSize="small" />
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation('/admin/users')}>
                    <AccountCircle sx={{ mr: 1 }} fontSize="small" />
                    Manage Users
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation('/admin/companies')}>
                    <Business sx={{ mr: 1 }} fontSize="small" />
                    Manage Companies
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation('/admin/jobs')}>
                    <Work sx={{ mr: 1 }} fontSize="small" />
                    Manage Jobs
                  </MenuItem>
                </>
              )}

              <Divider />
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} fontSize="small" />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          // Not logged in - show Login and Register buttons
          (<Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              startIcon={<LoginIcon />}
              onClick={() => navigate('/login')}
              variant={isActive('/login') ? 'outlined' : 'text'}
            >
              Login
            </Button>
            <Button
              color="inherit"
              startIcon={<PersonAdd />}
              onClick={() => navigate('/register')}
              variant={isActive('/register') ? 'outlined' : 'text'}
              sx={{
                border: '1px solid rgba(255,255,255,0.5)',
                '&:hover': {
                  border: '1px solid white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Register
            </Button>
          </Box>)
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;