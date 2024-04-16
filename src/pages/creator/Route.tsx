import { Route, Routes } from 'react-router';

import CreatorLogin from './Login';
import CreatorSignUp from './SignUp';
import Creator from '.';

const CreatorRoute = () => {
  return (
    <Routes>
      <Route path="/login" element={<CreatorLogin />} />
      <Route path="/signup" element={<CreatorSignUp />} />
      <Route path="/*" element={<Creator />} />
    </Routes>
  );
};

export default CreatorRoute;