import { FC, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import APIInstance from '../api';

const EmailVerifier: FC = () => {
  const { token } = useParams();
  const navigator = useNavigate();

  useEffect(() => {
    APIInstance.post('auth/verify', { token }).then(() => {
      navigator('/campaign/all');
    }).catch(err => {
      console.log('error:', err);
      navigator('/');
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>Email Verifying...</div>
  );
};

export default EmailVerifier;