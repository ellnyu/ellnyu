import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import About from "./pages/About";
import Suggestions from "./pages/Suggestions";
import Messages from "./pages/Messages";
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
            <Route path="/instagram-posts" element={<Posts />} />
            <Route path="/om-meg" element={<About />} />
            <Route path="/forslag" element={<Suggestions />} />
            <Route path="/meldinger" element={<Messages />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
};

export default App;

