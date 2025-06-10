import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  TableSortLabel,
  Box,
  Chip,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WeatherIcon from '@mui/icons-material/Thermostat';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

const weekdays = [
  { id: 'monday', label: 'Montag' },
  { id: 'tuesday', label: 'Dienstag' },
  { id: 'wednesday', label: 'Mittwoch' },
  { id: 'thursday', label: 'Donnerstag' },
  { id: 'friday', label: 'Freitag' },
  { id: 'saturday', label: 'Samstag' },
  { id: 'sunday', label: 'Sonntag' },
];

const PlanningTable = ({ articles, onViewDetails, onCreateOrder }) => {
  const [orderAnchorEl, setOrderAnchorEl] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [hoveredRow, setHoveredRow] = useState(null);

  // Handle order menu opening
  const handleOrderMenuClick = (event) => {
    setOrderAnchorEl(event.currentTarget);
  };

  // Handle order menu closing
  const handleOrderMenuClose = () => {
    setOrderAnchorEl(null);
  };

  // Handle sort request
  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  // Sort articles based on current sort settings
  const getSortedArticles = () => {
    return [...articles].sort((a, b) => {
      // Handle sorting for normal fields
      if (sortField === 'name' || sortField === 'category' || sortField === 'basePrice' || sortField === 'weatherSensitivity') {
        if (a[sortField] < b[sortField]) {
          return sortDirection === 'asc' ? -1 : 1;
        }
        if (a[sortField] > b[sortField]) {
          return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      }
      
      // Handle sorting for demand fields (weekdays)
      if (sortField.startsWith('demand.')) {
        const day = sortField.split('.')[1];
        return sortDirection === 'asc' 
          ? a.demand[day] - b.demand[day]
          : b.demand[day] - a.demand[day];
      }
      
      return 0;
    });
  };

  // Get weather sensitivity icon and color
  const getWeatherSensitivityInfo = (sensitivity) => {
    switch (sensitivity) {
      case 'hoch':
        return { icon: <TrendingUpIcon sx={{ color: '#f44336' }} />, color: '#f44336' };
      case 'mittel':
        return { icon: <TrendingFlatIcon sx={{ color: '#fb8c00' }} />, color: '#fb8c00' };
      case 'niedrig':
        return { icon: <TrendingDownIcon sx={{ color: '#4caf50' }} />, color: '#4caf50' };
      default:
        return { icon: <TrendingFlatIcon sx={{ color: '#9e9e9e' }} />, color: '#9e9e9e' };
    }
  };

  // Calculate total demand per day
  const totalDemand = weekdays.reduce((acc, day) => {
    acc[day.id] = articles.reduce((sum, article) => sum + article.demand[day.id], 0);
    return acc;
  }, {});

  return (
    <Paper elevation={0} sx={{ width: '100%', overflow: 'hidden', border: '1px solid #e0e0e0', borderRadius: 2 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Sortiment & Tagesbedarf
        </Typography>
        
        <Button 
          startIcon={<ShoppingCartIcon />} 
          onClick={handleOrderMenuClick}
          variant="outlined"
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
          Bestellung erstellen
        </Button>
        
        {/* Order creation menu for selecting day */}
        <Menu
          anchorEl={orderAnchorEl}
          open={Boolean(orderAnchorEl)}
          onClose={handleOrderMenuClose}
        >
          <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 500 }}>
            Tag für Bestellung auswählen:
          </Typography>
          {weekdays.map((day) => (
            <MenuItem 
              key={day.id} 
              onClick={() => {
                onCreateOrder(day.id);
                handleOrderMenuClose();
              }}
            >
              <ListItemText>{day.label}</ListItemText>
              <Typography variant="body2" color="text.secondary">
                {totalDemand[day.id]} Stk.
              </Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>

      <TableContainer sx={{ maxHeight: '70vh' }}>
        <Table stickyHeader aria-label="Planungstabelle">
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}
                sortDirection={sortField === 'name' ? sortDirection : false}
              >
                <TableSortLabel
                  active={sortField === 'name'}
                  direction={sortField === 'name' ? sortDirection : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Artikel
                </TableSortLabel>
              </TableCell>
              <TableCell 
                sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}
                sortDirection={sortField === 'category' ? sortDirection : false}
              >
                <TableSortLabel
                  active={sortField === 'category'}
                  direction={sortField === 'category' ? sortDirection : 'asc'}
                  onClick={() => handleSort('category')}
                >
                  Kategorie
                </TableSortLabel>
              </TableCell>
              <TableCell 
                align="right" 
                sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}
                sortDirection={sortField === 'basePrice' ? sortDirection : false}
              >
                <TableSortLabel
                  active={sortField === 'basePrice'}
                  direction={sortField === 'basePrice' ? sortDirection : 'asc'}
                  onClick={() => handleSort('basePrice')}
                >
                  Grundpreis
                </TableSortLabel>
              </TableCell>
              <TableCell 
                align="center" 
                sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}
                sortDirection={sortField === 'weatherSensitivity' ? sortDirection : false}
              >
                <TableSortLabel
                  active={sortField === 'weatherSensitivity'}
                  direction={sortField === 'weatherSensitivity' ? sortDirection : 'asc'}
                  onClick={() => handleSort('weatherSensitivity')}
                >
                  <Tooltip title="Wetterempfindlichkeit">
                    <WeatherIcon />
                  </Tooltip>
                </TableSortLabel>
              </TableCell>
              
              {/* Weekday headers */}
              {weekdays.map((day) => (
                <TableCell 
                  key={day.id}
                  align="right"
                  sx={{ 
                    fontWeight: 'bold', 
                    bgcolor: day.id === 'saturday' || day.id === 'sunday' 
                      ? 'rgba(240, 225, 198, 0.3)' 
                      : '#f5f5f5'
                  }}
                  sortDirection={sortField === `demand.${day.id}` ? sortDirection : false}
                >
                  <TableSortLabel
                    active={sortField === `demand.${day.id}`}
                    direction={sortField === `demand.${day.id}` ? sortDirection : 'asc'}
                    onClick={() => handleSort(`demand.${day.id}`)}
                  >
                    {day.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              
              <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getSortedArticles().map((article) => (
              <TableRow 
                key={article.id}
                hover
                onMouseEnter={() => setHoveredRow(article.id)}
                onMouseLeave={() => setHoveredRow(null)}
                sx={{ 
                  '&:nth-of-type(odd)': { bgcolor: 'rgba(0, 0, 0, 0.02)' },
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(215, 204, 163, 0.1)' }
                }}
                onClick={() => onViewDetails(article)}
              >
                <TableCell component="th" scope="row">
                  <Box sx={{ fontWeight: 500 }}>{article.name}</Box>
                </TableCell>
                <TableCell>{article.category}</TableCell>
                <TableCell align="right">{article.basePrice.toFixed(2)}€</TableCell>
                <TableCell align="center">
                  <Tooltip title={`Wetterempfindlichkeit: ${article.weatherSensitivity}`}>
                    {getWeatherSensitivityInfo(article.weatherSensitivity).icon}
                  </Tooltip>
                </TableCell>
                
                {/* Weekday demand values */}
                {weekdays.map((day) => (
                  <TableCell key={`${article.id}-${day.id}`} align="right">
                    {article.demand[day.id]}
                  </TableCell>
                ))}
                
                <TableCell>
                  <Box sx={{ 
                    display: 'flex',
                    opacity: hoveredRow === article.id ? 1 : 0.3,
                    transition: 'opacity 0.2s'
                  }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(article);
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            
            {/* Total row */}
            <TableRow sx={{ bgcolor: 'rgba(240, 225, 198, 0.4)' }}>
              <TableCell colSpan={4} sx={{ fontWeight: 'bold' }}>Gesamtbedarf</TableCell>
              {weekdays.map((day) => (
                <TableCell key={`total-${day.id}`} align="right" sx={{ fontWeight: 'bold' }}>
                  {totalDemand[day.id]}
                </TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PlanningTable;
