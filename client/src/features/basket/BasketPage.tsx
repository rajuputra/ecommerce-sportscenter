import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Box,
  Grid,
  Button,
  Divider,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCartCheckout as ShoppingCartCheckoutIcon,
  ShoppingBasket as ShoppingBasketIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import agent from "../../app/api/agent";
import { Product } from "../../app/models/product";
import { Link } from "react-router-dom";

export default function BasketPage() {
  const { basket } = useAppSelector((state) => state.basket);
  const dispatch = useAppDispatch();
  const { Basket: BasketActions } = agent;

  const removeItem = (productId: number) => {
    BasketActions.removeItem(productId, dispatch);
  };

  const decrementItem = (productId: number, quantity: number = 1) => {
    BasketActions.decrementItemQuantity(productId, quantity, dispatch);
  };
  const incrementItem = (productId: number, quantity: number = 1) => {
    BasketActions.incrementItemQuantity(productId, quantity, dispatch);
  };

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

  if (!basket || basket.items.length === 0)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mt: 10,
        }}
      >
        <ShoppingBasketIcon
          sx={{ fontSize: 100, color: "text.secondary", mb: 3, opacity: 0.5 }}
        />
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Your basket is empty
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Looks like you haven't added any gear to your cart yet.
        </Typography>
        <Button
          component={Link}
          to="/store"
          variant="contained"
          color="secondary"
          size="large"
          sx={{ borderRadius: "50px", px: 4 }}
        >
          Back to Store
        </Button>
      </Box>
    );

  const subTotal = basket.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = 35000;
  const total = subTotal + shipping;

  return (
    <Box sx={{ pb: 8 }}>
      <Typography variant="h3" fontWeight="bold" sx={{ mb: 4 }}>
        Shopping Cart
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          {/* Tampilan Mobile: Card List */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            {basket.items.map((item) => (
              <Paper
                key={item.id}
                elevation={0}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 4,
                  bgcolor: (theme) =>
                    theme.palette.mode === "light"
                      ? "#f5f5f5"
                      : "rgba(255, 255, 255, 0.05)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  {item.pictureUrl && (
                    <Box
                      sx={{
                        bgcolor: (theme) =>
                          theme.palette.mode === "light"
                            ? "white"
                            : "transparent",
                        p: 1,
                        borderRadius: 2,
                      }}
                    >
                      <img
                        src={"/images/products/" + extractImageName(item)}
                        alt={`Gambar produk ${item.name}`}
                        style={{ width: 60, height: 60, objectFit: "contain" }}
                      />
                    </Box>
                  )}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {item.name}
                    </Typography>
                    <Typography color="text.secondary">
                      {formatPrice(item.price)}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => removeItem(item.id)}
                    color="error"
                    aria-label={`Hapus ${item.name} dari keranjang`}
                    sx={{ minWidth: 44, minHeight: 44 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <Divider />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                      color="error"
                      onClick={() => decrementItem(item.id)}
                      size="small"
                      aria-label={`Kurangi kuantitas ${item.name}`}
                      sx={{ minWidth: 44, minHeight: 44 }}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography fontWeight="bold">{item.quantity}</Typography>
                    <IconButton
                      color="success"
                      onClick={() => incrementItem(item.id)}
                      size="small"
                      aria-label={`Tambah kuantitas ${item.name}`}
                      sx={{ minWidth: 44, minHeight: 44 }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <Typography fontWeight="bold" color="secondary.main">
                    {formatPrice(item.price * item.quantity)}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>

          {/* Tampilan Desktop: Table */}
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              display: { xs: "none", md: "block" },
              borderRadius: 4,
              bgcolor: (theme) =>
                theme.palette.mode === "light"
                  ? "#f5f5f5"
                  : "rgba(255, 255, 255, 0.05)",
            }}
          >
            <Table
              sx={{
                "& th, & td": {
                  borderBottom: "1px solid",
                  borderColor: "divider",
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                  >
                    Product
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                  >
                    Price
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      textAlign: "center",
                    }}
                  >
                    Quantity
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                  >
                    Subtotal
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      textAlign: "right",
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {basket.items.map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        {item.pictureUrl && (
                          <Box
                            sx={{
                              bgcolor: (theme) =>
                                theme.palette.mode === "light"
                                  ? "white"
                                  : "transparent",
                              p: 1,
                              borderRadius: 2,
                            }}
                          >
                            <img
                              src={"/images/products/" + extractImageName(item)}
                              alt={`Gambar produk ${item.name}`}
                              style={{
                                width: 60,
                                height: 60,
                                objectFit: "contain",
                              }}
                            />
                          </Box>
                        )}
                        <Typography variant="subtitle1" fontWeight="bold">
                          {item.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{formatPrice(item.price)}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <IconButton
                          color="error"
                          onClick={() => decrementItem(item.id)}
                          size="small"
                          aria-label={`Kurangi kuantitas ${item.name}`}
                          sx={{ minWidth: 44, minHeight: 44 }}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography fontWeight="bold">
                          {item.quantity}
                        </Typography>
                        <IconButton
                          color="success"
                          onClick={() => incrementItem(item.id)}
                          size="small"
                          aria-label={`Tambah kuantitas ${item.name}`}
                          sx={{ minWidth: 44, minHeight: 44 }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {formatPrice(item.price * item.quantity)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => removeItem(item.id)}
                        color="error"
                        aria-label={`Hapus ${item.name} dari keranjang`}
                        sx={{ minWidth: 44, minHeight: 44 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              bgcolor: (theme) =>
                theme.palette.mode === "light"
                  ? "#f5f5f5"
                  : "rgba(255, 255, 255, 0.05)",
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography fontWeight="bold">{formatPrice(subTotal)}</Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography color="text.secondary">Shipping</Typography>
              <Typography fontWeight="bold">
                {shipping === 0 ? "Free" : formatPrice(shipping)}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}
            >
              <Typography variant="h6" fontWeight="bold">
                Total
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="secondary.main">
                {formatPrice(total)}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              size="large"
              component={Link}
              to="/checkout"
              startIcon={<ShoppingCartCheckoutIcon />}
              sx={{ py: 1.5, borderRadius: 2, fontWeight: "bold" }}
            >
              Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
