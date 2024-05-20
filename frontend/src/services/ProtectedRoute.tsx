import { useAuthServiceContext } from "../context/AuthServiceContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthServiceContext();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace={true} />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
