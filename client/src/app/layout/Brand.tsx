import { Link } from "react-router-dom";

export default function Brand() {
  return (
    <Link className="av-wordmark" to="/" aria-label="Avero home">
      <span className="av-mark" aria-hidden="true"><i /><i /><i /></span>
      <span>AVERO</span>
    </Link>
  );
}
