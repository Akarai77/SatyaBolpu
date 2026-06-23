import { StrictMode, useEffect } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import Navbar from "./components/Navbar.tsx"
import { BrowserRouter, useLocation } from "react-router-dom"
import { LoadingProvider } from "./context/LoadingContext.tsx"
import Footer from "./components/Footer.tsx"
import { AuthProvider } from "./context/AuthContext.tsx"
import { DialogBoxProvider } from "./context/DialogBoxContext.tsx"
import { ThemeProvider } from "./context/ThemeContext.tsx"

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LoadingProvider>
          <ScrollToTop />
          <AuthProvider>
            <DialogBoxProvider>
              <Navbar />
              <App />
              <Footer />
            </DialogBoxProvider>
          </AuthProvider>
        </LoadingProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
