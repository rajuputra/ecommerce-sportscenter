import { VisibilityOutlined, VisibilityOffOutlined } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField, type TextFieldProps } from "@mui/material";
import { useState } from "react";

export default function PasswordField(props: TextFieldProps) {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      {...props}
      label="Password"
      type={visible ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              type="button"
              edge="end"
              aria-label={visible ? "Hide password" : "Show password"}
              onMouseDown={event => event.preventDefault()}
              onClick={() => setVisible(value => !value)}
              sx={{ width: 44, height: 44 }}
            >
              {visible ? <VisibilityOffOutlined fontSize="small" /> : <VisibilityOutlined fontSize="small" />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
