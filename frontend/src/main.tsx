import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Navbar from './components/Navbar.tsx'
import { BrowserRouter } from 'react-router-dom'
import { LoadingProvider } from './context/LoadingContext.tsx'
import Footer from './components/Footer.tsx'
import Lenis from '@studio-freight/lenis'

const LenisProvider = () => {
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    lenis.start()

    return () => {
      lenis.destroy()
    }
  }, [])

  return null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LoadingProvider>
        <LenisProvider />
        <Navbar />
        <App />
        <Footer />
      </LoadingProvider>
    </BrowserRouter>
  </StrictMode>
)
