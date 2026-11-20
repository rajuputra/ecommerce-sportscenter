import { ArrowOutward } from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function NotFoundError() {
  return <div className="av-page">
    <section className="av-panel av-empty">
      <h1 className="av-display">PAGE NOT FOUND.</h1>
      <p>The page or product you’re looking for may have moved.</p>
      <Link to="/store" className="av-action">Back to the shop <ArrowOutward fontSize="small" /></Link>
    </section>
  </div>;
}
