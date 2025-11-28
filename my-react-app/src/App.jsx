import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import Navbar from './components/Navbar';
import Home from "./pages/home";
import Register from "./pages/Register";
import Login from "./pages/login";
import Post from "./pages/Post";

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
      </Routes>
    </BrowserRouter>
</AuthProvider>
      
  );
}

export default App;
