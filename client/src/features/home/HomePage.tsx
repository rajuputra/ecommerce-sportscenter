import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Stack,
  Avatar,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  LocalShipping,
  VerifiedUser,
  SupportAgent,
  ArrowForward,
} from "@mui/icons-material";
import agent from "../../app/api/agent";
import { Product } from "../../app/models/product";
import ProductCard from "../catalog/ProductCard";
import Spinner from "../../app/layout/Spinner";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch first 4 products for New Arrivals
    agent.Store.list(1, 4)
      .then((response) => setProducts(response.content))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  const trustItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: 2,
    p: 2,
  };

  return (
    <Box sx={{ pb: 8, mt: { xs: 2, md: 4 } }}>
      {/* Premium Integrated Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "60vh", md: "75vh" },
          width: "100%",
          display: "flex",
          alignItems: "center",
          borderRadius: 4,
          overflow: "hidden",
          mb: 8,
          boxShadow: (theme) =>
            theme.palette.mode === "light"
              ? "0 20px 40px rgba(0,0,0,0.1)"
              : "0 20px 40px rgba(0,0,0,0.4)",
          background: (theme) =>
            theme.palette.mode === "light"
              ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
              : "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
        }}
      >
        <Grid container sx={{ height: "100%", position: "relative", zIndex: 1 }}>
          <Grid
            item
            xs={12}
            md={7}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              px: { xs: 4, md: 10 },
              textAlign: { xs: "center", md: "left" },
              zIndex: 2,
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: "secondary.main",
                fontWeight: 800,
                mb: 2,
                letterSpacing: 4,
                textTransform: "uppercase",
              }}
            >
              Elite Performance Gear
            </Typography>
            <Typography
              variant="h1"
              sx={{
                color: "white",
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: "2.8rem", md: "4.5rem" },
                lineHeight: 1,
                fontFamily: "Oswald, sans-serif",
                textTransform: "uppercase",
                textShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
            >
              Push Beyond <br />
              <Box component="span" sx={{ color: "secondary.main" }}>
                Your Limits
              </Box>
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                mb: 5,
                fontWeight: 300,
                maxWidth: 550,
                lineHeight: 1.6,
                fontSize: { xs: "1rem", md: "1.25rem" },
              }}
            >
              Experience the pinnacle of athletic innovation with our 2026 Professional Collection. Engineered for those who never stop.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              justifyContent={{ xs: "center", md: "flex-start" }}
            >
              <Button
                component={Link}
                to="/store"
                variant="contained"
                color="secondary"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  borderRadius: 2,
                  px: 5,
                  py: 2,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  boxShadow: (theme) =>
                    theme.palette.mode === "light"
                      ? "0 8px 20px rgba(249, 115, 22, 0.4)"
                      : "0 8px 20px rgba(255, 255, 255, 0.15)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: (theme) =>
                      theme.palette.mode === "light"
                        ? "0 12px 24px rgba(249, 115, 22, 0.5)"
                        : "0 12px 24px rgba(255, 255, 255, 0.25)",
                  },
                }}
              >
                Shop Collection
              </Button>
              <Button
                component={Link}
                to="/contact"
                variant="outlined"
                sx={{
                  color: "white",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  borderRadius: 2,
                  px: 5,
                  py: 2,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  backdropFilter: "blur(4px)",
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Support
              </Button>
            </Stack>
          </Grid>
          <Grid
            item
            xs={0}
            md={5}
            sx={{
              display: { xs: "none", md: "block" },
              position: "relative",
              backgroundImage:
                "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: (theme) =>
                  `linear-gradient(to right, ${
                    theme.palette.mode === "light" ? "#0f172a" : "#020617"
                  } 0%, transparent 100%)`,
                zIndex: 1,
              },
            }}
          />
        </Grid>
      </Box>

      {/* Trust Bar */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          mb: 10,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          bgcolor: (theme) =>
            theme.palette.mode === "light"
              ? "white"
              : "rgba(255, 255, 255, 0.02)",
        }}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            sm={4}
            sx={{
              borderRight: { sm: "1px solid" },
              borderColor: { sm: "divider" },
            }}
          >
            <Box sx={trustItemStyle}>
              <Avatar
                sx={{
                  bgcolor: "secondary.main",
                  color: "white",
                  width: 48,
                  height: 48,
                }}
              >
                <LocalShipping />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  Free Delivery
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  On orders over IDR 1.000.000
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            sx={{
              borderRight: { sm: "1px solid" },
              borderColor: { sm: "divider" },
            }}
          >
            <Box sx={trustItemStyle}>
              <Avatar
                sx={{
                  bgcolor: "secondary.main",
                  color: "white",
                  width: 48,
                  height: 48,
                }}
              >
                <VerifiedUser />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  Secure Payment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  100% encrypted transaction
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={trustItemStyle}>
              <Avatar
                sx={{
                  bgcolor: "secondary.main",
                  color: "white",
                  width: 48,
                  height: 48,
                }}
              >
                <SupportAgent />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  Expert Support
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Talk to our athletic pros
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* New Arrivals - Real Store Integration */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            mb: 5,
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 1,
                fontFamily: "Oswald, sans-serif",
                textTransform: "uppercase",
              }}
            >
              New Arrivals
            </Typography>
            <Typography variant="h6" color="text.secondary" fontWeight={300}>
              Fresh gear just landed in our warehouse.
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/store"
            color="secondary"
            endIcon={<ArrowForward />}
            sx={{ fontWeight: "bold", textTransform: "none", fontSize: "1rem" }}
          >
            Explore All
          </Button>
        </Box>

        {loading ? (
          <Spinner message="Fetching gear..." />
        ) : (
          <Grid container spacing={4}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>

  );
}
