import React from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';

// Komponente für ein einzelnes Produkt in der Sidebar
const ProductCard = ({ product, index }) => {
  return (
    <Draggable draggableId={`product-${product.id}`} index={index}>
      {(provided, snapshot) => (
        <ListItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            mb: 1,
            borderRadius: 2,
            bgcolor: snapshot.isDragging ? 'rgba(240, 225, 198, 0.8)' : 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            '&:hover': {
              bgcolor: 'rgba(240, 225, 198, 0.5)',
            }
          }}
        >
          <ListItemIcon>
            <Box 
              component="img" 
              src={product.icon} 
              alt={product.name}
              sx={{ 
                width: 40, 
                height: 40,
                filter: 'brightness(0.9)'
              }}
            />
          </ListItemIcon>
          <ListItemText 
            primary={product.name}
            primaryTypographyProps={{
              fontWeight: 500,
              color: '#5D4037'
            }}
          />
        </ListItem>
      )}
    </Draggable>
  );
};

// Hauptkomponente für die Produktliste
const ProductList = ({ products }) => {
  return (
    <Box 
      sx={{ 
        width: '100%', 
        height: '100%',
        bgcolor: '#f8f5f0',
        borderRadius: 2,
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2, 
          color: '#5D4037',
          fontWeight: 600
        }}
      >
        Produkte
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <List sx={{ p: 0 }}>
        {products.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            index={index} 
          />
        ))}
      </List>
      
      <Typography 
        variant="caption" 
        sx={{ 
          display: 'block', 
          mt: 2, 
          textAlign: 'center',
          color: 'text.secondary'
        }}
      >
        Produkte per Drag & Drop in die Auslage ziehen
      </Typography>
    </Box>
  );
};

export default ProductList;
