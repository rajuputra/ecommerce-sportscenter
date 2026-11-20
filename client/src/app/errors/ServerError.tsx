import { Link } from "react-router-dom";

export default function ServerError() {
  return <div className="av-page">
    <section className="av-panel av-empty">
      <h1 className="av-display">SOMETHING WENT WRONG.</h1>
      <p>Avero couldn’t load the page. Try refreshing or return to the shop.</p>
      <Link to="/store" className="av-action">Back to the shop</Link>
    </section>
  </div>;
}
