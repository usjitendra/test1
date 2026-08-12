import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { People as PeopleIcon, Stars as AdminIcon } from "@mui/icons-material";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total_employees: 0, total_admins: 0 });
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
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: "#0f172a" }}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Total Employees */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 3, backgroundColor: "#ffffff" }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                <Avatar sx={{ bgcolor: "#e0f2fe", color: "#00AEEF", width: 60, height: 60, borderRadius: 3 }}>
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

        {/* Total Admins */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 3, backgroundColor: "#ffffff" }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                <Avatar sx={{ bgcolor: "#f3e8ff", color: "#8b5cf6", width: 60, height: 60, borderRadius: 3 }}>
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
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
