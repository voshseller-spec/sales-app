import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const DEMO = import.meta.env.VITE_DEMO === "1";

async function boot() {
  if (DEMO) {
    // Single-file demo build: the whole API runs in-browser (see src/demo/shim.ts).
    const { installDemoApi } = await import("./demo/shim");
    installDemoApi();
  }

  // HashRouter for the demo so it works from any static path; clean URLs otherwise.
  const Router = DEMO ? HashRouter : BrowserRouter;

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Router>
        <App />
      </Router>
    </React.StrictMode>
  );

  if (!DEMO && "serviceWorker" in navigator && import.meta.env.PROD) {
    window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
  }
}

boot();
