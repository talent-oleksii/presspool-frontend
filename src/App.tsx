import { FC } from 'react';
import { Route, Routes } from 'react-router';
import { ConfigProvider } from 'antd';
import './App.css';

import Landing from './pages/Landing';
import Login from './pages/Login';
import ClientSignUp from './pages/ClientSignUp';
import MainContent from './pages/MainContent';
import URLRedirector from './pages/URLRedirector';


const App: FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Inter"
        }
      }}
    >
      <div className="App flex justify-center bg-[#EDECF2]">
        <div className='w-screen min-h-screen'>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/client-sign-up" element={<ClientSignUp />} />
            <Route path="/cul/:id" element={<URLRedirector />} />
            <Route path="/*" element={<MainContent />} />
          </Routes>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default App;
