import { FC } from "react";
import { Routes, Route } from "react-router";
import { Link } from "react-router-dom";

import Campaign from './Campaign';
import Admin from './admin';
import Logo from '../assets/logo/logo.png';
import Man from '../assets/image/Headshot 1.png';

const MainContent: FC = () => {
  return (
    <div className='flex min-h-[100vh] w-[1440px]'>
      <div className='w-[150px] px-5 py-8 flex flex-col border-r-[2px] border-[#7F8182] bg-[white] justify-between'>
        <div className='flex flex-col'>
          <Link to="/">
            <img src={Logo} className='w-[80px] my-10' alt="logo" />
          </Link>

          <Link className='w-full text-left my-5 text-[Inter] font-semibold' to="/campaign/all">Dashboard</Link>
          <Link className='w-full text-left my-5 text-[Inter] font-semibold' to="/campaign/approve">Approve</Link>
          <Link className='w-full text-left my-5 text-[Inter] font-semibold' to="/campaign/reports">Reports </Link>
          <Link className='w-full text-left my-5 text-[Inter] font-semibold' to="/campaign/billing">Billing</Link>
          <Link className='w-full text-left my-5 text-[Inter] font-semibold' to="/campaign/support">Support</Link>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <img src={Man} className='rounded-full' alt="avatar" />
          <Link className='text-[Inter] my-9 font-semibold' to="/settings">Settings</Link>
        </div>
      </div>

      <div className='bg-[#F5F5F5] w-full px-[75px] py-[40px]'>
        <Routes>
          <Route path="/campaign/*" element={<Campaign />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </div>
    </div>
  );
};

export default MainContent;