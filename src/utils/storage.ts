import { Transaction, SavingsGoal } from '../types';

const STORAGE_KEYS = {
  TRANSACTIONS: 'myfinance_transactions',
  SAVINGS_GOALS: 'myfinance_savings_goals',
  SETTINGS: 'myfinance_settings',
};

export const saveTransactions = (transactions: Transaction[]): void => {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

export const getTransactions = (): Transaction[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return stored ? JSON.parse(stored) : [];
};

export const saveSavingsGoals = (goals: SavingsGoal[]): void => {
  localStorage.setItem(STORAGE_KEYS.SAVINGS_GOALS, JSON.stringify(goals));
};

export const getSavingsGoals = (): SavingsGoal[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.SAVINGS_GOALS);
  return stored ? JSON.parse(stored) : [];
};