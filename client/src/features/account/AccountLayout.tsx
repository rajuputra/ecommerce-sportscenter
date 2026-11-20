import { ArrowBack, ArrowOutward } from "@mui/icons-material";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./account.css";

export default function AccountLayout({ title, description, children }: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="av-page av-account-page">
      <Link className="av-breadcrumb" to="/store"><ArrowBack fontSize="small" /> Back to the shop</Link>
      <section className="av-auth" aria-labelledby="account-title">
        <div className="av-auth-visual" aria-hidden="true">
          <img src="/images/avero/court-study.webp" alt="" />
          <div className="av-auth-campaign">
            <span>AVERO</span>
            <p>BUILT TO<br /><em>PLAY.</em></p>
          </div>
        </div>
        <div className="av-auth-body">
          <div className="av-auth-content">
            <h1 id="account-title" className="av-display">{title}</h1>
            <p className="av-auth-description">{description}</p>
            {children}
          </div>
        </div>
      </section>
    </div>
  );
}

export function AccountAlternate({ to, state, question, label }: {
  to: string;
  state?: unknown;
  question: string;
  label: string;
}) {
  return (
    <div className="av-auth-switch">
      <span>{question}</span>
      <Link to={to} state={state}>{label} <ArrowOutward fontSize="small" /></Link>
    </div>
  );
}
