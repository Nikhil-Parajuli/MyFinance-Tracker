import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Transaction } from '../../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpenseBreakdownProps {
  transactions: Transaction[];
  currency: 'NPR' | 'USD';
}

const COLORS = [
  '#4F46E5', // indigo-600
  '#7C3AED', // violet-600
  '#DB2777', // pink-600
  '#DC2626', // red-600
  '#EA580C', // orange-600
  '#D97706', // amber-600
  '#059669', // emerald-600
  '#0891B2', // cyan-600
  '#2563EB', // blue-600
];

export default function ExpenseBreakdown({ transactions, currency }: ExpenseBreakdownProps) {
  const expensesByCategory = transactions
    .filter((t) => t.type === 'expense' && t.currency === currency)
    .reduce((acc, transaction) => {
      const { category, amount } = transaction;
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);

  const data = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        data: Object.values(expensesByCategory),
        backgroundColor: COLORS,
        borderColor: COLORS.map((color) => color + '33'),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
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
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Expense Breakdown</h3>
      <div className="h-64">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}