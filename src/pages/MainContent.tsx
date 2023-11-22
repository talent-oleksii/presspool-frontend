import { FC, useEffect, useState } from "react";
import { Routes, Route } from "react-router";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { HiLogout, HiHome, HiSpeakerphone, HiClipboardList, HiSupport } from 'react-icons/hi';
import { Avatar } from 'antd';
import { setUnauthenticated, selectAuth, setAuthenticated, setUserData } from '../store/authSlice';

import Dashboard from './dashboard';
import Billing from './billing';
import Support from "./support";
import Detail from './campaign';
import Admin from './admin';
import Logo from '../assets/logo/logo.png';
import APIInstance from "../api";
import Loading from "../components/Loading";

const MainContent: FC = () => {
  const location = useLocation();
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { fullName, email } = useSelector(selectAuth);

  //auth check
  useEffect(() => {
    setLoading(true);
    APIInstance.post('auth/check', {
      email
    }).then(data => {
      const ret = data.data.records;
      if (ret.length < 1) {
        dispatch(setUnauthenticated());
        navigator('/login');
      } else {
        dispatch(setAuthenticated());
        dispatch(setUserData({
          email: ret[0]['fields']['Email'],
          name: ret[0]['fields']['First Name'],
          fullName: ret[0]['fields']['Full Name'],
          company: ret[0]['fields']['Company Name'],
          verified: Number(data.data['verified']) === 0 ? 'false' : 'true',
        }));
        navigator('/campaign/all');
      }
    }).catch(err => {
      dispatch(setUnauthenticated());
      navigator('/login');
    }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    dispatch(setUnauthenticated());
    navigator('/');
  };

  const getPlaceHolder = () => {
    const names = fullName.split(' ');
    if (names.length === 2) {
      return `${names[0].at(0)}${names[1].at(0)}`;
    } else if (names.length === 1) {
      return `${names[0].at(0)}`;
    } else {
      return '';
    }
  };

  return (
    <div className='flex min-h-screen w-[1440px] relative'>
      {loading && <Loading />}
      {!loading && <>
        <div className='w-[230px] px-2 py-8 flex flex-col border-r-[2px] border-[#7F8182] bg-[white] justify-between h-full fixed'>
          <div className='flex flex-col items-center justify-center'>
            <Link to="/">
              <img src={Logo} className='w-[40px] my-6' alt="logo" />
            </Link>

            <Link className={`w-full text-left my-3 font-[Inter] text-lg font-semibold rounded-[10px] px-4 py-3 flex items-center ${location.pathname.indexOf('campaign') > -1 ? 'bg-[#2d2c2d] text-gray-200' : 'bg-white text-black'}`}
              to="/campaign/all">
              <HiHome className="mx-2" />
              Dashboard
            </Link>
            <Link className={`w-full text-left my-3 font-[Inter] text-lg font-semibold rounded-[10px] px-4 py-3 flex items-center ${location.pathname.indexOf('detail') > -1 ? 'bg-[#2d2c2d] text-gray-200' : 'bg-white text-black'}`}
              to="/detail">
              <HiSpeakerphone className="mx-2" />
              Campaigns
            </Link>
            <Link className={`w-full text-left my-3 font-[Inter] text-lg font-semibold rounded-[10px] px-4 py-3 flex items-center ${location.pathname.indexOf('billing') > -1 ? 'bg-[#2d2c2d] text-gray-200' : 'bg-white text-black'}`}
              to="/billing">
              <HiClipboardList className="mx-2" />
              Billing
            </Link>
            <Link className={`w-full text-left my-3 font-[Inter] text-lg font-semibold rounded-[10px] px-4 py-3 flex items-center ${location.pathname.indexOf('support') > -1 ? 'bg-[#2d2c2d] text-gray-200' : 'bg-white text-black'}`}
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

        <div className='bg-[#F5F5F5] w-full px-[75px] py-[40px] ml-[230px]'>
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
            <Avatar className="bg-[#6c63ff]" alt={getPlaceHolder()} size="large">
              {getPlaceHolder()}
            </Avatar>
            <p className="text-gray-800 mx-3 font-[Inter] font-semibold text-[14px]">{fullName}</p>
          </Link>
        </div>
      </>
      }
    </div>
  );
};

export default MainContent;