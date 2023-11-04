import { FC } from 'react';
import { Route, Routes } from 'react-router';
import './App.css';
import Landing from './pages/Landing';

const App: FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </div>
  );
}

export default App;
