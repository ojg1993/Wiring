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
import Register from "./pages/Register";
import MembershipProvider from "./context/MembeshiprContext";
import MembershipCheck from "./components/Membership/MembershipCheck";

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
                  <MembershipProvider>
                    <MembershipCheck>
                      <Server />
                    </MembershipCheck>
                  </MembershipProvider>
                </ProtectedRoute>
              }
            />
            <Route path="/servers/:categoryName" element={<Explore />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
