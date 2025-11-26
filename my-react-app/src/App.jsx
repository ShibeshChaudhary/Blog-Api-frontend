import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from './components/Navbar';
import Home from "./pages/home";
import Register from "./pages/Register";
import Login from "./pages/login";
import Post from "./pages/Post";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Post" element={<Post/>}/>
        <Route path="/Register" element={<Register/>} />
        <Route path="/Login" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
