import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";

interface Props {
  message?: string;
}
export default function Spinner({ message = "Loading..." }: Props) {
  return (
    <Backdrop open={true} invisible={true} sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress size={80} color="secondary" thickness={4} />
        <Typography variant="h5" sx={{ mt: 3, fontWeight: 'bold', letterSpacing: 2, color: 'secondary.main' }}>
          {message}
        </Typography>
      </Box>
    </Backdrop>
  );
}
