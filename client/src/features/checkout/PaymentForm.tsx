import {
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { CreditCard as CreditCardIcon } from "@mui/icons-material";
import { useFormContext } from "react-hook-form";

export default function PaymentForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
        <CreditCardIcon color="secondary" />
        <Typography variant="h5" fontWeight="bold">
          Payment Details
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter your card details to complete your purchase.
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardName"
            {...register("cardName")}
            label="Name on card"
            fullWidth
            autoComplete="cc-name"
            variant="outlined"
            error={!!errors.cardName}
            helperText={errors.cardName?.message as string || ""}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardNumber"
            {...register("cardNumber")}
            label="Card number"
            placeholder="•••• •••• •••• ••••"
            fullWidth
            autoComplete="cc-number"
            variant="outlined"
            error={!!errors.cardNumber}
            helperText={errors.cardNumber?.message as string || ""}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="expDate"
            {...register("expDate")}
            label="Expiry date"
            placeholder="MM/YY"
            fullWidth
            autoComplete="cc-exp"
            variant="outlined"
            error={!!errors.expDate}
            helperText={errors.expDate?.message as string || ""}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cvv"
            {...register("cvv")}
            label="CVV"
            placeholder="•••"
            fullWidth
            autoComplete="cc-csc"
            variant="outlined"
            error={!!errors.cvv}
            helperText={errors.cvv?.message as string || "Last three digits on signature strip"}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox color="secondary" name="saveCard" value="yes" />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                Remember credit card details for next time
              </Typography>
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
}
