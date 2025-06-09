import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import AssessmentIcon from '@mui/icons-material/Assessment';

const EventCard = ({ 
  title, 
  description, 
  startDate, 
  endDate,
  duration, 
  category, 
  status,
  affectedItems = [],
  performance,
  ...props
}) => {
  return (
    <Card 
      elevation={0} 
      sx={{ 
        borderRadius: 2, 
        border: '1px solid',
        borderColor: 'divider',
        ...props.sx 
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" sx={{ mr: 1 }}>
                {title}
              </Typography>
              {status && (
                <Chip 
                  label={status === 'active' ? 'Aktiv' : 'Geplant'} 
                  size="small"
                  color={status === 'active' ? 'success' : 'info'}
                  variant="outlined"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              {description}
            </Typography>
          </Box>
          {category && (
            <Chip 
              label={category} 
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarTodayIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
            <Typography variant="body2" color="textSecondary">
              {startDate}
              {endDate && ` - ${endDate}`}
            </Typography>
          </Box>
          {duration && (
            <Typography variant="body2" color="textSecondary">
              Dauer: {duration}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />
        
        {/* Auswirkungen auf Artikel */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AssessmentIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="subtitle2">
              Auswirkungen auf Artikel
            </Typography>
          </Box>
          
          <Paper variant="outlined" sx={{ p: 1 }}>
            <List dense disablePadding>
              {Array.isArray(affectedItems) && affectedItems.map((item, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemText 
                    primary={item.name} 
                    secondary={
                      <Typography 
                        variant="body2" 
                        component="span" 
                        sx={{ 
                          color: item.impact?.includes('+') ? 'success.main' : 'text.secondary',
                          fontWeight: 'medium'
                        }}
                      >
                        {item.impact}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
              {!Array.isArray(affectedItems) && (
                <ListItem disableGutters>
                  <ListItemText primary={`Betroffene Artikel: ${affectedItems}`} />
                </ListItem>
              )}
            </List>
          </Paper>
        </Box>

        {/* Performance-Metriken */}
        {performance && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TrendingUpIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="subtitle2">
                Performance
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Paper variant="outlined" sx={{ p: 1, flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUpIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="body2">
                    Absatz: {performance.salesIncrease}
                  </Typography>
                </Box>
              </Paper>
              <Paper variant="outlined" sx={{ p: 1, flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachMoneyIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">
                    Umsatz: {performance.revenueChange}
                  </Typography>
                </Box>
              </Paper>
              <Paper variant="outlined" sx={{ p: 1, flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SentimentSatisfiedAltIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
                  <Typography variant="body2">
                    Zufriedenheit: {performance.customerSatisfaction}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default EventCard;
