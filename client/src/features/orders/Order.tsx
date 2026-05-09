import {
  Typography,
  Paper,
  Box,
  Chip,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  ShoppingBag as ShoppingBagIcon,
  Receipt as ReceiptIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import agent from "../../app/api/agent";
import Spinner from "../../app/layout/Spinner";
import type { Order } from "../../app/models/order";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    agent.Orders.list()
      .then((orders) => setOrders(orders))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  function formatDate(orderDate: any): string {
    try {
      let date: Date;
      if (Array.isArray(orderDate) && orderDate.length >= 3) {
        // Java LocalDateTime serialized as array: [year, month, day, hour?, min?, sec?]
        const [year, month, day] = orderDate;
        date = new Date(year, month - 1, day);
      } else if (typeof orderDate === "string") {
        date = new Date(orderDate);
      } else {
        return String(orderDate || "-");
      }
      if (isNaN(date.getTime())) return String(orderDate || "-");
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return String(orderDate || "-");
    }
  }

  function getStatusColor(status: string): "success" | "warning" | "info" | "error" | "default" {
    switch (status?.toLowerCase()) {
      case "pending":
        return "warning";
      case "confirmed":
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      case "shipped":
        return "info";
      default:
        return "default";
    }
  }

  if (loading) return <Spinner message="Loading orders..." />;

  return (
    <Box sx={{ pb: 8 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/store")}
        sx={{ mb: 4 }}
        color="inherit"
      >
        Back to Store
      </Button>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <ReceiptIcon sx={{ fontSize: 36, color: "secondary.main" }} />
        <Typography variant="h3" fontWeight="bold">
          My Orders
        </Typography>
      </Box>

      {!orders || orders.length === 0 ? (
        /* Empty state */
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            bgcolor: (theme) =>
              theme.palette.mode === "light"
                ? "#f5f5f5"
                : "rgba(255, 255, 255, 0.05)",
            textAlign: "center",
          }}
        >
          <ShoppingBagIcon
            sx={{ fontSize: 80, color: "text.secondary", mb: 3, opacity: 0.4 }}
          />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            No orders yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Once you place an order, it will appear here.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate("/store")}
            sx={{ borderRadius: 2, px: 4, py: 1.5, fontWeight: "bold" }}
          >
            Start Shopping
          </Button>
        </Paper>
      ) : (
        <>
          {/* Mobile: Card layout */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            {orders.map((order) => (
              <Paper
                key={order.id}
                elevation={0}
                sx={{
                  p: 3,
                  mb: 2,
                  borderRadius: 4,
                  bgcolor: (theme) =>
                    theme.palette.mode === "light"
                      ? "#f5f5f5"
                      : "rgba(255, 255, 255, 0.05)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Order #{order.id}
                  </Typography>
                  <Chip
                    label={order.orderStatus}
                    color={getStatusColor(order.orderStatus)}
                    size="small"
                    sx={{ fontWeight: "bold", textTransform: "capitalize" }}
                  />
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatDate(order.orderDate)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Subtotal
                  </Typography>
                  <Typography variant="body2">
                    {formatPrice(order.subTotal)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Shipping
                  </Typography>
                  <Typography variant="body2">
                    {formatPrice(order.deliveryFee)}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="secondary.main"
                  >
                    {formatPrice(order.total)}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>

          {/* Desktop: Table layout */}
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
                    Order
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                  >
                    Subtotal
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                  >
                    Shipping
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                  >
                    Total
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": {
                        bgcolor: (theme) =>
                          theme.palette.mode === "light"
                            ? "rgba(0,0,0,0.02)"
                            : "rgba(255,255,255,0.03)",
                      },
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        #{order.id}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatDate(order.orderDate)}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.orderStatus}
                        color={getStatusColor(order.orderStatus)}
                        size="small"
                        sx={{
                          fontWeight: "bold",
                          textTransform: "capitalize",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {formatPrice(order.subTotal)}
                    </TableCell>
                    <TableCell align="right">
                      {formatPrice(order.deliveryFee)}
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        fontWeight="bold"
                        color="secondary.main"
                      >
                        {formatPrice(order.total)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}
