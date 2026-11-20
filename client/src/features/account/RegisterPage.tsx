import { Alert, Box, TextField } from "@mui/material";
import { CheckCircleOutline, RadioButtonUnchecked } from "@mui/icons-material";
import { visuallyHidden } from "@mui/utils";
import { LoadingButton } from "@mui/lab";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import agent, { errorMessage } from "../../app/api/agent";
import type { Registration } from "../../app/models/user";
import AccountLayout, { AccountAlternate } from "./AccountLayout";
import PasswordField from "./PasswordField";
import { passwordRules, validatePassword } from "./passwordRules";

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Registration>({
    mode: "onChange",
    defaultValues: { password: "" },
  });
  const password = useWatch({ control, name: "password" });
  const checklist = passwordRules.map(rule => ({ label: rule.label, met: !!password && rule.check(password) }));
  const metCount = checklist.filter(rule => rule.met).length;
  const { ref: passwordRef, ...passwordField } = register("password", { validate: validatePassword });

  async function submit(values: Registration) {
    setError("");
    try {
      await agent.Account.register(values);
      navigate("/login", { replace: true, state: { from: location.state?.from, registered: true } });
    } catch (error) {
      setError(errorMessage(error, "Could not register. Please check your details and try again."));
    }
  }

  return (
    <AccountLayout title="Create your account." description="Save your demo orders and come back to check their status.">
      <Box component="form" className="av-auth-form" onSubmit={handleSubmit(submit)}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField fullWidth required label="Username" autoComplete="username"
          helperText="3–32 letters, numbers, underscores or hyphens."
          inputProps={{ minLength: 3, maxLength: 32, pattern: "[a-zA-Z0-9_\\-]+" }} {...register("username")} />
        <TextField fullWidth required label="Email" type="email" autoComplete="email"
          inputProps={{ maxLength: 254 }} {...register("email")} />
        <PasswordField fullWidth required id="register-password" autoComplete="new-password"
          inputRef={passwordRef} {...passwordField}
          error={!!errors.password} helperText={errors.password?.message}
          inputProps={{ "aria-describedby": errors.password ? "password-rules register-password-helper-text" : "password-rules" }} />
        <div className="av-password-rules" id="password-rules">
          <p>Password requirements <span role="status">{metCount} of {checklist.length} met</span></p>
          <ul>
            {checklist.map(rule => <li key={rule.label} data-met={rule.met}>
              {rule.met ? <CheckCircleOutline aria-hidden="true" /> : <RadioButtonUnchecked aria-hidden="true" />}
              <span>{rule.label}</span>
              <Box component="span" sx={visuallyHidden}>{rule.met ? "Met" : "Not met"}</Box>
            </li>)}
          </ul>
        </div>
        <LoadingButton fullWidth type="submit" loading={isSubmitting} variant="contained">Create account</LoadingButton>
      </Box>
      <AccountAlternate to="/login" state={{ from: location.state?.from }} question="Already registered?" label="Sign in" />
    </AccountLayout>
  );
}
