import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Breadcrumbs,
  Link as MuiLink,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  Divider
} from '@mui/material';
import { Link } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloudIcon from '@mui/icons-material/Cloud';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Import components
import PlanningTable from './components/PlanningTable';
import ArticleDetailView from './components/ArticleDetailView';
import AreaChart from './components/AreaChart';
import MetricCard from './components/MetricCard';

// Keep the Chart.js registration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

const PlanningPage = () => {
  // State variables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table', 'detail', or 'forecast'
  const [selectedDayForOrder, setSelectedDayForOrder] = useState(null);
  
  // Branch selection state (from PlanPage)
  const [plz, setPlz] = useState('10115');
  const [weather, setWeather] = useState([]);
  const [horizon, setHorizon] = useState(7);
  const [branch, setBranch] = useState('main');
  const [preds, setPreds] = useState([]);
  const [activeTab, setActiveTab] = useState(0); // 0 for table view, 1 for forecast view

  // Load weather and forecast data
  const loadForecast = () => {
    setLoading(true);
    
    // Mock API call for prediction data
    setTimeout(() => {
      // Generate some mock prediction data
      const mockPreds = Array.from({ length: horizon }, () => 
        Math.round(80 + Math.random() * 120)
      );
      
      setPreds(mockPreds);
      
      // Generate mock weather data
      const mockWeather = Array.from({ length: horizon }, (_, i) => ({
        date: new Date(Date.now() + i * 86400000).toISOString(),
        temperature: Math.round((18 + Math.random() * 8) * 10) / 10,
        condition: ['sunny', 'cloudy', 'rainy', 'cloudy'][Math.floor(Math.random() * 4)],
        plz: plz
      }));
      
      setWeather(mockWeather);
    }, 800);
  };
  
  // Fetch articles with demand data and forecasts
  useEffect(() => {
    // Load forecast data
    loadForecast();
    
    // Load articles data
    setTimeout(() => {
      // Mock data for bakery articles with demand per weekday
      const mockArticles = [
        {
          id: 1,
          name: 'Brötchen',
          category: 'Brot & Brötchen',
          basePrice: 0.40,
          weatherSensitivity: 'hoch', // hoch, mittel, niedrig
          demand: {
            monday: 120,
            tuesday: 100,
            wednesday: 105,
            thursday: 110,
            friday: 130,
            saturday: 180,
            sunday: 200
          }
        },
        {
          id: 2,
          name: 'Baguette',
          category: 'Brot & Brötchen',
          basePrice: 1.80,
          weatherSensitivity: 'mittel',
          demand: {
            monday: 35,
            tuesday: 30,
            wednesday: 32,
            thursday: 35,
            friday: 45,
            saturday: 60,
            sunday: 65
          }
        },
        {
          id: 3,
          name: 'Croissant',
          category: 'Feingebäck',
          basePrice: 1.30,
          weatherSensitivity: 'mittel',
          demand: {
            monday: 50,
            tuesday: 45,
            wednesday: 45,
            thursday: 50,
            friday: 60,
            saturday: 85,
            sunday: 100
          }
        },
        {
          id: 4,
          name: 'Apfeltasche',
          category: 'Feingebäck',
          basePrice: 1.75,
          weatherSensitivity: 'niedrig',
          demand: {
            monday: 20,
            tuesday: 18,
            wednesday: 18,
            thursday: 20,
            friday: 25,
            saturday: 40,
            sunday: 45
          }
        },
        {
          id: 5,
          name: 'Vollkornbrot',
          category: 'Brot & Brötchen',
          basePrice: 3.20,
          weatherSensitivity: 'niedrig',
          demand: {
            monday: 15,
            tuesday: 12,
            wednesday: 13,
            thursday: 15,
            friday: 18,
            saturday: 25,
            sunday: 20
          }
        },
        {
          id: 6,
          name: 'Brezel',
          category: 'Brot & Brötchen',
          basePrice: 0.90,
          weatherSensitivity: 'hoch',
          demand: {
            monday: 85,
            tuesday: 75,
            wednesday: 80,
            thursday: 80,
            friday: 95,
            saturday: 130,
            sunday: 145
          }
        },
        {
          id: 7,
          name: 'Käsekuchen',
          category: 'Kuchen',
          basePrice: 2.50,
          weatherSensitivity: 'niedrig',
          demand: {
            monday: 12,
            tuesday: 10,
            wednesday: 10,
            thursday: 15,
            friday: 20,
            saturday: 35,
            sunday: 40
          }
        },
        {
          id: 8,
          name: 'Laugenstange',
          category: 'Brot & Brötchen',
          basePrice: 1.20,
          weatherSensitivity: 'mittel',
          demand: {
            monday: 45,
            tuesday: 40,
            wednesday: 40,
            thursday: 45,
            friday: 55,
            saturday: 75,
            sunday: 80
          }
        }
      ];
      
      // Adjust article demand based on selected branch
      const branchFactor = 
        branch === 'north' ? 0.8 :
        branch === 'south' ? 1.2 : 1;
          
      const adjustedArticles = mockArticles.map(article => ({
        ...article,
        demand: Object.fromEntries(
          Object.entries(article.demand).map(([day, value]) => 
            [day, Math.round(value * branchFactor)]
          )
        ),
        location: branch === 'north' ? 'Nord' : branch === 'south' ? 'Süd' : 'Hauptfiliale'
      }));
      
      setArticles(adjustedArticles);
      setLoading(false);
    }, 1000); // Simulating API delay
  }, [branch, horizon]);

  // Handler for switching to detail view
  const handleViewArticleDetails = (article) => {
    setSelectedArticle(article);
    setViewMode('detail');
  };

  // Handler for returning to table view
  const handleBackToTable = () => {
    setViewMode('table');
    setSelectedArticle(null);
    setActiveTab(0); // Return to the table tab
  };
  
  // Handler for tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setViewMode(newValue === 0 ? 'table' : 'forecast');
  };
  
  // Handler for refreshing forecasts and data
  const handleRefreshData = () => {
    setLoading(true);
    loadForecast();
  };

  // Handler for creating order for a specific day
  const handleCreateOrder = (day) => {
    setSelectedDayForOrder(day);
    // Here you would implement creating an order with the day's articles
    console.log(`Creating order for ${day} with articles:`, articles.map(article => ({
      id: article.id,
      name: article.name,
      quantity: article.demand[day]
    })));
    
    // Navigate to orders page or show confirmation
    alert(`Bestellung für ${day} wurde erstellt und zur Bestellübersicht hinzugefügt.`);
  };

  // Generate date labels for forecast
  const days = Array.from({ length: horizon }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
  });
  
  return (
    <Box sx={{ flexGrow: 1, pt: 8, pb: 6 }}>
      <Container maxWidth="xl">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          aria-label="Breadcrumb"
          sx={{ mb: 3 }}
        >
          <MuiLink component={Link} to="/" color="inherit">
            Dashboard
          </MuiLink>
          <Typography color="text.primary">Planung</Typography>
          {viewMode === 'detail' && (
            <Typography color="text.primary">
              {selectedArticle?.name}
            </Typography>
          )}
          {viewMode === 'forecast' && (
            <Typography color="text.primary">
              Prognose
            </Typography>
          )}
        </Breadcrumbs>

        {/* Page Title */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {viewMode === 'table' ? 'Planungsübersicht' : 
             viewMode === 'detail' ? 'Artikeldetails' : 'Prognose'}
          </Typography>
          
          {viewMode === 'detail' && (
            <Button 
              variant="outlined" 
              onClick={handleBackToTable}
              sx={{ 
                borderRadius: 28,
                borderColor: '#D7CCA3',
                color: '#5D4037',
                '&:hover': {
                  borderColor: '#BDB290',
                  bgcolor: 'rgba(189, 178, 144, 0.1)'
                }
              }}
            >
              Zurück zur Übersicht
            </Button>
          )}
        </Box>
        
        {/* Branch Selection & Settings */}
        {viewMode !== 'detail' && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Filiale & Einstellungen</Typography>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Filiale</InputLabel>
                    <Select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      label="Filiale"
                    >
                      <MenuItem value="main">Hauptfiliale</MenuItem>
                      <MenuItem value="north">Nord</MenuItem>
                      <MenuItem value="south">Süd</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Prognosezeitraum</InputLabel>
                    <Select
                      value={horizon}
                      onChange={(e) => setHorizon(e.target.value)}
                      label="Prognosezeitraum"
                    >
                      <MenuItem value={3}>3 Tage</MenuItem>
                      <MenuItem value={7}>7 Tage</MenuItem>
                      <MenuItem value={14}>14 Tage</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="PLZ für Wetter"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={plz}
                    onChange={(e) => setPlz(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleRefreshData}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
                    disabled={loading}
                  >
                    Daten aktualisieren
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
        
        {/* Tab Navigation (only when not in detail view) */}
        {viewMode !== 'detail' && (
          <Box sx={{ mb: 4 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Artikelübersicht" icon={<FilterListIcon />} iconPosition="start" />
              <Tab label="Prognose & Wetter" icon={<ThermostatIcon />} iconPosition="start" />
            </Tabs>
          </Box>
        )}

        {/* Weather Cards - Show in forecast view or if weather data available */}
        {viewMode === 'forecast' && weather.length > 0 && (
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {weather.slice(0, 4).map((w, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <MetricCard
                  title={new Date(w.date).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                  value={`${w.temperature.toFixed(1)}°C`}
                  subtitle={`${w.condition === 'sunny' ? 'Sonnig' : 
                             w.condition === 'cloudy' ? 'Bewölkt' : 
                             w.condition === 'rainy' ? 'Regen' : 'Wechselhaft'}`}
                  icon={<ThermostatIcon />}
                />
              </Grid>
            ))}
          </Grid>
        )}
        
        {/* Main Content */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {viewMode === 'detail' ? (
              <ArticleDetailView 
                article={selectedArticle} 
                onBack={handleBackToTable}
              />
            ) : viewMode === 'table' ? (
              <PlanningTable 
                articles={articles}
                onViewDetails={handleViewArticleDetails}
                onCreateOrder={handleCreateOrder}
              />
            ) : (
              /* Forecast View */
              <Box>
                {/* Forecast Chart */}
                <Card sx={{ mb: 4 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Gesamtnachfrageprognose</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="textSecondary">
                          {branch === 'main' ? 'Hauptfiliale' : branch === 'north' ? 'Filiale Nord' : 'Filiale Süd'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CloudIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="textSecondary">
                        Wettereinfluss und standortspezifische Faktoren berücksichtigt
                      </Typography>
                    </Box>
                    
                    {preds.length > 0 ? (
                      <AreaChart 
                        data={preds}
                        categories={days}
                        height={300}
                        title=""
                      />
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <Typography color="textSecondary">Keine Prognosedaten verfügbar</Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>

                {/* Product Forecast Table */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Artikelprognosen</Typography>
                    <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Artikel</TableCell>
                            {days.map((day, i) => (
                              <TableCell key={i} align="right">{day}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {articles.map((article) => (
                            <TableRow 
                              key={article.id} 
                              hover 
                              onClick={() => handleViewArticleDetails(article)}
                              sx={{ cursor: 'pointer' }}
                            >
                              <TableCell component="th" scope="row">
                                {article.name}
                              </TableCell>
                              {days.map((day, i) => {
                                // Map weekdays to actual day values
                                const dayIndex = i % 7;
                                const dayName = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][dayIndex];
                                const forecastValue = article.demand[dayName];
                                // Apply some randomness for variation
                                const value = Math.round(forecastValue * (0.9 + Math.random() * 0.2));
                                
                                return (
                                  <TableCell key={i} align="right">
                                    {value}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          ))}
                          
                          {/* Total row */}
                          <TableRow sx={{ bgcolor: 'rgba(240, 225, 198, 0.4)' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>Gesamtbedarf</TableCell>
                            {days.map((day, i) => {
                              // Calculate daily total
                              const dayIndex = i % 7;
                              const dayName = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][dayIndex];
                              // Sum all article demands for this day
                              const total = articles.reduce((sum, article) => 
                                sum + article.demand[dayName], 0
                              );
                              // Apply some randomness
                              const totalWithVariation = Math.round(total * (0.95 + Math.random() * 0.1));
                              
                              return (
                                <TableCell key={i} align="right" sx={{ fontWeight: 'bold' }}>
                                  {totalWithVariation}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Box>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default PlanningPage;
