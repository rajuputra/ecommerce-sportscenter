import {
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Box,
  Button,
  IconButton,
  Chip,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import NotFoundError from "../../app/errors/NotFoundError";
import Spinner from "../../app/layout/Spinner";
import {
  AddShoppingCart,
  ArrowBack,
  Add as AddIcon,
  Remove as RemoveIcon,
  DeleteOutline as DeleteOutlineIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setBasket } from "../basket/basketSlice";
import { LoadingButton } from "@mui/lab";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingCart, setLoadingCart] = useState(false);
  const dispatch = useAppDispatch();
  const { basket } = useAppSelector((state) => state.basket);

  // Derive cart item for this product from Redux basket state
  const cartItem = product ? basket?.items.find((i) => i.id === product.id) : undefined;

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

  useEffect(() => {
    id &&
      agent.Store.details(parseInt(id))
        .then((response) => setProduct(response))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
  }, [id]);

  function addItem() {
    if (!product) return;
    setLoadingCart(true);
    agent.Basket.addItem(product, dispatch)
      .then((response) => {
        dispatch(setBasket(response.basket));
      })
      .catch((error) => console.log(error))
      .finally(() => setLoadingCart(false));
  }

  function incrementItem() {
    if (!product) return;
    setLoadingCart(true);
    agent.Basket.incrementItemQuantity(product.id, 1, dispatch)
      .catch((error) => console.log(error))
      .finally(() => setLoadingCart(false));
  }

  function decrementItem() {
    if (!product || !cartItem) return;
    setLoadingCart(true);
    // If quantity is 1, decrementing would go to 0 — remove instead
    if (cartItem.quantity === 1) {
      agent.Basket.removeItem(product.id, dispatch)
        .catch((error) => console.log(error))
        .finally(() => setLoadingCart(false));
    } else {
      agent.Basket.decrementItemQuantity(product.id, 1, dispatch)
        .catch((error) => console.log(error))
        .finally(() => setLoadingCart(false));
    }
  }

  function removeItem() {
    if (!product) return;
    setLoadingCart(true);
    agent.Basket.removeItem(product.id, dispatch)
      .catch((error) => console.log(error))
      .finally(() => setLoadingCart(false));
  }

  if (loading) return <Spinner message="Loading Product..." />;
  if (!product) return <NotFoundError />;

  return (
    <Box sx={{ pb: 8 }}>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate('/store')}
        sx={{ mb: 4 }}
        color="inherit"
      >
        Back to Store
      </Button>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <Box 
            sx={{ 
              bgcolor: (theme) => theme.palette.mode === 'light' ? '#f5f5f5' : 'rgba(255, 255, 255, 0.05)', 
              p: 4, 
              borderRadius: 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Box
              component="img"
              src={"/images/products/" + extractImageName(product)}
              alt={product.name}
              sx={{ 
                width: "100%", 
                maxWidth: "400px", 
                mixBlendMode: (theme) => theme.palette.mode === 'light' ? 'multiply' : 'normal' 
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h3" fontWeight="bold">{product.name}</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography gutterBottom color="secondary.main" variant="h4" fontWeight="bold">
            {formatPrice(product.price)}
          </Typography>
          
          {/* Cart Quantity Control */}
          <Box sx={{ mt: 4, mb: 6 }}>
            {!cartItem ? (
              /* Item NOT in cart — show Add to Cart button */
              <LoadingButton 
                loading={loadingCart}
                onClick={addItem}
                variant="contained" 
                size="large" 
                startIcon={<AddShoppingCart />}
                fullWidth
                sx={{ 
                  py: 1.5, 
                  px: 4, 
                  borderRadius: 2,
                  maxWidth: { xs: '100%', md: '320px' },
                }}
              >
                Add to Cart
              </LoadingButton>
            ) : (
              /* Item IS in cart — show quantity stepper */
              <Box>
                {/* Stepper row */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1, md: 2 },
                    bgcolor: (theme) => theme.palette.mode === 'light' ? '#f5f5f5' : 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 3,
                    p: { xs: 1, md: 1.5 },
                    maxWidth: { xs: '100%', md: '320px' },
                    justifyContent: 'center',
                  }}
                >
                  <IconButton
                    onClick={decrementItem}
                    disabled={loadingCart}
                    color="error"
                    aria-label={`Kurangi kuantitas ${product.name}`}
                    sx={{
                      minWidth: 48,
                      minHeight: 48,
                      bgcolor: (theme) => theme.palette.mode === 'light' ? 'white' : 'rgba(255,255,255,0.08)',
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: (theme) => theme.palette.mode === 'light' ? 'error.light' : 'rgba(244,67,54,0.2)',
                        color: 'white',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>

                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{
                      minWidth: 60,
                      textAlign: 'center',
                      userSelect: 'none',
                    }}
                  >
                    {cartItem.quantity}
                  </Typography>

                  <IconButton
                    onClick={incrementItem}
                    disabled={loadingCart}
                    color="success"
                    aria-label={`Tambah kuantitas ${product.name}`}
                    sx={{
                      minWidth: 48,
                      minHeight: 48,
                      bgcolor: (theme) => theme.palette.mode === 'light' ? 'white' : 'rgba(255,255,255,0.08)',
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: (theme) => theme.palette.mode === 'light' ? 'success.light' : 'rgba(76,175,80,0.2)',
                        color: 'white',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>

                {/* Info chip + Remove button row */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: 2,
                    maxWidth: { xs: '100%', md: '320px' },
                    flexWrap: 'wrap',
                    gap: 1,
                  }}
                >
                  <Chip
                    icon={<ShoppingCartIcon />}
                    label={`${cartItem.quantity} in your cart`}
                    color="secondary"
                    variant="outlined"
                    size="small"
                  />
                  <Button
                    onClick={removeItem}
                    disabled={loadingCart}
                    color="error"
                    size="small"
                    startIcon={<DeleteOutlineIcon />}
                    sx={{
                      textTransform: 'none',
                      minHeight: 40,
                      '&:hover': {
                        bgcolor: 'rgba(244,67,54,0.08)',
                      },
                    }}
                  >
                    Remove from Cart
                  </Button>
                </Box>
              </Box>
            )}
          </Box>

          <TableContainer>
            <Table sx={{ '& td': { borderBottom: '1px solid', borderColor: 'divider', py: 2 } }}>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Name</TableCell>
                  <TableCell>{product.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell>{product.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell>{product.productType}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Brand</TableCell>
                  <TableCell>{product.productBrand}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}
