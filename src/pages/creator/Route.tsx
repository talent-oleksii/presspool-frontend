import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import CreatorLogin from "./login";
import CreatorSignUp from "./signup";
import Onboarding from "./onboarding";
import Creator from "./Layout";
import CreatorAuth from "../../utils/creatorauth.utils";
import CreatorLayout from "./Layout";
import CreatorDashboard from "./dashboard";

const GuestCreatorRoutes = () => {
  const isAuthenticated = new CreatorAuth().isAuthenticated();
  return !isAuthenticated ? <Outlet /> : <Navigate to={"/creator/reporting"} />;
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
    <Navigate to={"/creator/reporting"} />
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
      </Route>
      <Route element={<ProtectedRouteWithoutLayout />}>
        <Route path="/:creatorId/onboarding" element={<Onboarding />} />
        <Route path="/*" element={<Creator />} />
      </Route>
      <Route element={<ProtectedRouteWithLayout />}>
        <Route path="/reporting/:id" element={<CreatorDashboard />} />
      </Route>
      <Route path="/" element={<CreatorBaseRouteRedirection />} />
    </Routes>
  );
};

export default CreatorRoute;
