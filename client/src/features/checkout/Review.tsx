import {
  Typography,
  Box,
  Divider,
  Paper,
} from "@mui/material";
import { Product } from "../../app/models/product";
import { useAppSelector } from "../../app/store/configureStore";

export default function Review() {
  const { basket } = useAppSelector((state) => state.basket);

  const extractImageName = (item: Product | any): string | null => {
    if (item && item.pictureUrl) {
      const parts = item.pictureUrl.split("/");
      if (parts.length > 0) {
        return parts[parts.length - 1];
      }
    }
    return null;
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const subTotal =
    basket?.items.reduce((acc, item) => acc + item.price * item.quantity, 0) ?? 0;
  const shipping = 35000;
  const total = subTotal + shipping;

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Order Summary
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Review your items before proceeding to payment.
      </Typography>

      {/* Item list */}
      <Box sx={{ mb: 3 }}>
        {basket?.items.map((item, index) => (
          <Box key={item.id}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                py: 2,
              }}
            >
              {/* Product image */}
              <Paper
                elevation={0}
                sx={{
                  p: 1,
                  borderRadius: 2,
                  bgcolor: (theme) =>
                    theme.palette.mode === "light"
                      ? "white"
                      : "rgba(255,255,255,0.08)",
                  flexShrink: 0,
                }}
              >
                {item.pictureUrl && (
                  <img
                    src={"/images/products/" + extractImageName(item)}
                    alt={item.name}
                    style={{
                      width: 56,
                      height: 56,
                      objectFit: "contain",
                    }}
                  />
                )}
              </Paper>

              {/* Product info */}
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  noWrap
                >
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatPrice(item.price)} × {item.quantity}
                </Typography>
              </Box>

              {/* Line total */}
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                color="secondary.main"
                sx={{ flexShrink: 0 }}
              >
                {formatPrice(item.price * item.quantity)}
              </Typography>
            </Box>
            {index < (basket?.items.length ?? 0) - 1 && (
              <Divider />
            )}
          </Box>
        ))}
      </Box>

      {/* Basket Summary */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: (theme) =>
            theme.palette.mode === "light"
              ? "white"
              : "rgba(255,255,255,0.08)",
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
          Price Details
        </Typography>
        <Box
          sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}
        >
          <Typography variant="body2" color="text.secondary">
            Subtotal ({basket?.items.reduce((acc, i) => acc + i.quantity, 0) ?? 0} items)
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {formatPrice(subTotal)}
          </Typography>
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}
        >
          <Typography variant="body2" color="text.secondary">
            Shipping
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {formatPrice(shipping)}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Total
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" color="secondary.main">
            {formatPrice(total)}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
