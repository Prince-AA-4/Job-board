import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  CircularProgress,
  Alert,
  InputAdornment,
  Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import axios from 'axios';
import PageWrapper from '../components/PageWrapper.jsx';

const JobsList = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    jobType: '',
    location: ''
  });

  useEffect(() => {
    fetchJobs(true);
  }, [filters]);

const fetchJobs = async (applyFilters = true) => {
  try {
    setLoading(true);
    const queryParams = new URLSearchParams();

    // Only append filters if applyFilters is true
    if (applyFilters) {
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.jobType) queryParams.append('jobType', filters.jobType);
      if (filters.location) queryParams.append('location', filters.location);
    }

    const response = await axios.get(
      `http://localhost:5600/api/jobs?${queryParams.toString()}`
    );

    setJobs(response.data.jobs);
    setError('');
  } catch (err) {
    setError('Failed to fetch jobs. Please try again.');
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = () => {
    fetchJobs();
  };

  const handleCardClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'default';
  };

  const getJobTypeColor = (jobType) => {
    const colors = {
      'Full-Time': 'primary',
      'Part-Time': 'secondary',
      'Internship': 'info'
    };
    return colors[jobType] || 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
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
          Find Your Dream Job
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse through {jobs.length} available positions
        </Typography>
      </Box>
      {/* Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid
            size={{
              xs: 12,
              md: 4
            }}>
            <TextField
              fullWidth
              placeholder="Search jobs..."
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 2
            }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={filters.status}
                label="Status"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 2
            }}>
            <FormControl fullWidth>
              <InputLabel>Job Type</InputLabel>
              <Select
                name="jobType"
                value={filters.jobType}
                label="Job Type"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Full-Time">Full-Time</MenuItem>
                <MenuItem value="Part-Time">Part-Time</MenuItem>
                <MenuItem value="Internship">Internship</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 8,
              md: 3
            }}>
            <TextField
              fullWidth
              placeholder="Location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 4,
              md: 1
            }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              sx={{ height: '56px' }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>
      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {/* Jobs Grid */}
      {jobs.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No jobs found matching your criteria
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {jobs.map((job) => (
            <Grid
              key={job.id}
              size={{
                xs: 12,
                md: 6
              }}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4

                  }
                }}
                onClick={() => handleCardClick(job.id)}
              >
                <CardContent>
                  {/* Status and Job Type Badges */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      label={job.status}
                      color={getStatusColor(job.status)}
                      size="small"
                    />
                    <Chip
                      label={job.jobType}
                      color={getJobTypeColor(job.jobType)}
                      size="small"
                    />
                  </Box>

                  {/* Job Title */}
                  <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                    {job.title}
                  </Typography>

                  {/* Company Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <BusinessIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {job.Company?.companyName || 'Company Name'}
                    </Typography>
                  </Box>

                  {/* Location */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <LocationIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {job.location}
                    </Typography>
                  </Box>

                  {/* Salary */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                    <WorkIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {job.salary || 'Competitive'}
                    </Typography>
                  </Box>

                  {/* Description Preview */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {job.description}
                  </Typography>

                  {/* Posted Date and Applications */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TimeIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        Posted {formatDate(job.createdAt)}
                      </Typography>
                    </Box>
                    {job.applications && (
                      <Typography variant="caption" color="primary">
                        {job.applications.length} applicant(s)
                      </Typography>
                    )}
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

export default JobsList;