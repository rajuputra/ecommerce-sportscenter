import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import ContactPage from "../../features/contact/ContactPage";
import ProductDetails from "../../features/catalog/ProductDetails";
import ServerError from "../errors/ServerError";
import NotFoundError from "../errors/NotFoundError";
import BasketPage from "../../features/basket/BasketPage";
import SignInPage from "../../features/account/SignInPage";
import RegisterPage from "../../features/account/RegisterPage";
import RequireAuth from "./RequireAuth";
import RequireGuest from "./RequireGuest";
import RequireAdmin from "./RequireAdmin";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          { path: "checkout", lazy: async () => ({ Component: (await import("../../features/checkout/CheckoutPage")).default }) },
          { path: "orders", lazy: async () => ({ Component: (await import("../../features/orders/Order")).default }) },
          { path: "orders/:id", lazy: async () => ({ Component: (await import("../../features/orders/OrderDetails")).default }) },
          {
            element: <RequireAdmin />,
            children: [
              { path: "admin", lazy: async () => ({ Component: (await import("../../features/admin/AdminPage")).default }) },
              { path: "admin/orders", lazy: async () => {
                const { default: Orders } = await import("../../features/orders/Order");
                return { Component: () => <Orders admin /> };
              } },
              { path: "admin/orders/:id", lazy: async () => {
                const { default: Detail } = await import("../../features/orders/OrderDetails");
                return { Component: () => <Detail admin /> };
              } },
            ],
          },
        ],
      },
      {
        element: <RequireGuest />,
        children: [
          { path: "login", element: <SignInPage /> },
          { path: "register", element: <RegisterPage /> },
        ],
      },
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/store",
        element: <Catalog />,
      },
      {
        path: "store/:id",
        element: <ProductDetails />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "basket",
        element: <BasketPage />,
      },
      {
        path: "server-error",
        element: <ServerError />,
      },
      {
        path: "not-found",
        element: <NotFoundError />,
      },
      {
        path: "*",
        element: <Navigate replace to="/not-found" />,
      },
    ],
  },
]);
