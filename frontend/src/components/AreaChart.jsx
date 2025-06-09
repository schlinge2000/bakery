import React from 'react';
import { Box, useTheme } from '@mui/material';
import { Line } from 'react-chartjs-2';

const AreaChart = ({ 
  data = [], 
  categories = [], 
  height = 350, 
  showGrid = true,
  showLegend = true,
  title = '',
  highlightArea = null, // { start: index, end: index, color: 'rgba(255,127,102,0.3)' }
}) => {
  const theme = useTheme();

  // Prepare data for Chart.js
  const chartData = {
    labels: categories,
    datasets: Array.isArray(data[0]) 
      ? data.map((d, i) => ({
          label: `Series ${i+1}`,
          data: d,
          borderColor: i === 0 ? theme.palette.primary.main : theme.palette.secondary.main,
          backgroundColor: i === 0 
            ? `rgba(${hexToRgb(theme.palette.primary.main)}, 0.2)`
            : `rgba(${hexToRgb(theme.palette.secondary.main)}, 0.2)`,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: i === 0 ? theme.palette.primary.main : theme.palette.secondary.main,
        }))
      : [{
          label: 'Series 1',
          data: data,
          borderColor: theme.palette.primary.main,
          backgroundColor: `rgba(${hexToRgb(theme.palette.primary.main)}, 0.2)`,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: theme.palette.primary.main,
        }]
  };

  // Helper function to convert hex to rgb
  function hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
  }

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top',
        align: 'end',
        labels: {
          font: {
            family: theme.typography.fontFamily,
            size: 12
          },
          color: theme.palette.text.primary
        }
      },
      title: {
        display: !!title,
        text: title,
        align: 'start',
        font: {
          family: theme.typography.fontFamily,
          size: 16,
          weight: 500
        },
        color: theme.palette.text.primary
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 10,
        bodyFont: {
          family: theme.typography.fontFamily
        },
        titleFont: {
          family: theme.typography.fontFamily,
          weight: 600
        },
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += parseFloat(context.parsed.y).toFixed(1);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: showGrid,
          color: theme.palette.divider,
          borderDash: [4, 4]
        },
        ticks: {
          font: {
            family: theme.typography.fontFamily,
            size: 12
          },
          color: theme.palette.text.secondary
        }
      },
      y: {
        grid: {
          display: showGrid,
          color: theme.palette.divider,
          borderDash: [4, 4]
        },
        ticks: {
          font: {
            family: theme.typography.fontFamily,
            size: 12
          },
          color: theme.palette.text.secondary
        },
        beginAtZero: true
      }
    },
  };

  // Add annotation if highlightArea is provided
  if (highlightArea) {
    options.plugins.annotation = {
      annotations: {
        box1: {
          type: 'box',
          xMin: highlightArea.start,
          xMax: highlightArea.end,
          backgroundColor: highlightArea.color || 'rgba(255,127,102,0.3)',
          borderColor: 'transparent',
          drawTime: 'beforeDatasetsDraw',
          label: {
            display: !!highlightArea.label,
            content: highlightArea.label || 'Highlighted',
            position: 'center',
            color: '#fff',
            backgroundColor: theme.palette.secondary.main,
            font: {
              family: theme.typography.fontFamily,
              size: 12
            }
          }
        }
      }
    };
  }

  return (
    <Box sx={{ width: '100%', height }}>
      <Line data={chartData} options={options} height={height} />
    </Box>
  );
};

export default AreaChart;
