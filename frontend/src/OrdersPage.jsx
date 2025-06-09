import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Breadcrumbs,
  Link as MuiLink,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
  Divider
} from '@mui/material';
import { Link } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
import AddIcon from '@mui/icons-material/Add';
import AreaChart from './components/AreaChart';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderHistory, setOrderHistory] = useState([]);

  // Generate some mock order history data for the chart
  const generateOrderHistory = () => {
    const data = [];
    const categories = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - 13 + i);
      categories.push(date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }));
      data.push(Math.floor(Math.random() * 30) + 20);
    }
    
    return { data, categories };
  };

  useEffect(() => {
    setLoading(true);
    fetch('/orders')
      .then(res => res.json())
      .then(data => {
        // Enhance the orders data with more information
        const enhancedOrders = data.map(order => ({
          ...order,
          status: Math.random() > 0.3 ? 'Abgeschlossen' : 'In Bearbeitung',
          products: Math.floor(Math.random() * 5) + 1,
          total: Math.floor(Math.random() * 200) + 50
        }));
        setOrders(enhancedOrders);
        setLoading(false);
        setOrderHistory(generateOrderHistory());
      })
      .catch(() => {
        setOrders([]);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status) => {
    return status === 'Abgeschlossen' ? 'success' : 'warning';
  };

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
        <Typography color="text.primary">Bestellungen</Typography>
      </Breadcrumbs>

      {/* Header with action button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Bestellungen
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 28 }}
        >
          Neue Bestellung
        </Button>
      </Box>

      {/* Order History Chart */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Bestellungsverlauf</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Anzahl der Bestellungen in den letzten 14 Tagen
          </Typography>
          {orderHistory.data && (
            <AreaChart 
              data={orderHistory.data}
              categories={orderHistory.categories}
              height={250}
            />
          )}
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Aktuelle Bestellungen</Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : orders.length > 0 ? (
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Bestellung #</TableCell>
                    <TableCell>Datum</TableCell>
                    <TableCell>Produkte</TableCell>
                    <TableCell align="right">Menge</TableCell>
                    <TableCell align="right">Summe</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Aktionen</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.products}</TableCell>
                      <TableCell align="right">{order.quantity}</TableCell>
                      <TableCell align="right">{order.total}€</TableCell>
                      <TableCell>
                        <Chip 
                          label={order.status} 
                          color={getStatusColor(order.status)} 
                          size="small" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="primary" title="Details anzeigen">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="primary" title="Herunterladen">
                          <GetAppIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="textSecondary">Keine Bestellungen vorhanden</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrdersPage;
