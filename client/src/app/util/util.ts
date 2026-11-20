export const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", maximumFractionDigits: 0,
});

export function productImage(value?: string | null) {
  const filename = value?.split("/").pop();
  return filename ? `/images/products/${encodeURIComponent(filename)}` : undefined;
}
