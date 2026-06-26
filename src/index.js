// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './styles/global.css';
// import { applyTheme, getInitialTheme } from './hooks/useTheme';
// import App from './App';

// applyTheme(getInitialTheme());

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<React.StrictMode><App /></React.StrictMode>);
import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/global.css";
import { applyTheme, getInitialTheme } from "./hooks/useTheme";
import App from "./App";
import { register } from "./serviceWorkerRegistration";

applyTheme(getInitialTheme());

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register the service worker
register();