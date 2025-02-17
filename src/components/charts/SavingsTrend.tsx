import React from 'react';
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
import { Line } from 'react-chartjs-2';
import { Transaction } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SavingsTrendProps {
  transactions: Transaction[];
  currency: 'NPR' | 'USD';
}

export default function SavingsTrend({ transactions, currency }: SavingsTrendProps) {
  // Group transactions by month and calculate savings
  const monthlySavings = transactions
    .filter((t) => t.currency === currency)
    .reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = { income: 0, expense: 0 };
      }
      
      if (transaction.type === 'income') {
        acc[monthKey].income += transaction.amount;
      } else {
        acc[monthKey].expense += transaction.amount;
      }
      
      return acc;
    }, {} as Record<string, { income: number; expense: number }>);

  const sortedMonths = Object.keys(monthlySavings).sort();
  const savings = sortedMonths.map(
    (month) => monthlySavings[month].income - monthlySavings[month].expense
  );

  const data = {
    labels: sortedMonths.map((month) => {
      const [year, monthNum] = month.split('-');
      return `${monthNum}/${year}`;
    }),
    datasets: [
      {
        label: 'Monthly Savings',
        data: savings,
        borderColor: '#4F46E5',
        backgroundColor: '#4F46E533',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `${currency} ${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `${currency} ${value.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Savings Trend</h3>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}