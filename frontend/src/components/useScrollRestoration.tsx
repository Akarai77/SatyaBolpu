import { useEffect } from "react";
import { useNavigate, useLocation, To, NavigateOptions } from "react-router-dom";

function useScrollRestoration() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedScroll = sessionStorage.getItem(`scrollPosition_${location.pathname}`);
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll, 10));
    }

    const saveScrollPosition = () => {
      sessionStorage.setItem(`scrollPosition_${location.pathname}`, window.scrollY);
    };

    const handlePopstate = () => {
      const savedScroll = sessionStorage.getItem(`scrollPosition_${location.pathname}`);
      if (savedScroll) {
          setTimeout(() => {
              window.scrollTo(0, parseInt(savedScroll, 10));
          },0);
      }
    };

    window.addEventListener("beforeunload", saveScrollPosition);
    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("beforeunload", saveScrollPosition);
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [location.pathname]);

  const customNavigate = (to: To, options?: NavigateOptions) => {
    sessionStorage.setItem(`scrollPosition_${location.pathname}`, window.scrollY);
    navigate(to, options);
    window.scrollTo(0,0);
  };

  return customNavigate;
}

export default useScrollRestoration;
