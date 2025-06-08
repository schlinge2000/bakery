import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PlanPage = () => {
  const [preds, setPreds] = useState([]);
  const [plz, setPlz] = useState('10115');
  const [weather, setWeather] = useState([]);

  const loadForecast = () => {
    fetch('/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ branch: 'main', horizon: 7, window: '1D' }),
    })
      .then(res => res.json())
      .then(data => setPreds(data.predictions))
      .catch(() => setPreds([]));

    fetch(`/weather/${plz}`)
      .then(res => res.json())
      .then(setWeather)
      .catch(() => setWeather([]));
  };

  const chartData = {
    labels: preds.map((_, idx) => `Tag ${idx + 1}`),
    datasets: [
      {
        label: 'Forecast',
        data: preds,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h2>Artikelplanung</h2>
      <button onClick={loadForecast}>Forecast laden</button>
      {preds.length > 0 && <Line data={chartData} />}
      {weather.length > 0 && (
        <ul>
          {weather.map(w => (
            <li key={w.date}>{w.date}: {w.temperature.toFixed(1)}°C</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlanPage;
