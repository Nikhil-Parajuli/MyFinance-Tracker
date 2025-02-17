import React, { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import TransactionList from '../components/transactions/TransactionList';
import { Transaction } from '../types';

export default function HistoryPage() {
  const { transactions, deleteTransaction, updateTransaction } = useTransactions();
  const [filter, setFilter] = useState('all');

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'personal') return t.isPersonal;
    if (filter === 'family') return !t.isPersonal;
    return true;
  });

  const handleEdit = (transaction: Transaction) => {
    // Implement edit functionality
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('personal')}
            className={`px-4 py-2 rounded-md ${
              filter === 'personal'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Personal
          </button>
          <button
            onClick={() => setFilter('family')}
            className={`px-4 py-2 rounded-md ${
              filter === 'family'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Family
          </button>
        </div>
      </div>

      <TransactionList
        transactions={filteredTransactions}
        onDelete={deleteTransaction}
        onEdit={handleEdit}
      />
    </div>
  );
}