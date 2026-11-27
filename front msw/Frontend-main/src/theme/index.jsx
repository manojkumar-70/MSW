import PropTypes from "prop-types";
import { useContext, useMemo } from "react";
// @mui
import { CssBaseline } from "@mui/material";
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";

//hooks
import useSettings from "../hooks/useSettings";

//Settings
import palette from "./palette";
import typography from "./typography";
import breakpoints from "./breakpoints";
import shadows, { customShadows } from "./shadows";

// ----------------------------------------------------------------------

ThemeProvider.propTypes = {
  children: PropTypes.node,
};

export default function ThemeProvider({ children }) {
  const { themeMode } = useSettings();
  const isLight = themeMode === "light";
  const themeOptions = useMemo(
    () => ({
      palette: isLight ? palette.light : palette.dark,
      typography,
      breakpoints,
      shape: { borderRadius: 12 },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 10,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)",
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 16,
              border: isLight ? "1px solid #E2E8F0" : "1px solid #323C52",
              boxShadow: isLight
                ? "0 1px 3px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.04)"
                : "0 4px 20px rgba(0, 0, 0, 0.25)",
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
      },
      shadows: isLight ? shadows.light : shadows.dark,
      customShadows: isLight ? customShadows.light : customShadows.dark,
      utils: {
        getColorByMode: (lightColor = 'primary', darkColor = 'info') => {
          return isLight ? lightColor : darkColor;
        }
      }
    }),
    [isLight]
  );

  const theme = createTheme(themeOptions);

  // Apply global theme object with dark mode color mapping
  theme.colorMode = isLight ? 'primary' : 'info';

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}
