import { supabase } from '../lib/supabase';
import { User, LoginCredentials, SignupCredentials } from '../types';

// Convert Supabase user to our User type
const mapSupabaseUser = (supabaseUser: any): User => ({
  id: supabaseUser.id,
  email: supabaseUser.email,
  fullName: supabaseUser.user_metadata?.full_name || supabaseUser.email,
  createdAt: supabaseUser.created_at
});

// Sign up a new user with Supabase
export const signupUser = async (credentials: SignupCredentials): Promise<{ success: boolean; message: string; user?: User }> => {
  try {
    // Validate password match
    if (credentials.password !== credentials.confirmPassword) {
      return { success: false, message: 'Passwords do not match' };
    }

    // Validate password strength
    if (credentials.password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long' };
    }

    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          full_name: credentials.fullName
        }
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        return { success: false, message: 'User with this email already exists' };
      }
      return { success: false, message: error.message };
    }

    if (!data.user) {
      return { success: false, message: 'Failed to create user account' };
    }

    // Check if email confirmation is required
    if (!data.session) {
      return { 
        success: true, 
        message: 'Account created! Please check your email to confirm your account before logging in.',
        user: mapSupabaseUser(data.user)
      };
    }

    return { 
      success: true, 
      message: 'Account created successfully!',
      user: mapSupabaseUser(data.user)
    };

  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, message: 'An unexpected error occurred during signup' };
  }
};

// Login user with Supabase
export const loginUser = async (credentials: LoginCredentials): Promise<{ success: boolean; message: string; user?: User }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return { success: false, message: 'Invalid email or password' };
      }
      if (error.message.includes('Email not confirmed')) {
        return { success: false, message: 'Please confirm your email address before logging in' };
      }
      return { success: false, message: error.message };
    }

    if (!data.user) {
      return { success: false, message: 'Login failed' };
    }

    return { 
      success: true, 
      message: 'Login successful',
      user: mapSupabaseUser(data.user)
    };

  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'An unexpected error occurred during login' };
  }
};

// Logout user
export const logoutUser = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Logged out successfully' };

  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, message: 'An unexpected error occurred during logout' };
  }
};

// Get current user session
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user ? mapSupabaseUser(user) : null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    const user = session?.user ? mapSupabaseUser(session.user) : null;
    callback(user);
  });
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
