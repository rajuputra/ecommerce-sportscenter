import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
  Chip,
  Box,
  CircularProgress,
} from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { Product } from "../../app/models/product";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch } from "../../app/store/configureStore";
import agent from "../../app/api/agent";
import { setBasket } from "../basket/basketSlice";
import { LoadingButton } from "@mui/lab";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const extractImageName = (item: Product): string | null => {
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
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  function addItem() {
    setLoading(true);
    agent.Basket.addItem(product, dispatch)
      .then((response) => {
        console.log("New Basket:", response.basket);
        dispatch(setBasket(response.basket));
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: (theme) =>
            theme.palette.mode === "light"
              ? "0px 12px 24px rgba(0, 0, 0, 0.1)"
              : "0px 12px 24px rgba(0, 0, 0, 0.6)",
        },
      }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "secondary.main", fontWeight: "bold" }}>
            {product.name.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={product.name}
        titleTypographyProps={{
          sx: {
            fontWeight: "bold",
            color: "text.primary",
            noWrap: true,
            width: "100%",
          },
        }}
      />
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#f5f5f5" : "white",
          p: (theme) => (theme.palette.mode === "light" ? 2 : 1),
          mx: (theme) => (theme.palette.mode === "light" ? 0 : 2),
          mt: (theme) => (theme.palette.mode === "light" ? 0 : 1),
          borderRadius: (theme) => (theme.palette.mode === "light" ? 0 : 3),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 200,
          overflow: "hidden",
        }}
      >
        <CardMedia
          sx={{
            height: "100%",
            width: "100%",
            backgroundSize: "contain",
            mixBlendMode: (theme) =>
              theme.palette.mode === "light" ? "multiply" : "normal",
          }}
          image={"/images/products/" + extractImageName(product)}
          title={product.name}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          gutterBottom
          color="secondary.main"
          variant="h5"
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          {formatPrice(product.price)}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            size="small"
            label={product.productBrand}
            variant="outlined"
            color="primary"
          />
          <Chip
            size="small"
            label={product.productType}
            variant="outlined"
            color="secondary"
          />
        </Box>
      </CardContent>
      <CardActions
        sx={{
          p: 1.5,
          pt: 0,
          gap: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <LoadingButton
          loading={loading}
          onClick={addItem}
          size="medium"
          variant="contained"
          color="secondary"
          startIcon={
            loading ? <CircularProgress size={20} color="inherit" /> : <ShoppingCart />
          }
          aria-label={`Tambahkan ${product.name} ke keranjang`}
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            borderRadius: "8px",
            minHeight: 44,
            px: { xs: 1, sm: 3 },
            textTransform: "none",
            fontSize: { xs: "0.85rem", sm: "0.95rem" },
            whiteSpace: "nowrap",
            boxShadow: "0 4px 14px 0 rgba(0,0,0,0.1)",
            "&:hover": {
              boxShadow: "0 6px 20px 0 rgba(0,0,0,0.15)",
            }
          }}
        >
          Add to cart
        </LoadingButton>
        <Button
          component={Link}
          to={`/store/${product.id}`}
          size="medium"
          variant="outlined"
          color="primary"
          aria-label={`Lihat detail ${product.name}`}
          sx={{
            minWidth: "auto",
            minHeight: 44,
            borderRadius: "8px",
            px: { xs: 1.5, sm: 3 },
            textTransform: "none",
            fontWeight: "bold",
            whiteSpace: "nowrap",
          }}
        >
          View
        </Button>
      </CardActions>
    </Card>
  );
}
