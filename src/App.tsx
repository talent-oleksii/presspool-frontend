import { FC } from 'react';
import { Route, Routes } from 'react-router';
import './App.css';

import Landing from './pages/Landing';
import Login from './pages/Login';
import ClientSignUp from './pages/ClientSignUp';
import Campaign from './pages/Campaign';

const App: FC = () => {
  return (
    <div className="App flex justify-center">
      <div className='max-w-[1440px]'>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/client-sign-up" element={<ClientSignUp />} />
          <Route path="/campaign/*" element={<Campaign />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
