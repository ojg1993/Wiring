import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import React from "react";
import Explore from "./pages/Explore";
import ToggleColorMode from "./components/PrimaryAppBar/DarkMode/ToggleColorMode";
import Server from "./pages/Server";
import Login from "./pages/Login";
import { AuthServiceProvider } from "./context/AuthServiceContext";
import TestLogin from "./pages/TestLogin";
import ProtectedRoute from "./services/ProtectedRoute";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthServiceProvider>
        <ToggleColorMode>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/servers/:serverId/:channelId?"
              element={
                <ProtectedRoute>
                  <Server />
                </ProtectedRoute>
              }
            />
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
          </Routes>
        </ToggleColorMode>
      </AuthServiceProvider>
    </BrowserRouter>
  );
};

export default App;
