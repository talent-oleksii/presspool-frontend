import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import CreatorLogin from "./login";
import CreatorSignUp from "./signup";
import Onboarding from "./onboarding";
import CreatorAuth from "../../utils/creatorauth.utils";
import CreatorLayout from "./Layout";
import CreatorDashboard from "./dashboard";
import CreatorReporting from "./reporting";
import CreatorProfile from "./profile";

const GuestCreatorRoutes = () => {
  const isAuthenticated = new CreatorAuth().isAuthenticated();
  return !isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={"/publishers/dashboard"} />
  );
};
const ProtectedRouteWithoutLayout = () => {
  const isAuthenticated = new CreatorAuth().isAuthenticated();
  return isAuthenticated ? <Outlet /> : <Navigate to={`/publishers/login`} />;
};

const ProtectedRouteWithLayout = () => {
  const isAuthenticated = new CreatorAuth().isAuthenticated();
  return isAuthenticated ? (
    <CreatorLayout>
      <Outlet />
    </CreatorLayout>
  ) : (
    <Navigate to={`/publishers/login`} />
  );
};

const CreatorBaseRouteRedirection = () => {
  const isAuthenticated = new CreatorAuth().isAuthenticated();
  return isAuthenticated ? (
    <Navigate to={"/publishers/dashboard"} />
  ) : (
    <Navigate to={`/publishers/login`} />
  );
};

const CreatorRoute = () => {
  return (
    <Routes>
      <Route element={<GuestCreatorRoutes />}>
        <Route path="/login" element={<CreatorLogin />} />
        <Route path="/signup" element={<CreatorSignUp />} />
      </Route>
      {/* <Route element={<ProtectedRouteWithoutLayout />}> */}
      <Route path="/:creatorId/onboarding" element={<Onboarding />} />
      {/* </Route> */}
      <Route element={<ProtectedRouteWithLayout />}>
        <Route path="/reporting/:id" element={<CreatorReporting />} />
        <Route path="/dashboard" element={<CreatorDashboard />} />
        <Route path="/profile" element={<CreatorProfile />} />
      </Route>
      <Route path="/" element={<CreatorBaseRouteRedirection />} />
    </Routes>
  );
};

export default CreatorRoute;
