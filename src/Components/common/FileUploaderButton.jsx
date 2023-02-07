/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@mui/material";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function FileUploadButton({
  title,
  onChange,
  gutter = 6,
  multiple = false,
  fileTypes = {
    "image/jpeg": [],
    "image/png": [],
    "image/gif": [],
    "image/jpg": [],
  },
}) {
  const onDrop = useCallback((acceptedFiles) => {
    const files = acceptedFiles;
    onChange(multiple ? files : files[0]);
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: fileTypes,
    multiple,
    noClick: true,
    useFsAccessApi: false,
  });

  return (
    <div
      {...getRootProps()}
      style={{ marginTop: gutter, marginBottom: gutter }}
    >
      <input {...getInputProps()} />
      <Button onClick={open} variant="contained" color="secondary">
        {title}
      </Button>
    </div>
  );
}
