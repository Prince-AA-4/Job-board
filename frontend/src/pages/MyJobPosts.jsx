import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Visibility as ViewIcon,
  People as PeopleIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import axios from 'axios';
import PageWrapper from '../components/PageWrapper.jsx';

const MyJobPosts = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    companyId: '',
    jobType: '',
    location: '',
    salary: '',
    deadline: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch companies
      const companiesResponse = await axios.get('http://localhost:5600/api/companies/my/companies', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setCompanies(companiesResponse.data.companies);

      // Fetch all jobs (filter by user's companies on frontend)
      const jobsResponse = await axios.get('http://localhost:5600/api/jobs', {
        withCredentials: true
      });
      
      const user = JSON.parse(localStorage.getItem('user'));
      const userCompanyIds = companiesResponse.data.companies.map(c => c.id);
      
      const userJobs = jobsResponse.data.jobs.filter(job => 
        userCompanyIds.includes(job.companyId) || user.role === 'admin'
      );
      
      setJobs(userJobs);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, job) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedJob(job);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = (job = null) => {
    if (job) {
      setEditMode(true);
      setSelectedJob(job);
      setFormData({
        title: job.title,
        description: job.description,
        companyId: job.companyId,
        jobType: job.jobType,
        location: job.location,
        salary: job.salary || '',
        deadline: job.deadline || ''
      });
    } else {
      setEditMode(false);
      setFormData({
        title: '',
        description: '',
        companyId: companies[0]?.id || '',
        jobType: '',
        location: '',
        salary: '',
        deadline: ''
      });
    }
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      title: '',
      description: '',
      companyId: '',
      jobType: '',
      location: '',
      salary: '',
      deadline: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (editMode) {
        await axios.put(
          `http://localhost:5600/api/jobs/${selectedJob.id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          }
        );
      } else {
        await axios.post('http://localhost:5600/api/jobs', formData, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
      }
      fetchData();
      handleCloseDialog();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5600/api/jobs/${selectedJob.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      fetchData();
      handleMenuClose();
    } catch (err) {
      setError('Failed to delete job');
    }
  };

  const handleCloseJob = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5600/api/jobs/${selectedJob.id}/close`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      fetchData();
      handleMenuClose();
    } catch (err) {
      setError('Failed to close job');
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (tabValue === 'all') return true;
    return job.status === tabValue;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            My Job Posts
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your job postings and track applications
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          size="large"
          disabled={companies.length === 0}
        >
          Post New Job
        </Button>
      </Box>
      {companies.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          You need to create a company first before posting jobs.
          <Button color="inherit" onClick={() => navigate('/my-companies')}>
            Create Company
          </Button>
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label={`All (${jobs.length})`} value="all" />
          <Tab label={`Active (${jobs.filter(j => j.status === 'active').length})`} value="active" />
          <Tab label={`Closed (${jobs.filter(j => j.status === 'closed').length})`} value="closed" />
        </Tabs>
      </Box>
      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <WorkIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No jobs found
          </Typography>
          {companies.length > 0 && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ mt: 2 }}>
              Post Your First Job
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredJobs.map((job) => (
            <Grid
              key={job.id}
              size={{
                xs: 12,
                md: 6
              }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Chip
                          label={job.status}
                          color={job.status === 'active' ? 'success' : 'default'}
                          size="small"
                        />
                        <Chip label={job.jobType} color="primary" size="small" />
                      </Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {job.title}
                      </Typography>
                    </Box>
                    <IconButton onClick={(e) => handleMenuOpen(e, job)}>
                      <MoreIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <BusinessIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {job.Company?.companyName}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                    <LocationIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {job.location}
                    </Typography>
                  </Box>

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

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      pt: 2,
                      borderTop: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PeopleIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {job.applications?.length || 0} applicant(s)
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Posted {formatDate(job.createdAt)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {/* Context Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => navigate(`/jobs/${selectedJob?.id}`)}>
          <ViewIcon sx={{ mr: 1 }} fontSize="small" />
          View Details
        </MenuItem>
        <MenuItem onClick={() => navigate(`/applications/job/${selectedJob?.id}`)}>
          <PeopleIcon sx={{ mr: 1 }} fontSize="small" />
          View Applications
        </MenuItem>
        <MenuItem onClick={() => handleOpenDialog(selectedJob)}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Edit
        </MenuItem>
        {selectedJob?.status === 'active' && (
          <MenuItem onClick={handleCloseJob}>
            <CloseIcon sx={{ mr: 1 }} fontSize="small" />
            Close Job
          </MenuItem>
        )}
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Delete
        </MenuItem>
      </Menu>
      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Job' : 'Post New Job'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Job Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel>Company</InputLabel>
              <Select
                name="companyId"
                value={formData.companyId}
                label="Company"
                onChange={handleChange}
              >
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.companyName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Job Type</InputLabel>
              <Select
                name="jobType"
                value={formData.jobType}
                label="Job Type"
                onChange={handleChange}
              >
                <MenuItem value="Full-Time">Full-Time</MenuItem>
                <MenuItem value="Part-Time">Part-Time</MenuItem>
                <MenuItem value="Internship">Internship</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              fullWidth
              placeholder="e.g., 5000 GHS/month or Competitive"
            />
            <TextField
              label="Application Deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Job Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={6}
              required
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? 'Update' : 'Post Job'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
    </PageWrapper>
  );
};

export default MyJobPosts;