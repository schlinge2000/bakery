import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Breadcrumbs,
  Link as MuiLink,
  Divider,
  Paper,
  IconButton,
  Tooltip,
  useTheme,
  Container,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SaveIcon from '@mui/icons-material/Save';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { DragDropContext } from 'react-beautiful-dnd';

// Import unsere Komponenten
import ProductList from './components/ProductList';
import DisplayGrid from './components/DisplayGrid';
import TimeSelector from './components/TimeSelector';
import BakeryIcons from './components/BakeryIcons';

// Hilfsfunktion zum Erstellen eines SVG-Data-URI aus einem SVG-Element
const svgToDataURI = (svgElement) => {
  const svgString = new XMLSerializer().serializeToString(svgElement);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
};

// Produkte mit Icons definieren
const createProductsWithIcons = () => {
  return [
    { id: 1, name: 'Brötchen', icon: '/bakery-icons/broetchen.svg' },
    { id: 2, name: 'Brezel', icon: '/bakery-icons/brezel.svg' },
    { id: 3, name: 'Baguette', icon: '/bakery-icons/baguette.svg' },
    { id: 4, name: 'Laugenstange', icon: '/bakery-icons/laugenstange.svg' },
    { id: 5, name: 'Croissant', icon: '/bakery-icons/croissant.svg' },
    { id: 6, name: 'Kürbiskernbrot', icon: '/bakery-icons/kuerbiskernbrot.svg' },
    { id: 7, name: 'Apfeltasche', icon: '/bakery-icons/apfeltasche.svg' },
    { id: 8, name: 'Nussecken', icon: '/bakery-icons/nussecken.svg' },
  ];
};

// Leeres Auslagenraster erstellen
const createEmptyGrid = (rows, cols) => {
  return Array(rows).fill().map(() => 
    Array(cols).fill().map(() => ({ product: null }))
  );
};

const DisplayCasePage = () => {
  const theme = useTheme();
  
  // Zustandsvariablen
  const [products, setProducts] = useState([]);
  const [selectedTime, setSelectedTime] = useState('08:00');
  const [times, setTimes] = useState(['06:00', '08:00', '11:00', '14:00', '17:00']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Separate Grids für verschiedene Tageszeiten
  const [timeGrids, setTimeGrids] = useState({});
  
  // Aktuelle Auslage basierend auf der ausgewählten Zeit
  const [currentGrid, setCurrentGrid] = useState([]);
  
  // Display Case Daten
  const [displayCase, setDisplayCase] = useState(null);
  
  // Animation-Zustand
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);
      
      // Vereinfachte Implementierung mit lokalen Daten
      console.log("Lade Displaycase-Daten");
      
      // Fallback-Produkte definieren (lokale Mock-Daten)
      const fallbackProducts = [
        { id: 1, name: 'Brötchen', icon: '/bakery-icons/broetchen.svg' },
        { id: 2, name: 'Brezel', icon: '/bakery-icons/brezel.svg' },
        { id: 3, name: 'Baguette', icon: '/bakery-icons/baguette.svg' },
        { id: 4, name: 'Laugenstange', icon: '/bakery-icons/laugenstange.svg' },
        { id: 5, name: 'Croissant', icon: '/bakery-icons/croissant.svg' },
        { id: 6, name: 'Kürbiskernbrot', icon: '/bakery-icons/kuerbiskernbrot.svg' },
        { id: 7, name: 'Apfeltasche', icon: '/bakery-icons/apfeltasche.svg' },
        { id: 8, name: 'Nussecken', icon: '/bakery-icons/nussecken.svg' },
      ];
      
      setProducts(fallbackProducts);
      
      // Lokale Grids erstellen
      const initialGrids = {};
      const rows = 4;
      const cols = 5;
      
      times.forEach(time => {
        const grid = createEmptyGrid(rows, cols);
        initialGrids[time] = grid;
      });
      
      setDisplayCase({
        id: 1,
        name: 'Haupttheke',
        description: 'Zentrale Verkaufstheke',
        rows: rows,
        columns: cols
      });
      
      setTimeGrids(initialGrids);
      setCurrentGrid(initialGrids[selectedTime] || createEmptyGrid(rows, cols));
      setLoading(false);
      console.log("Displaycase-Daten geladen");
    } catch (error) {
      console.error('Fehler in DisplayCasePage:', error);
      setError('Es ist ein Fehler aufgetreten: ' + error.message);
      setLoading(false);
    }
  }, [selectedTime, times]);
  
  // Aktualisiere das aktuelle Grid, wenn sich die ausgewählte Zeit ändert
  useEffect(() => {
    if (timeGrids[selectedTime]) {
      setCurrentGrid(timeGrids[selectedTime]);
    }
  }, [selectedTime, timeGrids]);
  
  // Speichere die Grids im localStorage, wenn sie sich ändern
  useEffect(() => {
    if (Object.keys(timeGrids).length > 0) {
      localStorage.setItem('bakeryDisplayGrids', JSON.stringify(timeGrids));
    }
  }, [timeGrids]);
  
  // Handler für Zeitänderungen
  const handleTimeChange = (newTime) => {
    setSelectedTime(newTime);
  };
  
  // Handler für Drag & Drop
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    
    // Wenn kein Ziel oder gleiche Position, nichts tun
    if (!destination) return;
    
    // Wenn das Produkt aus der Produktliste kommt
    if (source.droppableId === 'product-list') {
      const productIndex = source.index;
      const product = products[productIndex];
      
      // Extrahiere Reihe und Spalte aus der Ziel-ID
      const [, rowStr, colStr] = destination.droppableId.match(/slot-(\d+)-(\d+)/) || [];
      if (rowStr && colStr) {
        const rowIndex = parseInt(rowStr, 10);
        const colIndex = parseInt(colStr, 10);
        
        // Aktualisiere das Grid
        const newGrid = [...currentGrid];
        newGrid[rowIndex][colIndex] = { product: { ...product } };
        setCurrentGrid(newGrid);
        
        // Aktualisiere auch die timeGrids
        const newTimeGrids = { ...timeGrids };
        newTimeGrids[selectedTime] = newGrid;
        setTimeGrids(newTimeGrids);
      }
    }
    // Hier könnte man auch das Verschieben zwischen Slots implementieren
  };
  
  // Produkt aus einem Slot entfernen
  const handleRemoveProduct = (rowIndex, colIndex) => {
    const newGrid = [...currentGrid];
    newGrid[rowIndex][colIndex] = { product: null };
    setCurrentGrid(newGrid);
    
    const newTimeGrids = { ...timeGrids };
    newTimeGrids[selectedTime] = newGrid;
    setTimeGrids(newTimeGrids);
  };
  
  // Tagesablauf animieren
  const animateDayProgress = () => {
    setIsAnimating(true);
    
    let timeIndex = 0;
    const timeAnimation = setInterval(() => {
      if (timeIndex < times.length) {
        setSelectedTime(times[timeIndex]);
        timeIndex++;
      } else {
        clearInterval(timeAnimation);
        setIsAnimating(false);
      }
    }, 1500); // Jede Zeit wird 1,5 Sekunden angezeigt
  };

  return (
    <Box sx={{ 
      bgcolor: '#f8f5f0', 
      minHeight: '100vh',
      pb: 4
    }}>
      {/* Breadcrumbs */}
      <Container maxWidth="xl">
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{ pt: 3, pb: 2 }}
        >
          <MuiLink 
            component={Link} 
            to="/"
            underline="hover"
            color="inherit"
          >
            Zur Übersicht
          </MuiLink>
          <Typography color="text.primary">Ladentheke</Typography>
        </Breadcrumbs>

        {/* Header mit Titel und Zeitselektor */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography 
            variant="h5" 
            component="h1" 
            sx={{ 
              fontWeight: 600,
              color: '#5D4037'
            }}
          >
            Ladentheke
            {displayCase && (
              <Typography 
                variant="body2" 
                component="span"
                sx={{ 
                  ml: 2,
                  color: 'text.secondary',
                  fontWeight: 'normal'
                }}
              >
                {displayCase.name}
              </Typography>
            )}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PlayArrowIcon />}
              onClick={animateDayProgress}
              disabled={isAnimating || loading}
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
              Tagesverlauf anzeigen
            </Button>
            
            <TimeSelector 
              selectedTime={selectedTime}
              onTimeChange={handleTimeChange}
              times={times}
            />
          </Box>
        </Box>

        {/* Fehlermeldung anzeigen, falls vorhanden */}
        {error && (
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              mb: 3,
              bgcolor: '#FFEBEE',
              borderRadius: 2,
              border: '1px solid',
              borderColor: '#FFCDD2',
            }}
          >
            <Typography color="error">{error}</Typography>
          </Paper>
        )}

        {/* Ladeanzeige */}
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            py: 8
          }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography>Auslagedaten werden geladen...</Typography>
          </Box>
        ) : (
          /* Hauptbereich mit Drag & Drop */
          <DragDropContext onDragEnd={handleDragEnd}>
            <Grid container spacing={3}>
              {/* Linke Sidebar mit Produkten */}
              <Grid item xs={12} md={3}>
                <Box sx={{ position: 'sticky', top: 20 }}>
                  <ProductList products={products} />
                </Box>
              </Grid>
              
              {/* Rechter Bereich mit Auslage */}
              <Grid item xs={12} md={9}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 3, 
                    bgcolor: 'white',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: '#E0E0E0',
                    mb: 3
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        color: '#5D4037'
                      }}
                    >
                      Auslage {selectedTime} Uhr
                    </Typography>
                    
                    <Tooltip title="Die Auslage wird automatisch im Browser gespeichert.">
                      <IconButton size="small" color="info">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 3 }}
                  >
                    Ziehen Sie Produkte aus der linken Seitenleiste in die Auslage, um sie zu platzieren.
                  </Typography>
                  
                  <DisplayGrid grid={currentGrid} />
                </Paper>
                
                {/* Zusätzliche Informationen */}
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 3, 
                    bgcolor: 'white',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: '#E0E0E0'
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      color: '#5D4037',
                      mb: 2
                    }}
                  >
                    Hinweise zur Auslage
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    Die Auslage kann für verschiedene Tageszeiten individuell konfiguriert werden.
                    Wählen Sie eine Uhrzeit aus dem Dropdown-Menü oben rechts, um zwischen den
                    verschiedenen Konfigurationen zu wechseln.
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    Mit "Tagesverlauf anzeigen" können Sie sehen, wie sich die Auslage im Laufe des Tages verändert.
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    flexWrap: 'wrap',
                    mt: 3
                  }}>
                    <Button 
                      variant="outlined" 
                      color="primary"
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
                      Neue Thekenform erstellen
                    </Button>
                    
                    <Button 
                      variant="outlined" 
                      color="primary"
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
                      Auslage zurücksetzen
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </DragDropContext>
        )}
      </Container>
    </Box>
  );
};

export default DisplayCasePage;
