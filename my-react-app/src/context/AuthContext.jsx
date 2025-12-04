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
    try {
      const saved = localStorage.getItem("user");
      if (!saved) return null;
      return JSON.parse(saved);
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      localStorage.removeItem("user");
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const user = res.data?.user || res.data?.data?.user;
        if (user) {
          setUser(user);
          try {
            localStorage.setItem("user", JSON.stringify(user));
          } catch (storageError) {
            console.error("Error saving user to localStorage:", storageError);
          }
        }
      } catch (err) {
        // Token is invalid or expired
        console.error("Token verification failed:", err);
        try {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } catch (storageError) {
          console.error("Error clearing localStorage:", storageError);
        }
        setUser(null);
      }
    } catch (error) {
      console.error("Unexpected error in verifyToken:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      
      const user = res.data?.user || res.data?.data?.user;
      const token = res.data?.token || res.data?.data?.token;
      
      if (!user || !token) {
        return {
          success: false,
          error: "Invalid response from server",
        };
      }

      try {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        return { success: true };
      } catch (storageError) {
        console.error("Error saving to localStorage:", storageError);
        return {
          success: false,
          error: "Failed to save login information",
        };
      }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.msg || err.response?.data?.message || err.message || "Login failed",
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
      
      const user = res.data?.user || res.data?.data?.user;
      const token = res.data?.token || res.data?.data?.token;
      
      if (!user || !token) {
        return {
          success: false,
          error: "Invalid response from server",
        };
      }

      try {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        return { success: true, message: res.data?.msg || res.data?.message || "Registration successful" };
      } catch (storageError) {
        console.error("Error saving to localStorage:", storageError);
        return {
          success: false,
          error: "Failed to save registration information",
        };
      }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.msg || err.response?.data?.message || err.message || "Registration failed",
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
          // Ignore 404 errors (endpoint might not exist)
          if (err.response?.status !== 404) {
            console.error("Logout API error:", err);
          }
        }
      }
    } catch (error) {
      console.error("Unexpected error in logout:", error);
    } finally {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch (storageError) {
        console.error("Error clearing localStorage:", storageError);
      }
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