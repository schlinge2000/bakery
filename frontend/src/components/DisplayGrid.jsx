import React from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Grid,
} from '@mui/material';
import { Droppable } from 'react-beautiful-dnd';

// Komponente für einen einzelnen Slot in der Auslage
const DisplaySlot = ({ slot, index, rowIndex }) => {
  const slotId = `slot-${rowIndex}-${index}`;
  
  return (
    <Droppable droppableId={slotId} type="PRODUCTS">
      {(provided, snapshot) => (
        <Paper
          ref={provided.innerRef}
          {...provided.droppableProps}
          elevation={0}
          sx={{
            height: 120,
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid',
            borderColor: snapshot.isDraggingOver ? '#D7CCA3' : '#E0E0E0',
            borderRadius: 2,
            bgcolor: snapshot.isDraggingOver ? 'rgba(240, 225, 198, 0.3)' : 'white',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
        >
          {slot.product ? (
            <Box sx={{ textAlign: 'center' }}>
              <Box 
                component="img" 
                src={slot.product.icon} 
                alt={slot.product.name}
                sx={{ 
                  width: 50, 
                  height: 50,
                  mb: 1,
                  filter: 'brightness(0.9)'
                }}
              />
              <Typography 
                variant="caption" 
                component="div"
                sx={{
                  fontWeight: 500,
                  color: '#5D4037'
                }}
              >
                {slot.product.name}
              </Typography>
            </Box>
          ) : (
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ opacity: 0.5 }}
            >
              Leer
            </Typography>
          )}
          {provided.placeholder}
        </Paper>
      )}
    </Droppable>
  );
};

// Hauptkomponente für die Auslagenfläche
const DisplayGrid = ({ grid }) => {
  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Grid container spacing={2}>
        {grid.map((row, rowIndex) => (
          <Grid item xs={12} key={`row-${rowIndex}`}>
            <Grid container spacing={2}>
              {row.map((slot, index) => (
                <Grid item xs={12} sm={6} md={3} lg={2.4} key={`slot-${rowIndex}-${index}`}>
                  <DisplaySlot 
                    slot={slot} 
                    index={index} 
                    rowIndex={rowIndex} 
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DisplayGrid;
