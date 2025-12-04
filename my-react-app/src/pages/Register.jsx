import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await register(name, email, password, role);

    if (result.success) {
      alert(result.message || "Registration successful!");
      navigate("/Account");
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="signup-box">
      <h2>Signup</h2>

      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input 
          type="email" 
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input 
          type="password" 
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p style={{color: 'red', fontSize: '14px', marginTop: '10px'}}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default Register;