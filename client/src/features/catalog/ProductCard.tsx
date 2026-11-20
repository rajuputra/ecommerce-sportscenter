import { Add, ArrowOutward, Check } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import agent from "../../app/api/agent";
import type { Product } from "../../app/models/product";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { productImage, rupiah } from "../../app/util/util";

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const [added, setAdded] = useState(false);
  const timer = useRef<number>();
  const inBag = useAppSelector(state => state.basket.basket?.items.find(item => item.id === product.id)?.quantity ?? 0);
  const unavailable = product.stock === 0;
  const atLimit = inBag >= Math.min(product.stock, 99);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function add() {
    try {
      await agent.Basket.addItem(product, dispatch);
      setAdded(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setAdded(false), 1000);
      toast.success("Added to your bag");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add to your bag.");
    }
  }

  return (
    <article className="av-product">
      <Link className="av-product-link" to={`/store/${product.id}`}>
        <div className="av-product-media">
          <img src={productImage(product.pictureUrl)} alt="" loading="lazy" decoding="async" />
          <span className="av-product-category">{unavailable ? "Out of stock" : product.productType}</span>
          <span className="av-product-arrow"><ArrowOutward fontSize="small" /></span>
        </div>
        <div className="av-product-info">
          <span className="av-product-brand">{product.productBrand}</span>
          <h3>{product.name}</h3>
          <span className="av-product-price">{rupiah.format(product.price)}</span>
        </div>
      </Link>
      <button className="av-product-add" type="button" onClick={() => void add()} disabled={atLimit}
        title={unavailable ? "Out of stock" : atLimit ? "Stock limit reached" : "Add to bag"}
        aria-label={`Add ${product.name} to bag`}>
        {added ? <Check fontSize="small" /> : <Add fontSize="small" />}
      </button>
    </article>
  );
}
