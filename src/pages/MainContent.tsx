import { FC, useEffect, useState } from "react";
import { Routes, Route } from "react-router";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { HiLogout, HiHome, HiSpeakerphone, HiClipboardList, HiSupport, HiPlus } from 'react-icons/hi';
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
    if (location.pathname.indexOf('campaign') > -1) return 'translate-y-0';
    if (location.pathname.indexOf('detail') > -1) return 'translate-y-16 2xl:translate-y-[4.33rem]';
    if (location.pathname.indexOf('billing') > -1) return 'translate-y-32 2xl:translate-y-[8.67rem]';
    if (location.pathname.indexOf('support') > -1) return 'translate-y-48 2xl:translate-y-52';
  };

  const getOffsetColor = () => {
    if (location.pathname.indexOf('campaign') > -1) return 1;
    if (location.pathname.indexOf('detail') > -1) return 2;
    if (location.pathname.indexOf('billing') > -1) return 3;
    if (location.pathname.indexOf('support') > -1) return 4;
  };

  return (
    <div className='min-h-screen w-full relative'>
      {loading && <Loading />}
      {!loading && <>
        <div className='w-[230px] px-2 py-8 flex flex-col border-r-[2px] border-[#7F8182] bg-[white] justify-between h-full fixed'>
          <div className='flex flex-col items-center justify-center'>
            <Link to="/">
              <img src={Logo} className='w-[40px] my-6' alt="logo" />
            </Link>

            <button
              className="text-md 2xl:text-lg font-[Inter] flex items-center text-left py-4 px-3 w-full bg-[#6c63ff] rounded-[20px] my-2 text-white"
              onClick={() => setShowAddDialog(true)}
            >
              <HiPlus className="mx-2" />
              New Campaign
            </button>

            <div className="relative w-full">
              <Link className={`w-full text-left my-2 font-[Inter] text-md 2xl:text-lg rounded-[20px] px-3 py-4 flex items-center ${getOffsetColor() === 1 ? 'text-white' : 'text-black'} transition-colors duration-300`}
                to="/campaign/all">
                <HiHome className="mx-2" />
                Dashboard
              </Link>
              <Link className={`w-full text-left my-2 font-[Inter] text-md 2xl:text-lg rounded-[20px] px-3 py-4 flex items-center ${getOffsetColor() === 2 ? 'text-white' : 'text-black'} transition-colors duration-300`}
                to="/detail">
                <HiSpeakerphone className="mx-2" />
                Campaigns
              </Link>
              <Link className={`w-full text-left my-2 font-[Inter] text-md 2xl:text-lg rounded-[20px] px-3 py-4 flex items-center ${getOffsetColor() === 3 ? 'text-white' : 'text-black'} transition-colors duration-300`}
                to="/billing">
                <HiClipboardList className="mx-2" />
                Billing
              </Link>
              <Link className={`w-full text-left my-2 font-[Inter] text-md 2xl:text-lg rounded-[20px] px-3 py-4 flex items-center ${getOffsetColor() === 4 ? 'text-white' : 'text-black'} transition-colors duration-300`}
                to="/support">
                <HiSupport className="mx-2" />
                Support
              </Link>

              <div className={`absolute h-14 bg-black w-full rounded-[20px] top-2 -z-[1] transition-transform duration-300 transform ${getOffsetBack()}`} />
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

        <div className='bg-[#F5F5F5] px-[40px] py-[20px] ml-[230px]'>
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