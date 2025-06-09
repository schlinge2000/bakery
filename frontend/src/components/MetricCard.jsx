import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  Tooltip,
  useTheme 
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  tooltip = '', 
  className = '',
  onClick = null
}) => {
  const theme = useTheme();

  return (
    <Card 
      className={`hover-card ${className}`} 
      sx={{ 
        height: '100%', 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease'
      }}
      onClick={onClick}
    >
      <CardContent sx={{ position: 'relative', p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="subtitle2" color="textSecondary">
            {title}
          </Typography>
          {tooltip && (
            <Tooltip title={tooltip} arrow placement="top">
              <IconButton size="small" sx={{ p: 0 }}>
                <InfoOutlinedIcon fontSize="small" color="action" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4" component="div" sx={{ fontWeight: 500 }}>
            {value}
          </Typography>
          {icon && (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
                borderRadius: '50%',
                width: 40,
                height: 40
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
        
        {subtitle && (
          <Typography 
            variant="body2" 
            color="textSecondary" 
            sx={{ mt: 1, fontSize: '0.875rem' }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
