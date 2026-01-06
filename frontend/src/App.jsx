import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/SignUp.jsx';
import JobsList from './pages/Jobs.jsx';
import MyCompanies from './pages/MyCompanies.jsx';
import MyApplications from './pages/MyApplications.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserProfile from './pages/UserProfile.jsx';
import JobDetails from './pages/JobDetails.jsx';
import MyJobPosts from './pages/MyJobPosts.jsx';
import CompanyDetails from './pages/CompanyDetails.jsx';
import Companies from './pages/Companies.jsx';
import UsersManagement from './pages/UsersManagement.jsx';
import CompaniesManagement from './pages/CompaniesManagement.jsx';
import JobsManagement from './pages/JobsManagement.jsx';
import ApplicationsManagement from './pages/ApplicationManagement.jsx';
import ApplicationsPage from './pages/EmployersApplications.jsx';
import ResetPassword from './pages/RessetPassword.jsx';
import { AnimatePresence } from 'framer-motion';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const location = useLocation();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    
        <Navbar />
        <Box>
          <AnimatePresence mode='wait'>
          <Routes location={location} key={location.pathname}>
            {/* Home page with Hero section */}
            <Route path="/" element={<Home />} />
            {/* Auth pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Jobs page */}
            <Route path="/jobs" element={<JobsList />} /> 
            {/* Employer companies page */}
            <Route path="/my-companies" element={<MyCompanies />} />
            {/* Applicants applications */}
            <Route path="/my-applications" element={<MyApplications />} />
            {/* Admin Dashboard */}
            <Route path="/admin" element={<AdminDashboard />} />
            {/* User Profile page  */}
            <Route path="/profile" element={<UserProfile />} />
            {/* Job Details page */}
            <Route path='/jobs/:id' element={<JobDetails/>}/>
            {/* companies list page */}
            <Route path="/companies" element={<Companies />} />
            {/* company details page(individual basis) */}
            <Route path="/companies/:id" element={<CompanyDetails />} />
            {/* Job posts by an Employer page */}
            <Route path="/my-jobs" element={<MyJobPosts />} />
            {/* All users Manipulation page */}
            <Route path="/admin/users" element={<UsersManagement />} />
            {/*All companies Management page  */}
            <Route path="/admin/companies" element={<CompaniesManagement />} />
            {/* All Jobs Management page */}
            <Route path="/admin/jobs" element={<JobsManagement />} />
            {/* All Applications Management page */}
            <Route path="/admin/applications" element={<ApplicationsManagement />} /> 
            {/* Route for viewing applications by job ID */}
            <Route path="/applications/job/:jobId" element={<ApplicationsPage />} />   
            {/*Reset password page */}
            <Route path="/reset-password" element={<ResetPassword />} />      
          </Routes>
          </AnimatePresence>
        </Box>
        <Footer/>
    </ThemeProvider>
  );
}

export default App;