import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('/tasks')
      .then(res => res.json())
      .then(setTasks)
      .catch(() => setTasks([]));
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <ul>
        {tasks.map(t => (
          <li key={t.id}>{t.title} (fällig am {t.due_date})</li>
        ))}
      </ul>
      <nav>
        <Link to="/plan">Planung</Link> |{' '}
        <Link to="/orders">Bestellungen</Link> |{' '}
        <Link to="/display">Ladentheke</Link>
      </nav>
    </div>
  );
};

export default Dashboard;
