import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Stack,
  Avatar,
} from "@mui/material";
import { Email, Phone, LocationOn, Send } from "@mui/icons-material";

export default function ContactPage() {
  const infoCardStyle = {
    p: 3,
    borderRadius: 3,
    bgcolor: (theme: any) =>
      theme.palette.mode === "light" ? "#f5f5f5" : "rgba(255, 255, 255, 0.05)",
    display: "flex",
    alignItems: "center",
    gap: 2,
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "translateX(10px)",
    },
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Contact Us
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Have questions? Our team is here to help.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Contact Form */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
              Send us a Message
            </Typography>
            <Box component="form" noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    variant="outlined"
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    variant="outlined"
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Message"
                    multiline
                    rows={4}
                    variant="outlined"
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                </Grid>
              </Grid>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                size="large"
                endIcon={<Send />}
                sx={{
                  mt: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: "bold",
                  textTransform: "none",
                }}
                onClick={(e) => e.preventDefault()}
              >
                Send Message
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Contact Info */}
        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
              Information
            </Typography>
            
            <Paper elevation={0} sx={infoCardStyle}>
              <Avatar sx={{ bgcolor: "secondary.main" }}>
                <Email />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  support@sportcenter.com
                </Typography>
              </Box>
            </Paper>

            <Paper elevation={0} sx={infoCardStyle}>
              <Avatar sx={{ bgcolor: "secondary.main" }}>
                <Phone />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  +1 (555) 123-4567
                </Typography>
              </Box>
            </Paper>

            <Paper elevation={0} sx={infoCardStyle}>
              <Avatar sx={{ bgcolor: "secondary.main" }}>
                <LocationOn />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  123 Stadium Way, Sport City
                </Typography>
              </Box>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: "secondary.main", // Changed to secondary for better visibility and consistency
                color: "white",
                borderRadius: 3,
                mt: 2,
                boxShadow: "0 4px 14px 0 rgba(249, 115, 22, 0.2)",
              }}
            >
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Store Hours
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Mon - Fri: 09:00 - 20:00
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Sat: 10:00 - 18:00
              </Typography>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}


