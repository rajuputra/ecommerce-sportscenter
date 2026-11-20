import { Link } from "react-router-dom";
import Brand from "./Brand";

export default function Footer() {
  return (
    <footer className="av-footer">
      <div className="av-shell av-footer-inner">
        <Brand />
        <nav aria-label="Footer">
          <Link to="/store">Shop all gear</Link>
          <Link to="/contact">About Avero</Link>
          <a href="https://rajuputra.web.id">Raju’s portfolio</a>
        </nav>
        <small>© {new Date().getFullYear()} Avero · Portfolio demo</small>
      </div>
    </footer>
  );
}
