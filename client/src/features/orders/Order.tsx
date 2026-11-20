import { ArrowOutward, ReceiptLongOutlined } from "@mui/icons-material";
import { Alert, Button, Pagination, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import agent, { type Page } from "../../app/api/agent";
import type { Order } from "../../app/models/order";
import Spinner from "../../app/layout/Spinner";
import { rupiah } from "../../app/util/util";
import { orderDate, statusLabel } from "./orderPresentation";
import "./orders.css";

export default function OrdersPage({ admin = false }: { admin?: boolean }) {
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [orders, setOrders] = useState<Page<Order>>();
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setError(false);
    setOrders(undefined);
    (admin ? agent.Admin.orders(page) : agent.Orders.list(page))
      .then(result => { if (active) setOrders(result); })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [page, admin, reload]);

  return (
    <Stack spacing={2} className="av-page">
      <div className="av-page-intro av-orders-intro">
        <div>
          <h1 className="av-display">{admin ? "Manage orders." : "My orders."}</h1>
          <p>{admin ? "Review and update demo orders." : "View your demo orders and check their status."}</p>
        </div>
        <Link className="av-text-link" to={admin ? "/admin" : "/store"}>
          {admin ? "Manage products" : "Continue shopping"} <ArrowOutward fontSize="small" />
        </Link>
      </div>
      {error ? <Alert severity="error" action={<Button color="secondary" onClick={() => setReload(value => value + 1)}>Retry</Button>}>Could not load orders.</Alert> :
        !orders ? <Spinner message="Loading orders…" /> :
        !orders.content.length ? <section className="av-panel av-empty">
          <ReceiptLongOutlined />
          <h2>{admin ? "No orders yet" : "You haven’t placed an order yet"}</h2>
          {!admin && <Link className="av-action" to="/store">Explore the shop <ArrowOutward fontSize="small" /></Link>}
        </section> :
        <ul className="av-panel av-orders-list">
          {orders.content.map(order => (
            <li className="av-order-row" key={order.id}>
              <Link className="av-order-link" to={`${admin ? "/admin" : ""}/orders/${order.id}`}>
                <div className="av-order-id">
                  <strong>Order #{order.id}</strong>
                  <small>{orderDate(order.orderDate)}{admin && order.buyer ? ` · ${order.buyer}` : ""}</small>
                </div>
                <span className="av-order-status" data-status={order.orderStatus}>{statusLabel(order.orderStatus)}</span>
                <strong className="av-order-price">{rupiah.format(order.total)}</strong>
                <ArrowOutward fontSize="small" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>}
      {orders && orders.page.totalPages > 1 &&
        <Pagination count={orders.page.totalPages} page={page} onChange={(_, value) => setPage(value)} />}
    </Stack>
  );
}
