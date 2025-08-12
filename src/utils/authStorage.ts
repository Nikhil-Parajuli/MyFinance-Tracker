import { User, LoginCredentials, SignupCredentials } from '../types';

const USERS_KEY = 'finance_tracker_users';
const CURRENT_USER_KEY = 'finance_tracker_current_user';

interface StoredUser {
  id: string;
  email: string;
  fullName: string;
  password: string; // In real app, this would be hashed
  createdAt: string;
}

// Get all users from localStorage
export const getStoredUsers = (): StoredUser[] => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error reading users from localStorage:', error);
    return [];
  }
};

// Save users to localStorage
export const saveUsers = (users: StoredUser[]): void => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
};

// Generate unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Sign up a new user
export const signupUser = (credentials: SignupCredentials): { success: boolean; message: string; user?: User } => {
  const users = getStoredUsers();
  
  // Check if user already exists
  const existingUser = users.find(user => user.email.toLowerCase() === credentials.email.toLowerCase());
  if (existingUser) {
    return { success: false, message: 'User with this email already exists' };
  }

  // Validate password match
  if (credentials.password !== credentials.confirmPassword) {
    return { success: false, message: 'Passwords do not match' };
  }

  // Create new user
  const newUser: StoredUser = {
    id: generateId(),
    email: credentials.email.toLowerCase(),
    fullName: credentials.fullName,
    password: credentials.password, // In real app, hash this
    createdAt: new Date().toISOString()
  };

  // Save user
  users.push(newUser);
  saveUsers(users);

  // Return user without password
  const user: User = {
    id: newUser.id,
    email: newUser.email,
    fullName: newUser.fullName,
    createdAt: newUser.createdAt
  };

  return { success: true, message: 'Account created successfully', user };
};

// Login user
export const loginUser = (credentials: LoginCredentials): { success: boolean; message: string; user?: User } => {
  const users = getStoredUsers();
  
  const user = users.find(
    u => u.email.toLowerCase() === credentials.email.toLowerCase() && u.password === credentials.password
  );

  if (!user) {
    return { success: false, message: 'Invalid email or password' };
  }

  // Return user without password
  const authenticatedUser: User = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    createdAt: user.createdAt
  };

  return { success: true, message: 'Login successful', user: authenticatedUser };
};

// Save current user session
export const saveCurrentUser = (user: User): void => {
  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving current user:', error);
  }
};

// Get current user session
export const getCurrentUser = (): User | null => {
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Clear current user session
export const clearCurrentUser = (): void => {
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
  } catch (error) {
    console.error('Error clearing current user:', error);
  }
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  return { isValid: true, message: 'Password is valid' };
};
