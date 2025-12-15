import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, logout as apiLogout, getUserDetails } from "../service/apiService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated by calling the backend
    const checkAuth = async () => {
      try {
        const userData = await getUserDetails();
        setUser(userData);
      } catch (error) {
        // User not authenticated or session expired
        setUser(null);
        // Don't redirect here as it might interfere with the apiRequest redirect
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const response = await apiLogin(credentials);
    // After successful login, get user details
    const userData = await getUserDetails();
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const value = { user, login, logout, isAuthenticated: !!user };

  if (loading) return <div>Loading...</div>;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
