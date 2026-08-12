import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
  Link,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
const LoginPage = () => {
  const [isReset, setIsReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  const navigate = useNavigate();
  const loginTime = Date.now();
  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const showNotify = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };
  const handleCloseNotify = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      showNotify('Please enter Email and Password', 'error');
      return;
    }
    setLoading(true);
    try {
      const loginRes = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/user/login`, {
        email: formData.email,
        password: formData.password,
      });
      const resData = loginRes?.data;
      if (resData?.success && resData?.data) {
        const { user, accessToken } = resData.data;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('loginTime', loginTime.toString());
        showNotify(resData.message || 'Login successful');
        setTimeout(() => {
          if (user?.user_type === 'super_admin') {
            navigate('/super-admin');
          } else if (user?.user_type === 'admin') {
            navigate('/admin');
          } else {
            navigate('/employee');
          }
        }, 500);
      } else {
        showNotify(resData?.message || 'Login failed', 'error');
      }
    } catch (error) {
      console.error('Login error', error);
      const errMsg = error?.response?.data?.message || 'Login failed, please try again';
      showNotify(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      showNotify('Please enter a valid email!', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      showNotify(`Password reset link sent to ${formData.email}`);
      setIsReset(false);
      setFormData((prev) => ({ ...prev, email: '', password: '' }));
      setLoading(false);
    }, 1200);
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      showNotify('Passwords do not match!', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      showNotify('Password reset successfully!');
      setIsReset(false);
      setFormData({ email: '', password: '', newPassword: '', confirmPassword: '' });
      setLoading(false);
    }, 1200);
  };
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 0,
            backgroundColor: '#ffffff',
          }}
        >
          <Box
            component="img"
            src="/jamtech.png"
            alt="Jamtech Technologies"
            sx={{ width: 220, mb: 3, objectFit: 'contain' }}
          />
          {isReset === 'forgot' ? (
            <Box component="form" onSubmit={handleForgotPassword} sx={{ width: '100%' }}>
              <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: 600 }}>
                Forgot Password
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                Enter your email to receive a password reset link
              </Typography>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
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
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
              </Button>
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={() => !loading && setIsReset(false)}
                  underline="hover"
                  sx={{ cursor: 'pointer', color: 'primary.main' }}
                >
                  Back to Login
                </Link>
              </Box>
            </Box>
          ) : isReset === 'reset' ? (
            <Box component="form" onSubmit={handleResetPassword} sx={{ width: '100%' }}>
              <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: 600 }}>
                Reset Password
              </Typography>
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={handleInputChange}
                margin="normal"
                required
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
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
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
              </Button>
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={() => !loading && setIsReset(false)}
                  underline="hover"
                  sx={{ cursor: 'pointer', color: 'primary.main' }}
                >
                  Back to Login
                </Link>
              </Box>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
              <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: 600 }}>
                Sign In
              </Typography>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                margin="normal"
                required
                disabled={loading}
                autoFocus
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                margin="normal"
                required
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2, py: 1.2, fontWeight: 600 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotify}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotify} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
export default LoginPage;
