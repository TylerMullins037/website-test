import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Box,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Divider,
  Alert,
  useTheme,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Button,
  Stack,
} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, LineChart, Line, Legend, PieChart, Pie } from "recharts";
import SecurityIcon from '@mui/icons-material/Security';
import RefreshIcon from '@mui/icons-material/Refresh';
import WarningIcon from '@mui/icons-material/Warning';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';
import ShieldIcon from '@mui/icons-material/Shield';
import FilterListIcon from '@mui/icons-material/FilterList';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimelineIcon from '@mui/icons-material/Timeline';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

// Custom theme
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
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#2c2c2c',
          color: '#fff',
          fontWeight: 600,
        },
      },
    },
  },
});

// Utility functions for API calls
const fetchAssets = async () => {
  const response = await fetch("http://localhost:5000/api/assets");
  return await response.json();
};

const fetchThreats = async () => {
  const response = await fetch("http://localhost:5000/api/threats");
  return await response.json();
};

const fetchThreatData = async () => {
  const response = await fetch("http://localhost:5000/api/threat_data");
  return await response.json();
};

const fetchMitigations = async () => {
  const response = await fetch("http://localhost:5000/api/mitigation-strategies");
  return await response.json();
};

// New API function for risk trends
const fetchRiskTrends = async () => {
  const response = await fetch("http://localhost:5000/api/risk-trends");
  return await response.json();
};

// Risk score color mapping
const getRiskColor = (score) => {
  if (score >= 20) return '#f44336'; // High risk - red
  if (score >= 10) return '#ff9800'; // Medium risk - orange
  return '#4caf50'; // Low risk - green
};

// Convert risk score to text
const getRiskLevel = (score) => {
  if (score >= 20) return 'High';
  if (score >= 10) return 'Medium';
  return 'Low';
};

export default function ThreatDashboard() {
  const [assets, setAssets] = useState([]);
  const [threats, setThreats] = useState([]);
  const [threatData, setThreatData] = useState([]);
  const [riskScores, setRiskScores] = useState([]);
  const [mitigations, setMitigations] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterRisk, setFilterRisk] = useState("");
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // New state variables for enhanced filtering and risk trends
  const [riskTrends, setRiskTrends] = useState([]);
  const [filterSeverity, setFilterSeverity] = useState("");
  const [filterImpactLevel, setFilterImpactLevel] = useState("");
  const [filterThreatType, setFilterThreatType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const assetsData = await fetchAssets();
        const threatsData = await fetchThreats();
        const threatDataResults = await fetchThreatData();
        const mitigationsData = await fetchMitigations();
        const riskTrendsData = await fetchRiskTrends(); // New data fetch
        
        setAssets(assetsData);
        setThreats(threatsData);
        setThreatData(threatDataResults);
        setMitigations(mitigationsData);
        setRiskTrends(riskTrendsData); // Set the new data
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRiskScores(
        threats.map((threat) => ({
          threat: threat.name,
          risk: threat.risk_score,
          color: getRiskColor(threat.risk_score)
        }))
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [threats]);

  const handleRefresh = async () => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setAssets(await fetchAssets());
        setThreats(await fetchThreats());
        setThreatData(await fetchThreatData());
        setMitigations(await fetchMitigations());
        setRiskTrends(await fetchRiskTrends()); // Add this line
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Error refreshing data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  };

  // Get threat types from the threats data
  const getThreatTypes = () => {
    const types = [...new Set(threats.map(threat => threat.type || "Unclassified"))];
    return types;
  };

  const filteredAssets = assets.filter((asset) => !filterType || asset.asset_type === filterType);
  
  // Enhanced threat filtering
  const filteredThreats = threats.filter(
    (threat) => 
      (!filterRisk || threat.risk_score >= filterRisk) &&
      (!filterSeverity || getRiskLevel(threat.risk_score) === filterSeverity) &&
      (!filterImpactLevel || threat.impact === parseInt(filterImpactLevel)) &&
      (!filterThreatType || threat.type === filterThreatType)
  );

  // Get high risk threats count
  const highRiskCount = threats.filter(threat => threat.risk_score >= 20).length;

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <SecurityIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              ShopSmart Solutions Dashboard
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 2 }}>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </Typography>
              <IconButton color="inherit" onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        
        {/* Report Generation Buttons */}
        <Box sx={{ backgroundColor: 'background.paper', p: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
          <Container maxWidth="xl">
            <Stack 
              direction="row" 
              spacing={2} 
              justifyContent="flex-end" 
              alignItems="center"
            >
              <Button
                variant="outlined"
                color="primary"
                startIcon={<FileDownloadIcon />}
                onClick={() => {
                  fetch('http://localhost:5000/api/generate-csv-report')
                    .then(response => response.json())
                    .then(data => {
                      if (data.success) {
                        window.location.href = `http://localhost:5000/${data.file}`;
                      } else {
                        console.error(data.error);
                        // You might want to display an error message to the user
                      }
                    });
                }}
                
              >
                Export CSV Report
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PictureAsPdfIcon />}
                onClick={() => {
                  fetch('http://localhost:5000/api/generate-pdf-report')
                    .then(response => response.json())
                    .then(data => {
                      if (data.success) {
                        window.location.href = `http://localhost:5000/${data.file}`;
                      } else {
                        console.error(data.error);
                        // You might want to display an error message to the user
                      }
                    });
                }}
              >
                Generate PDF Report
              </Button>
            </Stack>
          </Container>
        </Box>
        
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          {/* Overview Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <StorageIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Typography variant="h5" component="div">
                    {assets.length}
                  </Typography>
                  <Typography color="text.secondary">
                    Monitored Assets
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <WarningIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                  <Typography variant="h5" component="div">
                    {threats.length}
                  </Typography>
                  <Typography color="text.secondary">
                    Active Threats
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <ShieldIcon sx={{ fontSize: 40, color: 'error.main' }} />
                  <Typography variant="h5" component="div">
                    {highRiskCount}
                  </Typography>
                  <Typography color="text.secondary">
                    High Risk Threats
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <DashboardIcon sx={{ fontSize: 40, color: 'success.main' }} />
                  <Typography variant="h5" component="div">
                    {mitigations.length}
                  </Typography>
                  <Typography color="text.secondary">
                    Mitigation Strategies
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Enhanced Filtering Controls */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" component="div">
                      <FilterListIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                      Enhanced Threat Filtering
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        select
                        label="Filter by Severity"
                        value={filterSeverity}
                        onChange={(e) => setFilterSeverity(e.target.value)}
                        variant="outlined"
                        size="small"
                        fullWidth
                      >
                        <MenuItem value="">All Severity Levels</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Low">Low</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        select
                        label="Filter by Impact"
                        value={filterImpactLevel}
                        onChange={(e) => setFilterImpactLevel(e.target.value)}
                        variant="outlined"
                        size="small"
                        fullWidth
                      >
                        <MenuItem value="">All Impact Levels</MenuItem>
                        <MenuItem value="5">Very High (5)</MenuItem>
                        <MenuItem value="4">High (4)</MenuItem>
                        <MenuItem value="3">Medium (3)</MenuItem>
                        <MenuItem value="2">Low (2)</MenuItem>
                        <MenuItem value="1">Very Low (1)</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        select
                        label="Filter by Threat Type"
                        value={filterThreatType}
                        onChange={(e) => setFilterThreatType(e.target.value)}
                        variant="outlined"
                        size="small"
                        fullWidth
                      >
                        <MenuItem value="">All Threat Types</MenuItem>
                        {getThreatTypes().map((type) => (
                          <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        label="Min Risk Score"
                        type="number"
                        value={filterRisk}
                        onChange={(e) => setFilterRisk(e.target.value)}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  
                  {/* Filter Results Summary */}
                  <Box sx={{ mt: 2, p: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      Displaying {filteredThreats.length} out of {threats.length} threats based on current filters
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {filterSeverity && (
                        <Chip 
                          label={`Severity: ${filterSeverity}`} 
                          onDelete={() => setFilterSeverity("")} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      )}
                      {filterImpactLevel && (
                        <Chip 
                          label={`Impact: ${filterImpactLevel}`} 
                          onDelete={() => setFilterImpactLevel("")} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      )}
                      {filterThreatType && (
                        <Chip 
                          label={`Type: ${filterThreatType}`} 
                          onDelete={() => setFilterThreatType("")} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      )}
                      {filterRisk && (
                        <Chip 
                          label={`Min Risk: ${filterRisk}`} 
                          onDelete={() => setFilterRisk("")} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Asset Inventory */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" component="div">
                      Asset Inventory
                    </Typography>
                    <TextField
                      select
                      label="Filter by Type"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{ width: 200 }}
                    >
                      <MenuItem value="">All Types</MenuItem>
                      {[...new Set(assets.map((a) => a.asset_type))].map((type) => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </TextField>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 300, overflow: 'auto' }}>
                    <TableContainer component={Paper} elevation={0}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell width="25%">Name</TableCell>
                            <TableCell width="20%">Type</TableCell>
                            <TableCell width="55%">Description</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredAssets.length > 0 ? (
                            filteredAssets.map((asset) => (
                              <TableRow 
                                key={asset.id}
                                hover
                                sx={{
                                  '&:hover': {
                                    backgroundColor: 'rgba(63, 81, 181, 0.08)',
                                  }
                                }}
                              >
                                <TableCell sx={{ fontWeight: 'medium' }}>{asset.asset_name}</TableCell>
                                <TableCell>
                                  <Chip 
                                    label={asset.asset_type} 
                                    size="small" 
                                    color="primary" 
                                    variant="outlined" 
                                  />
                                </TableCell>
                                <TableCell sx={{ 
                                  maxWidth: 0,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  '&:hover': {
                                    whiteSpace: 'normal',
                                    wordBreak: 'break-word'
                                  }
                                }}>
                                  {asset.description}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                                <Typography variant="body2" color="text.secondary">
                                  No assets found with the selected filters
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Threat Intelligence */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" component="div">
                      Threat Intelligence Overview
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 300, overflow: 'auto' }}>
                    <TableContainer component={Paper} elevation={0}>
                      <Table stickyHeader size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell width="25%">Threat</TableCell>
                            <TableCell width="30%">Vulnerability</TableCell>
                            <TableCell align="center" width="15%">Likelihood</TableCell>
                            <TableCell align="center" width="15%">Impact</TableCell>
                            <TableCell align="center" width="15%">Risk</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredThreats.length > 0 ? (
                            filteredThreats.map((threat, index) => (
                              <TableRow 
                                key={index}
                                hover
                                sx={{
                                  '&:hover': {
                                    backgroundColor: 'rgba(244, 67, 54, 0.08)',
                                  },
                                  borderLeft: `4px solid ${getRiskColor(threat.risk_score)}`,
                                }}
                              >
                                <TableCell sx={{ 
                                  fontWeight: 'medium',
                                  maxWidth: 0,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  '&:hover': {
                                    whiteSpace: 'normal'
                                  }
                                }}>
                                  {threat.name}
                                </TableCell>
                                <TableCell sx={{ 
                                  maxWidth: 0,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  '&:hover': {
                                    whiteSpace: 'normal',
                                    wordBreak: 'break-word'
                                  }
                                }}>
                                  {threat.vulnerability}
                                </TableCell>
                                <TableCell align="center">
                                  <Box 
                                    sx={{ 
                                      display: 'inline-block',
                                      bgcolor: 'rgba(255, 152, 0, 0.1)',
                                      borderRadius: '4px',
                                      px: 1,
                                      py: 0.5
                                    }}
                                  >
                                    {threat.likelihood}/5
                                  </Box>
                                </TableCell>
                                <TableCell align="center">
                                  <Box 
                                    sx={{ 
                                      display: 'inline-block',
                                      bgcolor: 'rgba(244, 67, 54, 0.1)',
                                      borderRadius: '4px',
                                      px: 1,
                                      py: 0.5
                                    }}
                                  >
                                    {threat.impact}/5
                                  </Box>
                                </TableCell>
                                <TableCell align="center">
                                  <Chip 
                                    label={`${threat.risk_score} - ${getRiskLevel(threat.risk_score)}`} 
                                    size="small" 
                                    sx={{ 
                                      bgcolor: getRiskColor(threat.risk_score),
                                      color: 'white',
                                      fontWeight: 'bold' 
                                    }} 
                                  />
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                <Typography variant="body2" color="text.secondary">
                                  No threats found matching the current criteria
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

           {/* Risk Trends Chart */}
<Grid item xs={12} md={6}>
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="div">
          <TimelineIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
          Risk Trend Analysis
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={riskTrends}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
            <YAxis />
            <Tooltip 
              labelFormatter={(date) => new Date(date).toLocaleDateString()} 
              formatter={(value) => [value + " threats", "Count"]} 
            />
            <Legend verticalAlign="top" height={36} />
            <Bar 
              dataKey="count" 
              name="Threat Count" 
              fill="#3f51b5" 
              barSize={30} 
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </CardContent>
  </Card>
</Grid>


            {/* Threat Distribution Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" component="div">
                      <AssessmentIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                      Threat Distribution
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'High Risk', value: threats.filter(t => getRiskLevel(t.risk_score) === 'High').length, fill: '#f44336' },
                            { name: 'Medium Risk', value: threats.filter(t => getRiskLevel(t.risk_score) === 'Medium').length, fill: '#ff9800' },
                            { name: 'Low Risk', value: threats.filter(t => getRiskLevel(t.risk_score) === 'Low').length, fill: '#4caf50' },
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                          dataKey="value"
                        />
                        <Tooltip formatter={(value, name) => [`${value} threats`, name]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Threat Data */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                    Threat Data
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 300, overflow: 'auto' }}>
                    <TableContainer component={Paper} elevation={0}>
                      <Table stickyHeader size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell width="25%">IP Address</TableCell>
                            <TableCell width="35%">Ports</TableCell>
                            <TableCell width="40%">Services</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {threatData.length > 0 ? (
                            threatData.map((threats_data, id) => (
                              <TableRow 
                                key={id}
                                hover
                                sx={{
                                  '&:hover': {
                                    backgroundColor: 'rgba(33, 150, 243, 0.08)',
                                  }
                                }}
                              >
                                <TableCell sx={{ fontWeight: 'medium' }}>
                                  <Box sx={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}>
                                    <Box 
                                      sx={{ 
                                        width: 8, 
                                        height: 8, 
                                        borderRadius: '50%', 
                                        bgcolor: 'info.main',
                                        mr: 1.5
                                      }} 
                                    />
                                    {threats_data.ip_address}
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {Array.isArray(threats_data.ports) ? 
                                      threats_data.ports.map((port, i) => (
                                        <Chip 
                                          key={i}
                                          label={port} 
                                          size="small" 
                                          sx={{ 
                                            bgcolor: 'rgba(33, 150, 243, 0.1)',
                                            borderRadius: '4px',
                                            height: '24px'
                                          }} 
                                        />
                                      )) : 
                                      threats_data.ports
                                    }
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {Array.isArray(threats_data.services) ? threats_data.services.map((service, i) => (
                                        <Chip 
                                          key={i}
                                          label={service} 
                                          size="small" 
                                          color="info"
                                          variant="outlined"
                                          sx={{ 
                                            borderRadius: '4px',
                                            height: '24px'
                                          }} 
                                        />
                                      )) : 
                                      threats_data.services
                                    }
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                                <Typography variant="body2" color="text.secondary">
                                  No threat data available
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                  </CardContent>
              </Card>
            </Grid>

            {/* Mitigation Strategies */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                    Mitigation Strategies
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 300, overflow: 'auto' }}>
                    <TableContainer component={Paper} elevation={0}>
                      <Table stickyHeader size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell width="30%">Threat</TableCell>
                            <TableCell width="70%">Strategies</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {mitigations.length > 0 ? (
                            mitigations.map((mit, id) => (
                              <TableRow 
                                key={id}
                                hover
                                sx={{
                                  '&:hover': {
                                    backgroundColor: 'rgba(76, 175, 80, 0.08)',
                                  }
                                }}
                              >
                                <TableCell 
                                  sx={{ 
                                    fontWeight: 'medium',
                                    verticalAlign: 'top',
                                    borderLeft: '4px solid rgba(76, 175, 80, 0.6)',
                                    paddingLeft: 2
                                  }}
                                >
                                  {mit.threat}
                                </TableCell>
                                <TableCell>
                                  {typeof mit.strategies === 'string' ? (
                                    <Box 
                                      sx={{ 
                                        p: 1, 
                                        borderRadius: 1, 
                                        bgcolor: 'rgba(76, 175, 80, 0.1)',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 1
                                      }}
                                    >
                                      <ShieldIcon sx={{ color: 'success.main', mt: 0.5 }} fontSize="small" />
                                      <Typography variant="body2">
                                        {mit.strategies}
                                      </Typography>
                                    </Box>
                                  ) : Array.isArray(mit.strategies) ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                      {mit.strategies.map((strategy, i) => (
                                        <Box 
                                          key={i}
                                          sx={{ 
                                            p: 1, 
                                            borderRadius: 1, 
                                            bgcolor: 'rgba(76, 175, 80, 0.1)',
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 1
                                          }}
                                        >
                                          <ShieldIcon sx={{ color: 'success.main', mt: 0.5 }} fontSize="small" />
                                          <Typography variant="body2">
                                            {strategy}
                                          </Typography>
                                        </Box>
                                      ))}
                                    </Box>
                                  ) : null}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={2} align="center" sx={{ py: 3 }}>
                                <Typography variant="body2" color="text.secondary">
                                  No mitigation strategies available
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Risk Scores Chart */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                    Real-Time Risk Assessment
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 350 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={riskScores}
                        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="threat" 
                          angle={-45} 
                          textAnchor="end" 
                          height={70} 
                        />
                        <YAxis domain={[0, 25]} />
                        <Tooltip 
                          formatter={(value) => [`Risk Score: ${value}`, 'Risk Level']}
                          labelFormatter={(label) => `Threat: ${label}`}
                        />
                        <Bar 
                          dataKey="risk" 
                          name="Risk Score"
                          fill="#8884d8" 
                          radius={[4, 4, 0, 0]}
                        >
                          {riskScores.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}