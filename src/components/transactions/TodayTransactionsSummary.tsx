import React from 'react';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

interface TodayTransactionsSummaryProps {
  transactions: Transaction[];
}

export default function TodayTransactionsSummary({ transactions }: TodayTransactionsSummaryProps) {
  const getTodayTransactions = () => {
    const today = new Date().toISOString().split('T')[0];
    return transactions.filter(t => t.date.startsWith(today));
  };

  const calculateTotals = () => {
    const todayTransactions = getTodayTransactions();
    return todayTransactions.reduce(
      (acc, t) => {
        if (t.type === 'income') {
          acc[t.currency].income += t.amount;
        } else {
          acc[t.currency].expense += t.amount;
        }
        return acc;
      },
      {
        NPR: { income: 0, expense: 0 },
        USD: { income: 0, expense: 0 },
      }
    );
  };

  const totals = calculateTotals();

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Today's Transactions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* NPR Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">NPR Summary</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-600">Income</span>
              </div>
              <span className="text-sm font-medium text-green-600">
                {formatCurrency(totals.NPR.income, 'NPR')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ArrowDownRight className="w-4 h-4 text-red-500 mr-2" />
                <span className="text-sm text-gray-600">Expense</span>
              </div>
              <span className="text-sm font-medium text-red-600">
                {formatCurrency(totals.NPR.expense, 'NPR')}
              </span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Wallet className="w-4 h-4 text-indigo-500 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Net</span>
                </div>
                <span className="text-sm font-medium text-indigo-600">
                  {formatCurrency(totals.NPR.income - totals.NPR.expense, 'NPR')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* USD Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">USD Summary</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-600">Income</span>
              </div>
              <span className="text-sm font-medium text-green-600">
                {formatCurrency(totals.USD.income, 'USD')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ArrowDownRight className="w-4 h-4 text-red-500 mr-2" />
                <span className="text-sm text-gray-600">Expense</span>
              </div>
              <span className="text-sm font-medium text-red-600">
                {formatCurrency(totals.USD.expense, 'USD')}
              </span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Wallet className="w-4 h-4 text-indigo-500 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Net</span>
                </div>
                <span className="text-sm font-medium text-indigo-600">
                  {formatCurrency(totals.USD.income - totals.USD.expense, 'USD')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}