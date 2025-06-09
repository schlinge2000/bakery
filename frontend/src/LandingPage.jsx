import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent,
  useTheme,
  useMediaQuery,
  Paper,
  Divider
} from '@mui/material';
import { Link } from 'react-router-dom';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#f0e1c6', // Warm beige background similar to the logo background
      color: '#1a1a1a',
      pb: 8
    }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          pt: { xs: 8, md: 12 }, 
          pb: { xs: 8, md: 12 },
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, mb: 4 }}>
                <Box 
                  component="img" 
                  src="/logo.svg" 
                  alt="Mehl & Methode Logo" 
                  sx={{ 
                    height: 80,
                    mb: 2
                  }}
                />
              </Box>
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  color: '#1a1a1a'
                }}
              >
                Damit das richtige zur richtigen Zeit im Ofen landet!
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4, 
                  color: 'rgba(0,0,0,0.7)',
                  fontWeight: 400
                }}
              >
                Präzise Bedarfsprognosen für Bäckereien mit künstlicher Intelligenz
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  component={Link}
                  to="/dashboard"
                  sx={{ 
                    borderRadius: 28,
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)'
                  }}
                >
                  Demo starten
                </Button>
                <Button 
                  variant="outlined" 
                  color="primary"
                  size="large"
                  sx={{ 
                    borderRadius: 28,
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600
                  }}
                >
                  Mehr erfahren
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                component="img" 
                src="/hero-image.svg" 
                alt="Bäckerei Prognose" 
                sx={{ 
                  width: '100%',
                  maxWidth: 500,
                  height: 'auto',
                  borderRadius: 4,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  display: 'block',
                  mx: 'auto'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            sx={{ 
              mb: 6,
              fontWeight: 600
            }}
          >
            Unsere Lösung für Ihren Bedarf
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card 
                elevation={0} 
                sx={{ 
                  height: '100%', 
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      mb: 2
                    }}
                  >
                    <QueryStatsIcon fontSize="large" />
                  </Box>
                  <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
                    Präzise Prognosen
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Unsere KI-Algorithmen analysieren historische Daten, Wetter und lokale Ereignisse für genaue Bedarfsprognosen.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card 
                elevation={0} 
                sx={{ 
                  height: '100%', 
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      bgcolor: theme.palette.secondary.main,
                      color: 'white',
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      mb: 2
                    }}
                  >
                    <AccessTimeIcon fontSize="large" />
                  </Box>
                  <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
                    Zeitersparnis
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Reduzieren Sie den Planungsaufwand und konzentrieren Sie sich auf das, was wirklich zählt: Qualität und Kundenzufriedenheit.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card 
                elevation={0} 
                sx={{ 
                  height: '100%', 
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      bgcolor: '#4caf50',
                      color: 'white',
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      mb: 2
                    }}
                  >
                    <TrendingUpIcon fontSize="large" />
                  </Box>
                  <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
                    Weniger Verschwendung
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Optimieren Sie Ihre Produktion, reduzieren Sie Überschüsse und steigern Sie Ihre Gewinnmargen nachhaltig.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            sx={{ 
              mb: 6,
              fontWeight: 600
            }}
          >
            So funktioniert's
          </Typography>
          
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box 
                component="img" 
                src="/dashboard-preview.svg" 
                alt="Dashboard Vorschau" 
                sx={{ 
                  width: '100%',
                  height: 'auto',
                  borderRadius: 4,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      mr: 2
                    }}
                  >
                    1
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Daten verbinden
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Integrieren Sie Ihre Verkaufsdaten und lassen Sie unsere KI Muster erkennen.
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      mr: 2
                    }}
                  >
                    2
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Prognosen erhalten
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Erhalten Sie tägliche Prognosen für jeden Artikel in jeder Filiale.
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex' }}>
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      mr: 2
                    }}
                  >
                    3
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Produktion optimieren
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Planen Sie Ihre Produktion basierend auf präzisen Vorhersagen und maximieren Sie Ihren Gewinn.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonial Section */}
      <Box sx={{ py: 8, bgcolor: 'white' }}>
        <Container maxWidth="md">
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            sx={{ 
              mb: 6,
              fontWeight: 600
            }}
          >
            Das sagen unsere Kunden
          </Typography>
          
          <Paper 
            elevation={0}
            sx={{ 
              p: 6, 
              borderRadius: 4,
              bgcolor: '#f9f9f9',
              border: '1px solid',
              borderColor: 'divider',
              textAlign: 'center'
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3, 
                fontStyle: 'italic',
                color: 'text.primary'
              }}
            >
              "Mit Mehl & Methode konnten wir unsere Überschüsse um 40% reduzieren und gleichzeitig sicherstellen, dass wir immer genug frische Backwaren für unsere Kunden haben."
            </Typography>
            <Divider sx={{ width: 100, mx: 'auto', my: 3 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Martina Becker
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Geschäftsführerin, Bäckerei Sonnenschein
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          py: 10, 
          textAlign: 'center',
          bgcolor: theme.palette.primary.main,
          color: 'white'
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              mb: 3,
              fontWeight: 600
            }}
          >
            Bereit, Ihre Bäckerei zu optimieren?
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4,
              fontWeight: 400,
              opacity: 0.9
            }}
          >
            Starten Sie noch heute mit unserer intelligenten Bedarfsprognose
          </Typography>
          <Button
            component={Link}
            to="/dashboard"
            variant="contained"
            size="large"
            sx={{ 
              mt: 4, 
              py: 1.5, 
              px: 4, 
              borderRadius: 28,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 500,
              boxShadow: 2,
              bgcolor: '#D7B963', // Ockerfarbe für ein bodenständigeres Design
              '&:hover': {
                bgcolor: '#C4A94C', // Dunklere Ockerfarbe beim Hover
              }
            }}
          >
            Zum Dashboard
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box 
        sx={{ 
          py: 4, 
          bgcolor: '#1a1a1a',
          color: 'white'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <BakeryDiningIcon sx={{ mr: 1 }} />
                <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
                  Mehl & Methode
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                © {new Date().getFullYear()} Mehl & Methode GmbH. Alle Rechte vorbehalten.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
