import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Card, 
  CardContent, 
  Box, 
  CssBaseline,
  Paper,
  IconButton,
  InputAdornment,
  ThemeProvider,
  createTheme,
  Avatar,
  Link,
  Alert,
  Divider
} from "@mui/material";
import { useAuth } from "../AuthContext";
import SecurityIcon from '@mui/icons-material/Security';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import StorefrontIcon from '@mui/icons-material/Storefront';

// Custom theme that matches the dashboard
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none',
          padding: '10px 24px',
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: 16,
        },
      },
    },
  },
});

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    // Mock authentication (Replace with real authentication logic)
    if (username === "admin" && password === "myPassword!") {
      login(); // Set authentication state
      navigate("/dashboard"); // Redirect to Dashboard
    } else {
      setError("Invalid username or password.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e1e1e 0%, #2d3748 100%)',
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  sx={{ 
                    m: 1, 
                    bgcolor: 'primary.main',
                    width: 60,
                    height: 60
                  }}
                >
                  <StorefrontIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography 
                  component="h1" 
                  variant="h4" 
                  sx={{ 
                    mt: 2, 
                    fontWeight: 700,
                    color: 'white',
                    textAlign: 'center'
                  }}
                >
                  ShopSmart Solutions
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  color="text.secondary"
                  sx={{ 
                    mb: 1,
                    textAlign: 'center'
                  }}
                >
                  Security Management Portal
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ mb: 3 }}
                  icon={<LockOutlinedIcon />}
                >
                  {error}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ color: 'text.secondary' }}>
                        <SecurityIcon />
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ color: 'text.secondary' }}>
                        <LockOutlinedIcon />
                      </Box>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleLogin}
                size="large"
                sx={{ 
                  mt: 2, 
                  py: 1.5,
                  fontSize: '1rem'
                }}
              >
                Sign In
              </Button>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Link href="#" variant="body2" sx={{ color: 'primary.main' }}>
                  Forgot password?
                </Link>
              </Box>

              <Typography 
                variant="body2" 
                color="text.secondary" 
                align="center" 
                sx={{ mt: 4 }}
              >
                Â© 2025 ShopSmart Solutions. All rights reserved.
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;