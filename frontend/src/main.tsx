import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Navbar from './components/Navbar.tsx'
import { BrowserRouter } from 'react-router-dom'
import { LoadingProvider } from './context/LoadingContext.tsx'
import Footer from './components/Footer.tsx'
import { LenisProvider } from './context/LenisContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
        <LenisProvider >
            <Navbar />
            <LoadingProvider>
                <App />
            </LoadingProvider>
            <Footer />
        </LenisProvider>
    </BrowserRouter>
  </StrictMode>
)
