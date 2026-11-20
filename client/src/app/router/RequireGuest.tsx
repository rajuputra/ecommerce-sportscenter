import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";

export default function RequireGuest() {
  const { user } = useAppSelector((state) => state.account);
  const destination = useLocation().state?.from;
  if (user) {
    const path = typeof destination === "string" && /^\/(?![/\\])/.test(destination) ? destination : "/store";
    return <Navigate to={path} replace />;
  }
  return <Outlet />;
}
