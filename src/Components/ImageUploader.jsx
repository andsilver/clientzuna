/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function ImageUploader({
  title,
  onChange,
  setPreview,
  gutter = 16,
}) {
  const [file, setFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const [file] = acceptedFiles;
    setFile(file);
    onChange(file);
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    noClick: true,
  });

  useEffect(() => {
    if (!file) {
      return;
    }
    const objUrl = URL.createObjectURL(file);
    setPreview(objUrl);
  }, [file]);

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
