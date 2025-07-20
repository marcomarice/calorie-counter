import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./i18n/i18n";

import { AlimentiProvider } from "./context/AlimentiContext.jsx";
import { ValoriProvider } from "./context/ValoriContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AlimentiProvider>
      <ValoriProvider>
        <App />
      </ValoriProvider>
    </AlimentiProvider>
  </React.StrictMode>
);
