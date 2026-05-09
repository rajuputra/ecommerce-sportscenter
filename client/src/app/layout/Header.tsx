import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Box,
  List,
  ListItem,
  Badge,
  Drawer,
  Divider,
} from "@mui/material";
import {
  DarkMode,
  LightMode,
  FitnessCenter,
  ShoppingBag,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import SignedInMenu from "./SignedInMenu";
import { logOut } from "../../features/account/accountSlice";

const navLinks = [
  { title: "Home", path: "/" },
  { title: "Store", path: "/store" },
  { title: "Contact", path: "/contact" },
];
const accountLinks = [
  { title: "Login", path: "/login" },
  { title: "Register", path: "/register" },
];
const navStyles = {
  color: "inherit",
  textDecoration: "none",
  typography: "h6",
  "&:hover": {
    color: "secondary.main",
  },
  "&.active": {
    color: "secondary.main",
    fontWeight: "bold",
  },
};

interface Props {
  darkMode: boolean;
  handleThemeChange: () => void;
}

export default function Header({ darkMode, handleThemeChange }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { basket } = useAppSelector((state) => state.basket);
  const { user } = useAppSelector((state) => state.account);
  const dispatch = useAppDispatch();
  const itemCount =
    basket?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawerWidth = 240;

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        textAlign: "center",
        bgcolor: "background.default",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          my: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        <FitnessCenter color="secondary" />
        <Typography variant="h6" sx={{ fontWeight: "bold", letterSpacing: 1 }}>
          SPORTS CENTER
        </Typography>
      </Box>
      <Divider />
      <List>
        {navLinks.map(({ title, path }) => (
          <ListItem
            component={NavLink}
            to={path}
            key={path}
            sx={{ ...navStyles, justifyContent: "center" }}
          >
            {title}
          </ListItem>
        ))}
      </List>
      <Divider />
      {user ? (
        <List>
          <ListItem sx={{ justifyContent: "center", py: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="secondary.main">
              Hi, {user.username}
            </Typography>
          </ListItem>
          <ListItem
            component={NavLink}
            to="/orders"
            sx={{ ...navStyles, justifyContent: "center" }}
          >
            My Orders
          </ListItem>
          <ListItem
            onClick={() => dispatch(logOut())}
            sx={{ ...navStyles, justifyContent: "center", cursor: "pointer" }}
          >
            Logout
          </ListItem>
        </List>
      ) : (
        <List>
          {accountLinks.map(({ title, path }) => (
            <ListItem
              component={NavLink}
              to={path}
              key={path}
              sx={{ ...navStyles, justifyContent: "center" }}
            >
              {title}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: darkMode
            ? "rgba(11, 15, 25, 0.7)"
            : "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid",
          borderColor: darkMode
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.05)",
          color: darkMode ? "white" : "text.primary",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              color="inherit"
              aria-label="Buka drawer navigasi"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 1,
                display: { md: "none" },
                minWidth: 44,
                minHeight: 44,
              }}
            >
              <MenuIcon />
            </IconButton>

            <FitnessCenter color="secondary" />
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", letterSpacing: 1 }}
            >
              SPORTS CENTER
            </Typography>

            <IconButton
              onClick={handleThemeChange}
              color="inherit"
              aria-label={
                darkMode ? "Beralih ke mode terang" : "Beralih ke mode gelap"
              }
              sx={{ ml: { xs: 0, sm: 1 }, minWidth: 44, minHeight: 44 }}
            >
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Box>

          <List sx={{ display: { xs: "none", md: "flex" } }}>
            {navLinks.map(({ title, path }) => (
              <ListItem component={NavLink} to={path} key={path} sx={navStyles}>
                {title}
              </ListItem>
            ))}
          </List>

          <Box display="flex" alignItems="center">
            <IconButton
              component={Link}
              to="/basket"
              size="large"
              edge="start"
              color="inherit"
              sx={{ mr: { xs: 0, md: 2 } }}
            >
              <Badge badgeContent={itemCount} color="secondary">
                <ShoppingBag />
              </Badge>
            </IconButton>
            {user ? (
              <SignedInMenu />
            ) : (
              <List sx={{ display: { xs: "none", md: "flex" } }}>
                {accountLinks.map(({ title, path }) => (
                  <ListItem
                    component={NavLink}
                    to={path}
                    key={path}
                    sx={navStyles}
                  >
                    {title}
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        {mobileOpen && (
          <IconButton
            onClick={handleDrawerToggle}
            aria-label="Tutup navigasi"
            sx={{
              position: "fixed",
              top: 16,
              left: drawerWidth + 16,
              color: darkMode ? "#000" : "#fff",
              bgcolor: darkMode
                ? "rgba(255, 255, 255, 0.85)"
                : "rgba(0, 0, 0, 0.85)",
              boxShadow: darkMode
                ? "0 4px 12px rgba(255,255,255,0.2)"
                : "0 4px 12px rgba(0,0,0,0.3)",
              "&:hover": {
                bgcolor: darkMode
                  ? "rgba(255, 255, 255, 1)"
                  : "rgba(0, 0, 0, 1)",
              },
              zIndex: (theme) => theme.zIndex.drawer + 1,
              minWidth: 44,
              minHeight: 44,
              display: { md: "none" },
              borderRadius: "50%",
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </nav>
    </>
  );
}
