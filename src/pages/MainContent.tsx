import { FC, useEffect, useState } from "react";
import { Routes, Route } from "react-router";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { HiLogout, HiHome, HiSpeakerphone, HiClipboardList, HiSupport, HiPlus } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { Avatar } from 'antd';
import { setUnauthenticated, selectAuth, setAuthenticated, setUserData } from '../store/authSlice';

import CreateCampaign from "./dashboard/CreateCampaign";
import Dashboard from './dashboard';
import Billing from './billing';
import Support from "./support";
import Detail from './campaign';
import Admin from './admin';
import Logo from '../assets/logo/logo.png';
import APIInstance from "../api";
import Loading from "../components/Loading";
import { addCampaign, setCampaign } from "../store/dataSlice";
import { FADE_UP_ANIMATION_VARIANTS } from "../utils/TransitionConstants";

const MainContent: FC = () => {
  const location = useLocation();
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
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

        Promise.all([
          APIInstance.get('data/campaign', { params: { email } }),
        ]).then((results: Array<any>) => {
          dispatch(setCampaign({ campaign: results[0].data }));
        }).catch(err => {
          console.log('err:', err);
        }).finally(() => setLoading(false));

        navigator('/campaign/all');
      }
    }).catch(err => {
      dispatch(setUnauthenticated());
      navigator('/login');
    }).finally();
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

  const getOffsetBack = () => {
    if (location.pathname.indexOf('campaign') > -1) return 'top-0';
    if (location.pathname.indexOf('detail') > -1) return 'top-[25%]';
    if (location.pathname.indexOf('billing') > -1) return 'top-[50%]';
    if (location.pathname.indexOf('support') > -1) return 'top-[75%]';
  };

  // const getOffsetColor = () => {
  //   if (location.pathname.indexOf('campaign') > -1) return 1;
  //   if (location.pathname.indexOf('detail') > -1) return 2;
  //   if (location.pathname.indexOf('billing') > -1) return 3;
  //   if (location.pathname.indexOf('support') > -1) return 4;
  // };

  return (
    <div className='min-h-screen w-full relative'>
      {loading && <Loading />}
      {!loading &&
        <>
          <div className='w-[210px] pl-2 py-8 flex flex-col justify-between h-full fixed'>
            <div className='flex flex-col items-center justify-center'>
              <Link to="/" className="text-left w-full pl-3 mb-5">
                <img src={Logo} className='w-[25px] my-2' alt="logo" />
              </Link>

              <button
                className="text-sm 2xl:text-base font-[Inter] flex items-center text-left py-3 px-3 w-full bg-[#6c63ff] rounded-[15px] my-4 text-white"
                onClick={() => setShowAddDialog(true)}
              >
                <HiPlus className="mx-2" />
                New Campaign
              </button>

              <div className="relative w-full">
                <Link className={`w-full text-left my-1.5 font-[Inter] text-sm 2xl:text-base rounded-[20px] px-3 py-2.5 flex items-center text-black`}
                  to="/campaign/all">
                  <HiHome className="mx-2" />
                  Dashboard
                </Link>
                <Link className={`w-full text-left my-1.5 font-[Inter] text-sm 2xl:text-base rounded-[20px] px-3 py-2.5 flex items-center text-black`}
                  to="/detail">
                  <HiSpeakerphone className="mx-2" />
                  Campaigns
                </Link>
                <Link className={`w-full text-left my-1.5 font-[Inter] text-sm 2xl:text-base rounded-[20px] px-3 py-2.5 flex items-center text-black`}
                  to="/billing">
                  <HiClipboardList className="mx-2" />
                  Billing
                </Link>
                <Link className={`w-full text-left my-1.5 font-[Inter] text-sm 2xl:text-base rounded-[20px] px-3 py-2.5 flex items-center text-black`}
                  to="/support">
                  <HiSupport className="mx-2" />
                  Support
                </Link>

                <div className={`absolute h-1/4 bg-white w-full rounded-[15px] -z-[1] transition-all duration-500 transform ${getOffsetBack()}`} />
              </div>
            </div>
            <div className='flex flex-col items-center justify-left'>
              <div className="my-3">
                <Link to="/profile" className="flex items-center">
                  <Avatar className="bg-[#6c63ff]" alt={getPlaceHolder()} size="large">
                    {getPlaceHolder()}
                  </Avatar>
                  <p className="text-gray-800 mx-3 font-[Inter] font-semibold text-[14px]">{fullName}</p>
                </Link>
              </div>
              <div className="flex items-center justify-left border-t-[1px] py-5">
                <HiLogout className="mx-4" />
                <button className='text-[Inter] font-semibold' onClick={handleLogout}>Log Out</button>
              </div>
            </div>
          </div>

          <div className='bg-[#EDECF2] px-[15px] py-[20px] ml-[210px]'>
            <Routes>
              <Route path="/campaign/:id" element={<Dashboard />} />
              <Route path="/detail" element={<Detail />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/support" element={<Support />} />
              <Route path="/admin/*" element={<Admin />} />
            </Routes>
          </div>
        </>
      }

      <CreateCampaign
        show={showAddDialog}
        setShow={(show: boolean) => setShowAddDialog(show)}
        afterAdd={(data: any) => {
          dispatch(addCampaign({ campaign: data }));
        }}
      />
    </div>
  );
};

export default MainContent;