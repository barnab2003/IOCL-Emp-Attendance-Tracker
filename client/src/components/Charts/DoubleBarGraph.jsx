import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DoubleBarGraph = ({ data }) => {
  const departments = data.map(item => item._id);
  
  // Extract specific statuses across all departments
  const getCounts = (statusToFind) => data.map(dept => {
    const record = dept.attendanceRecords.find(r => r.status === statusToFind);
    return record ? record.count : 0;
  });

  const chartData = {
    labels: departments,
    datasets: [
      {
        label: 'Present',
        data: getCounts('Present'),
        backgroundColor: '#4c1d95', // Purple from mockup
        borderRadius: 4,
      },
      {
        label: 'Absent / On Leave',
        // Combining negative statuses for the second bar
        data: departments.map((_, index) => getCounts('Absent')[index] + getCounts('On Leave')[index]),
        backgroundColor: '#f97316', // Orange from mockup
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true }
    },
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default DoubleBarGraph;