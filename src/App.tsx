import { FC } from 'react';
import { Route, Routes } from 'react-router';
import './App.css';

import Landing from './pages/Landing';
import Login from './pages/Login';
import ClientSignUp from './pages/ClientSignUp';

const App: FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="client-sign-up" element={<ClientSignUp />} />
      </Routes>
    </div>
  );
}

export default App;
