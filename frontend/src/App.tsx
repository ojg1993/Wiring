import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import React from "react";
import Explore from "./pages/Explore";
import ToggleColorMode from "./components/PrimaryAppBar/DarkMode/ToggleColorMode";
import Server from "./pages/Server";
import Login from "./pages/Login";
import { AuthServiceProvider } from "./context/AuthServiceContext";
import TestLogin from "./pages/TestLogin";
import ProtectedRoute from "./services/ProtectedRoute";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Home />} />
      <Route path="/servers/:serverId/:channelId?" element={<Server />} />
      <Route path="/servers/:categoryName" element={<Explore />} />
      <Route path="/Login" element={<Login />} />
      <Route
        path="/testlogin"
        element={
          <ProtectedRoute>
            <TestLogin />
          </ProtectedRoute>
        }
      />
    </Route>
  )
);

const App: React.FC = () => {
  return (
    <AuthServiceProvider>
      <ToggleColorMode>
        <RouterProvider router={router} />
      </ToggleColorMode>
    </AuthServiceProvider>
  );
};

export default App;
