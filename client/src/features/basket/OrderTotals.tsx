import type { BasketItem } from "../../app/models/basket";
import { rupiah } from "../../app/util/util";

const DEMO_SHIPPING_FEE = 35_000;

export default function OrderTotals({ items }: { items: BasketItem[] }) {
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  return (
    <dl className="av-order-totals">
      <div><dt>Subtotal</dt><dd>{rupiah.format(subtotal)}</dd></div>
      <div><dt>Estimated shipping</dt><dd>{rupiah.format(DEMO_SHIPPING_FEE)}</dd></div>
      <div><dt>Total</dt><dd>{rupiah.format(subtotal + DEMO_SHIPPING_FEE)}</dd></div>
    </dl>
  );
}
