import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { transactionService } from '../services/database';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch transactions from database
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const fetchedTransactions = await transactionService.getAll();
      setTransactions(fetchedTransactions);
      setError(null);
    } catch (err) {
      setError('Failed to fetch transactions from database');
      console.error('Error fetching transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = async (newTransaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const transaction = await transactionService.create({
        ...newTransaction,
        date: newTransaction.date || new Date().toISOString().split('T')[0],
      });
      
      setTransactions(prev => [transaction, ...prev]);
      setError(null);
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError('Failed to add transaction to database');
      throw err; // Re-throw to let the UI handle it
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await transactionService.delete(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Failed to delete transaction from database');
      throw err;
    }
  };

  const updateTransaction = async (updatedTransaction: Transaction) => {
    try {
      const updated = await transactionService.update(updatedTransaction.id, updatedTransaction);
      setTransactions(prev =>
        prev.map(t => (t.id === updatedTransaction.id ? updated : t))
      );
      setError(null);
    } catch (err) {
      console.error('Error updating transaction:', err);
      setError('Failed to update transaction in database');
      throw err;
    }
  };

  // Get transactions by date range
  const getTransactionsByDateRange = async (startDate: string, endDate: string) => {
    try {
      const rangeTransactions = await transactionService.getByDateRange(startDate, endDate);
      return rangeTransactions;
    } catch (err) {
      console.error('Error fetching transactions by date range:', err);
      setError('Failed to fetch transactions by date range');
      return [];
    }
  };

  // Helper functions for calculations
  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpense = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getBalance = () => {
    return getTotalIncome() - getTotalExpense();
  };

  return {
    transactions,
    isLoading,
    error,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    refreshTransactions: fetchTransactions,
    getTransactionsByDateRange,
    getTotalIncome,
    getTotalExpense,
    getBalance,
  };
}