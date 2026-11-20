import { Add, ArrowBack, ArrowOutward, Remove, ShoppingBagOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import agent from "../../app/api/agent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { productImage, rupiah } from "../../app/util/util";
import OrderTotals from "./OrderTotals";

export default function BasketPage() {
  const { basket } = useAppSelector(state => state.basket);
  const dispatch = useAppDispatch();

  function update(operation: Promise<unknown>) {
    void operation.catch(() => toast.error("Could not update your bag. Try again."));
  }

  return (
    <div className="av-page">
      <Link className="av-breadcrumb" to="/store"><ArrowBack fontSize="small" /> Continue shopping</Link>
      <div className="av-page-intro">
        <h1 className="av-display">YOUR BAG.</h1>
      </div>
      {!basket?.items.length ? <section className="av-panel av-empty">
        <ShoppingBagOutlined />
        <h2>Your bag is empty</h2>
        <Link className="av-action" to="/store">Shop the gear <ArrowOutward fontSize="small" /></Link>
      </section> : <div className="av-bag-layout">
        <ul className="av-bag-items av-panel">
          {basket.items.map(item => (
            <li key={item.id} className="av-bag-row">
              <Link to={`/store/${item.id}`} className="av-bag-media" aria-label={`View ${item.name}`}>
                <img src={productImage(item.pictureUrl)} alt="" loading="lazy" />
              </Link>
              <div className="av-bag-info">
                <p>{item.productBrand}</p>
                <Link to={`/store/${item.id}`}>{item.name}</Link>
                <p>{rupiah.format(item.price)} each</p>
                <button className="av-remove" type="button" onClick={() => update(agent.Basket.removeItem(item.id, dispatch))}
                  aria-label={`Remove ${item.name} from bag`}>Remove</button>
              </div>
              <div className="av-bag-amount">
                <strong>{rupiah.format(item.price * item.quantity)}</strong>
                <div className="av-quantity">
                  <button type="button" disabled={item.quantity <= 1} aria-label={`Decrease quantity of ${item.name}`}
                    onClick={() => update(agent.Basket.decrementItemQuantity(item.id, 1, dispatch))}><Remove fontSize="small" /></button>
                  <output aria-label={`Quantity of ${item.name}`}>{item.quantity}</output>
                  <button type="button" disabled={item.quantity >= Math.min(item.stock ?? 99, 99)} aria-label={`Increase quantity of ${item.name}`}
                    onClick={() => update(agent.Basket.incrementItemQuantity(item.id, 1, dispatch))}><Add fontSize="small" /></button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <aside className="av-panel av-summary" aria-label="Order summary">
          <h2>Order summary</h2>
          <OrderTotals items={basket.items} />
          <Link className="av-action" to="/checkout">Checkout <ArrowOutward fontSize="small" /></Link>
          <p>Demo checkout. No payment or delivery.</p>
        </aside>
      </div>}
    </div>
  );
}
