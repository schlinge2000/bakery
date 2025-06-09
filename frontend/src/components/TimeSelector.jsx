import React from 'react';
import { 
  Box, 
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Zeitselektor-Komponente
const TimeSelector = ({ selectedTime, onTimeChange, times }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'flex-end',
        mb: 2
      }}
    >
      <FormControl 
        variant="outlined" 
        size="small"
        sx={{ 
          width: 150,
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
            bgcolor: '#f8f5f0',
            border: '1px solid #D7CCA3',
            '&:hover': {
              borderColor: '#BDB290',
            }
          }
        }}
      >
        <InputLabel 
          id="time-selector-label"
          sx={{ color: '#5D4037' }}
        >
          Tageszeit
        </InputLabel>
        <Select
          labelId="time-selector-label"
          id="time-selector"
          value={selectedTime}
          onChange={(e) => onTimeChange(e.target.value)}
          label="Tageszeit"
          IconComponent={() => (
            <AccessTimeIcon sx={{ color: '#5D4037', mr: 1 }} />
          )}
          sx={{ 
            color: '#5D4037',
            fontWeight: 500
          }}
        >
          {times.map((time) => (
            <MenuItem 
              key={time} 
              value={time}
              sx={{ 
                fontWeight: time === selectedTime ? 600 : 400,
                color: '#5D4037'
              }}
            >
              {time}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default TimeSelector;
