import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("accessToken");

  const handleCloseNotify = () => setNotification((prev) => ({ ...prev, open: false }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setNotification({ open: true, message: "Passwords do not match!", severity: "error" });
      return;
    }
    if (password.length < 6) {
      setNotification({ open: true, message: "Password must be at least 6 characters!", severity: "error" });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/user/change-password`,
        { password },
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setNotification({ open: true, message: "Password changed successfully!", severity: "success" });
        setTimeout(() => {
          if (user.user_type === "employee") {
            navigate("/employee");
          } else {
            navigate("/admin");
          }
        }, 1000);
      } else {
        setNotification({
          open: true,
          message: response.data.message || "Failed to change password.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "An error occurred.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
          <Typography variant="h5" component="h2" fontWeight={700} gutterBottom sx={{ color: "#0f172a" }}>
            Change Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter your new password below
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.2, fontWeight: 600 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Change Password"}
            </Button>
          </Box>
        </Paper>
      </Container>

      <Snackbar open={notification.open} autoHideDuration={3000} onClose={handleCloseNotify} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleCloseNotify} severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChangePassword;
