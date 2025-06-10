import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
  Alert,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import UmbrellaIcon from '@mui/icons-material/Umbrella';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EuroIcon from '@mui/icons-material/Euro';
import PsychologyIcon from '@mui/icons-material/Psychology';
import InfoIcon from '@mui/icons-material/Info';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

// Mock imports (replace with actual chart library in production)
import { Line } from 'react-chartjs-2';
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

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

const ArticleDetailView = ({ article, onBack }) => {
  const [timeInterval, setTimeInterval] = useState('1day');
  const [salesData, setSalesData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [promotionHistory, setPromotionHistory] = useState([]);
  const [weatherCorrelation, setWeatherCorrelation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (article) {
      // Simulate API calls
      setTimeout(() => {
        // Generate mock sales data based on the selected time interval
        generateMockData();
        setLoading(false);
      }, 500);
    }
  }, [article, timeInterval]);

  // Generate mock data for visualizations
  const generateMockData = () => {
    // Generate time labels based on selected interval
    const labels = [];
    const salesValues = [];
    const forecastValues = [];
    const lowerBoundValues = [];
    const upperBoundValues = [];
    const weatherValues = [];
    const temperatures = [];
    
    const now = new Date();
    const daysInPast = 14; // Two weeks of data
    
    // Generate different time intervals based on selection
    if (timeInterval === '3h') {
      // 3-hour intervals for the past 3 days
      for (let i = 8*3; i >= 0; i--) {
        const date = new Date(now);
        date.setHours(now.getHours() - i * 3);
        labels.push(`${date.getHours()}:00`);
        
        // Sales data with some randomness
        const baseSale = article.demand.monday / 8; // Divide daily demand into 8 periods
        const randomFactor = 0.5 + Math.random();
        salesValues.push(Math.round(baseSale * randomFactor));
        
        // Weather data
        const weather = ['sunny', 'cloudy', 'rainy', 'cloudy', 'sunny'][Math.floor(Math.random() * 5)];
        weatherValues.push(weather);
        temperatures.push(Math.round(15 + Math.random() * 10));
      }
    } else if (timeInterval === '6h') {
      // 6-hour intervals for the past week
      for (let i = 7*4; i >= 0; i--) {
        const date = new Date(now);
        date.setHours(now.getHours() - i * 6);
        const day = date.toLocaleDateString('de-DE', { weekday: 'short' });
        labels.push(`${day} ${date.getHours()}:00`);
        
        // Sales data with some randomness
        const baseSale = article.demand.monday / 4; // Divide daily demand into 4 periods
        const randomFactor = 0.7 + Math.random() * 0.6;
        salesValues.push(Math.round(baseSale * randomFactor));
        
        // Weather data
        const weather = ['sunny', 'cloudy', 'rainy', 'cloudy', 'sunny'][Math.floor(Math.random() * 5)];
        weatherValues.push(weather);
        temperatures.push(Math.round(15 + Math.random() * 10));
      }
    } else {
      // Daily data for two weeks
      for (let i = daysInPast; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const day = date.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
        labels.push(day);
        
        // Sales data with weekend spikes and some randomness
        const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        let baseDemand;
        switch(dayOfWeek) {
          case 0: baseDemand = article.demand.sunday; break;
          case 1: baseDemand = article.demand.monday; break;
          case 2: baseDemand = article.demand.tuesday; break;
          case 3: baseDemand = article.demand.wednesday; break;
          case 4: baseDemand = article.demand.thursday; break;
          case 5: baseDemand = article.demand.friday; break;
          case 6: baseDemand = article.demand.saturday; break;
          default: baseDemand = article.demand.monday;
        }
        
        const randomFactor = 0.85 + Math.random() * 0.3;
        salesValues.push(Math.round(baseDemand * randomFactor));
        
        // Weather data
        const weather = ['sunny', 'cloudy', 'rainy', 'cloudy', 'sunny'][Math.floor(Math.random() * 5)];
        weatherValues.push(weather);
        temperatures.push(Math.round(15 + Math.random() * 10));
      }
    }
    
    // Generate daily data for visualization
    setSalesData({
      labels: labels,
      datasets: [
        {
          label: 'Verkaufsmenge',
          data: salesValues,
          borderColor: '#795548',
          backgroundColor: 'rgba(121, 85, 72, 0.5)',
          tension: 0.4,
        },
        {
          label: 'Prognose',
          data: [...salesValues.slice(-7), ...Array(7).fill(null).map((_, i) => {
            // Generate forecast values based on sales with some variation
            const lastSales = salesValues[salesValues.length - 7 + (i % 7)];
            return Math.round(lastSales * (0.9 + Math.random() * 0.3));
          })],
          borderColor: '#1976d2',
          borderWidth: 2,
          backgroundColor: 'rgba(25, 118, 210, 0.5)',
          tension: 0.4,
          borderDash: [5, 5],
          pointStyle: 'circle',
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Obere Prognoseintervall',
          data: [...salesValues.slice(-7), ...Array(7).fill(null).map((_, i) => {
            // Generate upper bound with more variation
            const lastSales = salesValues[salesValues.length - 7 + (i % 7)];
            return Math.round(lastSales * (1.1 + Math.random() * 0.3 + i * 0.02));
          })],
          borderColor: 'rgba(25, 118, 210, 0.3)',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          borderWidth: 1,
          tension: 0.4,
          pointRadius: 0,
          fill: '+1'
        },
        {
          label: 'Untere Prognoseintervall',
          data: [...salesValues.slice(-7), ...Array(7).fill(null).map((_, i) => {
            // Generate lower bound with variation
            const lastSales = salesValues[salesValues.length - 7 + (i % 7)];
            return Math.round(lastSales * (0.7 + Math.random() * 0.2 - i * 0.01));
          })],
          borderColor: 'rgba(25, 118, 210, 0.3)',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          borderWidth: 1,
          tension: 0.4,
          pointRadius: 0,
          fill: false
        }
      ],
    });  
    
    // Set weather data
    setWeatherData({ days: labels, conditions: weatherValues, temperatures });
    
    // Generate promotion history
    const mockPromotions = [
      { 
        id: 1, 
        name: '10% Rabatt', 
        startDate: '01.06.2025', 
        endDate: '07.06.2025', 
        impact: 'positive' 
      },
      { 
        id: 2, 
        name: '2 für 1 Aktion', 
        startDate: '15.05.2025', 
        endDate: '22.05.2025', 
        impact: 'positive' 
      },
      { 
        id: 3, 
        name: 'Happy Hour', 
        startDate: '10.05.2025', 
        endDate: '10.05.2025', 
        impact: 'neutral' 
      }
    ];
    
    setPromotionHistory(mockPromotions);
    
    // Generate weather correlation data
    const weatherTypes = ['sunny', 'cloudy', 'rainy', 'cold'];
    const correlations = weatherTypes.map(type => {
      let impact;
      if (article.weatherSensitivity === 'hoch') {
        impact = type === 'sunny' ? 20 : type === 'cloudy' ? 5 : type === 'rainy' ? -15 : -25;
      } else if (article.weatherSensitivity === 'mittel') {
        impact = type === 'sunny' ? 10 : type === 'cloudy' ? 0 : type === 'rainy' ? -8 : -12;
      } else {
        impact = type === 'sunny' ? 3 : type === 'cloudy' ? 0 : type === 'rainy' ? -3 : -5;
      }
      
      return {
        type,
        impact,
        description: getWeatherImpactDescription(type, impact)
      };
    });
    
    setWeatherCorrelation(correlations);
  };
  
  // Helper to get weather impact description
  const getWeatherImpactDescription = (type, impact) => {
    if (impact > 15) return 'Starke Steigerung';
    if (impact > 5) return 'Leichte Steigerung';
    if (impact < -15) return 'Starker Rückgang';
    if (impact < -5) return 'Leichter Rückgang';
    return 'Neutral';
  };

  // Setup chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          footer: (tooltipItems) => {
            // Only add confidence information for forecast points
            const item = tooltipItems[0];
            if (item.datasetIndex === 1 && item.parsed.y) {
              const lowerBound = tooltipItems[2]?.parsed.y || 0;
              const upperBound = tooltipItems[1]?.parsed.y || 0;
              return `Konfidenzintervall: [${Math.round(lowerBound)} - ${Math.round(upperBound)}]`;
            }
            return '';
          }
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Datum'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Stückzahl'
        },
        beginAtZero: true
      }
    },
    maintainAspectRatio: false
  };

  // Handle time interval change
  const handleTimeIntervalChange = (event, newInterval) => {
    if (newInterval) {
      setTimeInterval(newInterval);
    }
  };

  // Get weather icon based on condition
  const getWeatherIcon = (condition) => {
    switch(condition) {
      case 'sunny': return <WbSunnyIcon sx={{ color: '#FFC107' }} />;
      case 'cloudy': return <CloudIcon sx={{ color: '#90A4AE' }} />;
      case 'rainy': return <UmbrellaIcon sx={{ color: '#2196F3' }} />;
      case 'cold': return <AcUnitIcon sx={{ color: '#90CAF9' }} />;
      default: return <CloudIcon sx={{ color: '#90A4AE' }} />;
    }
  };

  if (!article) {
    return <Typography>Kein Artikel ausgewählt</Typography>;
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Master data card */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              height: '100%',
              border: '1px solid #e0e0e0',
              borderRadius: 2
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#5D4037' }}>
              {article.name}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Kategorie
              </Typography>
              <Typography variant="body1">
                {article.category}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Grundpreis
              </Typography>
              <Typography variant="body1">
                {article.basePrice.toFixed(2)}€
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Wetterempfindlichkeit
              </Typography>
              <Chip
                icon={
                  article.weatherSensitivity === 'hoch' ? <TrendingUpIcon /> : 
                  article.weatherSensitivity === 'niedrig' ? <TrendingDownIcon /> : 
                  <TrendingFlatIcon />
                }
                label={`${article.weatherSensitivity.charAt(0).toUpperCase() + article.weatherSensitivity.slice(1)}`}
                color={
                  article.weatherSensitivity === 'hoch' ? 'error' : 
                  article.weatherSensitivity === 'niedrig' ? 'success' : 
                  'warning'
                }
                variant="outlined"
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Durchschnittlicher Tagesbedarf
              </Typography>
              <Typography variant="body1">
                {Object.values(article.demand).reduce((sum, val) => sum + val, 0) / 7} Stk.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Wetterwirkung auf den Verkauf
              </Typography>
              
              {weatherCorrelation && weatherCorrelation.map((item) => (
                <Box key={item.type} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  {getWeatherIcon(item.type)}
                  <Box sx={{ ml: 1, flex: 1 }}>
                    <Typography variant="body2">
                      {item.type === 'sunny' ? 'Sonnig' : 
                       item.type === 'cloudy' ? 'Bewölkt' : 
                       item.type === 'rainy' ? 'Regnerisch' : 'Kalt'}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={`${item.impact > 0 ? '+' : ''}${item.impact}%`}
                    color={
                      item.impact > 15 ? 'success' :
                      item.impact > 5 ? 'info' :
                      item.impact < -15 ? 'error' :
                      item.impact < -5 ? 'warning' : 'default'
                    }
                    variant="outlined"
                    sx={{ minWidth: 60, textAlign: 'center' }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
        
        {/* Sales chart card */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              border: '1px solid #e0e0e0',
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#5D4037' }}>
                Verkaufszeitreihe
              </Typography>
              
              <ToggleButtonGroup
                size="small"
                value={timeInterval}
                exclusive
                onChange={handleTimeIntervalChange}
              >
                <ToggleButton value="3h">3h</ToggleButton>
                <ToggleButton value="6h">6h</ToggleButton>
                <ToggleButton value="1day">1 Tag</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            
            {loading ? (
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography>Daten werden geladen...</Typography>
              </Box>
            ) : salesData ? (
              <Box sx={{ height: 300 }}>
                <Line options={chartOptions} data={salesData} />
              </Box>
            ) : (
              <Typography>Keine Verkaufsdaten verfügbar</Typography>
            )}
            
            <Divider sx={{ my: 3 }} />
            
            {/* AI Model Information */}
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Über unser Prognosemodell
              </Typography>
              <Typography variant="body2">
                Unsere KI-gestützte Prognose berücksichtigt mehrere Faktoren, um Ihnen die bestmögliche Produktionsplanung zu ermöglichen.
              </Typography>
              <List dense disablePadding sx={{ mt: 1 }}>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LocationOnIcon fontSize="small" color="info" />
                  </ListItemIcon>
                  <ListItemText primary="Position in der Auslage" secondary="Berücksichtigt die Platzierung des Artikels" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <AccessTimeIcon fontSize="small" color="info" />
                  </ListItemIcon>
                  <ListItemText primary="Tageszeit-Analyse" secondary="Verkauf zu verschiedenen Tageszeiten" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CloudIcon fontSize="small" color="info" />
                  </ListItemIcon>
                  <ListItemText primary="Wettereinfluss" secondary="Temperatur, Niederschlag und Sonnenstunden" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <EuroIcon fontSize="small" color="info" />
                  </ListItemIcon>
                  <ListItemText primary="Preisstrategie" secondary="Preissensitivität und Aktionspreise" />
                </ListItem>
              </List>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2">
                <strong>Konfidenzintervalle:</strong> Der schattierte Bereich zeigt die Bandbreite möglicher Verkaufszahlen an. 
                Je weiter in der Zukunft, desto breiter wird das Intervall aufgrund steigender Unsicherheit.
              </Typography>
            </Alert>

            {/* Weather data table */}
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Wetterdaten im Zeitraum
            </Typography>
            
            {weatherData && (
              <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 200 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Zeitpunkt</TableCell>
                      <TableCell align="center">Wetter</TableCell>
                      <TableCell align="right">Temperatur</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {weatherData.days.map((day, index) => (
                      <TableRow key={day}>
                        <TableCell component="th" scope="row">
                          {day}
                        </TableCell>
                        <TableCell align="center">
                          {getWeatherIcon(weatherData.conditions[index])}
                        </TableCell>
                        <TableCell align="right">
                          {weatherData.temperatures[index]}°C
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
          
          {/* Promotions card */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              mt: 3,
              border: '1px solid #e0e0e0',
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocalOfferIcon sx={{ mr: 1, color: '#5D4037' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#5D4037' }}>
                Vergangene Aktionen
              </Typography>
            </Box>
            
            {promotionHistory.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Aktion</TableCell>
                      <TableCell>Zeitraum</TableCell>
                      <TableCell align="right">Auswirkung</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {promotionHistory.map((promo) => (
                      <TableRow key={promo.id}>
                        <TableCell>{promo.name}</TableCell>
                        <TableCell>{promo.startDate} - {promo.endDate}</TableCell>
                        <TableCell align="right">
                          <Chip
                            size="small"
                            label={
                              promo.impact === 'positive' ? 'Positiv' :
                              promo.impact === 'negative' ? 'Negativ' : 'Neutral'
                            }
                            color={
                              promo.impact === 'positive' ? 'success' :
                              promo.impact === 'negative' ? 'error' : 'default'
                            }
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Keine vergangenen Aktionen für diesen Artikel
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ArticleDetailView;
