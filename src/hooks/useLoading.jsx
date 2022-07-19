import { useState } from "react";
import { useSnackbar } from "../contexts/Snackbar";

export default function useLoading() {
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useSnackbar();

  const sendRequest = async (request, errorMessage) => {
    setLoading(true);

    try {
      const res = await request();
      setLoading(false);
      return res;
    } catch (err) {
      console.error(err);

      if (errorMessage) {
        showSnackbar({
          severity: "error",
          message: errorMessage,
        });
      }
    }
    setLoading(false);
  };

  return {
    loading,
    setLoading,
    sendRequest,
  };
}
