import { createContext } from "react";

interface DarkModeContextProps {
  toggleMode: () => void;
}

export const DarkModeContext = createContext<DarkModeContextProps>({
  toggleMode: () => {},
});
