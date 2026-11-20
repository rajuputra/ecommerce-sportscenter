import { ArrowDownward, ArrowBack, ArrowForward, ArrowOutward } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import agent from "../../app/api/agent";
import type { Product } from "../../app/models/product";
import type { Type } from "../../app/models/type";
import { productImage } from "../../app/util/util";
import ProductList from "../catalog/ProductList";
import "./home.css";

const collections = [
  { type: "Shoes", name: "Court Shoes", image: "yonex_shoe-1.png", tone: "stone" },
  { type: "Rackets", name: "Rackets", image: "yonex-badminton-1.png", tone: "sage" },
  { type: "Football", name: "Football", image: "adidas_football-2.png", tone: "sand" },
  { type: "Kit Bags", name: "Kit Bags", image: "babolat-kitback-1.png", tone: "metal" },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>();
  const [types, setTypes] = useState<Type[]>([]);
  const home = useRef<HTMLDivElement>(null);
  const collectionRail = useRef<HTMLUListElement>(null);
  const [railPosition, setRailPosition] = useState({ start: true, end: false });

  useEffect(() => {
    const controller = new AbortController();
    agent.Store.list(1, 50, undefined, controller.signal).then(({ content }) => {
      if (!controller.signal.aborted) setProducts(content);
    }).catch(() => {
      if (!controller.signal.aborted) setProducts([]);
    });
    agent.Store.types().then(types => {
      if (!controller.signal.aborted) setTypes(types);
    }).catch(() => { /* The category links can fall back to the catalog. */ });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const sections = home.current?.querySelectorAll(".av-reveal");
    if (!sections || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("av-in-view");
        observer.unobserve(entry.target);
      }
    }, { threshold: .16 });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const featured = collections.flatMap(({ type }) => {
    const product = products?.find(product => product.productType === type && product.stock > 0);
    return product ? [product] : [];
  });
  const collectionUrl = (type: string) => {
    const id = types.find(item => item.name === type)?.id;
    return id ? `/store?type=${id}` : "/store";
  };

  function scrollCollection(direction: number) {
    const rail = collectionRail.current;
    const card = rail?.firstElementChild;
    if (!rail || !card) return;
    const gap = parseFloat(window.getComputedStyle(rail).columnGap) || 0;
    rail.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  return (
    <div className="av-home" ref={home}>
      <section className="av-hero" aria-labelledby="home-title">
        <picture className="av-hero-image" aria-hidden="true">
          <source media="(max-width: 680px)" srcSet="/images/avero/court-mobile.webp" />
          <img src="/images/avero/court-hero.webp" alt="" fetchPriority="high" />
        </picture>
        <div className="av-hero-shade" aria-hidden="true" />
        <div className="av-hero-sweep" aria-hidden="true" />
        <div className="av-shell av-hero-frame">
          <div className="av-hero-content">
            <p className="av-kicker">The court collection</p>
            <h1 id="home-title"><span>BUILT TO</span><span>PLAY.</span></h1>
            <p className="av-hero-description">Court shoes, rackets and kit for your next game.</p>
            <Link className="av-action" to="/store">Shop the collection <ArrowUpRight /></Link>
          </div>
          <a className="av-hero-down" href="#collections"><ArrowDownward fontSize="small" /><span>Explore collections</span></a>
        </div>
      </section>

      <section className="av-section av-shell" id="collections" aria-labelledby="collection-title">
        <div className="av-section-heading av-reveal">
          <h2 className="av-display" id="collection-title">FIND YOUR GAME.</h2>
          <Link className="av-text-link" to="/store">Shop all gear <ArrowForward fontSize="small" /></Link>
        </div>
        <ul className="av-collection-grid av-reveal" ref={collectionRail} id="collection-rail"
          onScroll={event => {
            const { clientWidth, scrollLeft, scrollWidth } = event.currentTarget;
            setRailPosition({ start: scrollLeft < 3, end: scrollLeft + clientWidth >= scrollWidth - 3 });
          }}>
          {collections.map(({ type, name, image, tone }) => (
            <li key={type}>
              <Link to={collectionUrl(type)} className={`av-collection av-collection--${tone}`}>
                <img src={productImage(image)} alt="" loading="lazy" decoding="async" />
                <span className="av-collection-name">{name}</span>
                <span className="av-collection-arrow"><ArrowUpRight /></span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="av-rail-controls">
          <button type="button" aria-label="Previous collection" aria-controls="collection-rail" disabled={railPosition.start}
            onClick={() => scrollCollection(-1)}><ArrowBack fontSize="small" /></button>
          <button type="button" aria-label="Next collection" aria-controls="collection-rail" disabled={railPosition.end}
            onClick={() => scrollCollection(1)}><ArrowForward fontSize="small" /></button>
        </div>
      </section>

      <section className="av-featured" aria-labelledby="featured-title">
        <div className="av-section av-shell">
          <div className="av-section-heading av-reveal">
            <h2 className="av-display" id="featured-title">FEATURED GEAR.</h2>
            <Link className="av-text-link" to="/store">View the catalog <ArrowForward fontSize="small" /></Link>
          </div>
          {featured.length ? <ProductList products={featured} /> :
            <p role="status">{products ? "Explore the catalog to see available gear." : "Loading featured gear…"}</p>}
        </div>
      </section>

      <section className="av-section av-shell">
        <div className="av-editorial">
          <img src="/images/avero/court-study.webp" alt="Badminton racket and shuttlecock on an indoor court"
            width="1200" height="800" loading="lazy" decoding="async" />
          <div className="av-editorial-content av-reveal">
            <h2 className="av-display">THE NEXT<br />RALLY.</h2>
            <p>Find your next racket before you step onto the court.</p>
            <Link className="av-action" to={collectionUrl("Rackets")}>Explore rackets <ArrowUpRight /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ArrowUpRight() {
  return <ArrowOutward fontSize="small" aria-hidden="true" />;
}
