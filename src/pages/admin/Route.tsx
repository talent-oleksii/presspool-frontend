import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import AdminLogin from "./Login";
import AdminSignUp from "./SignUp";
import Admin from ".";
import AdminAuth from "../../utils/adminauth.utils";
import AdminDashboard from "./Dashboard";
import AdminDashboardClient from "./dashboard/Client";
import AdminClient from "./Client";
import AdminClientCampaign from "./ClientCampaign";
import AdminMember from "./Member";
import AdminCampaign from "./Campaign";
import AdminBilling from "./Billing";
import AdminSupport from "./Support";
import TrainingHub from "./TrainingHub";
import AdminProfile from "./Profile";
import Publishers from "./Publishers";

const GuestAdminRoutes = () => {
  const isAuthenticated = new AdminAuth().isAuthenticated();
  return !isAuthenticated ? <Outlet /> : <Navigate to={"/admin/dashboard"} />;
};

const ProtectedRouteWithLayout = () => {
  const isAuthenticated = new AdminAuth().isAuthenticated();
  return isAuthenticated ? (
    <Admin>
      <Outlet />
    </Admin>
  ) : (
    <Navigate to={`/admin/login`} />
  );
};

const AdminBaseRouteRedirection = () => {
  const isAuthenticated = new AdminAuth().isAuthenticated();
  return isAuthenticated ? (
    <Navigate to={"/admin/dashboard"} />
  ) : (
    <Navigate to={`/admin/login`} />
  );
};

const AdminRoute = () => {
  return (
    <Routes>
      <Route element={<GuestAdminRoutes />}>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/signup" element={<AdminSignUp />} />
      </Route>
      <Route element={<ProtectedRouteWithLayout />}>
        <Route path="/dashboard/*" element={<AdminDashboard />} />
        <Route path="/client" element={<AdminDashboardClient />} />
        <Route path="/publishers" element={<Publishers />} />
        <Route
          path="/:accountManagerId/client"
          element={<AdminDashboardClient />}
        />
        <Route path="/client/:id" element={<AdminClient />} />
        <Route
          path="/client/:id/campaign/:campaignId"
          element={<AdminClientCampaign />}
        />
        <Route path="/member" element={<AdminMember />} />
        <Route path="/campaign" element={<AdminCampaign />} />
        <Route path="/billing" element={<AdminBilling />} />
        <Route path="/support" element={<AdminSupport />} />
        <Route path="/profile" element={<AdminProfile />} />
        <Route path="/training-hub" element={<TrainingHub />} />
      </Route>
      <Route path="/" element={<AdminBaseRouteRedirection />} />
    </Routes>
  );
};

export default AdminRoute;
