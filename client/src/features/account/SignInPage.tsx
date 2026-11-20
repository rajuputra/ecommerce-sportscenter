import { Alert, Box, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import agent, { errorMessage, storeToken } from "../../app/api/agent";
import { useAppDispatch } from "../../app/store/configureStore";
import type { Credentials } from "../../app/models/user";
import { setProfile } from "./accountSlice";
import AccountLayout, { AccountAlternate } from "./AccountLayout";
import PasswordField from "./PasswordField";

export default function SignInPage() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<Credentials>();
  const { ref: passwordRef, ...passwordField } = register("password");

  async function submit(values: Credentials) {
    setError("");
    try {
      const { token, ...profile } = await agent.Account.login(values);
      storeToken(token);
      dispatch(setProfile(profile));
    } catch (error) {
      setError(errorMessage(error, "Unable to sign in. Check your credentials and try again."));
    }
  }

  return (
    <AccountLayout title="Welcome back." description="Sign in to pick up your checkout or see your orders.">
      <Box component="form" className="av-auth-form" onSubmit={handleSubmit(submit)}>
        {location.state?.registered && <Alert severity="success">Your account is ready. Sign in to continue.</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <TextField fullWidth required label="Username" autoComplete="username"
          inputProps={{ maxLength: 32 }} {...register("username")} />
        <PasswordField fullWidth required autoComplete="current-password"
          inputProps={{ maxLength: 72 }} inputRef={passwordRef} {...passwordField} />
        <LoadingButton fullWidth type="submit" loading={isSubmitting} variant="contained">Sign in</LoadingButton>
      </Box>
      <AccountAlternate to="/register" state={{ from: location.state?.from }} question="New to Avero?" label="Create an account" />
    </AccountLayout>
  );
}
