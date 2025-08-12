import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User, LoginCredentials, SignupCredentials } from '../types';
import { 
  loginUser, 
  signupUser, 
  logoutUser,
  getCurrentUser,
  onAuthStateChange
} from '../utils/supabaseAuth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message: string }>;
  signup: (credentials: SignupCredentials) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: action.payload !== null,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount and listen to auth changes
  useEffect(() => {
    const initializeAuth = async () => {
      const currentUser = await getCurrentUser();
      dispatch({ type: 'SET_USER', payload: currentUser });
    };

    initializeAuth();

    // Listen to auth state changes
    const { data: { subscription } } = onAuthStateChange((user) => {
      dispatch({ type: 'SET_USER', payload: user });
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message: string }> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const result = await loginUser(credentials);
      
      if (result.success && result.user) {
        dispatch({ type: 'SET_USER', payload: result.user });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
      
      return { success: result.success, message: result.message };
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, message: 'An error occurred during login' };
    }
  };

  const signup = async (credentials: SignupCredentials): Promise<{ success: boolean; message: string }> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const result = await signupUser(credentials);
      
      if (result.success && result.user) {
        dispatch({ type: 'SET_USER', payload: result.user });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
      
      return { success: result.success, message: result.message };
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, message: 'An error occurred during signup' };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      dispatch({ type: 'LOGOUT' });
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
