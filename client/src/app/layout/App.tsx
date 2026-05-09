import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";

import Header from "./Header";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch } from "../store/configureStore";
import agent from "../api/agent";
import { setBasket } from "../../features/basket/basketSlice";
import Spinner from "./Spinner";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? "dark" : "light";
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agent.Basket.get()
      .then(basket => dispatch(setBasket(basket)))
      .catch(error => console.log(error))
      .finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) return <Spinner message="Initializing app..." />;

  const theme = createTheme({
    palette: {
      mode: paletteType,
      primary: {
        main: paletteType === "light" ? "#111827" : "#F3F4F6",
      },
      secondary: {
        main: paletteType === "light" ? "#F97316" : "#10B981",
      },
      background: {
        default: paletteType === "light" ? "#F3F4F6" : "#0B0F19",
        paper: paletteType === "light" ? "#FFFFFF" : "#111827",
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontFamily: '"Oswald", sans-serif' },
      h2: { fontFamily: '"Oswald", sans-serif' },
      h3: { fontFamily: '"Oswald", sans-serif' },
      h4: { fontFamily: '"Oswald", sans-serif' },
      h5: { fontFamily: '"Oswald", sans-serif', fontWeight: 600 },
      h6: { fontFamily: '"Oswald", sans-serif', fontWeight: 500 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundImage: "none",
            boxShadow:
              paletteType === "light"
                ? "0px 4px 20px rgba(0, 0, 0, 0.05)"
                : "0px 4px 20px rgba(0, 0, 0, 0.4)",
          },
        },
      },
    },
  });
  function handleThemeChange() {
    setDarkMode(!darkMode);
  }
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <CssBaseline />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
      <Container sx={{ paddingTop: "64px" }}>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
}

export default App;
