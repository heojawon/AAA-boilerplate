import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import showConsoleWarning from "./utils/showconsolewarning.ts";

showConsoleWarning();
setInterval(() => showConsoleWarning(), 50000);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
