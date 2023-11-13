import { FC } from "react";
import { Routes, Route } from "react-router";
import { Link, useLocation } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/20/solid";

import Campaign from './Campaign';
import Admin from './admin';
import Logo from '../assets/logo/logo.png';
import Man from '../assets/image/Headshot 1.png';
import Rica from '../assets/image/rica.png';

const MainContent: FC = () => {
  const location = useLocation();

  return (
    <div className='flex min-h-[100vh] w-[1440px] relative'>
      <div className='w-[230px] px-2 py-8 flex flex-col border-r-[2px] border-[#7F8182] bg-[white] justify-between'>
        <div className='flex flex-col items-center justify-center'>
          <Link to="/">
            <img src={Logo} className='w-[40px] my-6' alt="logo" />
          </Link>

          <Link className={`w-full text-left my-3 text-[Inter] font-semibold rounded-[10px] px-4 py-3 flex ${location.pathname.indexOf('campaign') > -1 ? 'bg-[#2d2c2d] text-gray-200' : 'bg-white text-black'}`}
            to="/campaign/all">
            <HomeIcon className="mx-2 w-[20px]" />
            Dashboard
          </Link>
          <Link className={`w-full text-left my-3 text-[Inter] font-semibold rounded-[10px] px-4 py-3 flex ${location.pathname.indexOf('detail') > -1 ? 'bg-[#2d2c2d] text-gray-200' : 'bg-white text-black'}`}
            to="/detail">
            <HomeIcon className="mx-2 w-[20px]" />
            Campaigns
          </Link>
          <Link className={`w-full text-left my-3 text-[Inter] font-semibold rounded-[10px] px-4 py-3 flex ${location.pathname.indexOf('billing') > -1 ? 'bg-[#2d2c2d] text-gray-200' : 'bg-white text-black'}`}
            to="/billing">
            <HomeIcon className="mx-2 w-[20px]" />
            Billing
          </Link>
          <Link className={`w-full text-left my-3 text-[Inter] font-semibold rounded-[10px] px-4 py-3 flex ${location.pathname.indexOf('support') > -1 ? 'bg-[#2d2c2d] text-gray-200' : 'bg-white text-black'}`}
            to="/support">
            <HomeIcon className="mx-2 w-[20px]" />
            Support
          </Link>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <img src={Man} className='rounded-full' alt="avatar" />
          <Link className='text-[Inter] mb-12 mt-2 font-semibold' to="/settings">My Profile</Link>
        </div>
      </div>

      <div className='bg-[#F5F5F5] w-full px-[75px] py-[40px]'>
        <Routes>
          <Route path="/campaign/*" element={<Campaign />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </div>

      <div className="fixed right-[30px] bottom-[30px] w-[50px] h-[50px] cursor-pointer">
        <img src={Rica} alt="rica" className="rounded-full" />
      </div>
    </div>
  );
};

export default MainContent;