import {
  Box,
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import {
  LocalShipping as LocalShippingIcon,
  CheckCircleOutline as CheckCircleIcon,
  ShoppingBag as ShoppingBagIcon,
} from "@mui/icons-material";
import { useState } from "react";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { BasketItem } from "../../app/models/basket";
import { toast } from "react-toastify";
import agent from "../../app/api/agent";
import { useAppDispatch } from "../../app/store/configureStore";
import { setBasket } from "../basket/basketSlice";
import { ValidationRules } from "./validationRules";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";

const steps = ["Shipping address", "Review your order", "Payment details"];

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return <AddressForm />;
    case 1:
      return <Review />;
    case 2:
      return <PaymentForm />;
    default:
      throw new Error("Unknown step");
  }
}

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [orderNumber, setOrderNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const currentValdationRule = ValidationRules[activeStep];
  const methods = useForm({
    mode: "all",
    resolver: yupResolver(currentValdationRule),
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleNext = async () => {
    const isValid = await methods.trigger();
    if (isValid) {
      const data: any = methods.getValues();
      if (activeStep === steps.length - 1) {
        const basket = await agent.Basket.get();
        if (basket) {
          const subTotal = calculateSubTotal(basket.items);
          const deliveryFee = 35000;

          try {
            setLoading(true);
            const orderDto = {
              basketId: basket.id,
              shippingAddress: {
                name: data.firstName + " " + data.lastName,
                address1: data.address1,
                address2: data.address2 || "",
                city: data.city,
                state: data.state,
                zipCode: data.zip,
                country: data.country,
              },
              subTotal: Math.round(subTotal),
              deliveryFee: deliveryFee,
              orderDate: new Date().toISOString(),
            };

            const orderId = await agent.Orders.create(orderDto);
            setOrderNumber(orderId);
            setActiveStep(activeStep + 1);
            agent.Basket.deleteBasket(basket.id);
            dispatch(setBasket(null));
            localStorage.removeItem("basket_id");
            localStorage.removeItem("basket");
          } catch (error) {
            console.error("Error submitting the order:", error);
            toast.error("Failed to submit the order. Please try again.");
          } finally {
            setLoading(false);
          }
        } else {
          console.error("Basket not found in local storage.");
          toast.error("Your cart is empty.");
        }
      } else {
        setActiveStep(activeStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const calculateSubTotal = (items: BasketItem[]): number => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <FormProvider {...methods}>
      <Box sx={{ pb: 8 }}>
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{ mb: { xs: 2, md: 4 }, fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" } }}
        >
          Checkout
        </Typography>

        {/* Stepper */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 1.5, sm: 2, md: 4 },
            borderRadius: { xs: 3, md: 4 },
            bgcolor: (theme) =>
              theme.palette.mode === "light"
                ? "#f5f5f5"
                : "rgba(255, 255, 255, 0.05)",
            mb: { xs: 2, md: 4 },
            overflow: "hidden",
          }}
        >
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              "& .MuiStepLabel-root .Mui-completed": {
                color: "secondary.main",
              },
              "& .MuiStepLabel-root .Mui-active": {
                color: "secondary.main",
              },
              "& .MuiStepConnector-line": {
                borderTopWidth: 3,
              },
              "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
                borderColor: "secondary.main",
              },
              "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
                borderColor: "secondary.main",
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    "& .MuiStepLabel-label": {
                      fontWeight: "bold",
                      mt: 1,
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Content */}
        {activeStep === steps.length ? (
          /* Success state */
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
            <CheckCircleIcon
              sx={{ fontSize: { xs: 56, md: 80 }, color: "success.main", mb: 2 }}
            />
            <Typography variant="h4" fontWeight="bold" gutterBottom
              sx={{ fontSize: { xs: "1.4rem", sm: "1.75rem", md: "2.125rem" } }}
            >
              Thank you for your order!
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 1, maxWidth: 500, mx: "auto" }}
            >
              Your order has been placed successfully.
            </Typography>
            <Typography
              variant="h6"
              color="secondary.main"
              fontWeight="bold"
              sx={{ mb: 4 }}
            >
              Order #{orderNumber}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 500, mx: "auto" }}
            >
              We have emailed your order confirmation and will send you an
              update when your order has shipped.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap", flexDirection: { xs: "column", sm: "row" } }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<ShoppingBagIcon />}
                onClick={() => navigate("/orders")}
                sx={{ borderRadius: 2, px: 4, py: 1.5, fontWeight: "bold", width: { xs: "100%", sm: "auto" } }}
              >
                View Orders
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                startIcon={<LocalShippingIcon />}
                onClick={() => navigate("/store")}
                sx={{ borderRadius: 2, px: 4, py: 1.5, fontWeight: "bold", width: { xs: "100%", sm: "auto" } }}
              >
                Continue Shopping
              </Button>
            </Box>
          </Paper>
        ) : (
          /* Step content */
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: { xs: 3, md: 4 },
              bgcolor: (theme) =>
                theme.palette.mode === "light"
                  ? "#f5f5f5"
                  : "rgba(255, 255, 255, 0.05)",
            }}
          >
            {getStepContent(activeStep)}

            {/* Navigation buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 4,
                pt: 3,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{
                  fontWeight: "bold",
                  visibility: activeStep === 0 ? "hidden" : "visible",
                }}
              >
                Back
              </Button>
              <LoadingButton
                loading={loading}
                variant="contained"
                color="secondary"
                onClick={handleNext}
                size="large"
                sx={{
                  px: { xs: 3, md: 4 },
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: "bold",
                  minWidth: { xs: 120, md: 160 },
                }}
              >
                {activeStep === steps.length - 1 ? "Place Order" : "Next"}
              </LoadingButton>
            </Box>
          </Paper>
        )}
      </Box>
    </FormProvider>
  );
}
