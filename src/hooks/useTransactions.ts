import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { DiscordService } from '../services/discord';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch transactions from Discord
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const fetchedTransactions = await DiscordService.fetchTransactions();
      setTransactions(fetchedTransactions);
      setError(null);
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error('Error fetching transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = async (newTransaction: Omit<Transaction, 'id' | 'date'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };

    try {
      const success = await DiscordService.addTransaction(transaction);
      if (success) {
        setTransactions(prev => [transaction, ...prev]);
      } else {
        throw new Error('Failed to add transaction');
      }
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError('Failed to add transaction');
    }
  };

  const deleteTransaction = async (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    try {
      const success = await DiscordService.deleteTransaction(transaction);
      if (success) {
        setTransactions(prev => prev.filter(t => t.id !== id));
      } else {
        throw new Error('Failed to delete transaction');
      }
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Failed to delete transaction');
    }
  };

  const updateTransaction = async (updatedTransaction: Transaction) => {
    try {
      const success = await DiscordService.updateTransaction(updatedTransaction);
      if (success) {
        setTransactions(prev =>
          prev.map(t => (t.id === updatedTransaction.id ? updatedTransaction : t))
        );
      } else {
        throw new Error('Failed to update transaction');
      }
    } catch (err) {
      console.error('Error updating transaction:', err);
      setError('Failed to update transaction');
    }
  };

  return {
    transactions,
    isLoading,
    error,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    refreshTransactions: fetchTransactions,
  };
}