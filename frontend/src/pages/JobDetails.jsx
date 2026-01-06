import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Paper
} from '@mui/material';
import {
  LocationOn,
  Business,
  Work,
  AccessTime,
  AttachMoney,
  CalendarToday,
  ArrowBack,
  Close as CloseIcon,
  Language as WebsiteIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import axios from 'axios';
import JobApplicationForm from '../components/ApplicationForm';
import PageWrapper from '../components/PageWrapper.jsx';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openApplicationDialog, setOpenApplicationDialog] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5600/api/jobs/${id}`);
      setJob(response.data.job);
      
      // Check if current user has already applied
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const currentUser = JSON.parse(storedUser);
        const userApplication = response.data.job.applications?.find(
          app => app.userId === currentUser.id
        );
        setHasApplied(!!userApplication);
      }
    } catch (err) {
      setError('Failed to load job details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationSuccess = () => {
    setOpenApplicationDialog(false);
    setHasApplied(true);
    fetchJobDetails(); // Refresh to show updated application count
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5600/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      navigate('/jobs');
    } catch (err) {
      setError('Failed to delete job');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  const canApply = () => {
    return user && user.role === 'applicant' && !hasApplied && job?.status === 'active';
  };

  const canEdit = () => {
    return user && (user.role === 'admin' || (user.role === 'employer' && job?.Company?.userId === user.id));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !job) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Job not found'}</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/jobs')} sx={{ mt: 2 }}>
          Back to Jobs
        </Button>
      </Container>
    );
  }

  return (
    <PageWrapper>
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/jobs')}
        sx={{ mb: 3 }}
      >
        Back to Jobs
      </Button>
      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column - Job Details */}
        <Grid
          size={{
            xs: 12,
            md: 8
          }}>
          <Card>
            <CardContent>
              {/* Header */}
              <Box sx={{ mb: 3 }}>
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
                
                <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                  {job.title}
                </Typography>

                {/* Company Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                  <Business color="action" />
                  <Typography variant="h6" color="text.secondary">
                    {job.Company?.companyName}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOn fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {job.location}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Job Info Grid */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid
                  size={{
                    xs: 6,
                    sm: 3
                  }}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Work sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="caption" color="text.secondary" display="block">
                      Job Type
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {job.jobType}
                    </Typography>
                  </Box>
                </Grid>
                <Grid
                  size={{
                    xs: 6,
                    sm: 3
                  }}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <AttachMoney sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="caption" color="text.secondary" display="block">
                      Salary
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {job.salary || 'Competitive'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid
                  size={{
                    xs: 6,
                    sm: 3
                  }}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <CalendarToday sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                    <Typography variant="caption" color="text.secondary" display="block">
                      Posted
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatDate(job.createdAt)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid
                  size={{
                    xs: 6,
                    sm: 3
                  }}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <AccessTime sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                    <Typography variant="caption" color="text.secondary" display="block">
                      Deadline
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {job.deadline ? formatDate(job.deadline) : 'No deadline'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Job Description */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Job Description
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                  {job.description}
                </Typography>
              </Box>

              {/* Company Details */}
              {job.Company && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Box>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      About {job.Company.companyName}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2">
                          <strong>Location:</strong> {job.Company.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Business fontSize="small" color="action" />
                        <Typography variant="body2">
                          <strong>Industry:</strong> {job.Company.industry}
                        </Typography>
                      </Box>
                      {job.Company.website && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <WebsiteIcon fontSize="small" color="action" />
                          <Typography
                            variant="body2"
                            component="a"
                            href={job.Company.website}
                            target="_blank"
                            color="primary"
                            sx={{ textDecoration: 'none' }}
                          >
                            {job.Company.website}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    {job.Company.description && (
                      <Typography variant="body2" color="text.secondary">
                        {job.Company.description}
                      </Typography>
                    )}
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Action Card */}
        <Grid
          size={{
            xs: 12,
            md: 4
          }}>
          <Paper sx={{ p: 3, position: 'sticky', top: 80 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Application Status
            </Typography>
            
            {!user ? (
              <Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Please login to apply for this job
                </Alert>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              </Box>
            ) : user.role === 'applicant' ? (
              <Box>
                {!hasApplied ? (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    You have already applied for this job
                  </Alert>
                ) : job.status !== 'active' ? (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    This job is no longer accepting applications
                  </Alert>
                ) : job.deadline && new Date(job.deadline) < new Date() ? (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    Application deadline has passed
                  </Alert>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={() => setOpenApplicationDialog(true)}
                    sx={{ mb: 2 }}
                  >
                    Apply Now
                  </Button>
                )}
                
                <Typography variant="body2" color="text.secondary" align="center">
                  {job.applications?.length || 0} people have applied
                </Typography>
              </Box>
            ) : (
              <Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Only applicants can apply for jobs
                </Alert>
                {canEdit() && (
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/jobs/${id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      startIcon={<DeleteIcon />}
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
                  </Box>
                )}
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Additional Info */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Posted by
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {job.Company?.User?.fullName || 'Company'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {/* Application Dialog */}
      <Dialog
        open={openApplicationDialog}
        onClose={() => setOpenApplicationDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Apply for {job.title}</Typography>
            <IconButton onClick={() => setOpenApplicationDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <JobApplicationForm
            jobId={id}
            onSuccess={handleApplicationSuccess}
          />
        </DialogContent>
      </Dialog>
    </Container>
    </PageWrapper>
  );
};

export default JobDetails;