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
  return !isAuthenticated ? <Outlet /> : <Navigate to={"/creator/dashboard"} />;
};
//For future use
// const ProtectedRouteWithoutLayout = () => {
//   const isAuthenticated = new CreatorAuth().isAuthenticated();
//   return isAuthenticated ? <Outlet /> : <Navigate to={`/creator/login`} />;
// };

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
      <Route path="/:creatorId/onboarding" element={<Onboarding />} />
      <Route element={<GuestCreatorRoutes />}>
        <Route path="/login" element={<CreatorLogin />} />
        <Route path="/signup" element={<CreatorSignUp />} />
      </Route>
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
