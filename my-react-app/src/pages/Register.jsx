import { useState } from "react";
import "./Register.css";
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = { name, email, password, role };

    console.log("Form Data:", formData);
    alert("Form Submitted!");
  };

  return (
    <div className="Signup-div">
      <h2>Signup</h2>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Name:</label><br />
          <input type="text" placeholder="Enter your name"value={name}onChange={(e) => setName(e.target.value)}/>
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>Email:</label><br />
          <input type="email" placeholder="Enter email"value={email}onChange={(e) => setEmail(e.target.value)}/>
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>Password:</label><br />
          <input type="password" placeholder="Enter password"value={password}onChange={(e) => setPassword(e.target.value)}/>
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>Role:</label><br />
          <select value={role}onChange={(e) => setRole(e.target.value)}>
            <option value="editor">Editor</option>
            <option value="user">User</option>
          </select>
        </div>

        <button type="submit" style={{ marginTop: "10px" }}>
          Submit
        </button>

      </form>
    </div>
  );
}

export default Register;
