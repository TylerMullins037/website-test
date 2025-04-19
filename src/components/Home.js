import React from "react";
import { 
  Button, 
  Typography, 
  Container, 
  Box, 
  Paper, 
  Grid, 
  Divider,
  Card,
  CardContent,
  ThemeProvider,
  createTheme,
  CssBaseline
} from "@mui/material";
import { Link } from "react-router-dom";
import SecurityIcon from '@mui/icons-material/Security';
import ShieldIcon from '@mui/icons-material/Shield';
import StorefrontIcon from '@mui/icons-material/Storefront';
import DashboardIcon from '@mui/icons-material/Dashboard';

// Custom theme that matches the dashboard and login page
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
    h3: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
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
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
        },
      },
    },
  },
});

const Home = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #1e1e1e 0%, #2d3748 100%)',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            py: 2,
            bgcolor: 'rgba(0, 0, 0, 0.3)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <Container>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ShieldIcon sx={{ fontSize: 32, color: '#3f51b5', mr: 2 }} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                CyberShield
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Hero Section */}
        <Container sx={{ mt: 8, mb: 6, textAlign: 'center' }}>
          <Typography 
            variant="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 700, 
              background: 'linear-gradient(45deg, #3f51b5 30%, #8d99e6 90%)', 
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3
            }}
          >
            Real-Time Threat Intelligence
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              maxWidth: 700, 
              mx: 'auto', 
              mb: 5, 
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: 1.6
            }}
          >
            Secure your enterprise with our advanced security monitoring and threat intelligence platform. Monitor, detect and respond to security threats in real-time.
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to="/login"
            size="large"
            startIcon={<SecurityIcon />}
            sx={{ 
              py: 1.5, 
              px: 4, 
              fontSize: '1.1rem'
            }}
          >
            Access Dashboard
          </Button>
        </Container>
        
        {/* Feature Cards */}
        <Container sx={{ my: 6 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <ShieldIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    Threat Assessment
                  </Typography>
                  <Typography color="text.secondary">
                    Real-time monitoring and assessment of security threats across your organization's digital infrastructure.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <SecurityIcon sx={{ fontSize: 60, color: 'info.main', mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    Asset Protection
                  </Typography>
                  <Typography color="text.secondary">
                    Comprehensive inventory and protection of your critical digital and physical assets from cyber threats.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <DashboardIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    Security Dashboard
                  </Typography>
                  <Typography color="text.secondary">
                    Intuitive visualization of security data with actionable insights and mitigation strategies.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
        
        {/* Call to Action */}
        <Box 
          sx={{ 
            mt: 'auto',
            bgcolor: 'rgba(63, 81, 181, 0.1)', 
            py: 5,
            borderTop: '1px solid rgba(63, 81, 181, 0.3)'
          }}
        >
          <Container sx={{ textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Ready to secure your enterprise?
            </Typography>
            <Typography 
              variant="body1" 
              paragraph 
              sx={{ 
                maxWidth: 700, 
                mx: 'auto', 
                mb: 3,
                color: 'rgba(255, 255, 255, 0.7)'
              }}
            >
              Get immediate access to our enterprise security platform and start monitoring your security posture today.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                to="/login"
              >
                Login
              </Button>
              <Button 
                variant="outlined" 
                color="primary" 
                component={Link} 
                to="/contact"
              >
                Contact Sales
              </Button>
            </Box>
          </Container>
        </Box>
        
        {/* Footer */}
        <Box 
          sx={{ 
            py: 3, 
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            bgcolor: 'rgba(0, 0, 0, 0.3)'
          }}
        >
          <Container>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              align="center"
            >
              Â© 2025 ShopSmart Solutions. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Home;