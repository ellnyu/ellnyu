import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import About from "./pages/About";
import Suggestion from "./pages/Suggestion";
import "./App.scss"; // global styles

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-layout">
        {/* Top Navbar */}
        <Navbar />

        {/* Main content area */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/about" element={<About />} />
            <Route path="/suggestion" element={<Suggestion />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="footer">
          © {new Date().getFullYear()} Ellen Yu · Built with ❤️
        </footer>
      </div>
    </Router>
  );
};

export default App;

