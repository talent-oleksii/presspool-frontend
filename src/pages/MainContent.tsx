import { FC } from "react";
import { Routes, Route } from "react-router";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { HiLogout, HiHome, HiSpeakerphone, HiClipboardList, HiSupport } from 'react-icons/hi';
import { setUnauthenticated, selectAuth } from '../store/authSlice';

import Dashboard from './dashboard';
import Billing from './billing';
import Support from "./support";
import Detail from './campaign';
import Admin from './admin';
import User from '../assets/image/Headshot 1.png';
import Logo from '../assets/logo/logo.png';
import Rica from '../assets/image/rica.png';

const MainContent: FC = () => {
  const location = useLocation();
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const { email, fullName } = useSelector(selectAuth);
  console.log('d:', email, fullName);

  const handleLogout = () => {
    dispatch(setUnauthenticated());
    navigator('/');
  };

  return (
    <div className='flex min-h-[100vh] w-[1440px] relative'>
      <div className='w-[230px] px-2 py-8 flex flex-col border-r-[2px] border-[#7F8182] bg-[white] justify-between'>
        <div className='flex flex-col items-center justify-center'>
          <Link to="/">
            <img src={Logo} className='w-[40px] my-6' alt="logo" />
          </Link>

          <Link className={`w-full text-left my-3 text-[Inter] text-lg font-semibold rounded-[10px] px-4 py-3 flex items-center ${location.pathname.indexOf('campaign') > -1 ? 'bg-[#2d2c2d] text-gray-200' : 'bg-white text-black'}`}
            to="/campaign/all">
            <HiHome className="mx-2" />
            Dashboard
          </Link>
          <Link className={`w-full text-left my-3 text-[Inter] text-lg font-semibold rounded-[10px] px-4 py-3 flex items-center ${location.pathname.indexOf('detail') > -1 ? 'bg-[#2d2c2d] text-gray-200' : 'bg-white text-black'}`}
            to="/detail">
            <HiSpeakerphone className="mx-2" />
            Campaigns
          </Link>
          <Link className={`w-full text-left my-3 text-[Inter] text-lg font-semibold rounded-[10px] px-4 py-3 flex items-center ${location.pathname.indexOf('billing') > -1 ? 'bg-[#2d2c2d] text-gray-200' : 'bg-white text-black'}`}
            to="/billing">
            <HiClipboardList className="mx-2" />
            Billing
          </Link>
          <Link className={`w-full text-left my-3 text-[Inter] text-lg font-semibold rounded-[10px] px-4 py-3 flex items-center ${location.pathname.indexOf('support') > -1 ? 'bg-[#2d2c2d] text-gray-200' : 'bg-white text-black'}`}
            to="/support">
            <HiSupport className="mx-2" />
            Support
          </Link>
        </div>
        <div className='flex items-center justify-left border-t-[1px] py-9'>
          <HiLogout className="mx-4" />
          <button className='text-[Inter] font-semibold' onClick={handleLogout}>Log Out</button>
        </div>
      </div>

      <div className='bg-[#F5F5F5] w-full px-[75px] py-[40px]'>
        <Routes>
          <Route path="/campaign/*" element={<Dashboard />} />
          <Route path="/detail" element={<Detail />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/support" element={<Support />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </div>

      <div className="absolute right-[20px] top-[20px]">
        <Link to="/profile" className="flex items-center">
          <img src={User} alt="user" className="h-[40px] rounded-full" />
          <p className="text-gray-800 mx-3 font-[Inter] font-semibold text-[14px]">{fullName}</p>
        </Link>
      </div>
    </div>
  );
};

export default MainContent;