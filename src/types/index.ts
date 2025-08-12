export type Currency = 'NPR' | 'USD';

export interface Transaction {
  id: string;
  amount: number;
  currency: Currency;
  type: 'income' | 'expense';
  category: string;
  subCategory: string;
  description: string;
  date: string;
  isPersonal: boolean;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currency: Currency;
  currentAmount: number;
  deadline: string;
}

export interface TransactionCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
}

export const EXPENSE_CATEGORIES = [
  'Housing',
  'Transportation',
  'Food',
  'Healthcare',
  'Entertainment',
  'Shopping',
  'Education',
  'Savings',
  'Others'
] as const;

export const INCOME_CATEGORIES = [
  'Salary',
  'Business',
  'Investments',
  'Freelance',
  'Others'
] as const;

// Authentication types
export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}