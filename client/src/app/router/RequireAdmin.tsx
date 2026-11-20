import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";

export default function RequireAdmin() {
  const isAdmin = useAppSelector(state => state.account.user?.admin);
  return isAdmin ? <Outlet /> : <Navigate to="/store" replace />;
}
