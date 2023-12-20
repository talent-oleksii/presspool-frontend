import { Avatar } from 'antd';
import { FC, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import AdminAPIInstance from '../../api/adminApi';
import Loading from '../../components/Loading';

const AdminClient: FC = () => {
  const { id } = useParams();
  const navigator = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>({});
  const [campaignData, setCampaignData] = useState<Array<any>>([]);

  useEffect(() => {
    setLoading(true);
    AdminAPIInstance.get('/client', { params: { id } }).then(data => {
      console.log('data:', data.data);
      setUserData(data.data.userData);
      setCampaignData(data.data.campaignData);
    }).catch(err => {
      console.log('err:', err);
    }).finally(() => setLoading(false));
  }, [id]);

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
        <h2 className='font-[Inter] text-[20px] font-semibold -tracking-[.6px] flex items-center'>
          <button className='underline' onClick={goBack}>Dashboard</button>
          <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" className='mx-1'>
            <path d="M683.154-460H200v-40h483.154L451.461-731.692 480-760l280 280-280 280-28.539-28.308L683.154-460Z" />
          </svg>
          <span>Client Details</span>
        </h2>
        <p className='text-[#43474a] text-sm font-[Inter] mt-1'>One-stop shop to manage all clients</p>
        <div className='mt-4 flex justify-between items-center border-b-[1px] border-[#bcbcbc] py-4'>
          <div className='flex items-center'>
            <Avatar size={77} src={userData.avatar} className='bg-[#7f8182]'>
              {!userData.avatar && getPlaceHolder(userData.name)}
            </Avatar>
            <div className='ms-2 py-[20px]'>
              <p className='font-[Inter] text-xs text-[#a3a3a3] -tracking-[.36px]'>{`ID: ${userData.id}`}</p>
              <p className='font-[Inter] text-lg text-[#43474a] -tracking-[.54px]'>{userData.company}</p>
            </div>
          </div>
          <div className='flex gap-4'>
            <div className='bg-white rounded-[10px] px-[20px] pt-[12px] min-w-[240px]'>
              <div className='flex items-center font-[Inter] text-base font-medium -tracking-[.48px]'>
                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" className="me-2">
                  <path d="M718.461-450.001v-59.998h144.615v59.998H718.461Zm45.693 269.23-115.692-86.768 36.461-47.845 115.691 86.768-36.46 47.845Zm-80.77-465.383-36.46-47.845 115.691-86.769 36.461 47.845-115.692 86.769ZM210.001-220.771v-156.153h-40.77q-29.922 0-51.115-21.192-21.192-21.193-21.192-51.115v-61.538q0-29.922 21.192-51.115 21.193-21.192 51.115-21.192h154.615l179.23-106.922v419.996l-179.23-106.922h-53.847v156.153h-59.998Zm348.46-134.46v-249.538q23.539 21.308 37.923 53.692 14.385 32.385 14.385 71.077t-14.385 71.077Q582-376.539 558.461-355.231Z" />
                </svg>
                Total Campaigns
              </div>
              <p className='text-[25px] font-[Inter] text-[#7ffbae] font-semibold -tracking-[.75px] mt-2 mb-0'>{campaignData.length}</p>
            </div>
            <div className='bg-white rounded-[10px] px-[20px] pt-[12px] pb-[7px] min-w-[240px]'>
              <div className='flex items-center font-[Inter] text-base font-medium -tracking-[.48px]'>
                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" className="me-2">
                  <path d="M459.385-215.385h39.23v-46.923q43.077-3.615 82.539-30.923 39.461-27.307 39.461-84.769 0-42-25.538-71.615-25.538-29.616-97.538-55.616-66.154-23.077-84.539-39.615-18.385-16.539-18.385-47.154 0-30.615 23.885-51t63.5-20.385q30.462 0 50.769 13.962 20.308 13.962 32.923 35.423l34.77-13.692q-14.077-28.846-41.27-48.308-27.192-19.462-58.577-21.692v-46.923h-39.23v46.923q-52.308 8.692-79.154 39-26.846 30.307-26.846 66.692 0 43.154 27.115 69.077Q409.615-497 474-473.692q64.538 23.769 86.731 42.923 22.192 19.154 22.192 52.769 0 42.231-30.808 60.808-30.807 18.577-66.115 18.577-34.538 0-62.346-20.116-27.808-20.115-44.423-57.269L344-360.769q17.077 41.077 45.808 64.038 28.73 22.962 69.577 32.423v48.923ZM480-120q-74.539 0-140.231-28.423t-114.308-77.038q-48.615-48.616-77.038-114.308Q120-405.461 120-480t28.423-140.231q28.423-65.692 77.038-114.308 48.616-48.615 114.308-77.038Q405.461-840 480-840t140.231 28.423q65.692 28.423 114.308 77.038 48.615 48.616 77.038 114.308Q840-554.539 840-480t-28.423 140.231q-28.423 65.692-77.038 114.308-48.616 48.615-114.308 77.038Q554.539-120 480-120Z" />
                </svg>
                Total Spend
              </div>
              <p className='text-[25px] font-[Inter] text-[#7ffbae] font-semibold -tracking-[.75px] mt-2 mb-0'>{`$${campaignData.map(item => Number(item.spent)).reduce((acc, current) => acc + current, 0)}`}</p>
            </div>
            <div className='bg-white rounded-[10px] px-[20px] pt-[12px] pb-[7px] min-w-[240px]'>
              <div className='flex items-center font-[Inter] text-base font-medium -tracking-[.48px]'>
                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" className="me-2">
                  <path d="M264.615-120Q237-120 218.5-138.5 200-157 200-184.615v-590.77Q200-803 218.5-821.5 237-840 264.615-840H580l180 180v475.385Q760-157 741.5-138.5 723-120 695.385-120h-430.77Zm209.231-110h40v-40h60q8.5 0 14.25-5.75t5.75-14.25v-120q0-8.5-5.75-14.25t-14.25-5.75h-140v-80h160v-40h-80v-40h-40v40h-60q-8.5 0-14.25 5.75t-5.75 14.25v120q0 8.5 5.75 14.25t14.25 5.75h140v80h-160v40h80v40Zm89.308-430h140l-140-140v140Z" />
                </svg>
                Total Billed
              </div>
              <p className='text-[25px] font-[Inter] text-[#7ffbae] font-semibold -tracking-[.75px] mt-2 mb-0'>{`$${campaignData.map(item => Number(item.billed)).reduce((acc, current) => acc + current, 0)}`}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminClient;