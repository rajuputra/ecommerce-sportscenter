import { CircularProgress, useMediaQuery } from "@mui/material";

export default function Spinner({ message = "Loading…" }: { message?: string }) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  return <div className="av-spinner" role="status">
    {!reduced && <CircularProgress aria-hidden="true" size={25} thickness={3} color="secondary" />}
    <span>{message}</span>
  </div>;
}
