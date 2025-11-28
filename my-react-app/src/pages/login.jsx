import { useState } from "react";
import axios from "axios";
import { API_URL } from "../services/api";
import "./Register.css";  // Fixed: removed extra parentheses

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");  // Fixed: was "onst"
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);  // Fixed: was "true" (string), should be true (boolean)
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password
      });
      
      console.log("Login successful!", res.data);
      
      // Save token
      localStorage.setItem("token", res.data.token);
      
      // Redirect to dashboard
      window.location.href = "/Account";
      
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login Page</h2>
      
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email}  // Added: connect to state
          onChange={(e) => setEmail(e.target.value)}  // Added: update state
          required
        />
        <br />
        
        <input 
          type="password" 
          placeholder="Password" 
          value={password}  // Added: connect to state
          onChange={(e) => setPassword(e.target.value)}  // Added: update state
          required
        />
        <br />
        
        {error && <p className="error">{error}</p>}  {/* Added: show errors */}
        
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}  {/* Added: loading state */}
        </button>
      </form>
    </div>
  );
}

export default Login;