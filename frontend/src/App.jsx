import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Dashboard from './Dashboard.jsx';
import PlanPage from './PlanPage.jsx';
import OrdersPage from './OrdersPage.jsx';
import DisplayCasePage from './DisplayCasePage.jsx';

const App = () => {
  return (
    <div>
      <h1>Bakery Demand Planner</h1>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/plan" element={<PlanPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/display" element={<DisplayCasePage />} />
        <Route path="*" element={<p>Seite nicht gefunden</p>} />
      </Routes>
      <footer style={{ marginTop: '2em' }}>
        <Link to="/">Home</Link>
      </footer>
    </div>
  );
};

export default App;
