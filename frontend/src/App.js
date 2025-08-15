import React from "react";
import InstagramFeed from "./InstagramFeed";

const colors = {
  background: "#F9EBDD",
  header: "#BDAED6",
  cardBg: "#455A6C",
  cardText: "#F9EBDD",
  accent: "#0C2B3B",
};

function App() {
  return (
    <div
      className="App"
      style={{
        padding: "16px",
        backgroundColor: colors.background,
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        color: colors.accent,
      }}
    >
      <h1
        style={{
          backgroundColor: colors.header,
          padding: "12px",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        Jeg er en fake frrrrr
      </h1>

      <div style={{ marginTop: "16px" }}>
        <InstagramFeed
          cardStyle={{
            backgroundColor: colors.cardBg,
            color: colors.cardText,
            borderRadius: "8px",
            padding: "8px",
          }}
        />
      </div>
    </div>
  );
}

export default App;

