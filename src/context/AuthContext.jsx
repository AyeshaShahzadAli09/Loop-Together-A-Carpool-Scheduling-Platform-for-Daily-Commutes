import { createContext, useContext, useReducer, useEffect } from 'react';
import { useClerk } from '@clerk/clerk-react';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { signOut } = useClerk();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('userToken');
      if (token) {
        try {
          // Here you would typically verify the token with your backend
          // For now, we'll just set the user based on the token
          dispatch({ 
            type: 'LOGIN', 
            payload: { token } 
          });
        } catch (error) {
          localStorage.removeItem('userToken');
          dispatch({ 
            type: 'AUTH_ERROR', 
            payload: 'Session expired. Please login again.' 
          });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    };

    initAuth();
  }, []);

  const logout = async () => {
    try {
      await signOut(); // Clerk signout
      localStorage.removeItem('userToken');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, dispatch, logout }}>
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