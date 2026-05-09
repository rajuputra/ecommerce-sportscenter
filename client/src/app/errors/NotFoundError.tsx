import { useNavigate } from "react-router-dom";
import { Container, Box, Typography, Button } from "@mui/material";
import { Home } from "@mui/icons-material";

export default function NotFoundError() {
  const navigate = useNavigate();
  const handleGoHome = () => {
    navigate("/");
  };
  return (
    <Container
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
      }}
    >
      <Box
        component="img"
        sx={{
          height: "auto",
          width: "100%",
          maxHeight: { xs: 233, md: 400 },
          maxWidth: { xs: 350, md: 400 },
          mb: 4,
        }}
        src="/images/page-not-found.png"
        alt="404 Not Found"
      />
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        Oops! Page not found.
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        We can't seem to find the page you're looking for.
      </Typography>

      <Button 
        variant="contained" 
        color="secondary" 
        size="large" 
        onClick={handleGoHome}
        startIcon={<Home />}
        sx={{ borderRadius: '50px', px: 4, py: 1.5, fontWeight: 'bold' }}
      >
        Go Home
      </Button>
    </Container>
  );
}
