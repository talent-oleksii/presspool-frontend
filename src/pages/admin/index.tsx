import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, Route, Routes, useNavigate } from "react-router-dom";
import { Avatar, Dropdown, MenuProps } from "antd";
import { selectAuth, setAdminAuthenticated, setAdminToken, setAdminUserData } from "../../store/authSlice";

import Logo from '../../assets/logo/logo.png';

import AdminAPIInstance from '../../api/adminApi';
import Loading from '../../components/Loading';
import AdminDashboard from './Dashboard';
import AdminClient from './Client';
import AdminMember from './Member';
import AdminCampaign from './Campaign';
import AdminBilling from './Billing';
import AdminSupport from './Support';

const Admin: FC = () => {
  const location = useLocation();
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const { isAdminAuthenticated, adminToken } = useSelector(selectAuth);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated) navigator('/admin/login');
    else {
      setLoading(true);
      AdminAPIInstance.post('auth/check', { token: adminToken }).then((data) => {
        dispatch(setAdminAuthenticated({ state: true }));
        dispatch(setAdminToken({ token: data.data.token }));
        dispatch(setAdminUserData({ userName: data.data.name, email: data.data.email, role: data.data.role }));
        if (!location.pathname.includes('/admin/')) navigator('/admin/dashboard/overview');
      }).catch(err => {
        setAdminAuthenticated({ state: false });
        navigator('/admin/login');
      }).finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdminAuthenticated]);

  const { adminName } = useSelector(selectAuth);

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
    if (location.pathname.indexOf('dashboard') > -1 || location.pathname.includes('client')) return 'top-[1%]';
    if (location.pathname.indexOf('member') > -1) return 'top-[25%]';
    if (location.pathname.indexOf('billing') > -1) return 'top-[50%]';
    if (location.pathname.indexOf('support') > -1) return 'top-[75%]';

    return 'top-0';
  };

  return (
    <div className='h-full w-full'>
      <div className="fixed px-[9px] py-[5px] w-full z-[7]">
        <div className="flex bg-[#fffdfd] rounded-full items-center px-[18px] py-[6px]">
          <Link to="/" className="text-left w-full">
            <img src={Logo} className='h-[18px]' alt="logo" />
          </Link>

          <div className="flex items-center">
            <Dropdown placement="bottomRight" menu={{ items: feedbackItems }}>
              <button className="flex font-[Inter] bg-[#C1FFD9] rounded-full px-[10px] py-[3px] text-[#57D386] text-xs whitespace-nowrap items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="me-1 w-[18px] h-[18px]">
                  <path d="M100.001-118.464v-669.227q0-30.308 21-51.308t51.308-21h615.382q30.308 0 51.308 21t21 51.308v455.382q0 30.308-21 51.308t-51.308 21H241.539L100.001-118.464ZM480-371.539q13.731 0 23.019-9.289 9.288-9.288 9.288-23.018 0-13.731-9.288-23.019-9.288-9.289-23.019-9.289-13.731 0-23.019 9.289-9.288 9.288-9.288 23.019 0 13.73 9.288 23.018 9.288 9.289 23.019 9.289Zm-29.999-139.23h59.998v-241.538h-59.998v241.538Z" fill="#57D386" />
                </svg>
                <span className="font-[Inter] text-xs">Beta feedback</span>
              </button>
            </Dropdown>
            <div className="ms-[44px]">
              <Dropdown
                placement="bottomRight"
                menu={{ items: profileItems }}
              >
                <button className="flex justify-center items-center border-none p-0 font-[Inter] text-[11px]">
                  <Avatar className="bg-[#7FFBAE] text-black items-center justify-center flex" alt={getPlaceHolder()} size="small">
                    <span className="text-xs font-[Inter] font-medium">{getPlaceHolder()}</span>
                  </Avatar>

                  <span className="font-[Inter] text-xs font-medium ms-1">↓</span>
                </button>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>

      <div className='min-w-[210px] pl-2 pt-[50px] pb-2 flex flex-col justify-between h-full fixed'>
        <div className='flex flex-col items-center justify-center'>

          <Link
            to="/admin/new"
            className={`text-xs font-[Inter] flex items-center font-semibold text-left py-[18px] px-[12px] w-full bg-[#7FFBAE] rounded-[15px] my-4 text-black ${location.pathname.indexOf('new') > -1 ? 'ring-black ring-[1px]' : 'ring-0'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-[19px] h-[18px] me-2">
              <path d="M450.001-290.001h59.998v-160h160v-59.998h-160v-160h-59.998v160h-160v59.998h160v160Zm30.066 190q-78.836 0-148.204-29.92-69.369-29.92-120.682-81.21-51.314-51.291-81.247-120.629-29.933-69.337-29.933-148.173t29.92-148.204q29.92-69.369 81.21-120.682 51.291-51.314 120.629-81.247 69.337-29.933 148.173-29.933t148.204 29.92q69.369 29.92 120.682 81.21 51.314 51.291 81.247 120.629 29.933 69.337 29.933 148.173t-29.92 148.204q-29.92 69.369-81.21 120.682-51.291 51.314-120.629 81.247-69.337 29.933-148.173 29.933Z" />
            </svg>
            Add Account Manager
          </Link>

          <div className="relative w-full">
            <Link className={`w-full text-left my-1.5 font-[Inter] text-xs rounded-[15px] px-3 py-2.5 flex items-center font-medium text-black hover:bg-white`}
              to="/admin/dashboard">
              <svg xmlns="http://www.w3.org/2000/svg" className="me-2" height="20" viewBox="0 -960 960 960" width="20">
                <path d="M180.001-140.001v-449.998L480-815.767l299.999 225.768v449.998H556.154v-267.692H403.846v267.692H180.001Z" />
              </svg>
              Dashboard
            </Link>
            {/* <Link className={`w-full text-left my-1.5 font-[Inter] text-sm rounded-[15px] px-3 py-2.5 flex items-center text-black hover:bg-white`}
              to="/admin/client">
              <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" className="me-2">
                <path d="M247.846-260.615q51-36.693 108.231-58.039Q413.308-340 480-340q66.692 0 123.923 21.346 57.231 21.346 108.231 58.039 39.615-41 63.731-96.847Q800-413.308 800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 66.692 24.115 122.538 24.116 55.847 63.731 96.847ZM480-460q-50.539 0-85.269-34.731Q360-529.461 360-580q0-50.539 34.731-85.269Q429.461-700 480-700q50.539 0 85.269 34.731Q600-630.539 600-580q0 50.539-34.731 85.269Q530.539-460 480-460Zm0 340q-75.308 0-141-28.038-65.692-28.039-114.308-76.654Q176.077-273.308 148.038-339 120-404.692 120-480t28.038-141q28.039-65.692 76.654-114.308Q273.308-783.923 339-811.962 404.692-840 480-840t141 28.038q65.692 28.039 114.308 76.654Q783.923-686.692 811.962-621 840-555.308 840-480t-28.038 141q-28.039 65.692-76.654 114.308Q686.692-176.077 621-148.038 555.308-120 480-120Z" />
              </svg>
              Clients
            </Link> */}
            <Link className={`w-full text-left my-1.5 font-[Inter] text-xs rounded-[15px] px-3 py-2.5 flex items-center font-medium text-black hover:bg-white`}
              to="/admin/member">
              <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" className="me-2">
                <path d="M103.846-215.384v-65.847q0-27.846 14.423-47.884 14.423-20.039 38.765-32.029 52.043-24.779 103.35-39.51 51.308-14.731 123.462-14.731t123.462 14.731q51.307 14.731 103.35 39.51 24.342 11.99 38.765 32.029 14.423 20.038 14.423 47.884v65.847h-560Zm640 0v-67.693q0-34.769-14.074-65.64-14.075-30.871-39.926-52.976 29.462 6 56.769 16.654 27.308 10.654 54.001 23.962 26 13.077 40.769 33.469 14.769 20.393 14.769 44.531v67.693H743.846Zm-360-289.231q-49.5 0-84.75-35.25t-35.25-84.75q0-49.501 35.25-84.751 35.25-35.25 84.75-35.25t84.75 35.25q35.25 35.25 35.25 84.751 0 49.5-35.25 84.75t-84.75 35.25Zm290.77-120q0 49.5-35.25 84.75t-84.75 35.25q-2.539 0-6.462-.577-3.923-.577-6.462-1.269 20.325-24.895 31.239-55.235 10.915-30.34 10.915-63.015 0-32.674-11.423-62.443t-30.731-55.616q3.231-1.153 6.462-1.5 3.231-.346 6.462-.346 49.5 0 84.75 35.25t35.25 84.751Z" />
              </svg>
              Team Members
            </Link>
            {/* <Link className={`w-full text-left my-1.5 font-[Inter] text-sm rounded-[15px] px-3 py-2.5 flex items-center text-black hover:bg-white`}
              to="/admin/campaign">
              <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" className="me-2">
                <path d="M716.923-460v-40h129.231v40H716.923Zm43.385 258.462-103.385-77.539 24.923-31.692 103.385 77.538-24.923 31.693Zm-81.539-450.77L653.846-684l103.385-77.539 24.923 31.693-103.385 77.538ZM220-241.538v-152.308h-41.539q-26.846 0-45.73-18.885-18.885-18.884-18.885-45.73v-43.078q0-26.846 18.885-45.73 18.884-18.885 45.73-18.885h149.231L486.154-660v360l-158.462-93.846H260v152.308h-40Zm336.923-122.923v-231.078q20.077 18.616 32.346 48.885 12.27 30.269 12.27 66.654t-12.27 66.654Q577-383.077 556.923-364.461Z" />
              </svg>
              Campaigns
            </Link> */}
            <Link className={`w-full text-left my-1.5 font-[Inter] text-xs rounded-[15px] px-3 py-2.5 flex items-center font-medium text-black hover:bg-white`}
              to="/admin/billing">
              <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" className="me-2">
                <path d="M184.615-200Q157-200 138.5-218.5 120-237 120-264.615v-430.77Q120-723 138.5-741.5 157-760 184.615-760h590.77Q803-760 821.5-741.5 840-723 840-695.385v430.77Q840-237 821.5-218.5 803-200 775.385-200h-590.77ZM160-512.307h640v-95.386H160v95.386Z" />
              </svg>
              Billing
            </Link>
            <Link className={`w-full text-left my-1.5 font-[Inter] text-xs rounded-[15px] px-3 py-2.5 flex items-center font-medium text-black hover:bg-white`}
              to="/admin/support">
              <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" className="me-2">
                <path d="M480.067-100.001q-78.836 0-148.204-29.92-69.369-29.92-120.682-81.21-51.314-51.291-81.247-120.629-29.933-69.337-29.933-148.173t29.92-148.204q29.92-69.369 81.21-120.682 51.291-51.314 120.629-81.247 69.337-29.933 148.173-29.933t148.204 29.92q69.369 29.92 120.682 81.21 51.314 51.291 81.247 120.629 29.933 69.337 29.933 148.173t-29.92 148.204q-29.92 69.369-81.21 120.682-51.291 51.314-120.629 81.247-69.337 29.933-148.173 29.933ZM364-182l58.77-133.848q-37.451-13.225-64.648-40.997-27.197-27.771-41.505-65.156L181.231-366q23.384 64 71.384 112T364-182Zm-47.383-355.999q13.538-37.385 40.961-64.653 27.423-27.269 64.423-40.731L366-778.769q-64.385 24.384-112.385 72.384T181.231-594l135.386 56.001Zm163.292 171.845q47.398 0 80.668-33.179 33.269-33.179 33.269-80.576 0-47.398-33.179-80.668-33.178-33.269-80.576-33.269-47.398 0-80.668 33.179-33.269 33.178-33.269 80.576 0 47.398 33.179 80.668 33.179 33.269 80.576 33.269ZM596-182q63-24 110.5-71.5T778-364l-133.848-58.77q-12.692 37-40.23 64.23-27.538 27.231-63.923 41.923L596-182Zm47.383-357.999L778-596q-24-63-71.5-110.5T596-778l-56.001 135.848q35.615 13.846 62.153 40.307 26.539 26.461 41.231 61.846Z" />
              </svg>
              Support
            </Link>
            {
              (
                location.pathname.indexOf('dashboard') > -1 || location.pathname.indexOf('client') > -1 ||
                location.pathname.indexOf('member') > -1 ||
                location.pathname.indexOf('billing') > -1 ||
                location.pathname.indexOf('support') > -1
              ) &&
              <div className={`absolute h-[25%] bg-white w-full rounded-[15px] shadow-sm -z-[1] transition-all duration-500 transform ${getOffsetBack()} `} />
            }
          </div>
        </div>
      </div>
      {loading && <Loading />}
      {!loading &&
        <div className="pt-[40px]">
          <div className='bg-[#EDECF2] px-[15px] py-[20px] ml-[230px]'>
            <Routes>
              <Route path="/dashboard/*" element={<AdminDashboard />} />
              <Route path="/client/:id" element={<AdminClient />} />
              <Route path="/member" element={<AdminMember />} />
              <Route path="/campaign" element={<AdminCampaign />} />
              <Route path="/billing" element={<AdminBilling />} />
              <Route path="/support" element={<AdminSupport />} />
            </Routes>
          </div>
        </div>
      }
    </div>
  );
};

export default Admin;