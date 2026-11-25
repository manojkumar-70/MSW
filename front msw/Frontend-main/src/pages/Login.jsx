import {
  Box,
  Card,
  Typography,
  Container,
  TextField,
  FormControlLabel,
  Radio,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Avatar,
  Link,
  useTheme,
} from "@mui/material";
import { useContext, useRef, useState } from "react";
import { loginCall } from "../apiCalls";
import { AuthContext } from "../context/AuthContext";
import Image from "mui-image";
import Page from "../components/Page";
import { useSnackbar } from "notistack";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

import logger from "../utils/logger.js";
import LoginIllustration from "../assets/illustration_login";

const sidelogo = "/logo.svg";

const Login = () => {
  const RELEASE_ANNOUNCEMENT_SESSION_KEY = "showMsw20Announcement";
  const navigate = useNavigate();
  const location = useLocation();
  const email = useRef();
  const password = useRef();
  const { enqueueSnackbar } = useSnackbar();
  const { isFetching, dispatch } = useContext(AuthContext);
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const from = location.state?.from;
  const redirectParam = new URLSearchParams(location.search).get("redirect");

  const [isAdminDemoChecked, setIsAdminDemoChecked] = useState(false);
  const [isFacultyDemoChecked, setIsFacultyDemoChecked] = useState(false);
  const [isStudentDemoChecked, setIsStudentDemoChecked] = useState(false);

  const handleAdminDemoChange = (event) => {
    setIsAdminDemoChecked(event.target.checked);
    if (event.target.checked) {
      setIsStudentDemoChecked(false);
      setIsFacultyDemoChecked(false);
    } else {
      email.current.value = "";
      password.current.value = "";
    }
  };

  const handleFacultyDemoChange = (event) => {
    setIsFacultyDemoChecked(event.target.checked);
    if (event.target.checked) {
      setIsStudentDemoChecked(false);
      setIsAdminDemoChecked(false);
    } else {
      email.current.value = "";
      password.current.value = "";
    }
  };

  const handleStudentDemoChange = (event) => {
    setIsStudentDemoChecked(event.target.checked);
    if (event.target.checked) {
      setIsFacultyDemoChecked(false);
      setIsAdminDemoChecked(false);
    } else {
      email.current.value = "";
      password.current.value = "";
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginCall(
        { email: email.current.value, password: password.current.value },
        dispatch
      );
      sessionStorage.setItem(RELEASE_ANNOUNCEMENT_SESSION_KEY, "true");
      const savedRedirectPath = sessionStorage.getItem("postLoginRedirectPath");
      const redirectPath =
        redirectParam ||
        savedRedirectPath ||
        (from ? `${from.pathname || "/"}${from.search || ""}` : "/");

      sessionStorage.removeItem("postLoginRedirectPath");
      navigate(redirectPath, { replace: true });
    } catch (err) {
      logger.info(err);
      enqueueSnackbar(err?.response?.data?.message || "Login failed", {
        variant: "error",
      });
    }
  };

  return (
    <Page title="Login">
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 0 } }}>
        <Grid
          container
          spacing={{ xs: 1.5, md: 2 }}
          sx={{ minHeight: "100dvh", height: { md: "100vh" } }}
        >
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "center",
              p: 4,
            }}
          >
            <LoginIllustration sx={{ width: "100%", maxWidth: 540 }} />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              py: { xs: 3, sm: 4, md: 8 },
              px: { xs: 1, sm: 3, md: 8 },
              display: "flex",
              alignItems: { xs: "flex-start", md: "center" },
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <Box
                component="form"
                noValidate
                onSubmit={handleLogin}
                display="flex"
                flexDirection="column"
                width="100%"
                maxWidth={{ xs: "100%", sm: 460, md: 500 }}
                mx="auto"
              >
                <Stack spacing={{ xs: 2.5, sm: 3 }} mb={3}>
                  <Box
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                    mb={1}
                  >
                    <img
                      src={sidelogo}
                      alt="MSW Logo"
                      style={{
                        width: "clamp(120px, 34vw, 150px)",
                        filter: "none",
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="h4"
                      component="h1"
                      fontWeight={700}
                      sx={{ fontSize: { xs: "1.75rem", sm: "2rem" }, mb: 0.75 }}
                    >
                      Welcome Back :)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      To keep connected with us please login with your email address and password.
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: { xs: "flex", md: "none" },
                      justifyContent: "center",
                      width: "100%",
                      mt: -0.5,
                      mb: 0.5,
                    }}
                  >
                    <LoginIllustration sx={{ width: "100%", maxWidth: 320 }} />
                  </Box>
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    inputRef={email}
                    autoComplete="email"
                  />
                  <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    inputRef={password}
                    autoComplete="current-password"
                  />

                  <Box display="flex" justifyContent="flex-end">
                    <Link component={RouterLink} to="/forgot-password" underline="hover">
                      Forgot Password?
                    </Link>
                  </Box>

                  {/* <Stack direction="row" justifyContent="space-between">
                    <FormControlLabel
                      control={
                        <Radio
                          checked={isAdminDemoChecked}
                          onChange={handleAdminDemoChange}
                          name="adminDemo"
                        />
                      }
                      label="Admin"
                    />
                    <FormControlLabel
                      control={
                        <Radio
                          checked={isFacultyDemoChecked}
                          onChange={handleFacultyDemoChange}
                          name="faculty"
                        />
                      }
                      label="Faculty"
                    />
                    <FormControlLabel
                      control={
                        <Radio
                          checked={isStudentDemoChecked}
                          onChange={handleStudentDemoChange}
                          name="studentDemo"
                        />
                      }
                      label="Student"
                    />
                  </Stack> */}

                  <Button
                    type="submit"
                    variant="contained"
                    color={isLight ? "primary" : "info"}
                    size="large"
                    fullWidth
                    disabled={isFetching}
                    sx={{ borderRadius: 999, py: 1.4 }}
                    startIcon={
                      isFetching ? <CircularProgress size={20} /> : null
                    }
                  >
                    {isFetching ? "Signing in..." : "Login Now"}
                  </Button>
                </Stack>

              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Login;
