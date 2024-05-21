import { useAuthServiceContext } from "../context/AuthServiceContext";
import { useState } from "react";
import { BASE_URL } from "../config";
import useAxiosWithInterceptor from "../helpers/jwtinterceptor";

const TestLogin = () => {
  const jwtAxios = useAxiosWithInterceptor();
  const { isAuthenticated, logout } = useAuthServiceContext();
  const [username, setUsername] = useState("");
  const getUserDetails = async () => {
    try {
      const response = await jwtAxios.get(
        // `${BASE_URL}/account/?user_id=${userId}`,
        `${BASE_URL}/account/?user_id=1`,
        { withCredentials: true }
      );
      const userDetails = response.data;
      setUsername(userDetails.username);
    } catch (error) {
      return error;
    }
  };

  return (
    <>
      <div>{isAuthenticated.toString()}</div>
      <div>
        <button onClick={logout}>Logout</button>
        <button onClick={getUserDetails}>Get User Details</button>
      </div>
      <div>Username: {username}</div>
    </>
  );
};

export default TestLogin;
