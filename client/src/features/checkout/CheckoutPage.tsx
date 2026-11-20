import { Check } from "@mui/icons-material";
import { Alert, Box, Button, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import agent, { errorMessage, errorStatus } from "../../app/api/agent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import AddressForm from "./AddressForm";
import Review from "./Review";
import { addressSchema, type AddressFields } from "./validationRules";

export default function CheckoutPage() {
  const basket = useAppSelector(state => state.basket.basket);
  const dispatch = useAppDispatch();
  const [review, setReview] = useState(false);
  const [orderId, setOrderId] = useState<number>();
  const [busy, setBusy] = useState(false);
  const [conflict, setConflict] = useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(false);
  const methods = useForm<AddressFields>({ resolver: yupResolver(addressSchema) });

  async function placeOrder(data: AddressFields) {
    if (!review) {
      setReview(true);
      return;
    }
    if (!basket || inFlight.current || conflict) return;
    inFlight.current = true;
    setBusy(true);
    setError("");
    try {
      const id = await agent.Orders.create({
        basketId: basket.id,
        shippingAddress: {
          name: `${data.firstName} ${data.lastName}`,
          address1: data.address1,
          address2: data.address2,
          city: data.city,
          state: data.state,
          zipCode: data.zip,
          country: data.country,
        },
        items: basket.items.map(item => ({ productId: item.id, quantity: item.quantity, unitPrice: item.price })),
      });
      setOrderId(id);
      await agent.Basket.clear(basket.id, dispatch);
    } catch (error) {
      setConflict(errorStatus(error) === 409);
      setError(errorMessage(error, "Could not confirm the order. You can safely retry."));
    } finally {
      setBusy(false);
      inFlight.current = false;
    }
  }

  async function refreshBasket() {
    if (!basket || inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    try {
      const items = await Promise.all(basket.items.map(async (item) => {
        try {
          const product = await agent.Store.details(item.id);
          return { ...product, quantity: Math.min(item.quantity, product.stock) };
        } catch (error) {
          if (errorStatus(error) === 404) return null;
          throw error;
        }
      }));
      await agent.Basket.replace(items.flatMap(item => item && item.quantity > 0 ? [item] : []), dispatch);
      setConflict(false);
      setError("");
    } catch {
      setError("Could not refresh the basket. Try again.");
    } finally {
      setBusy(false);
      inFlight.current = false;
    }
  }

  if (orderId) return (
    <div className="av-page">
      <section className="av-panel av-empty av-confirmation" aria-live="polite">
        <span className="av-confirmation-icon"><Check /></span>
        <h1 className="av-display">ORDER PLACED.</h1>
        <p>Demo order #{orderId}. No payment or delivery.</p>
        <Link className="av-action" to={`/orders/${orderId}`}>View order</Link>
        <Link className="av-text-link" to="/store">Continue shopping</Link>
      </section>
    </div>
  );

  if (!basket) return (
    <div className="av-page">
      <section className="av-panel av-empty">
        <h1 className="av-display">YOUR BAG IS EMPTY.</h1>
        <Link className="av-action" to="/store">Back to the shop</Link>
      </section>
    </div>
  );

  return (
    <div className="av-page av-checkout">
      <div className="av-page-intro"><h1 className="av-display">CHECKOUT.</h1></div>
      <Alert severity="info">This is a demo. Use a sample address. No payment or delivery will take place.</Alert>
      <ol className="av-steps" aria-label="Checkout steps">
        <li aria-current={review ? undefined : "step"}><span>{review ? <Check fontSize="small" /> : "1"}</span> Shipping address</li>
        <li aria-current={review ? "step" : undefined}><span>2</span> Review order</li>
      </ol>
      <div className="av-checkout-layout">
      <section className="av-panel av-checkout-form" aria-label={review ? "Confirm address" : "Shipping address"}>
        <FormProvider {...methods}>
          <Box component="form" onSubmit={methods.handleSubmit(placeOrder)} noValidate>
            {review ? <div className="av-address-review">
              <h2>Shipping address</h2>
              <address>
                {methods.getValues("firstName")} {methods.getValues("lastName")}<br />
                {methods.getValues("address1")}<br />
                {methods.getValues("address2") && <>{methods.getValues("address2")}<br /></>}
                {methods.getValues("city")}, {methods.getValues("state")} {methods.getValues("zip")}<br />
                {methods.getValues("country")}
              </address>
            </div> : <AddressForm />}
            {error && <Alert sx={{ mt: 2 }} severity="error">{error}</Alert>}
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
              {review ? <Button color="secondary" disabled={busy} onClick={() => setReview(false)}>Edit address</Button>
                : <Button color="secondary" component={Link} to="/basket">Back to bag</Button>}
              {review && conflict ?
                <LoadingButton loading={busy} variant="contained" onClick={refreshBasket}>Refresh basket</LoadingButton> :
                <LoadingButton loading={busy} type="submit" variant="contained">{review ? "Place demo order" : "Review order"}</LoadingButton>}
            </Stack>
          </Box>
        </FormProvider>
      </section>
      <aside className="av-panel av-summary" aria-label="Order summary"><Review /></aside>
      </div>
    </div>
  );
}
