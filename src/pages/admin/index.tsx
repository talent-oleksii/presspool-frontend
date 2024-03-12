import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, Route, Routes, useNavigate } from "react-router-dom";
import { Dropdown, MenuProps } from "antd";
import { selectAuth, setAdminAuthenticated, setAdminToken, setAdminUserData } from "../../store/authSlice";

import Logo from '../../assets/logo/logo.png';

import AdminAPIInstance from '../../api/adminApi';
import Loading from '../../components/Loading';
import AdminDashboard from './Dashboard';
import AdminMember from './Member';
import AdminCampaign from './Campaign';
import AdminBilling from './Billing';
import AdminSupport from './Support';
import AdminProfile from './Profile';

import FeedbackImage from '../../assets/icon/topbar-help.png';
import HelpImage from '../../assets/icon/help.png';
import ClientImage from '../../assets/icon/account.png';
import TeamImage from '../../assets/icon/team.png';
import AccountImage from '../../assets/image/account.png';
import LinkImage from '../../assets/icon/link.png';
import InviteNewClient from './ui/InviteNewClient';
import AdminDashboardClient from './dashboard/Client';
import AdminClient from './Client';
import AdminClientCampaign from './ClientCampaign';
import InviteAccountManager from './ui/InviteAccountManager';
import TrainingHub from './TrainingHub';

const Admin: FC = () => {
  const location = useLocation();
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const { isAdminAuthenticated, adminToken, adminRole } = useSelector(selectAuth);

  const [loading, setLoading] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showInviteAM, setShowInviteAM] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated) navigator('/admin/login');
    else {
      setLoading(true);
      AdminAPIInstance.post('auth/check', { token: adminToken }).then((data) => {
        dispatch(setAdminAuthenticated({ state: true }));
        dispatch(setAdminToken({ token: data.data.token }));
        dispatch(setAdminUserData({ userName: data.data.name, email: data.data.email, role: data.data.role, id: data.data.id, link: data.data.link }));
        if (!location.pathname.includes('/admin/')) navigator('/admin/dashboard');
      }).catch(err => {
        setAdminAuthenticated({ state: false });
        navigator('/admin/login');
      }).finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdminAuthenticated]);

  const { adminName, adminLink } = useSelector(selectAuth);

  const handleLogout = () => {
    dispatch(setAdminAuthenticated({ state: false }));
    navigator('/admin');
  };

  const feedbackItems: MenuProps['items'] = [{
    key: '1',
    label: (
      <a href="https://forms.gle/T9Kc6JvaVhzwozYR8" className="font-[Inter] font-medium text-xs flex items-center" target='_blank' rel="noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-[18px] h-[18px] -ms-1 me-2">
          <path d="M160-160v-100.769l527.231-527.77q6.146-5.481 13.573-8.471 7.427-2.99 15.486-2.99 8.06 0 15.616 2.538 7.556 2.539 13.94 9.154l42.693 42.923q6.615 6.385 9.038 14.008Q800-723.754 800-716.131q0 8.131-2.741 15.558-2.74 7.427-8.72 13.573l-527.77 527H160Zm540.154-496.461L760-715.538 715.538-760l-59.077 59.846 43.693 43.693Z" />
        </svg>
        Give feedback
      </a>
    ),
  }, {
    key: '2',
    label: (
      <a href="https://forms.gle/j1HCrRcrGK9roPhGA" className="font-[Inter] font-medium text-xs flex items-center" target='_blank' rel="noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-[18px] h-[18px] -ms-1 me-2">
          <path d="M240-140v-620h287.693l16 80H760v320H552.307l-16-80H280v300h-40Z" />
        </svg>
        Request a feature
      </a>
    ),
  }];

  const profileItems: MenuProps['items'] = [{
    key: '1',
    label: (
      <Link to="/admin/profile" className="font-[Inter] font-medium text-xs flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-[16px] h-[16px] me-2 -ms-1">
          <path d="M480-380q45.231 0 82.923-20.577 37.693-20.577 62.154-54.808-31.154-22.077-67.846-33.346Q520.539-500 480-500q-40.539 0-77.231 11.269-36.692 11.269-67.846 33.346 24.461 34.231 62.154 54.808Q434.769-380 480-380Zm0-200q25.308 0 42.654-17.346Q540-614.692 540-640q0-25.308-17.346-42.654Q505.308-700 480-700q-25.308 0-42.654 17.346Q420-665.308 420-640q0 25.308 17.346 42.654Q454.692-580 480-580Zm0 460.769Q339-243.923 267.577-351.808q-71.423-107.884-71.423-196.346 0-126.923 82.654-209.385Q361.461-840 480-840t201.192 82.461q82.654 82.462 82.654 209.385 0 88.462-71.423 196.346Q621-243.923 480-119.231Z" />
        </svg>
        My Profile
      </Link>
    ),
  }, {
    key: '3',
    label: (
      <button className="font-[Inter] font-medium text-xs flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-[16px] h-[16px] me-2 -ms-1">
          <path d="M450.001-290.001h59.998v-160h160v-59.998h-160v-160h-59.998v160h-160v59.998h160v160Zm30.066 190q-78.836 0-148.204-29.92-69.369-29.92-120.682-81.21-51.314-51.291-81.247-120.629-29.933-69.337-29.933-148.173t29.92-148.204q29.92-69.369 81.21-120.682 51.291-51.314 120.629-81.247 69.337-29.933 148.173-29.933t148.204 29.92q69.369 29.92 120.682 81.21 51.314 51.291 81.247 120.629 29.933 69.337 29.933 148.173t-29.92 148.204q-29.92 69.369-81.21 120.682-51.291 51.314-120.629 81.247-69.337 29.933-148.173 29.933Z" />
        </svg>
        Add a teammate
      </button>
    ),
  }, {
    key: '2',
    label: (
      <button className='font-[Inter] font-medium text-xs flex items-center' onClick={() => handleLogout()}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-[16px] h-[16px] me-2 -ms-1">
          <path d="M224.615-160Q197-160 178.5-178.5 160-197 160-224.615v-510.77Q160-763 178.5-781.5 197-800 224.615-800h256.154v40H224.615q-9.23 0-16.923 7.692Q200-744.615 200-735.385v510.77q0 9.23 7.692 16.923Q215.385-200 224.615-200h256.154v40H224.615Zm433.846-178.461-28.077-28.77L723.154-460H367.692v-40h355.462l-92.77-92.769 28.077-28.77L800-480 658.461-338.461Z" />
        </svg>
        Log Out
      </button>
    ),
    onClick: handleLogout
  }];

  const getPlaceHolder = () => {
    const names = adminName.split(' ');
    if (names.length === 2) {
      return `${names[0].at(0)}${names[1].at(0)}`;
    } else if (names.length === 1) {
      return `${names[0].at(0)}`;
    } else {
      return '';
    }
  };

  const getOffsetBack = () => {
    if (adminRole === 'account_manager') {
      if (location.pathname.indexOf('dashboard') > -1) return 'top-[1%]';
      if (location.pathname.indexOf('client') > -1) return 'top-[25%]';
      if (location.pathname.indexOf('profile') > -1) return 'top-[50%]';
      if (location.pathname.indexOf('support') > -1) return 'top-[75%]';
    } else if (adminRole === 'super_admin') {
      if (location.pathname.indexOf('dashboard') > -1) return 'top-[1%]';
      if (location.pathname.indexOf('client') > -1) return 'top-[20%]';
      if (location.pathname.indexOf('member') > -1) return 'top-[40%]';
      if (location.pathname.indexOf('profile') > -1) return 'top-[60%]';
      if (location.pathname.indexOf('support') > -1) return 'top-[80%]';
    }

    return 'top-0';
  };

  return (
    <div className='h-full w-full'>
      <div className="fixed px-[9px] py-[5px] w-full z-[7]">
        <div className="flex bg-[#fffdfd] rounded-[10px] items-center pl-[18px] pr-[5px] py-[6px] w-full justify-between">
          <div className="flex items-center justify-center">
            <Link to="/" className="text-left w-full">
              <img src={Logo} className='h-[18px]' alt="logo" />
            </Link>
          </div>

          <div className="flex items-center">
            <Dropdown placement="bottomRight" menu={{ items: feedbackItems }}>
              <button className="flex font-[Inter] bg-main rounded-[10px] px-3 py-[3px] font-medium text-primary text-xs whitespace-nowrap items-center">
                <img alt="Support" src={FeedbackImage} className="w-[14px] me-1 -ms-1" />
                <span className="font-[Inter] text-xs ms-1">Beta feedback</span>
              </button>
            </Dropdown>
            {/* <div className="ms-[44px]">
              <Dropdown
                placement="bottomRight"
                menu={{ items: profileItems }}
              >
                <button className="flex justify-center items-center border-none p-0 font-[Inter] text-[11px]">
                  <Avatar className="bg-main text-primary items-center justify-center flex" alt={getPlaceHolder()} size="small">
                    <span className="text-xs font-[Inter] font-medium">{getPlaceHolder()}</span>
                  </Avatar>

                  <span className="font-[Inter] text-xs font-medium ms-1">↓</span>
                </button>
              </Dropdown>
            </div> */}
          </div>
        </div>
      </div>

      <div className='w-[210px] pl-2 pt-[50px] pb-2 flex flex-col h-full fixed justify-between pb-4'>
        <div>
          <div className='flex flex-col items-center justify-center'>
            {
              adminRole === 'super_admin' &&
              <button
                className={`text-xs font-[Inter] flex items-center font-semibold text-left py-[18px] px-[12px] w-full bg-[#7FFBAE] rounded-[10px] my-4 text-primary ${location.pathname.indexOf('new') > -1 ? 'ring-black ring-[1px]' : 'ring-0'}`}
                onClick={() => setShowInviteAM(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className='me-2'>
                  <path d="M7 10H13M10 7V13M1 10C1 11.1819 1.23279 12.3522 1.68508 13.4442C2.13738 14.5361 2.80031 15.5282 3.63604 16.364C4.47177 17.1997 5.46392 17.8626 6.55585 18.3149C7.64778 18.7672 8.8181 19 10 19C11.1819 19 12.3522 18.7672 13.4442 18.3149C14.5361 17.8626 15.5282 17.1997 16.364 16.364C17.1997 15.5282 17.8626 14.5361 18.3149 13.4442C18.7672 12.3522 19 11.1819 19 10C19 7.61305 18.0518 5.32387 16.364 3.63604C14.6761 1.94821 12.3869 1 10 1C7.61305 1 5.32387 1.94821 3.63604 3.63604C1.94821 5.32387 1 7.61305 1 10Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Add Account Manager
              </button>
            }
            {
              adminRole === 'account_manager' &&
              <button
                className={`text-xs font-[Inter] flex items-center font-semibold text-left py-[18px] px-[12px] w-full bg-main rounded-[10px] my-4 text-primary ${location.pathname.indexOf('new') > -1 ? 'ring-black ring-[1px]' : 'ring-0'}`}
                onClick={() => setShowInvite(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className='me-3'>
                  <path d="M7 10H13M10 7V13M1 10C1 11.1819 1.23279 12.3522 1.68508 13.4442C2.13738 14.5361 2.80031 15.5282 3.63604 16.364C4.47177 17.1997 5.46392 17.8626 6.55585 18.3149C7.64778 18.7672 8.8181 19 10 19C11.1819 19 12.3522 18.7672 13.4442 18.3149C14.5361 17.8626 15.5282 17.1997 16.364 16.364C17.1997 15.5282 17.8626 14.5361 18.3149 13.4442C18.7672 12.3522 19 11.1819 19 10C19 7.61305 18.0518 5.32387 16.364 3.63604C14.6761 1.94821 12.3869 1 10 1C7.61305 1 5.32387 1.94821 3.63604 3.63604C1.94821 5.32387 1 7.61305 1 10Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Invite New Client
              </button>
            }
            <InviteNewClient show={showInvite} onClose={() => setShowInvite(false)} link={adminLink} />
            <InviteAccountManager show={showInviteAM} onClose={() => setShowInviteAM(false)} />
            <div className="relative w-full">
              <Link className={`w-full text-left my-1.5 font-[Inter] text-xs rounded-[10px] px-3 py-2.5 flex items-center font-medium text-primary hover:bg-white`}
                to="/admin/dashboard">
                <svg fill="none" height="15" viewBox="0 0 15 15" width="15" xmlns="http://www.w3.org/2000/svg" className="w-[16px] ms-1 me-3">
                  <path clipRule="evenodd" d="M2.8 1L2.74967 0.99997C2.52122 0.999752 2.32429 0.999564 2.14983 1.04145C1.60136 1.17312 1.17312 1.60136 1.04145 2.14983C0.999564 2.32429 0.999752 2.52122 0.99997 2.74967L1 2.8V5.2L0.99997 5.25033C0.999752 5.47878 0.999564 5.67572 1.04145 5.85017C1.17312 6.39864 1.60136 6.82688 2.14983 6.95856C2.32429 7.00044 2.52122 7.00025 2.74967 7.00003L2.8 7H5.2L5.25033 7.00003C5.47878 7.00025 5.67572 7.00044 5.85017 6.95856C6.39864 6.82688 6.82688 6.39864 6.95856 5.85017C7.00044 5.67572 7.00025 5.47878 7.00003 5.25033L7 5.2V2.8L7.00003 2.74967C7.00025 2.52122 7.00044 2.32429 6.95856 2.14983C6.82688 1.60136 6.39864 1.17312 5.85017 1.04145C5.67572 0.999564 5.47878 0.999752 5.25033 0.99997L5.2 1H2.8ZM2.38328 2.01382C2.42632 2.00348 2.49222 2 2.8 2H5.2C5.50779 2 5.57369 2.00348 5.61672 2.01382C5.79955 2.05771 5.94229 2.20045 5.98619 2.38328C5.99652 2.42632 6 2.49222 6 2.8V5.2C6 5.50779 5.99652 5.57369 5.98619 5.61672C5.94229 5.79955 5.79955 5.94229 5.61672 5.98619C5.57369 5.99652 5.50779 6 5.2 6H2.8C2.49222 6 2.42632 5.99652 2.38328 5.98619C2.20045 5.94229 2.05771 5.79955 2.01382 5.61672C2.00348 5.57369 2 5.50779 2 5.2V2.8C2 2.49222 2.00348 2.42632 2.01382 2.38328C2.05771 2.20045 2.20045 2.05771 2.38328 2.01382ZM9.8 1L9.74967 0.99997C9.52122 0.999752 9.32429 0.999564 9.14983 1.04145C8.60136 1.17312 8.17312 1.60136 8.04145 2.14983C7.99956 2.32429 7.99975 2.52122 7.99997 2.74967L8 2.8V5.2L7.99997 5.25033C7.99975 5.47878 7.99956 5.67572 8.04145 5.85017C8.17312 6.39864 8.60136 6.82688 9.14983 6.95856C9.32429 7.00044 9.52122 7.00025 9.74967 7.00003L9.8 7H12.2L12.2503 7.00003C12.4788 7.00025 12.6757 7.00044 12.8502 6.95856C13.3986 6.82688 13.8269 6.39864 13.9586 5.85017C14.0004 5.67572 14.0003 5.47878 14 5.25033L14 5.2V2.8L14 2.74967C14.0003 2.52122 14.0004 2.32429 13.9586 2.14983C13.8269 1.60136 13.3986 1.17312 12.8502 1.04145C12.6757 0.999564 12.4788 0.999752 12.2503 0.99997L12.2 1H9.8ZM9.38328 2.01382C9.42632 2.00348 9.49222 2 9.8 2H12.2C12.5078 2 12.5737 2.00348 12.6167 2.01382C12.7995 2.05771 12.9423 2.20045 12.9862 2.38328C12.9965 2.42632 13 2.49222 13 2.8V5.2C13 5.50779 12.9965 5.57369 12.9862 5.61672C12.9423 5.79955 12.7995 5.94229 12.6167 5.98619C12.5737 5.99652 12.5078 6 12.2 6H9.8C9.49222 6 9.42632 5.99652 9.38328 5.98619C9.20045 5.94229 9.05771 5.79955 9.01382 5.61672C9.00348 5.57369 9 5.50779 9 5.2V2.8C9 2.49222 9.00348 2.42632 9.01382 2.38328C9.05771 2.20045 9.20045 2.05771 9.38328 2.01382ZM2.74967 7.99997L2.8 8H5.2L5.25033 7.99997C5.47878 7.99975 5.67572 7.99956 5.85017 8.04145C6.39864 8.17312 6.82688 8.60136 6.95856 9.14983C7.00044 9.32429 7.00025 9.52122 7.00003 9.74967L7 9.8V12.2L7.00003 12.2503C7.00025 12.4788 7.00044 12.6757 6.95856 12.8502C6.82688 13.3986 6.39864 13.8269 5.85017 13.9586C5.67572 14.0004 5.47878 14.0003 5.25033 14L5.2 14H2.8L2.74967 14C2.52122 14.0003 2.32429 14.0004 2.14983 13.9586C1.60136 13.8269 1.17312 13.3986 1.04145 12.8502C0.999564 12.6757 0.999752 12.4788 0.99997 12.2503L1 12.2V9.8L0.99997 9.74967C0.999752 9.52122 0.999564 9.32429 1.04145 9.14983C1.17312 8.60136 1.60136 8.17312 2.14983 8.04145C2.32429 7.99956 2.52122 7.99975 2.74967 7.99997ZM2.8 9C2.49222 9 2.42632 9.00348 2.38328 9.01382C2.20045 9.05771 2.05771 9.20045 2.01382 9.38328C2.00348 9.42632 2 9.49222 2 9.8V12.2C2 12.5078 2.00348 12.5737 2.01382 12.6167C2.05771 12.7995 2.20045 12.9423 2.38328 12.9862C2.42632 12.9965 2.49222 13 2.8 13H5.2C5.50779 13 5.57369 12.9965 5.61672 12.9862C5.79955 12.9423 5.94229 12.7995 5.98619 12.6167C5.99652 12.5737 6 12.5078 6 12.2V9.8C6 9.49222 5.99652 9.42632 5.98619 9.38328C5.94229 9.20045 5.79955 9.05771 5.61672 9.01382C5.57369 9.00348 5.50779 9 5.2 9H2.8ZM9.8 8L9.74967 7.99997C9.52122 7.99975 9.32429 7.99956 9.14983 8.04145C8.60136 8.17312 8.17312 8.60136 8.04145 9.14983C7.99956 9.32429 7.99975 9.52122 7.99997 9.74967L8 9.8V12.2L7.99997 12.2503C7.99975 12.4788 7.99956 12.6757 8.04145 12.8502C8.17312 13.3986 8.60136 13.8269 9.14983 13.9586C9.32429 14.0004 9.52122 14.0003 9.74967 14L9.8 14H12.2L12.2503 14C12.4788 14.0003 12.6757 14.0004 12.8502 13.9586C13.3986 13.8269 13.8269 13.3986 13.9586 12.8502C14.0004 12.6757 14.0003 12.4788 14 12.2503L14 12.2V9.8L14 9.74967C14.0003 9.52122 14.0004 9.32429 13.9586 9.14983C13.8269 8.60136 13.3986 8.17312 12.8502 8.04145C12.6757 7.99956 12.4788 7.99975 12.2503 7.99997L12.2 8H9.8ZM9.38328 9.01382C9.42632 9.00348 9.49222 9 9.8 9H12.2C12.5078 9 12.5737 9.00348 12.6167 9.01382C12.7995 9.05771 12.9423 9.20045 12.9862 9.38328C12.9965 9.42632 13 9.49222 13 9.8V12.2C13 12.5078 12.9965 12.5737 12.9862 12.6167C12.9423 12.7995 12.7995 12.9423 12.6167 12.9862C12.5737 12.9965 12.5078 13 12.2 13H9.8C9.49222 13 9.42632 12.9965 9.38328 12.9862C9.20045 12.9423 9.05771 12.7995 9.01382 12.6167C9.00348 12.5737 9 12.5078 9 12.2V9.8C9 9.49222 9.00348 9.42632 9.01382 9.38328C9.05771 9.20045 9.20045 9.05771 9.38328 9.01382Z" fill="currentColor" fillRule="evenodd" />
                </svg>
                Dashboard
              </Link>
              <Link className={`w-full text-left my-1.5 font-[Inter] text-xs rounded-[10px] px-3 py-2.5 flex items-center font-medium text-primary hover:bg-white`}
                to="/admin/client">
                <img alt="Support" src={ClientImage} className="w-[16px] me-3 ms-1" />
                Clients
              </Link>
              {
                adminRole === 'super_admin' &&
                <Link className={`w-full text-left my-1.5 font-[Inter] text-xs rounded-[10px] px-3 py-2.5 flex items-center font-medium text-primary hover:bg-white`}
                  to="/admin/member">
                  <img alt="Team" src={TeamImage} className="w-[16px] me-3 ms-1" />
                  My Team
                </Link>
              }
              <Link className={`w-full text-left my-1.5 font-[Inter] text-xs rounded-[10px] px-3 py-2.5 flex items-center font-medium text-primary hover:bg-white`}
                to="/admin/profile">
                <img alt="Support" src={AccountImage} className="w-[16px] me-3 ms-1" />
                Account
              </Link>
              <Link className={`w-full text-left my-1.5 font-[Inter] text-xs rounded-[10px] px-3 py-2.5 flex items-center font-medium text-primary hover:bg-white`}
                to="/admin/support">
                <img alt="Support" src={HelpImage} className="w-[16px] me-3 ms-1" />
                Support
              </Link>
              {
                (
                  location.pathname.indexOf('dashboard') > -1 || location.pathname.indexOf('client') > -1 ||
                  location.pathname.indexOf('client') > -1 ||
                  location.pathname.indexOf('profile') > -1 ||
                  location.pathname.indexOf('support') > -1 ||
                  location.pathname.indexOf('member') > -1
                ) &&
                <div className={`absolute ${adminRole === 'super_admin' ? 'h-[20%]' : 'h-[25%]'} bg-white w-full rounded-[10px] shadow-sm -z-[1] transition-all duration-500 transform ${getOffsetBack()} `} />
              }
            </div>
          </div>
          <div className='relative mt-4 text-left'>
            <div className='bg-main px-[19px] py-[12px] rounded-t-[10px] w-full z-10'>
              <p className='text-primary text-xs font-semibold font-[Inter]'>Resources</p>
              <p className='text-primary font-[Inter] font-semibold text-xs 2xl:text-xs mt-[5px]'>We are always here for you</p>
            </div>
            <div className='bg-white py-2 rounded-b-[10px] w-full z-0 top-[70px] shadow-md'>
              <a href="https://content.presspool.ai" className='flex font-[Inter] font-medium text-xs 2xl:text-xs items-center px-3 py-2' rel='noreferrer' target='_blank'>
                <img src={LinkImage} alt="link" className='w-[17px] me-2' />
                Presspool GPT
              </a>
              <a href="https://sales.presspool.ai" className='flex font-[Inter] font-medium text-xs 2xl:text-xs items-center px-3 py-2' rel='noreferrer' target='_blank'>
                <img src={LinkImage} alt="link" className='w-[17px] me-2' />
                Presspool CRM
              </a>
              <a href="https://dash.presspool.ai" className='flex font-[Inter] font-medium text-xs 2xl:text-xs items-center px-3 py-2' rel='noreferrer' target='_blank'>
                <img src={LinkImage} alt="link" className='w-[17px] me-2' />
                Tracking Dashboard
              </a>
              <Link to="/admin/training-hub" className='flex font-[Inter] font-medium text-xs 2xl:text-sm items-center px-3 py-2'>
                <img src={LinkImage} alt="link" className='w-[17px] me-2' />
                Training Hub
              </Link>
            </div>
          </div>
        </div>
        <button className='font-[Inter] font-medium text-xs flex items-center' onClick={() => handleLogout()}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-[26px] h-[22px] me-2 -ms-1">
            <path d="M224.615-160Q197-160 178.5-178.5 160-197 160-224.615v-510.77Q160-763 178.5-781.5 197-800 224.615-800h256.154v40H224.615q-9.23 0-16.923 7.692Q200-744.615 200-735.385v510.77q0 9.23 7.692 16.923Q215.385-200 224.615-200h256.154v40H224.615Zm433.846-178.461-28.077-28.77L723.154-460H367.692v-40h355.462l-92.77-92.769 28.077-28.77L800-480 658.461-338.461Z" />
          </svg>
          Log Out
        </button>
      </div>
      {loading && <Loading />}
      {!loading &&
        <div className="pt-[40px]">
          <div className='bg-[#EDECF2] px-[15px] py-[20px] ml-[230px]'>
            <Routes>
              <Route path="/dashboard/*" element={<AdminDashboard />} />
              <Route path="/client" element={<AdminDashboardClient />} />
              <Route path="/client/:id" element={<AdminClient />} />
              <Route path="/client/:id/:campaignId" element={<AdminClientCampaign />} />
              <Route path="/member" element={<AdminMember />} />
              <Route path="/campaign" element={<AdminCampaign />} />
              <Route path="/billing" element={<AdminBilling />} />
              <Route path="/support" element={<AdminSupport />} />
              <Route path="/profile" element={<AdminProfile />} />
              <Route path="/training-hub" element={<TrainingHub />} />
            </Routes>
          </div>
        </div>
      }
    </div>
  );
};

export default Admin;