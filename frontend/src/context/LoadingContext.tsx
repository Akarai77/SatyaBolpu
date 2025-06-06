import { createContext, ReactNode, useContext, useState } from "react";

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: true,
  setLoading: () => {
    console.warn("setLoading called outside of LoadingProvider");
  },
});

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setLoading] = useState(false);

  // useEffect(() => {
  //   const handleLoad = () => setLoading(false);
  //   window.addEventListener("load", handleLoad);
  //   return () => window.removeEventListener("load", handleLoad);
  // }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
