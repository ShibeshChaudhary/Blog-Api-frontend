import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import Navbar from './components/Navbar';
import Home from "./pages/home";
import Register from "./pages/Register";
import Login from "./pages/login";
import Post from "./pages/Post";
import Account from "./pages/Account"
import EditorDashboard from "./pages/EditorDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    
<AuthProvider>
  <BrowserRouter>
      <Navbar />
<Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Post" element={<Post/>}/>
        <Route path="/Register" element={<Register/>} />
        <Route path="/Login" element={<Login/>}/>
        <Route path="/Account" element={<Account/>}/>
        <Route path="/EditorDasshboard" element={<EditorDashboard/>}/>
        <Route path="/AdminDashboard" element={<AdminDashboard/>}/>
      </Routes>
    </BrowserRouter>
</AuthProvider>
      
  );
}

export default App;
