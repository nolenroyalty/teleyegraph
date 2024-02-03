import React from "react";
import ReactDOM from "react-dom/client";

// import "./global-styles.css";
import styled, { createGlobalStyle } from "styled-components";
import App from "./components/App";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: "Jacques Francois Shadow";
    src: url("/JacquesFrancoisShadow-Regular.ttf") format("truetype");
    font-weight: 400;
    font-style: normal;
  }

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
