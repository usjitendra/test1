import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Avatar,
} from "@mui/material";
import {
  People as PeopleIcon,
  Stars as AdminIcon,
  CheckCircle as ActiveIcon,
} from "@mui/icons-material";
import axios from "axios";
const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({ total_employees: 0, total_admins: 0, active_users: 0 });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/user/get-all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setStats({
            total_employees: res.data.data.total_employees || 0,
            total_admins: res.data.data.total_admins || 0,
            active_users: res.data.data.active_users || 0,
          });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 1 }}>
        <Typography variant="h5" fontWeight={700} sx={{ color: "#0f172a" }}>
          Super Admin Dashboard
        </Typography>
        <Chip
          label="Super Admin Control Center"
          color="secondary"
          sx={{ fontWeight: 600, px: 1, py: 2, borderRadius: 0 }}
        />
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ borderRadius: 0, backgroundColor: "#ffffff" }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "#f3e8ff", color: "#8b5cf6", width: 56, height: 56, borderRadius: 0 }}>
                  <AdminIcon fontSize="large" />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Total Admins
                  </Typography>
                  {loading ? (
                    <CircularProgress size={24} sx={{ mt: 1 }} />
                  ) : (
                    <Typography variant="h4" fontWeight={700} sx={{ color: "#0f172a", mt: 0.5 }}>
                      {stats.total_admins}
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ borderRadius: 0, backgroundColor: "#ffffff" }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "#e0f2fe", color: "#00AEEF", width: 56, height: 56, borderRadius: 0 }}>
                  <PeopleIcon fontSize="large" />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Total Employees
                  </Typography>
                  {loading ? (
                    <CircularProgress size={24} sx={{ mt: 1 }} />
                  ) : (
                    <Typography variant="h4" fontWeight={700} sx={{ color: "#0f172a", mt: 0.5 }}>
                      {stats.total_employees}
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ borderRadius: 0, backgroundColor: "#ffffff" }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "#dcfce7", color: "#16a34a", width: 56, height: 56, borderRadius: 0 }}>
                  <ActiveIcon fontSize="large" />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Active Users
                  </Typography>
                  {loading ? (
                    <CircularProgress size={24} sx={{ mt: 1 }} />
                  ) : (
                    <Typography variant="h4" fontWeight={700} sx={{ color: "#0f172a", mt: 0.5 }}>
                      {stats.active_users}
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
export default SuperAdminDashboard;
