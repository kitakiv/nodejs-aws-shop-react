import { Alert, AlertTitle } from "@mui/material";
import React from "react";

export default function AlertIcon(error: {
  message: string;
  statusCode: number;
}) {
  const [open, setOpen] = React.useState(true);
  return (
    open && (
      <Alert
        style={{
          position: "fixed",
          top: 10,
          right: 20,
          zIndex: 10,
          width: 300,
        }}
        severity="error"
        onClose={() => {
          setOpen(false);
        }}
      >
        <AlertTitle>Error {error.statusCode}</AlertTitle>
        {error.message}
      </Alert>
    ) || <></>
  );
}
