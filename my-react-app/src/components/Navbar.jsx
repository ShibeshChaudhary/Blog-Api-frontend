import React from "react";
import { Link ,useNavigate} from "react-router-dom";
import {useAuth} from '../context/AuthContext';
import "./Navbar.css";

function Navbar() {
  const{isAuthenticated,user,logout}=useAuth();
  const navigate=useNavigate();
  const handleLogout=()=>{
    logout();
    navigate('/');
  }
  return (
    <nav className="nav-bar">
      <div className="nav-bar-div">
        <Link to="/">Home</Link>
        <Link to="/Post">Posts</Link>
        <Link to="/Register">Register</Link>
        <Link to="/login">Login</Link>
      </div>
      <div className="navbar-buttons">
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link to="/admin-dashboard" className="btn btn-primary">Admin Dashboard</Link>
              )}
              {user?.role === 'editor' && (
                <Link to="/editor-dashboard" className="btn btn-primary">Editor Dashboard</Link>
              )}
              <Link to="/account" className="btn btn-secondary">My Account</Link>
              <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
    </nav>
  );
}

export default Navbar;
