import { Add, ArrowBack, Remove, ShoppingBagOutlined } from "@mui/icons-material";
import { Alert, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import agent, { errorStatus } from "../../app/api/agent";
import NotFoundError from "../../app/errors/NotFoundError";
import Spinner from "../../app/layout/Spinner";
import type { Product } from "../../app/models/product";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { productImage, rupiah } from "../../app/util/util";
import "./shop.css";

export default function ProductDetails() {
  const id = Number(useParams().id);
  return <ProductDetail key={id} id={id} />;
}

function ProductDetail({ id }: { id: number }) {
  const dispatch = useAppDispatch();
  const inBag = useAppSelector(state => state.basket.basket?.items.find(item => item.id === id)?.quantity ?? 0);
  const [product, setProduct] = useState<Product>();
  const [error, setError] = useState<"missing" | "network">();
  const [reload, setReload] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!Number.isSafeInteger(id) || id < 1) return;
    let active = true;
    agent.Store.details(id).then(product => {
      if (active) setProduct(product);
    }).catch(error => {
      if (active) setError(errorStatus(error) === 404 ? "missing" : "network");
    });
    return () => { active = false; };
  }, [id, reload]);

  if (!Number.isSafeInteger(id) || id < 1 || error === "missing") return <NotFoundError />;
  if (error === "network") return <div className="av-page">
    <Alert severity="error" action={<Button onClick={() => { setError(undefined); setReload(value => value + 1); }}>Retry</Button>}>
      Could not load this product.
    </Alert>
  </div>;
  if (!product) return <Spinner message="Loading product…" />;

  const selectedProduct = product;
  const max = Math.max(0, Math.min(99, selectedProduct.stock) - inBag);
  const selectedQuantity = Math.min(quantity, Math.max(1, max));

  async function add() {
    setBusy(true);
    try {
      await agent.Basket.addItem(selectedProduct, dispatch, selectedQuantity);
      setQuantity(1);
      toast.success("Added to your bag");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add to your bag.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="av-page av-detail">
      <Link className="av-breadcrumb" to="/store"><ArrowBack fontSize="small" /> All gear</Link>
      <div className="av-detail-layout">
        <div className="av-detail-media">
          <img src={productImage(product.pictureUrl)} alt={product.name} decoding="async" />
        </div>
        <div className="av-detail-info">
          <p className="av-kicker">{product.productBrand} / {product.productType}</p>
          <h1 className="av-display">{product.name}</h1>
          <p className="av-detail-price">{rupiah.format(product.price)}</p>
          <p className="av-stock"><span data-available={product.stock > 0} />{product.stock > 0 ? "In stock" : "Out of stock"}</p>
          <div className="av-detail-controls">
            <div className="av-quantity" aria-label="Quantity">
              <button type="button" onClick={() => setQuantity(selectedQuantity - 1)} disabled={selectedQuantity <= 1} aria-label="Decrease quantity"><Remove fontSize="small" /></button>
              <output aria-label="Selected quantity">{selectedQuantity}</output>
              <button type="button" onClick={() => setQuantity(selectedQuantity + 1)} disabled={selectedQuantity >= max} aria-label="Increase quantity"><Add fontSize="small" /></button>
            </div>
            <LoadingButton loading={busy} variant="contained" disabled={!max} startIcon={<ShoppingBagOutlined />}
              onClick={() => void add()}>
              {product.stock === 0 ? "Out of stock" : max ? "Add to bag" : "Stock limit reached"}
            </LoadingButton>
          </div>
          {inBag > 0 && <Link to="/basket" className="av-text-link">View bag ({inBag})</Link>}
          <section className="av-detail-description">
            <h2>Product details</h2>
            <p>{product.description}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
