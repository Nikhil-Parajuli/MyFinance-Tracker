export type Currency = 'NPR' | 'USD';

// Database-compatible types
export interface Transaction {
  id: string;
  user_id?: string; // Added for database
  amount: number;
  currency: Currency;
  type: 'income' | 'expense';
  category: string;
  sub_category?: string; // Made optional to match database
  description?: string; // Made optional to match database
  date: string;
  is_personal?: boolean; // Made optional with default true
  created_at?: string; // Database timestamp
  updated_at?: string; // Database timestamp
}

export interface SavingsGoal {
  id: string;
  user_id?: string; // Added for database
  name: string;
  target_amount: number; // Changed to match database
  currency: Currency;
  current_amount: number; // Changed to match database
  deadline?: string; // Made optional
  created_at?: string; // Database timestamp
  updated_at?: string; // Database timestamp
}

// Add new database types for rentals
export interface RoomRental {
  id: string;
  user_id?: string;
  room_number: string;
  tenant_name: string;
  rent_amount: number;
  currency: Currency;
  start_date: string;
  status: 'occupied' | 'vacant';
  created_at?: string;
  updated_at?: string;
}

export interface RentalPayment {
  id: string;
  user_id?: string;
  rental_id: string;
  date: string;
  month: string; // Format: YYYY-MM
  rent_amount: number;
  electricity_units?: number;
  electricity_amount?: number;
  water_units?: number;
  water_amount?: number;
  total_amount: number;
  status?: 'paid' | 'pending' | 'overdue';
  created_at?: string;
  updated_at?: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  default_currency: Currency;
  electricity_rate: number;
  water_rate: number;
  created_at?: string;
  updated_at?: string;
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