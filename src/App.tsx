import { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { AppRoutes } from "@/router";
import { AppProvider, ToastProvider } from "@/lib/core";

declare const __BASE_PATH__: string | undefined;

const BASE_PATH: string =
  typeof __BASE_PATH__ !== "undefined" && __BASE_PATH__ ? __BASE_PATH__ : "/";

function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter basename={BASE_PATH}>
      <ToastProvider>
        <AppProvider>
          <ScrollReset />
          <AppRoutes />
        </AppProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;