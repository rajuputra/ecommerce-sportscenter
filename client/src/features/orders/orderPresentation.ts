import type { OrderStatus } from "../../app/models/order";

const dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" });

export function orderDate(value: string | null) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : dateFormatter.format(date);
}

export function statusLabel(status: OrderStatus) {
  if (status === "PaymentReceived") return "Payment received";
  if (status === "PaymentFailed") return "Payment failed";
  return status;
}

export const orderStages = ["Pending", "Processing", "Shipped", "Completed"] as const;
