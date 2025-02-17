import React from 'react';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface TransactionSummaryProps {
  transactions: Transaction[];
}

export default function TransactionSummary({ transactions }: TransactionSummaryProps) {
  const calculateTotals = () => {
    const totals = {
      income: { NPR: 0, USD: 0 },
      expense: { NPR: 0, USD: 0 },
    };

    transactions.forEach((transaction) => {
      totals[transaction.type][transaction.currency] += transaction.amount;
    });

    return totals;
  };

  const totals = calculateTotals();

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center">
          <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-sm font-medium text-green-800">Total Income</h3>
        </div>
        <div className="mt-2 space-y-1">
          <p className="text-2xl font-semibold text-green-900">
            {formatCurrency(totals.income.NPR, 'NPR')}
          </p>
          <p className="text-sm text-green-700">
            {formatCurrency(totals.income.USD, 'USD')}
          </p>
        </div>
      </div>

      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex items-center">
          <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
          <h3 className="text-sm font-medium text-red-800">Total Expenses</h3>
        </div>
        <div className="mt-2 space-y-1">
          <p className="text-2xl font-semibold text-red-900">
            {formatCurrency(totals.expense.NPR, 'NPR')}
          </p>
          <p className="text-sm text-red-700">
            {formatCurrency(totals.expense.USD, 'USD')}
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 p-4 rounded-lg">
        <div className="flex items-center">
          <Wallet className="w-5 h-5 text-indigo-600 mr-2" />
          <h3 className="text-sm font-medium text-indigo-800">Balance</h3>
        </div>
        <div className="mt-2 space-y-1">
          <p className="text-2xl font-semibold text-indigo-900">
            {formatCurrency(totals.income.NPR - totals.expense.NPR, 'NPR')}
          </p>
          <p className="text-sm text-indigo-700">
            {formatCurrency(totals.income.USD - totals.expense.USD, 'USD')}
          </p>
        </div>
      </div>
    </div>
  );
}