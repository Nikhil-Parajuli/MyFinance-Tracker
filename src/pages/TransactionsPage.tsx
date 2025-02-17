import React, { useState } from 'react';
import { Loader, AlertCircle } from 'lucide-react';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionList from '../components/transactions/TransactionList';
import TransactionSummary from '../components/transactions/TransactionSummary';
import TransactionDownload from '../components/transactions/TransactionDownload';
import DailyTransactionSummary from '../components/transactions/DailyTransactionSummary';
import ExpenseBreakdown from '../components/charts/ExpenseBreakdown';
import SavingsTrend from '../components/charts/SavingsTrend';
import { useTransactions } from '../hooks/useTransactions';
import { Currency } from '../types';

export default function TransactionsPage() {
  const {
    transactions,
    isLoading,
    error,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    refreshTransactions
  } = useTransactions();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('NPR');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="mt-2 text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
          <p className="mt-2 text-red-600">{error}</p>
          <button
            onClick={refreshTransactions}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value as Currency)}
          className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option value="NPR">NPR</option>
          <option value="USD">USD</option>
        </select>
      </div>

      <TransactionSummary transactions={transactions} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseBreakdown transactions={transactions} currency={selectedCurrency} />
        <SavingsTrend transactions={transactions} currency={selectedCurrency} />
      </div>

      <DailyTransactionSummary transactions={transactions} />

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Transaction</h2>
        <TransactionForm onSubmit={addTransaction} />
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Transactions</h2>
          <button
            onClick={refreshTransactions}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Refresh
          </button>
        </div>
        
        <TransactionDownload transactions={transactions} />
        
        <TransactionList
          transactions={transactions}
          onDelete={deleteTransaction}
          onEdit={updateTransaction}
        />
      </div>
    </div>
  );
}