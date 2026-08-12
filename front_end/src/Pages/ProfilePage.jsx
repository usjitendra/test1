import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Grid,
  Typography,
  Avatar,
  TextField,
  Button,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import { Edit as EditIcon, Save as SaveIcon, Lock as LockIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    user_type: "",
    department: "",
    phone: "",
  });
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("accessToken") || "";
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(stored);
    setFormData({
      full_name: stored.full_name || stored.username || "",
      email: stored.email || "",
      user_type: stored.user_type || "",
      department: stored.department || "",
      phone: stored.phone || "",
    });
  }, []);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCloseNotify = () => setNotification((prev) => ({ ...prev, open: false }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedPayload = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
      };

      const res = await axios.put(
        `${import.meta.env.VITE_APP_BACKEND_URL}/user/update`,
        updatedPayload,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        const newUserObj = { ...user, ...res.data.data };
        setUser(newUserObj);
        localStorage.setItem("user", JSON.stringify(newUserObj));
        setNotification({ open: true, message: "Profile updated successfully", severity: "success" });
        setEditing(false);
      } else {
        setNotification({ open: true, message: res.data.message || "Failed to update profile", severity: "error" });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to update profile",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        {/* Header Profile Section */}
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 3, mb: 3 }}>
          <Avatar
            sx={{
              width: 90,
              height: 90,
              bgcolor: "primary.main",
              fontSize: 32,
              fontWeight: 700,
              boxShadow: "0 4px 12px rgba(0,174,239,0.3)",
            }}
          >
            {getInitials(user.full_name || user.username)}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" fontWeight={700} sx={{ color: "#0f172a" }}>
              {user.full_name || user.username || "User"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {user.email}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <Button
              variant={editing ? "outlined" : "contained"}
              startIcon={<EditIcon />}
              onClick={() => setEditing(!editing)}
              color="primary"
            >
              {editing ? "Cancel" : "Edit Profile"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<LockIcon />}
              onClick={() => {
                if (user.user_type === "employee") {
                  navigate("/employee/change-password");
                } else {
                  navigate("/admin/change-password");
                }
              }}
            >
              Change Password
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Profile Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                disabled={!editing || loading}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="User Role"
                name="user_type"
                value={formData.user_type}
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                disabled={!editing || loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!editing || loading}
              />
            </Grid>
          </Grid>

          {editing && (
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                size="large"
                disabled={loading}
              >
                Save Changes
              </Button>
            </Box>
          )}
        </Box>
      </Paper>

      <Snackbar open={notification.open} autoHideDuration={3000} onClose={handleCloseNotify} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleCloseNotify} severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;
