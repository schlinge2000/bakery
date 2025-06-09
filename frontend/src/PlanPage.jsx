import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Breadcrumbs,
  Link as MuiLink,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloudIcon from '@mui/icons-material/Cloud';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import AreaChart from './components/AreaChart';
import MetricCard from './components/MetricCard';

// Keep the Chart.js registration if needed
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

const PlanPage = () => {
  const [preds, setPreds] = useState([]);
  const [plz, setPlz] = useState('10115');
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(false);
  const [horizon, setHorizon] = useState(7);
  const [branch, setBranch] = useState('main');
  const [products, setProducts] = useState([
    { id: 1, name: 'Baguette', forecast: [] },
    { id: 2, name: 'Croissant', forecast: [] },
    { id: 3, name: 'Brot', forecast: [] },
    { id: 4, name: 'Kuchen', forecast: [] }
  ]);

  const loadForecast = () => {
    setLoading(true);
    
    fetch('/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ branch, horizon, window: '1D' }),
    })
      .then(res => res.json())
      .then(data => {
        setPreds(data.predictions);
        
        // Update product forecasts with random variations of the main prediction
        const updatedProducts = products.map(product => ({
          ...product,
          forecast: data.predictions.map(val => val * (0.8 + Math.random() * 0.4))
        }));
        setProducts(updatedProducts);
        
        setLoading(false);
      })
      .catch(() => {
        setPreds([]);
        setLoading(false);
      });

    fetch(`/weather/${plz}`)
      .then(res => res.json())
      .then(setWeather)
      .catch(() => setWeather([]));
  };

  useEffect(() => {
    loadForecast();
  }, []);

  const days = Array.from({ length: horizon }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
  });

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <MuiLink 
          component={Link} 
          to="/"
          underline="hover"
          color="inherit"
        >
          Zur Übersicht
        </MuiLink>
        <Typography color="text.primary">Artikelplanung</Typography>
      </Breadcrumbs>

      {/* Controls */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Prognose-Einstellungen</Typography>
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
                onClick={loadForecast}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
                disabled={loading}
              >
                Prognose aktualisieren
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Weather Cards */}
      {weather.length > 0 && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {weather.slice(0, 4).map((w, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <MetricCard
                title={new Date(w.date).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                value={`${w.temperature.toFixed(1)}°C`}
                subtitle={`PLZ: ${w.plz}`}
                icon={<ThermostatIcon />}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Forecast Chart */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Nachfrageprognose</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CloudIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="textSecondary">
                Wettereinfluss berücksichtigt
              </Typography>
            </Box>
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
              {loading ? (
                <CircularProgress />
              ) : (
                <Typography color="textSecondary">Keine Prognosedaten verfügbar</Typography>
              )}
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
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell component="th" scope="row">
                      {product.name}
                    </TableCell>
                    {product.forecast.map((value, i) => (
                      <TableCell key={i} align="right">
                        {Math.round(value)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PlanPage;
