import React, { useEffect, useState } from 'react';
import { 
  Grid, 
  Typography, 
  Box, 
  Paper, 
  Breadcrumbs,
  Link as MuiLink,
  Card,
  CardContent,
  Divider,
  Button,
  Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import StoreIcon from '@mui/icons-material/Store';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import MetricCard from './components/MetricCard';
import AreaChart from './components/AreaChart';
import EventCard from './components/EventCard';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch tasks or use mock data
    fetch('/tasks')
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback: Mock-Aufgaben mit Pfingstplanung
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        const mockTasks = [
          {
            id: 1,
            title: "Pfingstmontag-Planung erstellen",
            due_date: "10.06.25",
            priority: "Hoch",
            description: "Planung für den Pfingstmontag (2. Feiertag) mit angepasstem Sortiment und geänderten Öffnungszeiten."
          },
          {
            id: 2,
            title: "Dienstag nach Pfingsten planen",
            due_date: "10.06.25",
            priority: "Hoch",
            description: "Planung für Dienstag nach Pfingsten bereits am Freitag erstellen, da zwei Feiertage in Folge."
          },
          {
            id: 3,
            title: "Pfingst-Bestellung aufgeben",
            due_date: "07.06.25",
            priority: "Dringend",
            description: "Bestellung für Pfingstmontag und Dienstag bereits am Freitag aufgeben."
          },
          {
            id: 4,
            title: "Inventur durchführen",
            due_date: "15.06.25",
            priority: "Mittel",
            description: "Monatliche Inventur durchführen und Bestand aktualisieren."
          },
        ];
        
        setTasks(mockTasks);
        setLoading(false);
      });

    // Fetch orders or use mock data
    fetch('/orders')
      .then(res => res.json())
      .then(setOrders)
      .catch(() => {
        // Fallback: Mock-Bestellungen
        const mockOrders = [
          {
            id: 1,
            date: "06.06.25",
            quantity: 50,
            status: "Geliefert"
          },
          {
            id: 2,
            date: "07.06.25",
            quantity: 75,
            status: "In Bearbeitung"
          },
          {
            id: 3,
            date: "10.06.25",
            quantity: 60,
            status: "Geplant",
            note: "Pfingstmontag-Bestellung"
          },
        ];
        setOrders(mockOrders);
      });

    // Generate mock sales data for the chart
    const generateSalesData = () => {
      const data = [];
      const categories = [];
      const today = new Date();
      
      for (let i = 0; i < 24; i++) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - 24 + i);
        categories.push(format(date, 'MMM', { locale: de }));
        data.push(Math.floor(Math.random() * 50) + 30);
      }
      
      setSalesData({ data, categories });
    };

    generateSalesData();
  }, []);

  // Mock data für Verkaufsaktionen
  const salesPromotions = [
    {
      id: 1,
      title: '5+1 Gratis Brötchenaktion',
      description: 'Beim Kauf von 5 Brötchen gibt es ein weiteres gratis dazu.',
      startDate: '01.06.25',
      endDate: '30.06.25',
      duration: '1 Monat',
      category: 'Mengenrabatt',
      status: 'active',
      affectedItems: [
        { name: 'Weizenbrötchen', impact: '+28%' },
        { name: 'Roggenbrötchen', impact: '+15%' },
        { name: 'Vollkornbrötchen', impact: '+22%' }
      ],
      performance: {
        salesIncrease: '+23%',
        revenueChange: '+18%',
        customerSatisfaction: 'Sehr gut'
      }
    },
    {
      id: 2,
      title: 'Mittwochscombi: Landbrot + 4 Feierabendbrötchen',
      description: 'Jeden Mittwoch: Ein Landbrot und 4 Feierabendbrötchen zum Vorteilspreis von 6,50€.',
      startDate: 'Jeden Mittwoch',
      endDate: 'Unbegrenzt',
      duration: 'Wöchentlich',
      category: 'Kombi-Angebot',
      status: 'active',
      affectedItems: [
        { name: 'Landbrot', impact: '+45%' },
        { name: 'Feierabendbrötchen', impact: '+120%' }
      ],
      performance: {
        salesIncrease: '+38%',
        revenueChange: '+25%',
        customerSatisfaction: 'Gut'
      }
    },
    {
      id: 3,
      title: 'Frühstückspaket für 2 Personen',
      description: '2 Croissants, 4 Brötchen, 1 kleines Brot für nur 7,90€',
      startDate: '01.07.25',
      endDate: '31.08.25',
      duration: '2 Monate',
      category: 'Bundle-Angebot',
      status: 'upcoming',
      affectedItems: [
        { name: 'Croissant', impact: 'Prognose: +40%' },
        { name: 'Brötchen Mix', impact: 'Prognose: +25%' },
        { name: 'Kleines Brot', impact: 'Prognose: +30%' }
      ],
      performance: {
        salesIncrease: 'Prognose: +32%',
        revenueChange: 'Prognose: +28%',
        customerSatisfaction: 'Prognose: Sehr gut'
      }
    },
    {
      id: 4,
      title: 'Happy Hour: 30% auf alles ab 17 Uhr',
      description: 'Täglich ab 17 Uhr: 30% Rabatt auf alle Backwaren.',
      startDate: '15.06.25',
      endDate: '15.07.25',
      duration: '1 Monat',
      category: 'Zeitbasierter Rabatt',
      status: 'upcoming',
      affectedItems: [
        { name: 'Alle Brote', impact: 'Prognose: +65%' },
        { name: 'Alle Brötchen', impact: 'Prognose: +85%' },
        { name: 'Feingebäck', impact: 'Prognose: +50%' }
      ],
      performance: {
        salesIncrease: '+70%',
        revenueChange: '+40%',
        customerSatisfaction: 'Sehr gut'
      }
    }
  ];

  const handleCreateTask = () => {
    const newTask = {
      id: tasks.length + 1,
      title: 'Neue Aufgabe',
      due_date: '2023-03-15'
    };
    setTasks([...tasks, newTask]);
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
      </Breadcrumbs>

      {/* Metric Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Offene Aufgaben"
            value={tasks.length}
            subtitle="2 fällig diese Woche"
            icon={<AssignmentIcon />}
            tooltip="Anzahl der offenen Aufgaben"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Aktuelle Bestellungen"
            value={orders.length}
            subtitle="Letzte Bestellung: heute"
            icon={<LocalMallIcon />}
            tooltip="Anzahl der aktuellen Bestellungen"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Umsatz heute"
            value="€1,254"
            subtitle="+12% zum Vorwochentag"
            icon={<TrendingUpIcon />}
            tooltip="Heutiger Umsatz im Vergleich"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Ladentheke"
            value="32"
            subtitle="Artikel im Display"
            icon={<StoreIcon />}
            tooltip="Anzahl der Artikel in der Auslage"
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Sales Chart */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Umsatzentwicklung</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Monatlicher Umsatz der letzten 24 Monate
              </Typography>
              {salesData.data && (
                <AreaChart 
                  data={salesData.data}
                  categories={salesData.categories}
                  height={300}
                  highlightArea={{
                    start: 20,
                    end: 22,
                    label: "Rabattaktion",
                    color: "rgba(255,127,102,0.3)"
                  }}
                />
              )}
            </CardContent>
          </Card>

          {/* Tasks Card with Create Button */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Aufgaben</Typography>
                <Box>
                  <Button 
                    variant="contained" 
                    color="primary"
                    size="small" 
                    onClick={handleCreateTask}
                    sx={{ mr: 1, borderRadius: 28 }}
                  >
                    Neue Aufgabe
                  </Button>
                  <Button 
                    variant="text" 
                    size="small" 
                    component={Link} 
                    to="/tasks"
                  >
                    Alle anzeigen
                  </Button>
                </Box>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {tasks.length > 0 ? (
                <Box>
                  {tasks.map((task) => (
                    <Box 
                      key={task.id} 
                      sx={{ 
                        p: 2, 
                        mb: 1, 
                        borderRadius: 1, 
                        backgroundColor: task.title.toLowerCase().includes('pfingst') ? 'rgba(215, 185, 99, 0.15)' : 'background.default',
                        borderLeft: task.priority === 'Dringend' ? '4px solid #D32F2F' : 
                                  task.priority === 'Hoch' ? '4px solid #D7B963' : 
                                  '4px solid transparent',
                        '&:hover': { backgroundColor: task.title.toLowerCase().includes('pfingst') ? 'rgba(215, 185, 99, 0.25)' : 'action.hover' }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {task.title}
                        </Typography>
                        {task.priority && (
                          <Chip 
                            label={task.priority} 
                            size="small"
                            color={task.priority === 'Dringend' ? 'error' : 
                                  task.priority === 'Hoch' ? 'warning' : 
                                  'default'}
                            variant="outlined"
                            sx={{ ml: 1, fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        Fällig am {task.due_date}
                      </Typography>
                      {task.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ 
                          fontSize: '0.85rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {task.description}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
                  {loading ? 'Aufgaben werden geladen...' : 'Keine Aufgaben vorhanden'}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* Verkaufsaktionen mit Scrollbar */}
          <Typography variant="h6" sx={{ mb: 2, pl: 1 }}>Verkaufsaktionen</Typography>
          <Box 
            sx={{ 
              height: 'calc(100vh - 200px)', // Feste Höhe für den scrollbaren Bereich
              overflowY: 'auto',           // Vertikale Scrollbar aktivieren
              pr: 1,                       // Platz für die Scrollbar
              // Anpassung des Scrollbalkens für ein besseres Design
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(0,0,0,0.05)',
                borderRadius: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#D7B963',
                borderRadius: '8px',
              },
              // Firefox Scrollbar-Styling
              scrollbarWidth: 'thin',
              scrollbarColor: '#D7B963 rgba(0,0,0,0.05)'
            }}
          >
            {salesPromotions.map((promotion) => (
              <EventCard 
                key={promotion.id}
                title={promotion.title}
                description={promotion.description}
                startDate={promotion.startDate}
                endDate={promotion.endDate}
                duration={promotion.duration}
                category={promotion.category}
                status={promotion.status}
                affectedItems={promotion.affectedItems}
                performance={promotion.performance}
                sx={{ mb: 3 }}
              />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
