import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import LoadingPage from "../components/LoadingPage";

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setLoading: () => {
    console.warn("setLoading called outside of LoadingProvider");
  },
});

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
        {children}
        {isLoading && <LoadingPage /> }
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
