import { FC } from 'react';
import { Route, Routes } from 'react-router';
import './App.css';

import Landing from './pages/Landing';
import Login from './pages/Login';
import ClientSignUp from './pages/ClientSignUp';
import MainContent from './pages/MainContent';


const App: FC = () => {
  return (
    <div className="App flex justify-center">
      <div className='w-[1440px] bg-[#F5F5F5] min-h-[100vh]'>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/client-sign-up" element={<ClientSignUp />} />
          <Route path="/*" element={<MainContent />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
