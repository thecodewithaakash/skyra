import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/authContext";
import AuthUserLoader from "./context/AuthUserLoader";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <AuthUserLoader />
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>,
);
