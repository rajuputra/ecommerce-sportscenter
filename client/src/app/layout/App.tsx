import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import agent from "../api/agent";
import { useAppDispatch } from "../store/configureStore";
import { setBasket } from "../../features/basket/basketSlice";
import { fetchCurrentUser, logOut } from "../../features/account/accountSlice";
import Footer from "./Footer";
import Header from "./Header";
import Spinner from "./Spinner";
import { averoTheme } from "./theme";

export default function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("avero-theme") === "dark");
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();
  const waitForSession = /^\/(?:checkout|orders|admin|login|register)(?:\/|$)/.test(pathname);
  const dispatch = useAppDispatch();
  const theme = useMemo(() => averoTheme(darkMode), [darkMode]);

  useEffect(() => {
    let active = true;
    const sessionExpired = () => dispatch(logOut());
    window.addEventListener("sportscenter-session-expired", sessionExpired);
    void agent.Basket.get().then(basket => {
      if (active) dispatch(setBasket(basket));
    });
    void dispatch(fetchCurrentUser()).finally(() => { if (active) setLoading(false); });
    return () => {
      active = false;
      window.removeEventListener("sportscenter-session-expired", sessionExpired);
    };
  }, [dispatch]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);

  function toggleTheme() {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("avero-theme", next ? "dark" : "light");
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="av-app" data-theme={darkMode ? "dark" : "light"}>
        <a className="av-skip" href="#main-content">Skip to content</a>
        <Header darkMode={darkMode} handleThemeChange={toggleTheme} />
        <main id="main-content" tabIndex={-1} className={pathname === "/" ? "av-main" : "av-main av-shell"}>
          {loading && waitForSession ? <Spinner message="Loading Avero…" /> : <Outlet />}
        </main>
        <Footer />
        <ToastContainer position="bottom-right" hideProgressBar theme={darkMode ? "dark" : "light"} />
      </div>
    </ThemeProvider>
  );
}
