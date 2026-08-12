import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import './index.css'
import App from './App.jsx'
const theme = createTheme({
  palette: {
    primary: {
      main: '#00AEEF',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8b5cf6',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiPaper: { styleOverrides: { root: { borderRadius: 0 } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 0 } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 0 } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 0 } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 0 } } },
    MuiTableContainer: { styleOverrides: { root: { borderRadius: 0 } } },
  },
});
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </BrowserRouter>
)

