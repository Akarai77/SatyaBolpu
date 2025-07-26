import { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";

const LenisContext = createContext<{
  initLenis: () => void;
  destroyLenis: () => void;
}>({
  initLenis: () => {},
  destroyLenis: () => {},
});

export const LenisProvider = ({ children }: { children: React.ReactNode }) => {
  const lenisRef = useRef<Lenis | null>(null);

  const initLenis = () => {
    if (!lenisRef.current) {
      lenisRef.current = new Lenis({ smooth: true });
      const raf = (time: number) => {
        lenisRef.current?.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  };

  const destroyLenis = () => {
    if (lenisRef.current) {
      lenisRef.current.destroy();
      lenisRef.current = null;
    }
  };

  const stopLenis = () => {
      if(lenisRef.current) {
          lenisRef.current.stop();
      }
  }

  const startLenis = () => {
      if(lenisRef.current) {
          lenisRef.current.start();
      }
  }

  useEffect(() => {
    initLenis();
    return () => destroyLenis();
  }, []);

  return (
    <LenisContext.Provider value={{ initLenis, destroyLenis }}>
      {children}
    </LenisContext.Provider>
  );
};

export const useLenis = () => useContext(LenisContext);

