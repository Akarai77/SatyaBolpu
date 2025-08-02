import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Navbar from './components/Navbar.tsx'
import { BrowserRouter } from 'react-router-dom'
import { LoadingProvider } from './context/LoadingContext.tsx'
import Footer from './components/Footer.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { DialogBoxProvider } from './context/DialogBoxContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <BrowserRouter>
    <AuthProvider>
     <DialogBoxProvider>
      <Navbar />
       <LoadingProvider>
        <App />
       </LoadingProvider>
      <Footer />
     </DialogBoxProvider>
    </AuthProvider>
   </BrowserRouter>
  </StrictMode>
)
