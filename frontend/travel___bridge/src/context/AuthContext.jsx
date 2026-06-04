import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import SuccessToast from '../components/shared/SuccessToast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('travelbridge-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const login = async (email, password, rememberMe) => {
    setAuthLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/auth/login', {
        email,
        password
      }, {
        withCredentials: true
      });

      if (res.status === 200) {
        const userData = res.data.user || { email, fullname: email.split('@')[0] };
        setUser(userData);
        localStorage.setItem('travelbridge-user', JSON.stringify(userData));
        
        if (rememberMe) {
          localStorage.setItem('travelbridge-remember-email', email);
        } else {
          localStorage.removeItem('travelbridge-remember-email');
        }

        showToast('Welcome back to TravelBridge!', 'success');
        return { success: true };
      }
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      showToast(msg, 'error');
      return { success: false, error: msg };
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (fullname, email, password) => {
    setAuthLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/auth/register', {
        fullname,
        email,
        password
      }, {
        withCredentials: true
      });

      if (res.status === 200) {
        const userData = res.data.user || { email, fullname };
        setUser(userData);
        localStorage.setItem('travelbridge-user', JSON.stringify(userData));
        showToast('Account created successfully!', 'success');
        return { success: true };
      }
    } catch (err) {
      console.error('Signup error:', err);
      const msg = err.response?.data?.message || 'Signup failed. Please try again.';
      showToast(msg, 'error');
      return { success: false, error: msg };
    } finally {
      setAuthLoading(false);
    }
  };

  const loginWithGoogle = async (fullname, email) => {
    setAuthLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/auth/google', {
        fullname,
        email
      }, {
        withCredentials: true
      });

      if (res.status === 200) {
        const userData = res.data.user || { email, fullname };
        setUser(userData);
        localStorage.setItem('travelbridge-user', JSON.stringify(userData));
        showToast('Successfully authenticated with Google!', 'success');
        return { success: true };
      }
    } catch (err) {
      console.error('Google auth error:', err);
      const msg = err.response?.data?.message || 'Google authentication failed.';
      showToast(msg, 'error');
      return { success: false, error: msg };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    setAuthLoading(true);
    try {
      await axios.post('http://localhost:8000/api/auth/logout', {}, {
        withCredentials: true
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('travelbridge-user');
      showToast('Logged out successfully.', 'success');
      setAuthLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, authLoading, login, register, loginWithGoogle, logout, toast, showToast }}>
      {children}
      {toast && (
        <SuccessToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
