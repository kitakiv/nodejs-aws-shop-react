import { Alert, AlertTitle } from "@mui/material";

export default function AlertIcon(error: {
  message: string;
  statusCode: number;
}) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <Alert severity="error" onClose={() => {}}>
      <AlertTitle>Error {error.statusCode}</AlertTitle>
      {error.message}
    </Alert>
  );
}
