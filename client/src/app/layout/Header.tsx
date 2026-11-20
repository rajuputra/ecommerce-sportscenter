import { ArrowOutward, Close, DarkModeOutlined, LightModeOutlined, MenuOutlined, PersonOutline, ShoppingBagOutlined } from "@mui/icons-material";
import { Badge, Drawer, IconButton, Menu, MenuItem, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { logOut } from "../../features/account/accountSlice";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import Brand from "./Brand";

const links = [{ to: "/", label: "Home" }, { to: "/store", label: "Shop" }, { to: "/contact", label: "About" }];

export default function Header({ darkMode, handleThemeChange }: { darkMode: boolean; handleThemeChange: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [account, setAccount] = useState<HTMLElement | null>(null);
  const desktop = useMediaQuery("(min-width: 760px)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const basket = useAppSelector(state => state.basket.basket);
  const user = useAppSelector(state => state.account.user);
  const count = basket?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  useEffect(() => { setMobileOpen(false); setAccount(null); }, [pathname]);
  useEffect(() => { if (desktop) setMobileOpen(false); }, [desktop]);

  function signOut() {
    setAccount(null);
    dispatch(logOut());
    navigate("/", { replace: true });
  }

  return (
    <header className="av-header">
      <div className="av-shell av-header-inner">
        <Brand />
        <nav className="av-header-nav" aria-label="Main navigation">
          {links.map(link => <NavLink key={link.to} end={link.to === "/"} to={link.to}>{link.label}</NavLink>)}
        </nav>
        <div className="av-header-actions">
          <IconButton className="av-header-theme" onClick={handleThemeChange} color="inherit"
            aria-label={darkMode ? "Use light theme" : "Use dark theme"}>
            {darkMode ? <LightModeOutlined fontSize="small" /> : <DarkModeOutlined fontSize="small" />}
          </IconButton>
          {user ? <IconButton color="inherit" aria-label="Account" aria-expanded={Boolean(account)}
            aria-haspopup="menu" onClick={event => setAccount(event.currentTarget)}>
            <PersonOutline />
          </IconButton> : <IconButton className="av-header-signin" component={Link} to="/login" color="inherit" aria-label="Sign in">
            <PersonOutline />
          </IconButton>}
          <IconButton component={Link} to="/basket" color="inherit" aria-label={`Shopping bag, ${count} ${count === 1 ? "item" : "items"}`}>
            <Badge badgeContent={count} color="primary" max={99}><ShoppingBagOutlined /></Badge>
          </IconButton>
          <IconButton className="av-header-menu" color="inherit" aria-label="Open navigation"
            aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}>
            <MenuOutlined />
          </IconButton>
        </div>
      </div>
      <Menu anchorEl={account} open={Boolean(account)} onClose={() => setAccount(null)} transitionDuration={reduced ? 0 : undefined}>
        <MenuItem disabled>{user?.username}</MenuItem>
        <MenuItem component={Link} to="/orders" onClick={() => setAccount(null)}>My orders</MenuItem>
        {user?.admin && <MenuItem component={Link} to="/admin" onClick={() => setAccount(null)}>Admin</MenuItem>}
        <MenuItem onClick={signOut}>Sign out</MenuItem>
      </Menu>
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)} transitionDuration={reduced ? 0 : undefined}
        PaperProps={{ className: "av-mobile-drawer", "aria-label": "Navigation menu" }}>
        <div className="av-mobile-drawer-top"><Brand />
          <IconButton color="inherit" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><Close /></IconButton>
        </div>
        <nav aria-label="Mobile navigation">
          {links.map(link => <NavLink key={link.to} end={link.to === "/"} to={link.to} onClick={() => setMobileOpen(false)}>
            {link.label}<ArrowOutward fontSize="small" />
          </NavLink>)}
          {!user && <Link to="/login" onClick={() => setMobileOpen(false)}>Sign in<ArrowOutward fontSize="small" /></Link>}
        </nav>
        <button type="button" className="av-drawer-theme" onClick={handleThemeChange}>
          {darkMode ? <LightModeOutlined fontSize="small" /> : <DarkModeOutlined fontSize="small" />}
          {darkMode ? "Use light theme" : "Use dark theme"}
        </button>
      </Drawer>
    </header>
  );
}
