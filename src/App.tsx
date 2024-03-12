import { FC, useEffect, useState } from "react";
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
  const [zoom, setZoom] = useState(1.5);

  const calculateZoom = (width: number) => {
    const maxZoom = 2,
      minZoom = 1,
      maxWidth = 3840;
    const zoomPerPixel = 2 / maxWidth;
    const calculatedZoom = zoomPerPixel * width;
    setZoom(
      calculatedZoom < minZoom
        ? minZoom
        : calculatedZoom > maxZoom
        ? maxZoom
        : calculatedZoom
    );
  };
  const handleResize = () => {
    const innerWidth = window.innerWidth;
    calculateZoom(innerWidth);
  };
  useEffect(() => {
    const innerWidth = window.innerWidth;
    calculateZoom(innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Inter",
          fontWeightStrong: 500,
        },
        components: {
          Menu: {
            itemHoverBg: "#7FFBAE",
            itemSelectedBg: "#7FFBAE",
            itemSelectedColor: "#000000",
            itemHeight: 32,
          },
          Table: {
            headerColor: "#43474A",
            cellFontSize: 12,
          },
        },
      }}
    >
      <div
        className="w-full h-full App flex justify-center bg-[#EDECF2]"
        style={{ zoom }}
      >
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
