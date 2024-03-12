import { FC, useEffect, useState, useMemo } from 'react';
import Loading from '../../../components/Loading';
import AdminAPIInstance from '../../../api/adminApi';
import { Avatar } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../../store/authSlice';

const AdminDashboardClient: FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchStr, setSearchStr] = useState('');
  const { adminName } = useSelector(selectAuth);
  const [data, setData] = useState<Array<any>>([]);
  const [showData, setShowData] = useState<Array<any>>([]);

  useEffect(() => {
    setLoading(true);
    AdminAPIInstance.get('/dashboard/client', { params: { searchStr: '' } }).then(data => {
      setData(data.data);
      console.log('data:', data.data);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setShowData(data.filter(item => item.name.includes(searchStr) || item.company.includes(searchStr)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, searchStr]);

  const getPlaceHolder = (fullName: string) => {
    const names = fullName.split(' ');
    if (names.length === 2) {
      return `${names[0].at(0)}${names[1].at(0)}`;
    } else if (names.length === 1) {
      return `${names[0].at(0)}`;
    } else {
      return '';
    }
  };

  const totalCampaignCount = useMemo(() => data.reduce((prev, item) => prev + Number(item?.campaign_count ?? 0), 0), [data]);

  const activeCampaignCount = useMemo(() => data.reduce((prev, item) => prev + Number(item?.active_count ?? 0), 0), [data]);

  const totalSpend = useMemo(() => data.reduce((prev, item) => prev + Number(item?.price ?? 0), 0), [data]);

  const totalBilled = useMemo(() => data.reduce((prev, item) => prev + Number(item?.billed ?? 0), 0), [data]);

  // backend should be corrected.
  const completedCampaignCount = 0;

  return (
    <div className="w-full flex">
      <div className="text-left flex-1">
        <h2 className="font-[Inter] font-semibold -tracking-[.6px] text-[20px]">Clients</h2>
        <div className='mt-4'>
          {loading && <Loading />}
          <div className='flex items-center grid grid-cols-7 gap-2'>
            <div className="col-span-1 rounded-[10px] pt-2 px-2 pb-2 bg-white">
              <p className='text-[#7F8182] -tracking-[.42px] font-medium text-sm flex items-center'>
                Total Clients
              </p>
              <p className='text-black text-[25px] mt-2 -tracking-[.75px] font-semibold ms-2'>{showData.length}</p>
            </div>
            <div className="col-span-1 rounded-[10px] pt-2 px-2 pb-2 bg-white">
              <p className='text-[#7F8182] -tracking-[.42px] font-medium text-sm flex items-center'>
                Total Campaigns
              </p>
              <p className='text-black text-[25px] mt-2 -tracking-[.75px] font-semibold ms-2'>{totalCampaignCount}</p>
            </div>
            <div className="col-span-1 rounded-[10px] pt-2 px-2 pb-2 bg-white">
              <p className='text-[#7F8182] -tracking-[.42px] font-medium text-sm flex items-center'>
                Active Campaigns
              </p>
              <p className='text-black text-[25px] mt-2 -tracking-[.75px] font-semibold ms-2'>{activeCampaignCount}</p>
            </div>
            <div className="col-span-1 rounded-[10px] pt-2 px-2 pb-2 bg-white">
              <p className='text-[#7F8182] -tracking-[.42px] font-medium text-sm flex items-center'>
                Active Campaigns
              </p>
              <p className='text-black text-[25px] mt-2 -tracking-[.75px] font-semibold ms-2'>{totalCampaignCount - activeCampaignCount}</p>
            </div>
            <div className="col-span-1 rounded-[10px] pt-2 px-2 pb-2 bg-white">
              <p className='text-[#7F8182] -tracking-[.42px] font-medium text-sm flex items-center'>
                Completed Campaigns
              </p>
              <p className='text-black text-[25px] mt-2 -tracking-[.75px] font-semibold ms-2'>{completedCampaignCount}</p>
            </div>
            <div className="col-span-1 rounded-[10px] pt-2 px-2 pb-2 bg-white">
              <p className='text-[#7F8182] -tracking-[.42px] font-medium text-sm flex items-center'>
                Total Budget
              </p>
              <p className='text-black text-[25px] mt-2 -tracking-[.75px] font-semibold'>{`$${totalSpend}`}</p>
            </div>
            <div className="col-span-1 rounded-[10px] pt-2 px-2 pb-2 bg-white">
              <p className='text-[#7F8182] -tracking-[.42px] font-medium text-sm flex items-center'>
                Total Spent
              </p>
              <p className='text-[#57d386] text-[25px] mt-2 -tracking-[.75px] font-semibold'>{`$${totalBilled}`}</p>
            </div>
          </div>
          <div className='flex items-center mt-4'>
            <div className='rounded-[5px] flex-1 border-[1px] border-[#7f8182] py-2 px-4 bg-[#edecf2] flex items-center'>
              <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                <path d="M12.0016 1.07199C12.9542 1.62201 13.7832 2.36255 14.4368 3.24735C15.0903 4.13216 15.5544 5.14222 15.8 6.21444C16.0456 7.28666 16.0675 8.39801 15.8643 9.47908C15.6611 10.5601 15.2372 11.5877 14.619 12.4976L19.5637 17.4412C19.839 17.7125 19.9989 18.0795 20.0102 18.4659C20.0216 18.8522 19.8833 19.228 19.6244 19.5149C19.3655 19.8018 19.0058 19.9777 18.6203 20.006C18.2349 20.0342 17.8534 19.9126 17.5554 19.6665L17.4414 19.5635L12.4977 14.6188C11.3149 15.4222 9.93848 15.894 8.51156 15.9851C7.08464 16.0761 5.65938 15.7832 4.38408 15.1366C3.10878 14.4901 2.03003 13.5136 1.26007 12.3088C0.490105 11.104 0.0570647 9.71489 0.00600086 8.28598L0 8.00094L0.0050008 7.7159C0.0542013 6.33646 0.459431 4.99321 1.18131 3.8167C1.90318 2.64019 2.91715 1.67044 4.12465 1.00171C5.33216 0.332977 6.69213 -0.0119965 8.07239 0.00031853C9.45265 0.0126336 10.8063 0.381819 12.0016 1.07199Z" fill="#7F8182" />
                <circle cx="8.00781" cy="8.00391" r="6" fill="#F5F5F5" />
              </svg>
              <input
                value={searchStr}
                onChange={e => setSearchStr(e.target.value)}
                placeholder='Search by Client/Company Name'
                className='text-xs bg-[#edecf2] border-none p-0 ms-4 flex-1 focus:outline-0 focus:ring-0'
              />
            </div>
            {/* <select className='py-1.5 text-xs rounded-[5px] ms-4 border-[#7f8182] border-[1px] w-[23.5%] 2xl:w-[190px]'>
              <option>All</option>
            </select> */}
          </div>
          {/* <div className='mt-4'>
            <button
              className={`bg-main font-[Inter] font-semibold text-xs px-6 py-2 rounded-lg ring-[#7f8182] ${currentTab === 'active' ? 'ring-[1px]' : 'ring-0'}`}
              onClick={() => setCurrentTab('active')}
            >
              Active Clients
            </button>
            <button
              className={`bg-[#ffc3c0] font-[Inter] font-semibold text-xs px-6 py-2 rounded-lg ms-4 ring-[#7f8182] ${currentTab === 'inactive' ? 'ring-[1px]' : 'ring-0'}`}
              onClick={() => setCurrentTab('inactive')}
            >
              Inactive Clients
            </button>
          </div> */}
          <div className='mt-4'>
            {
              showData && showData.map((item, index) => (
                <div key={item.id} className={`bg-white mb-2 px-[20px] rounded-[15px] relative flex py-4 items-center justify-between ${index !== showData.length - 1 && 'border-b-[1px] border-[#d9d9d9]'}`}>
                  <div className='text-left min-w-[170px] pr-2'>
                    <div className='mt-1 flex items-center'>
                      <Avatar src={item.avatar} className='bg-[#7f8182]' size={40}>
                        {!item.avatar && getPlaceHolder(item.name)}
                      </Avatar>
                      <div className='ms-2'>
                        <p className='text-[#43474a] text-xs font-[Inter] -tracking-[.36px]'>{item.company}</p>
                        <p className='text-[#a3a3a3] text-xs font-[Inter] -tracking-[.36px]'>{item.name}</p>
                        <p className='font-[Inter] -tracking-[.3px] text-xs text-[#a3a3a3]'>{`ID: ${item.email}`}</p>
                      </div>
                    </div>
                  </div>
                  <div className='w-[1px] h-[25px] bg-[#a4a4a4]' />
                  <div>
                    <p className='font-[Inter] text-[#a3a3a3] text-xs font-medium -tracking-[.36px]'>Joined Date</p>
                    <p className='font-[Inter] text-[#43474a] text-xs font-medium -tracking-[.36px] mt-4'>{moment(Number(item.create_time)).format('DD/MM/YYYY')}</p>
                  </div>
                  <div>
                    <p className='font-[Inter] text-[#a3a3a3] text-xs font-medium -tracking-[.36px]'>Users</p>
                    <p className='font-[Inter] text-[#43474a] text-xs font-medium -tracking-[.36px] mt-4'>{1}</p>
                  </div>
                  <div>
                    <p className='font-[Inter] text-[#a3a3a3] text-xs font-medium -tracking-[.36px]'>Total Campaigns</p>
                    <p className='font-[Inter] text-[#43474a] text-xs font-medium -tracking-[.36px] mt-4'>{item.campaign_count}</p>
                  </div>
                  <div>
                    <p className='font-[Inter] text-[#a3a3a3] text-xs font-medium -tracking-[.36px]'>Total Spend</p>
                    <p className='font-[Inter] text-[#43474a] text-xs font-medium -tracking-[.36px] mt-4'>{`$${item.price}`}</p>
                  </div>
                  <div>
                    <p className='font-[Inter] text-[#a3a3a3] text-xs font-medium -tracking-[.36px]'>Account Manager</p>
                    <p className='font-[Inter] text-[#43474a] text-xs font-medium -tracking-[.36px] mt-4'>{adminName}</p>
                  </div>
                  <div className='items-center flex justify-center'>
                    {/* <Dropdown
                      menu={{
                        items: [{
                          key: '1',
                          label: <Link className='w-full h-full text-xs' to={`/admin/client/${item.id}`}>Details</Link>
                        }, {
                          key: '2',
                          label: <span className='w-full h-full text-xs'>{item.state === 'active' ? '`Deactiv`ate User' : 'Activate User'}</span>,
                          onClick: () => handleChangeState(item.id, item.state),
                        }]
                      }}
                      placement="bottomRight"
                    >
                      <button className='px-1 py-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                          <path d="M258.461-440q-16.5 0-28.25-11.75T218.461-480q0-16.5 11.75-28.25t28.25-11.75q16.501 0 28.251 11.75t11.75 28.25q0 16.5-11.75 28.25T258.461-440ZM480-440q-16.5 0-28.25-11.75T440-480q0-16.5 11.75-28.25T480-520q16.5 0 28.25 11.75T520-480q0 16.5-11.75 28.25T480-440Zm221.539 0q-16.501 0-28.251-11.75T661.538-480q0-16.5 11.75-28.25T701.539-520q16.5 0 28.25 11.75t11.75 28.25q0 16.5-11.75 28.25T701.539-440Z" />
                        </svg>
                      </button>
                    </Dropdown> */}
                    <Link className='w-full h-full text-xs rounded-lg bg-black font-medium text-white px-4 py-2' to={`/admin/client/${item.id}`}>Client Details</Link>
                  </div>
                  {/* <span className={`absolute rounded-full px-3 py-1 right-1 bg-black bottom-1 text-xs font-[Inter] ${item.state === 'inactive' ? 'text-[red]' : 'text-main'}`}>{item.state}</span> */}
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>

  );
};

export default AdminDashboardClient;