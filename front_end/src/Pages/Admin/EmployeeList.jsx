import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Switch,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment,
  Grid,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import axios from "axios";

const EmployeeList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    user_type: "employee",
    password: "",
  });

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const token = localStorage.getItem("accessToken");

  const showNotify = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotify = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const getUserList = useCallback(
    async (page = 1, limit = 10, search = "") => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/user/get-all`,
          {
            params: { page, limit, search },
            headers: {
              "ngrok-skip-browser-warning": "true",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          setUsers(res.data.data.users || []);
          setPagination({
            current: res.data.data.pagination?.page || page,
            pageSize: res.data.data.pagination?.limit || limit,
            total: res.data.data.total_users || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    getUserList();
  }, [getUserList]);

  const handleChangePage = (event, newPage) => {
    const page = newPage + 1;
    setPagination((prev) => ({ ...prev, current: page }));
    getUserList(page, pagination.pageSize, searchText);
  };

  const handleChangeRowsPerPage = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPagination((prev) => ({ ...prev, pageSize: newSize, current: 1 }));
    getUserList(1, newSize, searchText);
  };

  const onSearchChange = (e) => {
    const val = e.target.value;
    setSearchText(val);
    getUserList(1, pagination.pageSize, val);
  };

  const handleOpenModal = (employee = null) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        full_name: employee.full_name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        user_type: employee.user_type || "employee",
        password: "",
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        user_type: "employee",
        password: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (
      !formData.full_name ||
      !formData.email ||
      (!editingEmployee && !formData.password)
    ) {
      showNotify("Please fill in all required fields (Full name, email, and password)", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = { ...formData };

      if (editingEmployee) {
        await axios.put(
          `${import.meta.env.VITE_APP_BACKEND_URL}/user/edit/${editingEmployee._id}`,
          payload,
          config
        );
        showNotify("User Updated Successfully!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_APP_BACKEND_URL}/user/add`,
          payload,
          config
        );
        showNotify("User Added Successfully!");
      }
      setShowModal(false);
      getUserList(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      console.error(error);
      showNotify(error.response?.data?.message || "Something went wrong!", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (checked, record) => {
    try {
      let res = await axios.patch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/user/toggle-status/${record._id}`,
        { is_active: checked },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        showNotify("Status Updated Successfully");
        getUserList(pagination.current, pagination.pageSize, searchText);
      }
    } catch (error) {
      console.error(error);
      showNotify("Failed to update status", "error");
    }
  };

  const renderRoleChip = (role) => {
    if (role === "super_admin") {
      return <Chip label="Super Admin" color="secondary" size="small" sx={{ fontWeight: 600 }} />;
    }
    if (role === "admin") {
      return <Chip label="Admin" color="warning" size="small" sx={{ fontWeight: 600 }} />;
    }
    return <Chip label="Employee" color="info" size="small" sx={{ fontWeight: 600 }} />;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Header Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h5" fontWeight={700} sx={{ color: "#0f172a" }}>
          User & Employee Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
          sx={{ fontWeight: 600, py: 1, px: 2.5 }}
        >
          Add User
        </Button>
      </Box>

      {/* Main Table Card */}
      <Paper elevation={3} sx={{ borderRadius: 3, p: 2 }}>
        {/* Search Bar */}
        <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-start" }}>
          <TextField
            placeholder="Search by name or email..."
            size="small"
            value={searchText}
            onChange={onSearchChange}
            sx={{ width: { xs: "100%", sm: 350 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* User Data Table */}
        <TableContainer sx={{ borderRadius: 2 }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: "#f1f5f9" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Full Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={32} />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3, color: "text.secondary" }}>
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((row) => (
                  <TableRow key={row._id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{row.full_name || "-"}</TableCell>
                    <TableCell>{row.email || "-"}</TableCell>
                    <TableCell>{row.phone || "-"}</TableCell>
                    <TableCell>{renderRoleChip(row.user_type)}</TableCell>
                    <TableCell>
                      <Switch
                        checked={Boolean(row.is_active)}
                        onChange={(e) => handleStatusChange(e.target.checked, row)}
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleOpenModal(row)}
                        title="Edit User"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Table Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={pagination.total}
          rowsPerPage={pagination.pageSize}
          page={pagination.current - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Add / Edit User Dialog Modal */}
      <Dialog open={showModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, bgcolor: "#0f172a", color: "#ffffff" }}>
          {editingEmployee ? "Edit User" : "Add New User"}
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 3 }}>
          <Box component="form" onSubmit={handleSubmit} id="user-form">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name *"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="role-select-label">User Role *</InputLabel>
                  <Select
                    labelId="role-select-label"
                    label="User Role *"
                    name="user_type"
                    value={formData.user_type}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  >
                    <MenuItem value="employee">Employee</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={editingEmployee ? "Password (leave blank to keep current)" : "Password *"}
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required={!editingEmployee}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseModal} disabled={isSubmitting} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            form="user-form"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{ minWidth: 100 }}
          >
            {isSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : editingEmployee ? (
              "Update"
            ) : (
              "Save"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotify}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseNotify} severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EmployeeList;
