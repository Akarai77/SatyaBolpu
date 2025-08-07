import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useScrollRestoration() {
  const location = useLocation();

  useEffect(() => {
    const savedScroll = sessionStorage.getItem(`scroll-${location.pathname}`);
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll, 10));
    }

    const handleScroll = () => {
      sessionStorage.setItem(`scroll-${location.pathname}`, String(window.scrollY));
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);
}

