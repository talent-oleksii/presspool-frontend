import { Route, Routes } from "react-router";

import CreatorLogin from "./login";
import CreatorSignUp from "./signup";
import Onboarding from "./onboarding";
import Creator from ".";

const CreatorRoute = () => {
  return (
    <Routes>
      <Route path="/login" element={<CreatorLogin />} />
      <Route path="/signup" element={<CreatorSignUp />} />
      <Route path="/:creatorId/onboarding" element={<Onboarding />} />
      <Route path="/*" element={<Creator />} />
    </Routes>
  );
};

export default CreatorRoute;
