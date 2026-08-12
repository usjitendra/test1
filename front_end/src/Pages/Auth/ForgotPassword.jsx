import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
  Link,
} from '@mui/material';
const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();
  const handleCloseNotify = () => setNotification((prev) => ({ ...prev, open: false }));
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username) return;
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('resetEmail', username);
      setNotification({ open: true, message: 'Password reset link sent! Redirecting...', severity: 'success' });
      setTimeout(() => {
        navigate('/reset-password');
      }, 1000);
      setLoading(false);
    }, 500);
  };
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 0, textAlign: 'center' }}>
          <Typography variant="h5" component="h2" fontWeight={700} gutterBottom sx={{ color: '#0f172a' }}>
            Forgot Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter your username to reset password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              autoFocus
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
            <Box sx={{ mt: 2 }}>
              <Link component={RouterLink} to="/" variant="body2" underline="hover" color="primary">
                Back to Login
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
      <Snackbar open={notification.open} autoHideDuration={3000} onClose={handleCloseNotify} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseNotify} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
export default ForgotPassword;
