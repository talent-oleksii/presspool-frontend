import { FC, useEffect, useState } from "react";
import { Routes, Route } from "react-router";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Dropdown, MenuProps } from 'antd';
import { setUnauthenticated, selectAuth, setAuthenticated, setUserData } from '../store/authSlice';

import CreateCampaign from "./dashboard/CreateCampaign";
import Dashboard from './dashboard';
import Billing from './billing';
import Support from "./support";
import Detail from './campaign';
import Profile from './Profile';
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
  const { fullName, email, email_verified } = useSelector(selectAuth);

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
          email_verified: Number(data.data['email_verified']) === 0 ? 'false' : 'true',
        }));

        Promise.all([
          APIInstance.get('data/campaign', { params: { email } }),
        ]).then((results: Array<any>) => {
          dispatch(setCampaign({ campaign: results[0].data }));
        }).catch(err => {
          console.log('err:', err);
        }).finally(() => setLoading(false));

        if (location.pathname === '/')
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
    if (location.pathname.indexOf('campaign') > -1) return 'top-[1%]';
    if (location.pathname.indexOf('detail') > -1) return 'top-[25%]';
    if (location.pathname.indexOf('billing') > -1) return 'top-[50%]';
    if (location.pathname.indexOf('support') > -1) return 'top-[75%]';

    return 'top-0';
  };

  const profileItems: MenuProps['items'] = [{
    key: '1',
    label: (
      <Link to="/profile" className="font-[Inter] font-medium text-[8px] 2xl:text-xs flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-[8px] h-[8px] 2xl:w-[16px] 2xl:h-[16px] me-1">
          <path d="M480-380q45.231 0 82.923-20.577 37.693-20.577 62.154-54.808-31.154-22.077-67.846-33.346Q520.539-500 480-500q-40.539 0-77.231 11.269-36.692 11.269-67.846 33.346 24.461 34.231 62.154 54.808Q434.769-380 480-380Zm0-200q25.308 0 42.654-17.346Q540-614.692 540-640q0-25.308-17.346-42.654Q505.308-700 480-700q-25.308 0-42.654 17.346Q420-665.308 420-640q0 25.308 17.346 42.654Q454.692-580 480-580Zm0 460.769Q339-243.923 267.577-351.808q-71.423-107.884-71.423-196.346 0-126.923 82.654-209.385Q361.461-840 480-840t201.192 82.461q82.654 82.462 82.654 209.385 0 88.462-71.423 196.346Q621-243.923 480-119.231Z" />
        </svg>
        My Profile
      </Link>
    ),
  }, {
    key: '3',
    label: (
      <button className="font-[Inter] font-medium text-[8px] 2xl:text-xs flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-[8px] h-[8px] 2xl:w-[16px] 2xl:h-[16px] me-1">
          <path d="M450.001-290.001h59.998v-160h160v-59.998h-160v-160h-59.998v160h-160v59.998h160v160Zm30.066 190q-78.836 0-148.204-29.92-69.369-29.92-120.682-81.21-51.314-51.291-81.247-120.629-29.933-69.337-29.933-148.173t29.92-148.204q29.92-69.369 81.21-120.682 51.291-51.314 120.629-81.247 69.337-29.933 148.173-29.933t148.204 29.92q69.369 29.92 120.682 81.21 51.314 51.291 81.247 120.629 29.933 69.337 29.933 148.173t-29.92 148.204q-29.92 69.369-81.21 120.682-51.291 51.314-120.629 81.247-69.337 29.933-148.173 29.933Z" />
        </svg>
        Add a teammate
      </button>
    ),
  }, {
    key: '2',
    label: (
      <button className='font-[Inter] font-medium text-[8px] 2xl:text-xs flex items-center' onClick={handleLogout}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-[8px] h-[8px] 2xl:w-[16px] 2xl:h-[16px] me-1">
          <path d="M224.615-160Q197-160 178.5-178.5 160-197 160-224.615v-510.77Q160-763 178.5-781.5 197-800 224.615-800h256.154v40H224.615q-9.23 0-16.923 7.692Q200-744.615 200-735.385v510.77q0 9.23 7.692 16.923Q215.385-200 224.615-200h256.154v40H224.615Zm433.846-178.461-28.077-28.77L723.154-460H367.692v-40h355.462l-92.77-92.769 28.077-28.77L800-480 658.461-338.461Z" />
        </svg>
        Log Out
      </button>
    ),
  }];

  const feedbackItems: MenuProps['items'] = [{
    key: '1',
    label: (
      <a href="https://forms.gle/T9Kc6JvaVhzwozYR8" className="font-[Inter] font-medium text-[8px] 2xl:text-xs flex items-center" target='_blank' rel="noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-[11px] h-[11px] 2xl:w-[18px] 2xl:h-[18px] -ms-1 me-1">
          <path d="M160-160v-100.769l527.231-527.77q6.146-5.481 13.573-8.471 7.427-2.99 15.486-2.99 8.06 0 15.616 2.538 7.556 2.539 13.94 9.154l42.693 42.923q6.615 6.385 9.038 14.008Q800-723.754 800-716.131q0 8.131-2.741 15.558-2.74 7.427-8.72 13.573l-527.77 527H160Zm540.154-496.461L760-715.538 715.538-760l-59.077 59.846 43.693 43.693Z" />
        </svg>
        Give feedback
      </a>
    ),
  }, {
    key: '2',
    label: (
      <a href="https://forms.gle/j1HCrRcrGK9roPhGA" className="font-[Inter] font-medium text-[8px] 2xl:text-xs flex items-center" target='_blank' rel="noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-[11px] h-[11px] 2xl:w-[18px] 2xl:h-[18px] -ms-1 me-1">
          <path d="M240-140v-620h287.693l16 80H760v320H552.307l-16-80H280v300h-40Z" />
        </svg>
        Request a feature
      </a>
    ),
  }];

  console.log('veri:', email_verified);

  if (email_verified === 'false') {
    return (
      <div>Your email is not verified yet, please verify your email</div>
    );
  }

  return (
    <div className='min-h-screen w-full'>
      <div className="fixed px-[9px] py-[5px] w-full z-[7]">
        <div className="flex bg-[#fffdfd] rounded-full items-center px-[18px] py-[4.14px]">
          <Link to="/" className="text-left w-full">
            <img src={Logo} className='h-[21px]' alt="logo" />
          </Link>

          <div className="flex items-center">
            <Dropdown placement="bottomRight" menu={{ items: feedbackItems }}>
              <button className="flex font-[Inter] bg-[#C1FFD9] rounded-full px-[7px] h-[19px] text-[#57D386] text-xs whitespace-nowrap items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="me-[3px] w-[11px] h-[11px] 2xl:w-[18px] h-[18px]">
                  <path d="M100.001-118.464v-669.227q0-30.308 21-51.308t51.308-21h615.382q30.308 0 51.308 21t21 51.308v455.382q0 30.308-21 51.308t-51.308 21H241.539L100.001-118.464ZM480-371.539q13.731 0 23.019-9.289 9.288-9.288 9.288-23.018 0-13.731-9.288-23.019-9.288-9.289-23.019-9.289-13.731 0-23.019 9.289-9.288 9.288-9.288 23.019 0 13.73 9.288 23.018 9.288 9.289 23.019 9.289Zm-29.999-139.23h59.998v-241.538h-59.998v241.538Z" fill="#57D386" />
                </svg>
                <span className="font-[Inter] text-[8px] 2xl:text-xs">Beta feedback</span>
              </button>
            </Dropdown>
            <div className="ms-[44px]">
              <Dropdown
                placement="bottomRight"
                menu={{ items: profileItems }}
              >
                <button className="flex justify-center items-center border-none p-0 font-[Inter] text-[11px]">
                  <Avatar className="bg-[#7FFBAE] text-black items-center justify-center flex h-[19px] w-[19px]" alt={getPlaceHolder()}>
                    <span className="text-[8px] 2xl:text-xs font-[Inter] font-medium">{getPlaceHolder()}</span>
                  </Avatar>

                  <span className="font-[Inter] text-[8px] 2xl:text-xs font-medium ms-[5px]">↓</span>
                </button>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>

      <div className='min-w-[210px] pl-2 pt-[40px] pb-2 flex flex-col justify-between h-full fixed'>
        <div className='flex flex-col items-center justify-center'>

          <button
            className="text-xs font-[Inter] flex items-center font-semibold text-left py-[18px] px-[12px] w-full bg-[#7FFBAE] rounded-[15px] my-4 text-black"
            onClick={async () => {
              setShowAddDialog(true);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-[19px] h-[18px] me-2">
              <path d="M450.001-290.001h59.998v-160h160v-59.998h-160v-160h-59.998v160h-160v59.998h160v160Zm30.066 190q-78.836 0-148.204-29.92-69.369-29.92-120.682-81.21-51.314-51.291-81.247-120.629-29.933-69.337-29.933-148.173t29.92-148.204q29.92-69.369 81.21-120.682 51.291-51.314 120.629-81.247 69.337-29.933 148.173-29.933t148.204 29.92q69.369 29.92 120.682 81.21 51.314 51.291 81.247 120.629 29.933 69.337 29.933 148.173t-29.92 148.204q-29.92 69.369-81.21 120.682-51.291 51.314-120.629 81.247-69.337 29.933-148.173 29.933Z" />
            </svg>
            Create New Campaign
          </button>

          <div className="relative w-full">
            <Link className={`w-full text-left my-1.5 font-[Inter] text-sm rounded-[20px] px-3 py-2.5 flex items-center text-black`}
              to="/campaign/all">
              <svg xmlns="http://www.w3.org/2000/svg" className="me-2" height="20" viewBox="0 -960 960 960" width="20">
                <path d="M180.001-140.001v-449.998L480-815.767l299.999 225.768v449.998H556.154v-267.692H403.846v267.692H180.001Z" />
              </svg>
              Dashboard
            </Link>
            <Link className={`w-full text-left my-1.5 font-[Inter] text-sm rounded-[20px] px-3 py-2.5 flex items-center text-black`}
              to="/detail">
              <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" className="me-2">
                <path d="M718.461-450.001v-59.998h144.615v59.998H718.461Zm45.693 269.23-115.692-86.768 36.461-47.845 115.691 86.768-36.46 47.845Zm-80.77-465.383-36.46-47.845 115.691-86.769 36.461 47.845-115.692 86.769ZM210.001-220.771v-156.153h-40.77q-29.922 0-51.115-21.192-21.192-21.193-21.192-51.115v-61.538q0-29.922 21.192-51.115 21.193-21.192 51.115-21.192h154.615l179.23-106.922v419.996l-179.23-106.922h-53.847v156.153h-59.998Zm348.46-134.46v-249.538q23.539 21.308 37.923 53.692 14.385 32.385 14.385 71.077t-14.385 71.077Q582-376.539 558.461-355.231Z" />
              </svg>
              Campaigns
            </Link>
            <Link className={`w-full text-left my-1.5 font-[Inter] text-sm rounded-[20px] px-3 py-2.5 flex items-center text-black`}
              to="/billing">
              <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" className="me-2">
                <path d="M212.309-140.001q-30.308 0-51.308-21t-21-51.308v-535.382q0-30.308 21-51.308t51.308-21h419.229l188.461 188.461v419.229q0 30.308-21 51.308t-51.308 21H212.309ZM320-283.846q15.077 0 25.615-10.539 10.539-10.538 10.539-25.615 0-15.077-10.539-25.615-10.538-10.539-25.615-10.539-15.077 0-25.615 10.539-10.539 10.538-10.539 25.615 0 15.077 10.539 25.615 10.538 10.539 25.615 10.539Zm0-160q15.077 0 25.615-10.539 10.539-10.538 10.539-25.615 0-15.077-10.539-25.615-10.538-10.539-25.615-10.539-15.077 0-25.615 10.539-10.539 10.538-10.539 25.615 0 15.077 10.539 25.615 10.538 10.539 25.615 10.539Zm0-160q15.077 0 25.615-10.539 10.539-10.538 10.539-25.615 0-15.077-10.539-25.615-10.538-10.539-25.615-10.539-15.077 0-25.615 10.539-10.539 10.538-10.539 25.615 0 15.077 10.539 25.615 10.538 10.539 25.615 10.539ZM600-600h160L600-760v160Z" />
              </svg>
              Billing
            </Link>
            <Link className={`w-full text-left my-1.5 font-[Inter] text-sm rounded-[20px] px-3 py-2.5 flex items-center text-black`}
              to="/support">
              <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" className="me-2">
                <path d="M480.067-100.001q-78.836 0-148.204-29.92-69.369-29.92-120.682-81.21-51.314-51.291-81.247-120.629-29.933-69.337-29.933-148.173t29.92-148.204q29.92-69.369 81.21-120.682 51.291-51.314 120.629-81.247 69.337-29.933 148.173-29.933t148.204 29.92q69.369 29.92 120.682 81.21 51.314 51.291 81.247 120.629 29.933 69.337 29.933 148.173t-29.92 148.204q-29.92 69.369-81.21 120.682-51.291 51.314-120.629 81.247-69.337 29.933-148.173 29.933ZM364-182l58.77-133.848q-37.451-13.225-64.648-40.997-27.197-27.771-41.505-65.156L181.231-366q23.384 64 71.384 112T364-182Zm-47.383-355.999q13.538-37.385 40.961-64.653 27.423-27.269 64.423-40.731L366-778.769q-64.385 24.384-112.385 72.384T181.231-594l135.386 56.001Zm163.292 171.845q47.398 0 80.668-33.179 33.269-33.179 33.269-80.576 0-47.398-33.179-80.668-33.178-33.269-80.576-33.269-47.398 0-80.668 33.179-33.269 33.178-33.269 80.576 0 47.398 33.179 80.668 33.179 33.269 80.576 33.269ZM596-182q63-24 110.5-71.5T778-364l-133.848-58.77q-12.692 37-40.23 64.23-27.538 27.231-63.923 41.923L596-182Zm47.383-357.999L778-596q-24-63-71.5-110.5T596-778l-56.001 135.848q35.615 13.846 62.153 40.307 26.539 26.461 41.231 61.846Z" />
              </svg>
              Support
            </Link>
            {
              (
                location.pathname.indexOf('campaign') > -1 ||
                location.pathname.indexOf('detail') > -1 ||
                location.pathname.indexOf('billing') > -1 ||
                location.pathname.indexOf('support') > -1
              ) &&
              <div className={`absolute h-1/4 bg-white w-full rounded-[15px] shadow-sm -z-[1] transition-all duration-500 transform ${getOffsetBack()} `} />
            }
          </div>
        </div>
      </div>
      {loading && <Loading />}
      {!loading &&
        <div className="pt-[30px]">
          <div className='bg-[#EDECF2] px-[15px] py-[20px] ml-[230px] overflow-auto'>
            <Routes>
              <Route path="/campaign/:id" element={<Dashboard />} />
              <Route path="/detail" element={<Detail />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/support" element={<Support />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin/*" element={<Admin />} />
            </Routes>
          </div>
        </div>
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