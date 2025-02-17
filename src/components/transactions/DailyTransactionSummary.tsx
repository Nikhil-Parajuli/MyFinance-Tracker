import React from 'react';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

interface DailyTransactionsSummaryProps {
  transactions: Transaction[];
}

export default function DailyTransactionSummary({ transactions }: DailyTransactionsSummaryProps) {
  const today = new Date().toISOString().split('T')[0];
  const todayTransactions = transactions.filter(t => t.date.startsWith(today));
  const dateInfo = formatDate(today);

  const calculateTotals = () => {
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

  if (todayTransactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-gray-500" />
          <h3 className="text-base font-medium text-gray-900">
            {dateInfo.displayLabel}
            <span className="ml-2 text-sm text-gray-500">
              ({dateInfo.nepaliDate})
            </span>
          </h3>
        </div>
        <p className="text-gray-500 text-center py-4">No transactions recorded today</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <h3 className="text-base font-medium text-gray-900">
            {dateInfo.displayLabel}
            <span className="ml-2 text-sm text-gray-500">
              ({dateInfo.nepaliDate})
            </span>
          </h3>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NPR Summary */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">NPR Transactions</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">Income</span>
              </div>
              <span className="text-sm font-medium text-green-600">
                {formatCurrency(totals.NPR.income, 'NPR')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-600">Expense</span>
              </div>
              <span className="text-sm font-medium text-red-600">
                {formatCurrency(totals.NPR.expense, 'NPR')}
              </span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Net</span>
                <span className="text-sm font-medium text-indigo-600">
                  {formatCurrency(totals.NPR.income - totals.NPR.expense, 'NPR')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* USD Summary */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">USD Transactions</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">Income</span>
              </div>
              <span className="text-sm font-medium text-green-600">
                {formatCurrency(totals.USD.income, 'USD')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-600">Expense</span>
              </div>
              <span className="text-sm font-medium text-red-600">
                {formatCurrency(totals.USD.expense, 'USD')}
              </span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Net</span>
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