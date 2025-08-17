import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import LandingPage from "./pages/LandingPage/LandingPage";
import Posts from "./pages/Posts";
import AboutPage from "./pages/AboutPage/AboutPage";
import Suggestions from "./pages/Suggestions";
import { MessagePage } from "./features/messages/";
import { PostsPage } from "./features/instagram/";
import "./App.scss"; 

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-layout">
        {/* Top Navbar */}
        <Navbar />

        {/* Main content area */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/instagram-posts" element={<PostsPage />} />
            <Route path="/om-meg" element={<AboutPage />} />
            <Route path="/forslag" element={<Suggestions />} />
            <Route path="/meldinger" element={<MessagePage/>} />
          </Routes>
        </main>

      </div>
    </Router>
  );
};

export default App;

