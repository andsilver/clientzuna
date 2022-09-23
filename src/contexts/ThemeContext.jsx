import { useMemo, useState, createContext, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useContext } from "react";

const getDesignTokens = (mode) => ({
  palette: {
    bright: {
      main: "#fff",
      contrastText: "#fff",
    },
    mode,
    ...(mode === "light"
      ? {
          primary: {
            main: "#333",
          },
          secondary: {
            main: "#5142FC",
          },
          divider: "#ddd",
          text: {
            primary: "#444",
          },
          warning: {
            main: "#ffa000",
          },
          success: { main: "#5fc67f" },
          error: { main: "#f1385a" },
          background: {
            default: "#fff",
            paper: "#fff",
          },
        }
      : {
          primary: {
            main: "#fff",
          },
          secondary: {
            main: "#5142FC",
          },
          divider: "#524d4d",
          text: {
            primary: "#fff",
          },
          warning: {
            main: "#ffa000",
          },
          success: {
            main: "#5fc67f",
          },
          error: {
            main: "#f1385a",
          },
          background: {
            default: "#14141F",
            paper: "#343444",
          },
        }),
  },
  typography: {
    fontFamily: "Urbanist, sans-serif",
    fontWeightLight: 400,
    fontWeight: 600,
    fontSize: 13,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "40px",
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
          },
          textTransform: "none",
          fontWeight: 700,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

createTheme({
  palette: {
    text: {},
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "40px",
          textTransform: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

const ColorModeContext = createContext({
  toggleColorMode: () => null,
});

export function ColorModeProvider({ children }) {
  const [theme, setTheme] = useState(
    localStorage.getItem("zunaverse:theme") || "light"
  );

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setTheme((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const materialTheme = useMemo(
    () => createTheme(getDesignTokens(theme)),
    [theme]
  );

  useEffect(() => {
    localStorage.setItem("zunaverse:theme", theme);
  }, [theme]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={materialTheme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export const useColorMode = () => useContext(ColorModeContext);
