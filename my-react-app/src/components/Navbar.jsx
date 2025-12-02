import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import "./Navbar.css";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="nav-bar">
      <div className="nav-bar-div">
        <Link to="/">Home</Link>
        <Link to="/Post">Posts</Link>
        
        {isAuthenticated ? (
          <>
            {user?.role === 'admin' && (
              <Link to="/AdminDashboard">Admin Dashboard</Link>
            )}
            {user?.role === 'editor' && (
              <Link to="/EditorDashboard">Editor Dashboard</Link>
            )}
            <Link to="/Account">My Account</Link>
            <button onClick={handleLogout} className="nav-logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/Register">Register</Link>
            <Link to="/Login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;