import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useAuthServiceContext } from "../context/AuthServiceContext";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
} from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthServiceContext();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validate: (values) => {
      const errors: Partial<typeof values> = {};
      if (!values.username) {
        errors.username = "Required";
      }
      if (!values.password) {
        errors.password = "Required";
      }
      return errors;
    },
    onSubmit: async (values) => {
      const { username, password } = values;
      const res = await login(username, password);

      if (res === 401) {
        console.log("Authentication failed");
        formik.setErrors({
          username: "Invalid username or password",
          password: "Invalid username or password",
        });
      } else {
        navigate("/");
      }
    },
  });
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          marginTop: 8,
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          noWrap
          sx={{ fontWeight: 500, pb: 2 }}
        >
          Sign in
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
          <TextField
            id="username"
            name="username"
            autoFocus
            fullWidth
            label="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={!!formik.touched.username && !!formik.errors.username}
            helperText={formik.touched.username && formik.errors.username}
          ></TextField>
          <TextField
            fullWidth
            margin="normal"
            type="password"
            id="password"
            name="password"
            label="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={!!formik.touched.password && !!formik.errors.password}
            helperText={formik.touched.password && formik.errors.password}
          ></TextField>
          <Button
            fullWidth
            disableElevation
            type="submit"
            variant="contained"
            sx={{
              mt: 1,
              mb: 2,
              backgroundColor: "grey",
              ":hover": { backgroundColor: "black" },
            }}
          >
            Login
          </Button>
          <Box
            sx={{
              display: "flex",
              textAlign: "center",
              justifyContent: "center",
            }}
          >
            <Link href="/register" sx={{ textDecoration: "none" }}>
              <Typography color="primary">Don't have an account?</Typography>
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
