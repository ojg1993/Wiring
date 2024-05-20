import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useAuthServiceContext } from "../context/AuthServiceContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthServiceContext();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      const { username, password } = values;
      const res = await login(username, password);

      if (res) {
        console.log(res);
      } else {
        navigate("/testlogin");
      }
    },
  });
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={formik.handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
        ></input>

        <label>Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
        ></input>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
