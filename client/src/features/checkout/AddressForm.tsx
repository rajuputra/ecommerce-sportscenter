import { Grid, TextField, Typography, Box } from "@mui/material";
import { LocalShipping as LocalShippingIcon } from "@mui/icons-material";
import { useFormContext } from "react-hook-form";

export default function AddressForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
        <LocalShippingIcon color="secondary" />
        <Typography variant="h5" fontWeight="bold">
          Shipping Address
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter the address where you want your order delivered.
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="firstName"
            {...register("firstName")}
            label="First name"
            fullWidth
            autoComplete="given-name"
            variant="outlined"
            error={!!errors.firstName}
            helperText={errors.firstName?.message as string || ""}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="lastName"
            {...register("lastName")}
            label="Last name"
            fullWidth
            autoComplete="family-name"
            variant="outlined"
            error={!!errors.lastName}
            helperText={errors.lastName?.message as string || ""}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="address1"
            {...register("address1")}
            label="Address line 1"
            fullWidth
            autoComplete="shipping address-line1"
            variant="outlined"
            error={!!errors.address1}
            helperText={errors.address1?.message as string || ""}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="address2"
            {...register("address2")}
            label="Address line 2 (Optional)"
            fullWidth
            autoComplete="shipping address-line2"
            variant="outlined"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            {...register("city")}
            label="City"
            fullWidth
            autoComplete="shipping address-level2"
            variant="outlined"
            error={!!errors.city}
            helperText={errors.city?.message as string || ""}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="state"
            {...register("state")}
            label="State / Province"
            fullWidth
            variant="outlined"
            error={!!errors.state}
            helperText={errors.state?.message as string || ""}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="zip"
            {...register("zip")}
            label="Zip / Postal code"
            fullWidth
            autoComplete="shipping postal-code"
            variant="outlined"
            error={!!errors.zip}
            helperText={errors.zip?.message as string || ""}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="country"
            {...register("country")}
            label="Country"
            fullWidth
            autoComplete="shipping country"
            variant="outlined"
            error={!!errors.country}
            helperText={errors.country?.message as string || ""}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
