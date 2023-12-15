import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router';

import { selectAuth } from '../../store/authSlice';
import APIInstance from '../../api';
import Loading from '../../components/Loading';
import AdminLogin from './Login';

const Admin: FC = () => {
  const navigator = useNavigate();
  const { isAdminAuthenticated, adminToken } = useSelector(selectAuth);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated) navigator('/admin/login');
    setLoading(true);
    APIInstance.post('/admin/auth/check', { token: adminToken }).then(() => {

    }).catch(err => {
      console.log('err:', err);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {loading && <Loading />}
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
      </Routes>
    </div>
  );
};

export default Admin;