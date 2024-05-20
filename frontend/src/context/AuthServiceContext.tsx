import { createContext, useContext } from "react";
import { AuthServiceProps } from "../@types/auth-service";
import { useAuthService } from "../services/AuthServices";

const AuthServiceContext = createContext<AuthServiceProps | null>(null);

export function AuthServiceProvider(props: React.PropsWithChildren) {
  const authServices = useAuthService();
  return (
    <AuthServiceContext.Provider value={authServices}>
      {props.children}
    </AuthServiceContext.Provider>
  );
}

export function useAuthServiceContext(): AuthServiceProps {
  const context = useContext(AuthServiceContext);
  if (context == null) {
    throw new Error(
      "useAuthServiceContext must be used within a AuthServiceProvider"
    );
  }
  return context;
}

export default AuthServiceProvider;
