import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Halla velkommen til mitt tragiske univers</h1>
      <p>
        Jeg skal rydde på siden jeg lover, dette er den eneste linken som er kul foreløpig{" "}
        <Link to="/about">about me</Link>.
      </p>
    </div>
  );
};

export default Home;

