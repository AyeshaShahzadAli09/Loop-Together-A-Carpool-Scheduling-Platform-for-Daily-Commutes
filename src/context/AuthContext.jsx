import { createContext, useContext, useReducer, useEffect } from 'react';

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
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
      return {
        ...state,
        user: action.payload.user || action.payload,
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
        user: null,
        isAuthenticated: false,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'LOGIN_SUCCESS':
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
      return {
        ...state,
        user: action.payload.user || action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const fetchUserData = async (token) => {
    try {
      if (!token) {
        dispatch({ type: 'LOGOUT' });
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.error('Profile fetch failed:', response.status);
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
        return;
      }

      const data = await response.json();
      if (data.success) {
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { 
            user: data.user,
            token: token
          } 
        });
      } else {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const login = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (data.success) {
        dispatch({
          type: 'LOGIN',
          payload: {
            user: data.user,
            token: data.token
          }
        });
      } else {
        dispatch({
          type: 'AUTH_ERROR',
          payload: data.error || 'Login failed'
        });
      }
    } catch (error) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: error.message || 'Login failed'
      });
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        await fetchUserData(token);
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      dispatch, 
      logout,
      login,
      fetchUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 