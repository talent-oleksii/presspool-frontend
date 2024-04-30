import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import CreatorLogin from "./login";
import CreatorSignUp from "./signup";
import Onboarding from "./onboarding";
import CreatorAuth from "../../utils/creatorauth.utils";
import CreatorLayout from "./Layout";
import CreatorDashboard from "./dashboard";
import CreatorReporting from "./reporting";

const GuestCreatorRoutes = () => {
  const isAuthenticated = new CreatorAuth().isAuthenticated();
  return !isAuthenticated ? <Outlet /> : <Navigate to={"/creator/dashboard"} />;
};

const ProtectedRouteWithoutLayout = () => {
  const isAuthenticated = new CreatorAuth().isAuthenticated();
  return isAuthenticated ? <Outlet /> : <Navigate to={`/creator/login`} />;
};

const ProtectedRouteWithLayout = () => {
  const isAuthenticated = new CreatorAuth().isAuthenticated();
  return isAuthenticated ? (
    <CreatorLayout>
      <Outlet />
    </CreatorLayout>
  ) : (
    <Navigate to={`/creator/login`} />
  );
};

const CreatorBaseRouteRedirection = () => {
  const isAuthenticated = new CreatorAuth().isAuthenticated();
  return isAuthenticated ? (
    <Navigate to={"/creator/dashboard"} />
  ) : (
    <Navigate to={`/creator/login`} />
  );
};

const CreatorRoute = () => {
  return (
    <Routes>
      <Route element={<GuestCreatorRoutes />}>
        <Route path="/login" element={<CreatorLogin />} />
        <Route path="/signup" element={<CreatorSignUp />} />
        <Route path="/:creatorId/onboarding" element={<Onboarding />} />
      </Route>
      <Route element={<ProtectedRouteWithoutLayout />}>
        <Route path="/*" element={<CreatorLayout />} />
      </Route>
      <Route element={<ProtectedRouteWithLayout />}>
        <Route path="/dashboard" element={<CreatorDashboard />} />
        <Route path="/reporting/:id" element={<CreatorReporting />} />
      </Route>
      <Route path="/" element={<CreatorBaseRouteRedirection />} />
    </Routes>
  );
};

export default CreatorRoute;
