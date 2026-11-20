import { ArrowBack } from "@mui/icons-material";
import { Alert, Button, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import agent, { errorMessage } from "../../app/api/agent";
import type { OrderDetail, OrderStatus } from "../../app/models/order";
import Spinner from "../../app/layout/Spinner";
import { productImage, rupiah } from "../../app/util/util";
import { orderDate, orderStages, statusLabel } from "./orderPresentation";
import "./orders.css";

const adminTransitions: Partial<Record<OrderStatus, OrderStatus[]>> = {
  Pending: ["Processing", "Cancelled"],
  Processing: ["Shipped"],
  Shipped: ["Completed"],
};

export default function OrderDetails({ admin = false }: { admin?: boolean }) {
  const id = Number(useParams().id);
  const [order, setOrder] = useState<OrderDetail>();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<OrderStatus>();

  useEffect(() => {
    let active = true;
    setError("");
    setOrder(undefined);
    (admin ? agent.Admin.order(id) : agent.Orders.fetch(id))
      .then(order => { if (active) setOrder(order); })
      .catch(() => { if (active) setError("Could not find or load this order."); });
    setPendingStatus(undefined);
    return () => { active = false; };
  }, [id, admin]);

  async function update(status: OrderStatus) {
    setBusy(true);
    setError("");
    try {
      if (admin) await agent.Admin.status(id, status);
      else await agent.Orders.cancel(id);
      setOrder(await (admin ? agent.Admin.order(id) : agent.Orders.fetch(id)));
      setPendingStatus(undefined);
    } catch (error) {
      setError(errorMessage(error, "Could not update this order."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Stack spacing={2} className="av-page">
      <Link className="av-breadcrumb" to={admin ? "/admin/orders" : "/orders"}><ArrowBack fontSize="small" /> Back to orders</Link>
      {error && <Alert severity="error">{error}</Alert>}
      {!order ? !error && <Spinner message="Loading order..." /> : <>
        <div className="av-page-intro av-orders-intro">
          <div>
            <h1 className="av-display">Order #{order.summary.id}.</h1>
            <p>Placed {orderDate(order.summary.orderDate)} · Demo order</p>
          </div>
          <span className="av-order-status" data-status={order.summary.orderStatus}>{statusLabel(order.summary.orderStatus)}</span>
        </div>
        {orderStages.some(stage => stage === order.summary.orderStatus) && <ol className="av-order-progress" aria-label="Order progress">
          {orderStages.map((stage, index) => (
            <li key={stage} aria-current={stage === order.summary.orderStatus ? "step" : undefined}
              data-reached={index <= orderStages.findIndex(step => step === order.summary.orderStatus)}>{stage}</li>
          ))}
        </ol>}
        <div className="av-order-detail-layout">
          <section className="av-panel av-order-block">
            <h2>Items in this order</h2>
            {order.items.length ? <ul className="av-order-items">
              {order.items.map(item => <li key={item.productId}>
                <div className="av-bag-media"><img src={productImage(item.pictureUrl)} alt="" /></div>
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.quantity} × {item.price === null ? "–" : rupiah.format(item.price)}</p>
                </div>
                <strong>{item.price === null ? "–" : rupiah.format(item.price * item.quantity)}</strong>
              </li>)}
            </ul> : <p className="av-order-meta">Item details aren’t available for this order.</p>}
          </section>
          <Stack spacing={2}>
            <section className="av-panel av-order-block">
              <h2>Order summary</h2>
              <dl className="av-order-totals">
                <div><dt>Subtotal</dt><dd>{rupiah.format(order.summary.subTotal)}</dd></div>
                <div><dt>Estimated shipping</dt><dd>{rupiah.format(order.summary.deliveryFee)}</dd></div>
                <div><dt>Total</dt><dd>{rupiah.format(order.summary.total)}</dd></div>
              </dl>
            </section>
            {order.shippingAddress && <section className="av-panel av-order-block">
              <h2>Shipping address</h2>
              <address className="av-order-address">
                <strong>{order.shippingAddress.name}</strong>
                <p>{[order.shippingAddress.address1, order.shippingAddress.address2, order.shippingAddress.city,
                  order.shippingAddress.state, order.shippingAddress.zipCode, order.shippingAddress.country].filter(Boolean).join(", ")}</p>
              </address>
            </section>}
          </Stack>
        </div>
        {pendingStatus ? <Alert severity="warning">
          Confirm cancellation for order #{order.summary.id}?
          <Stack direction="row" spacing={1}>
            <Button color="secondary" disabled={busy} onClick={() => setPendingStatus(undefined)}>Keep order</Button>
            <LoadingButton loading={busy} color="error" onClick={() => update(pendingStatus)}>Confirm cancel</LoadingButton>
          </Stack>
        </Alert> : <Stack direction="row" spacing={1}>
          {(admin ? adminTransitions[order.summary.orderStatus] ?? [] : order.summary.orderStatus === "Pending" ? ["Cancelled" as const] : [])
            .map(status => <LoadingButton key={status} loading={busy} variant="outlined" color={status === "Cancelled" ? "error" : "secondary"}
              onClick={() => status === "Cancelled" ? setPendingStatus(status) : update(status)}>
              {status === "Cancelled" ? "Cancel order" : `Mark as ${status.toLowerCase()}`}
            </LoadingButton>)}
        </Stack>}
      </>}
    </Stack>
  );
}
