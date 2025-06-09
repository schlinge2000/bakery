import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Layout from './components/Layout';
import Dashboard from './Dashboard';
import PlanPage from './PlanPage';
import OrdersPage from './OrdersPage';
import DisplayCasePage from './DisplayCasePage';
import LandingPage from './LandingPage';

// Ockerfarbe für ein bodenständigeres Design
const ockerColor = '#D7B963';

// Theme mit Ockerfarbe anpassen
const theme = createTheme({
  palette: {
    primary: {
      main: '#5D4037', // Braun als Hauptfarbe
      dark: '#4E342E',
      light: '#8D6E63',
    },
    secondary: {
      main: ockerColor, // Ockerfarbe als Sekundärfarbe
    },
    background: {
      default: '#f8f5f0', // Heller Beige-Hintergrund
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/plan" element={<Layout><PlanPage /></Layout>} />
        <Route path="/orders" element={<Layout><OrdersPage /></Layout>} />
        <Route path="/display" element={<Layout><DisplayCasePage /></Layout>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
