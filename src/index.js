import React from "react";
import ReactDOM from "react-dom/client";

// import "./global-styles.css";
import styled, { createGlobalStyle } from "styled-components";
import App from "./components/App";

const GlobalStyle = createGlobalStyle`
  body {
    background: url("/noise.svg"), linear-gradient(235deg,
    var(--color-tan-400),
    var(--color-tan-300),
    var(--color-tan-200),

    var(--color-tan-300)
  );
  }

  

`;
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>
);
