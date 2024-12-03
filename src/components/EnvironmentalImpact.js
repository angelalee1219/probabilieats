import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EnvironmentalImpact = ({ impactResults }) => {
  const foodSaved = impactResults?.meanFoodSaved || 0;
  const co2Saved = impactResults?.meanCO2Saved || 0;

  const chartData = {
    labels: ['Food Saved (kg)', 'CO₂ Saved (kg)'],
    datasets: [
      {
        label: 'Environmental Impact Metrics',
        data: [foodSaved, co2Saved],
        backgroundColor: ['#34D399', '#60A5FA'],
        borderColor: ['#10B981', '#3B82F6'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Kilograms' },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-purple-700 mb-4">Environmental Impact</h2>
      {impactResults ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span role="img" aria-label="Food Icon" className="text-green-500 text-3xl mr-2">
                🥗
              </span>
              <p>
                <strong>Food Saved:</strong> {foodSaved.toFixed(2)} kg
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <span role="img" aria-label="CO2 Icon" className="text-blue-500 text-3xl mr-2">
                🌍
              </span>
              <p>
                <strong>CO₂ Saved:</strong> {co2Saved.toFixed(2)} kg
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No environmental impact data available</p>
      )}
    </div>
  );
};

export default EnvironmentalImpact;
