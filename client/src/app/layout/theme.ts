import { createTheme } from "@mui/material";

export function averoTheme(dark: boolean) {
  const text = dark ? "#f3f2ea" : "#171915";
  const background = dark ? "#151813" : "#f2f1e9";
  const paper = dark ? "#1e221b" : "#fbfaf5";

  return createTheme({
    palette: {
      mode: dark ? "dark" : "light",
      primary: { main: "#caff46", contrastText: "#171915" },
      secondary: { main: dark ? "#caff46" : "#415607", contrastText: dark ? "#171915" : "#fff" },
      background: { default: background, paper },
      text: { primary: text, secondary: dark ? "#bcc2b3" : "#51554a" },
      divider: dark ? "#40463a" : "#d5d7ca",
    },
    typography: {
      fontFamily: '"Geist Variable", system-ui, sans-serif',
      h1: { fontFamily: '"Barlow Condensed", Impact, sans-serif', fontWeight: 800, lineHeight: .9 },
      h2: { fontFamily: '"Barlow Condensed", Impact, sans-serif', fontWeight: 800, lineHeight: .95 },
      h3: { fontFamily: '"Barlow Condensed", Impact, sans-serif', fontWeight: 700, lineHeight: 1 },
      h4: { fontFamily: '"Barlow Condensed", Impact, sans-serif', fontWeight: 700, lineHeight: 1 },
      h5: { fontWeight: 650 },
      h6: { fontWeight: 650 },
      button: { textTransform: "none", fontWeight: 650 },
    },
    shape: { borderRadius: 6 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { minHeight: 44, paddingInline: 18, boxShadow: "none", "&:hover": { boxShadow: "none" } },
          containedPrimary: { "&:hover": { backgroundColor: "#b4ef2b" } },
        },
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
      MuiChip: { styleOverrides: { root: { fontWeight: 600, borderRadius: 5 } } },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { background: paper, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: text } },
        },
      },
      MuiFormLabel: { styleOverrides: { root: { "&.Mui-focused": { color: text } } } },
      MuiCssBaseline: {
        styleOverrides: {
          body: { scrollbarGutter: "stable" },
          ":focus-visible": { outline: `2px solid ${dark ? "#caff46" : "#476304"}`, outlineOffset: 4 },
        },
      },
    },
  });
}
