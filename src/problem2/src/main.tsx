import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "~app/global.css";
import App from "~app/App.tsx";
import { QueryProvider } from "~app/providers/QueryProvider";
import "~app/i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>
);
