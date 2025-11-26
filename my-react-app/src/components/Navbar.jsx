import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="nav-bar">
      <div className="nav-bar-div">
        <Link to="/">Home</Link>
        <Link to="/Post">Posts</Link>
        <Link to="/Register">Register</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
