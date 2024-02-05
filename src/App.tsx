import { FC } from "react";
import { Route, Routes } from "react-router";
import { ConfigProvider } from "antd";
import "./App.css";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import ClientSignUp from "./pages/ClientSignUp";
import MainContent from "./pages/MainContent";
import URLRedirector from "./pages/URLRedirector";
import EmailVerifier from "./pages/EmailVerifier";
import AdminRoute from "./pages/admin/Route";

const App: FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Inter",
          fontWeightStrong: 500,
        },
      }}
    >
      <div className="w-full h-full App flex justify-center bg-[#EDECF2]">
        <div className="w-full h-full">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/client-sign-up/*" element={<ClientSignUp />} />
            <Route path="/cul/:id" element={<URLRedirector />} />
            <Route path="/verify/:token" element={<EmailVerifier />} />
            <Route path="/admin/*" element={<AdminRoute />} />
            <Route path="/*" element={<MainContent />} />
          </Routes>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default App;
