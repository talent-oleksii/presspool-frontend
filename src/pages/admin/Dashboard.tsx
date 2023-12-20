import { FC, useEffect, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { DatePicker } from "antd";

import AdminDashboardOverview from "./dashboard/Overview";
import ADminDashboardCampaign from './dashboard/Campaign';
import AdminDashboardClient from "./dashboard/Client";

const AdminDashboard: FC = () => {
  const location = useLocation();
  const navigator = useNavigate();
  const [range, setRange] = useState<any>([]);

  useEffect(() => {
    if (!location.pathname.includes('/overview') && !location.pathname.includes('/campaign') && !location.pathname.includes('/client'))
      navigator('/admin/dashboard/overview');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getOffsetBack = () => {
    if (location.pathname.indexOf('overview') > -1) return 'left-[1%]';
    if (location.pathname.indexOf('campaign') > -1) return 'left-[33.4%]';
    if (location.pathname.indexOf('client') > -1) return 'left-[67%]';

    return 'left-0';
  };

  return (
    <div className="min-h-screen w-full flex">
      <div className="text-left flex-1">
        <h2 className="font-[Inter] font-semibold -tracking-[.6px] text-[20px]">Welcome To Admin Dashboard 🤝</h2>
        <p className="mt-1 text-[#43474a] font-[Inter] text-sm">Here's a snapshot of Presspool.ai, all in one place</p>

        <div className="flex w-full items-center justify-between mt-4">
          <div className="flex relative">
            <Link to="/admin/dashboard/overview" className="z-[1] text-center text-[#505050] font-semibold text-sm px-4 py-3 min-w-[150px]">Overview</Link>
            <Link to="/admin/dashboard/campaign" className="z-[1] text-center text-[#505050] font-semibold text-sm px-4 py-3 min-w-[150px]">Campaigns</Link>
            <Link to="/admin/dashboard/client" className="z-[1] text-center text-[#505050] font-semibold text-sm px-4 py-3 min-w-[150px]">Clients</Link>

            <div
              className={`h-full w-[33.3%] bg-white absolute z-0 rounded-[15px] border-[1px] border-[#7ffbae] transition-all duration-500 ${getOffsetBack()}`}
            />
          </div>
          <DatePicker.RangePicker
            className='font-[Inter] rounded-[15px] py-[10px] border-[#7F8182] w-[230px]'
            onChange={(e) => setRange(e)}
          />
        </div>

        <div className="mt-4">
          <Routes>
            <Route path="/overview" element={<AdminDashboardOverview />} />
            <Route path="/campaign" element={<ADminDashboardCampaign />} />
            <Route path="/client" element={<AdminDashboardClient />} />
          </Routes>
        </div>
      </div>
      <div className='w-[300px] pl-[30px] pr-[20px] mt-[130px] text-left'>
        <div className='relative h-[300px]'>
          <div className='bg-[#7FFBAE] p-[19px] rounded-t-[14px] w-full top-0 z-10'>
            <p className='text-black text-base font-semibold font-[Inter]'>Quick Actions:</p>
            <p className='text-[#505050] font-[Inter] font-semibold text-[10px] 2xl:text-xs mt-[4px]'>Let’s get you where you need to go</p>
          </div>
          <div className='bg-white py-2 w-full z-0 rounded-b-[14px] shadow-md'>
            <Link to="/admin/dashboard/campaign" className='flex font-[Inter] font-medium text-xs 2xl:text-sm items-center px-3 py-2'>
              <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='ms-1 me-2'>
                <rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
                <path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
              </svg>
              Manage Campaigns
            </Link>
            <Link to="/admin/dashboard/client" className='flex font-[Inter] font-medium text-xs 2xl:text-sm items-center px-3 py-2'>
              <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='ms-1 me-2'>
                <rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
                <path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
              </svg>
              Manage Clients
            </Link>
            <Link to="/admin/billing" className='flex font-[Inter] font-medium text-xs 2xl:text-sm items-center px-3 py-2'>
              <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='ms-1 me-2'>
                <rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
                <path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
              </svg>
              View Billing
            </Link>
            <Link to="/support" className='flex font-[Inter] font-medium text-xs 2xl:text-sm items-center px-3 py-2'>
              <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='ms-1 me-2'>
                <rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
                <path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
              </svg>
              Train Ava
            </Link>
            <a href="https://forms.gle/T9Kc6JvaVhzwozYR8" className='flex font-[Inter] font-medium text-xs 2xl:text-sm items-center px-3 py-2' target='_blank' rel="noreferrer">
              <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='ms-1 me-2'>
                <rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
                <path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
              </svg>
              Feedback Form
            </a>
          </div>
        </div>
        <div className='relative'>
          <div className='bg-[#7FFBAE] p-[19px] rounded-t-[14px] w-full z-10'>
            <p className='text-black text-base font-semibold font-[Inter]'>Resources</p>
            <p className='text-[#505050] font-[Inter] font-semibold text-[10px] 2xl:text-xs mt-[5px]'>We are always here for you</p>
          </div>
          <div className='bg-white py-2 rounded-b-[14px] w-full z-0 top-[70px] shadow-md'>
            <a href="https://blog.presspool.ai" className='flex font-[Inter] font-medium text-xs 2xl:text-sm items-center px-3 py-2' rel='noreferrer' target='_blank'>
              <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='ms-1 me-2'>
                <rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
                <path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
              </svg>
              Blog
            </a>
            <a href="https://join.slack.com/t/presspoolsupport/shared_invite/zt-1ytywzzld-974gUfTB8zCYlP4~f5XT1Q" className='flex font-[Inter] font-medium text-xs 2xl:text-sm items-center px-3 py-2' target='_blank' rel='noreferrer'>
              <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='ms-1 me-2'>
                <rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
                <path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
              </svg>
              Slack
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;