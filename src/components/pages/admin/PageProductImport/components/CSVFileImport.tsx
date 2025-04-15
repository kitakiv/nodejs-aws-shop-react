import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios, { AxiosRequestHeaders } from "axios";
import AlertIcon from "./alert";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();
  const [error, setError] = React.useState<{
    message: string;
    statusCode: number;
  } | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);
    try {
      if (!file) {
        throw new Error("No file selected");
      }
      // Get the presigned URL
      const header: AxiosRequestHeaders = localStorage.getItem(
        "authorization_token"
      )
        ? {
            Authorization: `Basic ${localStorage.getItem(
              "authorization_token"
            )}`,
          }
        : {};

      const response = await axios({
        method: "GET",
        url,
        params: {
          name: encodeURIComponent(file.name),
        },
        headers: header,
      });
      console.log("File to upload: ", file.name);
      console.log("Uploading to: ", response.data);
      const result = await fetch(response.data, {
        method: "PUT",
        body: file,
      });
      console.log("Result: ", result);
      setFile(undefined);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        setError({
          message: (
            (error.response as unknown as { data: { message: string } })
              .data as { message: string }
          ).message,
          statusCode: (
            (error.response as unknown as { data: { statusCode: number } })
              .data as { statusCode: number }
          ).statusCode,
        });
      } else if (error instanceof Error) {
        if (error.message.includes("status: 401")) {
          setError({
            message: "Unauthorized: You are not logged in",
            statusCode: 401,
          });
        } else if (error.message.includes("status: 403")) {
          setError({
            message:
              "Forbidden: You do not have permission to access this resource",
            statusCode: 403,
          });
        } else {
          setError({
            message: error.message,
            statusCode: 500,
          });
        }
      }
      console.error("Upload error:", error);
    }
  };
  return (
    <>
      <Box>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {!file ? (
          <input type="file" onChange={onFileChange} />
        ) : (
          <div>
            <button onClick={removeFile}>Remove file</button>
            <button onClick={uploadFile}>Upload file</button>
          </div>
        )}
      </Box>
      {error && <AlertIcon {...error} />}
    </>
  );
}
