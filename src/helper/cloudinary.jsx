import { config } from "../config";

export const uploadToCloudinary = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", config.cloudinary.upload_preset);

  return fetch(config.cloudinary.url, {
    method: "POST",
    body: formData,
  }).then((response) => response.json());
};
