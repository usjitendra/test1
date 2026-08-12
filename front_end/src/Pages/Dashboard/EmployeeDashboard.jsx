import React from "react";
import {
  Box,
  Container,
  Paper,
  Grid,
  Typography,
  Avatar,
  Chip,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { Person as PersonIcon, VpnKey as KeyIcon, CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Paper
        elevation={4}
        sx={{
          p: 3.5,
          borderRadius: 0,
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#ffffff",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: "success.main" }}>
              <PersonIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Welcome, {user.full_name || "User"}!
              </Typography>
              <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5 }}>
                Logged in as User Account
              </Typography>
            </Box>
          </Box>
          <Chip
            icon={<CheckCircleIcon sx={{ color: "#ffffff !important" }} />}
            label="Active Session"
            color="success"
            sx={{ px: 1, py: 2, fontWeight: 600, borderRadius: 0 }}
          />
        </Box>
      </Paper>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 0, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: "#0f172a" }}>
                Account Details
              </Typography>
              <Box sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Full Name:</strong> {user.full_name || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Email:</strong> {user.email || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>User Role:</strong> {user.user_type || "employee"}
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/employee/profile")}
                sx={{ mt: 2 }}
              >
                View / Edit Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 0, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: "#0f172a" }}>
                Quick Security Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
                Manage your account credentials and update your password anytime.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<KeyIcon />}
                onClick={() => navigate("/employee/change-password")}
                sx={{ mt: 2 }}
              >
                Change Password
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
export default EmployeeDashboard;
