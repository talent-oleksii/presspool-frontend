import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Avatar } from 'antd';
import { LineChart, Line, XAxis, YAxis } from 'recharts';

import Loading from '../../components/Loading';
import AdminAPIInstance from '../../api/adminApi';

const AdminClientCampaign: FC = () => {
  const [chartData, setChartData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>({});
  const [data, setData] = useState<any>({});
  const { campaignId } = useParams();

  const navigator = useNavigate();

  useEffect(() => {
    setLoading(true);
    if (campaignId && Number(campaignId) > 0) {
      AdminAPIInstance.get('/client-campaign', { params: { campaignId } }).then(data => {
        setData(data.data);
      }).finally(() => setLoading(false));
    }
  }, []);

  const goBack = () => {
    navigator(-1);
  };

  const getPlaceHolder = (fullName: string) => {
    if (!fullName) return '';
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
    <div>
      {loading && <Loading />}
      <div className='text-left'>
        <h2 className='font-[Inter] text-lg font-semibold -tracking-[.6px] flex items-center'>
          <button className='underline' onClick={goBack}>Dashboard</button>
          <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" className='mx-1'>
            <path d="M683.154-460H200v-40h483.154L451.461-731.692 480-760l280 280-280 280-28.539-28.308L683.154-460Z" />
          </svg>
          <span>{data.user_name}</span>
          <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" className='mx-1'>
            <path d="M683.154-460H200v-40h483.154L451.461-731.692 480-760l280 280-280 280-28.539-28.308L683.154-460Z" />
          </svg>
          <span>Campaigns</span>
          <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" className='mx-1'>
            <path d="M683.154-460H200v-40h483.154L451.461-731.692 480-760l280 280-280 280-28.539-28.308L683.154-460Z" />
          </svg>
          <span>{data.name}</span>
        </h2>
        <div className='mt-4 flex justify-between items-center border-b-[1px] border-[#bcbcbc] py-4'>
          <div className='flex items-center'>
            <Avatar size={77} src={data.avatar} className='bg-[#7f8182]'>
              {!data.avatar && getPlaceHolder(data.user_name)}
            </Avatar>
            <div className='ms-2 py-[20px]'>
              {/* <p className='font-[Inter] text-xs text-[#a3a3a3] -tracking-[.36px]'>{`ID: ${userData.id}`}</p> */}
              <p className='font-[Inter] text-lg text-secondry1 -tracking-[.54px]'>{data.company}</p>
            </div>
          </div>
          <div className='flex gap-4'>
            <div className='bg-white rounded-[10px] px-[20px] pt-[12px] min-w-[160px]'>
              <div className='flex items-center font-[Inter] text-xs font-medium -tracking-[.48px]'>
                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" className="me-2">
                  <path d="M718.461-450.001v-59.998h144.615v59.998H718.461Zm45.693 269.23-115.692-86.768 36.461-47.845 115.691 86.768-36.46 47.845Zm-80.77-465.383-36.46-47.845 115.691-86.769 36.461 47.845-115.692 86.769ZM210.001-220.771v-156.153h-40.77q-29.922 0-51.115-21.192-21.192-21.193-21.192-51.115v-61.538q0-29.922 21.192-51.115 21.193-21.192 51.115-21.192h154.615l179.23-106.922v419.996l-179.23-106.922h-53.847v156.153h-59.998Zm348.46-134.46v-249.538q23.539 21.308 37.923 53.692 14.385 32.385 14.385 71.077t-14.385 71.077Q582-376.539 558.461-355.231Z" />
                </svg>
                Total Impressions
              </div>
              <p className='text-[25px] font-[Inter] text-[#7ffbae] font-semibold -tracking-[.75px] mt-2 mb-0'>0</p>
            </div>
            <div className='bg-white rounded-[10px] px-[20px] pt-[12px] min-w-[160px]'>
              <div className='flex items-center font-[Inter] text-xs font-medium -tracking-[.48px]'>
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none" className="me-2">
                  <path d="M1 10H4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 1V4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5.80156 5.79961L3.60156 3.59961" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14.1992 5.79961L16.3992 3.59961" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5.80156 14.1992L3.60156 16.3992" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 8L21 12.3333L15.2222 15.2222L12.3333 21L8 8Z" fill="black" />
                </svg>
                Total Clicks
              </div>
              <p className='text-[25px] font-[Inter] text-[#7ffbae] font-semibold -tracking-[.75px] mt-2 mb-0'>{data.click_count}</p>
            </div>
            <div className='bg-white rounded-[10px] px-[20px] pt-[12px] pb-[7px] min-w-[160px]'>
              <div className='flex items-center font-[Inter] text-xs font-medium -tracking-[.48px]'>
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="20" viewBox="0 0 17 20" fill="none" className="me-2">
                  <path d="M12.5556 4.55469C13.2588 4.55469 13.9462 4.76322 14.5309 5.15391C15.1156 5.5446 15.5713 6.0999 15.8405 6.74959C16.1096 7.39928 16.18 8.11419 16.0428 8.8039C15.9056 9.49361 15.567 10.1271 15.0697 10.6244C14.5725 11.1217 13.9389 11.4603 13.2492 11.5975C12.5595 11.7347 11.8446 11.6643 11.1949 11.3951C10.5452 11.126 9.98991 10.6703 9.59922 10.0856C9.20853 9.50089 9 8.81346 9 8.11024L9.00356 7.95593C9.04332 7.04055 9.43492 6.17586 10.0967 5.54218C10.7585 4.90849 11.6393 4.55474 12.5556 4.55469Z" fill="black" />
                  <path d="M13.5084 13.4453C14.4345 13.4453 15.3227 13.7965 15.9776 14.4216C16.6325 15.0467 17.0004 15.8946 17.0004 16.7786V17.4453C17.0004 17.7989 16.8533 18.1381 16.5913 18.3881C16.3294 18.6382 15.9741 18.7786 15.6036 18.7786H8.61948C8.24902 18.7786 7.89373 18.6382 7.63178 18.3881C7.36982 18.1381 7.22266 17.7989 7.22266 17.4453V16.7786C7.22266 15.8946 7.59057 15.0467 8.24546 14.4216C8.90035 13.7965 9.78857 13.4453 10.7147 13.4453H13.5084Z" fill="black" />
                  <path d="M7.22179 1C8.10082 1 8.9601 1.26066 9.69099 1.74902C10.4219 2.23739 10.9915 2.93151 11.3279 3.74363C11.6643 4.55575 11.7523 5.44937 11.5808 6.31151C11.4093 7.17365 10.9861 7.96557 10.3645 8.58714C9.74292 9.20871 8.95099 9.632 8.08886 9.80349C7.22672 9.97498 6.33309 9.88697 5.52097 9.55058C4.70886 9.21419 4.01473 8.64453 3.52637 7.91365C3.03801 7.18276 2.77734 6.32347 2.77734 5.44444L2.78179 5.25156C2.83149 4.10733 3.32099 3.02647 4.14821 2.23436C4.97542 1.44226 6.07649 1.00007 7.22179 1Z" fill="black" stroke="white" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 11.666C10.1787 11.666 11.3092 12.1343 12.1427 12.9678C12.9762 13.8013 13.4444 14.9317 13.4444 16.1105V16.9993C13.4444 17.4708 13.2571 17.923 12.9237 18.2564C12.5903 18.5898 12.1382 18.7771 11.6667 18.7771H2.77778C2.30628 18.7771 1.8541 18.5898 1.5207 18.2564C1.1873 17.923 1 17.4708 1 16.9993V16.1105C1 14.9317 1.46825 13.8013 2.30175 12.9678C3.13524 12.1343 4.2657 11.666 5.44444 11.666H9Z" fill="black" stroke="white" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                New Visitors
              </div>
              <p className='text-[25px] font-[Inter] text-[#7ffbae] font-semibold -tracking-[.75px] mt-2 mb-0'>{data.unique_clicks}</p>
            </div>
            <div className='bg-white rounded-[10px] px-[20px] pt-[12px] pb-[7px] min-w-[160px]'>
              <div className='flex items-center font-[Inter] text-xs font-medium -tracking-[.48px]'>
                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" className="me-2">
                  <path d="M264.615-120Q237-120 218.5-138.5 200-157 200-184.615v-590.77Q200-803 218.5-821.5 237-840 264.615-840H580l180 180v475.385Q760-157 741.5-138.5 723-120 695.385-120h-430.77Zm209.231-110h40v-40h60q8.5 0 14.25-5.75t5.75-14.25v-120q0-8.5-5.75-14.25t-14.25-5.75h-140v-80h160v-40h-80v-40h-40v40h-60q-8.5 0-14.25 5.75t-5.75 14.25v120q0 8.5 5.75 14.25t14.25 5.75h140v80h-160v40h80v40Zm89.308-430h140l-140-140v140Z" />
                </svg>
                Total Billed
              </div>
              <p className='text-[25px] font-[Inter] text-[#7ffbae] font-semibold -tracking-[.75px] mt-2 mb-0'>{data.billed}</p>
            </div>
          </div>
        </div>
        <div className='my-[14px] p-[25px] min-h-[250px] rounded-[10px] bg-white shadow-md'>
          <div className='flex justify-between items-center'>
            <div>
              {data.state && <span className={`rounded-[10px] text-[10px] px-[12px] py-[4px] font-medium ${data.state === 'draft' ? 'bg-[#dbdbdb]' : data.state === 'paused' ? 'bg-[#fdbdbd]' : 'bg-[#7ffbae]'}`}>{data.state}</span>}
              <h2 className='font-[Inter] mt-4 text-xs 2xl:text-lg font-semibold'>{data.name || ''}</h2>
              {/* <p className='text-xs'>{`https://track.presspool.ai/${data.uid || 1}`}</p> */}
              <p className='font-[Inter] text-secondry1 mt-[5px] text-xs 2xl:text-xs'>Let’s see how your campaigns are performing</p>
            </div>

            {/* <button className='border-[1px] px-2 py-1 font-[Inter] rounded-[10px] text-xs 2xl:text-md font-semibold border-[#7f8182]' onClick={handleDownloadCSV}>
            Download as CSV
          </button> */}
          </div>

          <div className='flex relative'>
            <LineChart width={700} height={200} data={chartData} className='mt-[50px] w-full'>
              <Line type="linear" dataKey="click" stroke="#7F8182" />
              <Line type="linear" dataKey="impression" stroke="black" />
              <XAxis dataKey="date" />
              <YAxis />
            </LineChart>
            <div className='absolute right-[20px] top-0'>
              <p className='font-[Inter] text-primary text-xs 2xl:text-xs font-semibold mb-2'>Total Impressions</p>
              <p className='font-[Inter] text-secondry2 text-xs 2xl:text-xs mt-2 font-semibold'>Total Clicks</p>
            </div>
          </div>
        </div>
        <p className='text-lg -tracking-[.6px] font-semibold'>Top Devices</p>
      </div>
    </div>
  );
};

export default AdminClientCampaign;