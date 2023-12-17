import { Route, Routes } from "react-router";
import AdminLogin from "./Login";
import Admin from ".";

const AdminRoute = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/*" element={<Admin />} />
    </Routes>
  );
};

export default AdminRoute;