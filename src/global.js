import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  html, body, h1, p {
    margin: 0;
    padding: 0;
  }
  button{
    cursor: pointer;
  }
  *, *::after, *::before {
    box-sizing: border-box;
  }
  body {
    font-family: 'Mukta', sans-serif;
    text-rendering: optimizeLegibility;
    text-align: left;
  }
  `;
