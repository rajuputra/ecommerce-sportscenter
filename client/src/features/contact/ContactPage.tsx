import { ArrowOutward } from "@mui/icons-material";
import { Link } from "react-router-dom";
import "../home/home.css";

export default function ContactPage() {
  return (
    <div className="av-page">
      <section className="av-editorial">
        <img src="/images/avero/court-study.webp" alt="Badminton racket and shuttlecock on an indoor court" width="1200" height="800" />
        <div className="av-editorial-content">
          <h1 className="av-display">ABOUT<br />AVERO.</h1>
          <p>Avero is a sports gear storefront and full-stack portfolio project by Raju Putra. Browse the gear and try the checkout with a sample address.</p>
          <Link className="av-action" to="/store">Explore the shop <ArrowOutward fontSize="small" /></Link>
        </div>
      </section>
    </div>
  );
}
