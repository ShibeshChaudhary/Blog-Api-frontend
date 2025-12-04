// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { API_URL } from "../services/api";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      console.error("Token verification failed:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      const { user, token } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.msg || err.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (name, email, password, role = "user") => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
        role
      });
      const { user, token } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      return { success: true, message: res.data.msg };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.msg || err.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await axios.post(
            `${API_URL}/api/auth/logout`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
        } catch (err) {
          if (err.response?.status !== 404) {
            console.error("Logout API error:", err);
          }
        }
      }
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isEditor: user?.role === "editor",
        
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};