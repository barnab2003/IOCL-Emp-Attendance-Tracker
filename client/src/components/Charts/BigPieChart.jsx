import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const BigPieChart = ({ data }) => {
  // Map backend aggregation to Chart.js format
  const labels = data.map(item => item._id);
  const values = data.map(item => item.count);

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          '#22c55e', // Present - Green
          '#ef4444', // Absent - Red
          '#f59e0b', // Late - Yellow
          '#6366f1'  // On Leave - Indigo
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  return <Pie data={chartData} options={options} />;
};

export default BigPieChart;