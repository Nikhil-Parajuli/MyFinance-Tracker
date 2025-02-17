import React, { useState } from 'react';
import { Download, Calendar } from 'lucide-react';
import { Transaction } from '../../types';
import { exportToExcel } from '../../utils/excelExport';
import DatePicker from '../common/DatePicker';

interface TransactionDownloadProps {
  transactions: Transaction[];
}

export default function TransactionDownload({ transactions }: TransactionDownloadProps) {
  const [range, setRange] = useState<'today' | 'week' | 'month' | 'custom'>('today');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const filterTransactions = () => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include full end date

    return transactions.filter(t => {
      const date = new Date(t.date);
      switch (range) {
        case 'today':
          return date.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return date >= weekAgo;
        case 'month':
          const monthAgo = new Date(now);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return date >= monthAgo;
        case 'custom':
          return date >= start && date <= end;
        default:
          return true;
      }
    });
  };

  const handleDownload = () => {
    const filtered = filterTransactions();
    const filename = `transactions-${range}`;
    exportToExcel(filtered, filename);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as any)}
            className="rounded-md border-gray-300 text-sm w-full sm:w-auto"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>

          {range === 'custom' && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <DatePicker
                date={startDate}
                onChange={setStartDate}
                label="Start Date"
              />
              <span className="hidden sm:inline">to</span>
              <DatePicker
                date={endDate}
                onChange={setEndDate}
                label="End Date"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleDownload}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto justify-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Download as Excel
        </button>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-500">
          {filterTransactions().length} transactions selected
        </h4>
      </div>
    </div>
  );
}