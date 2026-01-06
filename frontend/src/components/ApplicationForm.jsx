import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  CheckCircle as CheckIcon,
  Person as PersonIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import axios from "axios";

function JobApplicationForm({ jobId, onSuccess }) {
  const [resume, setResume] = useState(null);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get current user info from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const validate = () => {
    const e = {};
    if (!resume) {
      e.resume = "Please upload your resume";
    } else {
      // Check file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(resume.type)) {
        e.resume = "Only PDF and Word documents are allowed";
      }
      // Check file size (5MB max)
      if (resume.size > 5 * 1024 * 1024) {
        e.resume = "File size must be less than 5MB";
      }
    }
    if (!consent) {
      e.consent = "You must accept the terms to proceed";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResume(file);
      setErrors({ ...errors, resume: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validate()) return;

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData(); 
      formData.append("resume", resume);

        try {
          const response = await axios.post(
            `http://localhost:5600/api/applications/${jobId}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/formdata",
              },
              withCredentials: true,
            }
          );

          setSuccess("Application submitted successfully!");
          setResume(null);
          setConsent(false);
          setErrors({});

          // Reset file input
          const fileInput = document.getElementById("resume-upload");
          if (fileInput) fileInput.value = "";

          // Call success callback if provided
          if (onSuccess) {
            setTimeout(() => onSuccess(), 2000);
          }
        } catch (err) {
          setError(
            err.response?.data?.message ||
              "Failed to submit application. Please try again."
          );
        } finally {
          setSubmitting(false);
        }
      

      reader.onerror = () => {
        setError("Failed to read file. Please try again.");
        setSubmitting(false);
      };
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Apply for this Position
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Submit your application with your resume. Your profile information will
        be used automatically.
      </Typography>

      {/* User Info Card */}
      <Card sx={{ mb: 3, bgcolor: "background.default" }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Application will be submitted with:
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <PersonIcon fontSize="small" color="primary" />
            <Typography variant="body2">
              <strong>Name:</strong>{" "}
              {user.fullName || user.userName || "Not available"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <EmailIcon fontSize="small" color="primary" />
            <Typography variant="body2">
              <strong>Email:</strong> {user.email || "Not available"}
            </Typography>
          </Box>
          {user.contact && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
              <Typography variant="body2">
                <strong>Contact:</strong> {user.contact}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Divider sx={{ my: 3 }} />

      {/* Success Message */}
      {success ? (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          icon={<CheckIcon />}
          onClose={() => setSuccess("")}
        >
          {success}
        </Alert>
      ): (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit}>
        {/* Resume Upload */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="500">
            Upload Resume *
          </Typography>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            size="large"
            startIcon={resume ? <CheckIcon /> : <UploadIcon />}
            color={errors.resume ? "error" : resume ? "success" : "primary"}
            sx={{
              py: 2,
              justifyContent: "flex-start",
              textTransform: "none",
            }}
          >
            {resume ? `✓ ${resume.name}` : "Choose file (PDF or Word)"}
            <input
              id="resume-upload"
              hidden
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </Button>
          {errors.resume && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 1, display: "block" }}
            >
              {errors.resume}
            </Typography>
          )}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            Accepted formats: PDF, DOC, DOCX (Max 5MB)
          </Typography>
        </Box>

        {/* Consent Checkbox */}
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  setErrors({ ...errors, consent: "" });
                }}
                color={errors.consent ? "error" : "primary"}
              />
            }
            label={
              <Typography variant="body2">
                I consent to my data being processed for this job application
                and agree to the terms and conditions.
              </Typography>
            }
          />
          {errors.consent && (
            <Typography
              variant="caption"
              color="error"
              sx={{ display: "block", ml: 4 }}
            >
              {errors.consent}
            </Typography>
          )}
        </Box>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={submitting}
          sx={{ py: 1.5 }}
        >
          {submitting ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Submitting Application...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 2, display: "block", textAlign: "center" }}
        >
          By submitting, you agree that the employer can contact you regarding
          this application.
        </Typography>
      </Box>
    </Box>
  );
}

export default JobApplicationForm;
