import { useAppSelector } from "../../app/store/configureStore";
import { productImage, rupiah } from "../../app/util/util";
import OrderTotals from "../basket/OrderTotals";

export default function Review() {
  const items = useAppSelector(state => state.basket.basket?.items);
  if (!items) return null;

  return (
    <section className="av-review">
      <h2>Order summary</h2>
      <ul>
        {items.map(item => <li key={item.id}>
          <div className="av-bag-media"><img src={productImage(item.pictureUrl)} alt="" /></div>
          <div><strong>{item.name}</strong><p>{item.quantity} × {rupiah.format(item.price)}</p></div>
          <strong>{rupiah.format(item.price * item.quantity)}</strong>
        </li>)}
      </ul>
      <OrderTotals items={items} />
    </section>
  );
}
