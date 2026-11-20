import type { Product } from "../../app/models/product";
import ProductCard from "./ProductCard";
import "./shop.css";

export default function ProductList({ products }: { products: Product[] }) {
  return (
    <ul className="av-product-grid">
      {products.map(product => <li key={product.id}><ProductCard product={product} /></li>)}
    </ul>
  );
}
