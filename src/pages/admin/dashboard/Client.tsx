import { FC, useEffect, useState } from 'react';
import { Dropdown } from 'antd';
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
    }).catch(err => {
      console.log('err:', err);
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

  const handleChangeState = (id: string, state: string) => {
    const newState = state === 'active' ? 'inactive' : 'active';
    setLoading(true);
    AdminAPIInstance.put('/dashboard/client', { id, data: newState, type: 'state' }).then(() => {
      setData(data.map(item => {
        if (item.id === id) {
          return { ...item, state: newState };
        }
        return item;
      }));
    }).catch(err => {
      console.log('error:', err);
    }).finally(() => setLoading(false));
  };

  console.log('er:', data);

  const getTotalCampaignCount = () => {
    let sum: number = 0;
    showData.forEach(item => {
      sum += Number(item.campaign_count);
    });

    return sum;
  };

  const getTotalSpend = () => {
    let sum: number = 0;
    showData.forEach(item => {
      sum += Number(item.spent);
    });

    return sum;
  };

  const getTotalBilled = () => {
    let sum: number = 0;
    showData.forEach(item => {
      sum += Number(item.billed);
    });

    return sum;
  };

  return (
    <div className="w-full flex">
      <div className="text-left flex-1">
        <h2 className="font-[Inter] font-semibold -tracking-[.6px] text-[20px]">Clients</h2>
        <div className='mt-4'>
          {loading && <Loading />}
          <div className='flex items-center grid grid-cols-4 gap-4'>
            <div className="col-span-1 rounded-[10px] pt-4 px-6 pb-2 bg-white">
              <div className='text-black -tracking-[.48px] font-medium text-base flex items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="20" viewBox="0 0 14 20" fill="none" className='me-2'>
                  <path d="M7 0C7.98891 0 8.95561 0.293245 9.77785 0.842652C10.6001 1.39206 11.241 2.17295 11.6194 3.08658C11.9978 4.00021 12.0969 5.00555 11.9039 5.97545C11.711 6.94536 11.2348 7.83627 10.5355 8.53553C9.83627 9.2348 8.94536 9.711 7.97545 9.90393C7.00555 10.0969 6.00021 9.99784 5.08658 9.6194C4.17295 9.24096 3.39206 8.6001 2.84265 7.77785C2.29324 6.95561 2 5.98891 2 5L2.005 4.783C2.06092 3.49575 2.61161 2.27978 3.54222 1.38866C4.47284 0.497541 5.71154 7.44425e-05 7 0Z" fill="black" />
                  <path d="M9 12C10.3261 12 11.5979 12.5268 12.5355 13.4645C13.4732 14.4021 14 15.6739 14 17V18C14 18.5304 13.7893 19.0391 13.4142 19.4142C13.0391 19.7893 12.5304 20 12 20H2C1.46957 20 0.960859 19.7893 0.585786 19.4142C0.210714 19.0391 0 18.5304 0 18V17C0 15.6739 0.526784 14.4021 1.46447 13.4645C2.40215 12.5268 3.67392 12 5 12H9Z" fill="black" />
                  <path d="M7 0C7.98891 0 8.95561 0.293245 9.77785 0.842652C10.6001 1.39206 11.241 2.17295 11.6194 3.08658C11.9978 4.00021 12.0969 5.00555 11.9039 5.97545C11.711 6.94536 11.2348 7.83627 10.5355 8.53553C9.83627 9.2348 8.94536 9.711 7.97545 9.90393C7.00555 10.0969 6.00021 9.99784 5.08658 9.6194C4.17295 9.24096 3.39206 8.6001 2.84265 7.77785C2.29324 6.95561 2 5.98891 2 5L2.005 4.783C2.06092 3.49575 2.61161 2.27978 3.54222 1.38866C4.47284 0.497541 5.71154 7.44425e-05 7 0Z" stroke="black" />
                  <path d="M9 12C10.3261 12 11.5979 12.5268 12.5355 13.4645C13.4732 14.4021 14 15.6739 14 17V18C14 18.5304 13.7893 19.0391 13.4142 19.4142C13.0391 19.7893 12.5304 20 12 20H2C1.46957 20 0.960859 19.7893 0.585786 19.4142C0.210714 19.0391 0 18.5304 0 18V17C0 15.6739 0.526784 14.4021 1.46447 13.4645C2.40215 12.5268 3.67392 12 5 12H9Z" stroke="black" />
                </svg>
                Total Clients
              </div>
              <p className='text-[#57d386] text-[25px] mt-2 -tracking-[.75px] font-semibold'>{showData.length}</p>
            </div>
            <div className="col-span-1 rounded-[10px] pt-4 px-6 pb-2 bg-white">
              <div className='text-black -tracking-[.48px] font-medium text-base flex items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18" fill="none" className='me-2'>
                  <path d="M16.668 4.41992C17.552 4.41992 18.3999 4.77111 19.025 5.39623C19.6501 6.02135 20.0013 6.8692 20.0013 7.75325C20.0013 8.63731 19.6501 9.48516 19.025 10.1103C18.3999 10.7354 17.552 11.0866 16.668 11.0866" fill="black" />
                  <path d="M7.77865 4.41992V16.6421C7.77865 16.9368 7.66158 17.2194 7.45321 17.4278C7.24483 17.6362 6.96222 17.7533 6.66753 17.7533H5.55642C5.26174 17.7533 4.97912 17.6362 4.77075 17.4278C4.56238 17.2194 4.44531 16.9368 4.44531 16.6421V11.0866" fill="black" />
                  <path d="M10 4.42052L15.0267 0.231626C15.1727 0.109968 15.3504 0.0324611 15.539 0.00818732C15.7275 -0.0160865 15.9191 0.0138786 16.0912 0.0945711C16.2633 0.175264 16.4088 0.30334 16.5108 0.463793C16.6127 0.624245 16.6668 0.810425 16.6667 1.00051V14.5072C16.6668 14.6973 16.6127 14.8835 16.5108 15.0439C16.4088 15.2044 16.2633 15.3324 16.0912 15.4131C15.9191 15.4938 15.7275 15.5238 15.539 15.4995C15.3504 15.4752 15.1727 15.3977 15.0267 15.2761L10 11.0872H1.11111C0.816426 11.0872 0.533811 10.9701 0.325437 10.7617C0.117063 10.5534 0 10.2708 0 9.97607V5.53163C0 5.23694 0.117063 4.95433 0.325437 4.74595C0.533811 4.53758 0.816426 4.42052 1.11111 4.42052H10Z" fill="black" />
                </svg>
                Total Campaigns
              </div>
              <p className='text-[#57d386] text-[25px] mt-2 -tracking-[.75px] font-semibold'>{getTotalCampaignCount()}</p>
            </div>
            <div className="col-span-1 rounded-[10px] pt-4 px-6 pb-2 bg-white">
              <div className='text-black -tracking-[.48px] font-medium text-base flex items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" className='me-2'>
                  <path d="M0 9C-1.76116e-08 10.1819 0.232792 11.3522 0.685084 12.4442C1.13738 13.5361 1.80031 14.5282 2.63604 15.364C3.47177 16.1997 4.46392 16.8626 5.55585 17.3149C6.64778 17.7672 7.8181 18 9 18C10.1819 18 11.3522 17.7672 12.4442 17.3149C13.5361 16.8626 14.5282 16.1997 15.364 15.364C16.1997 14.5282 16.8626 13.5361 17.3149 12.4442C17.7672 11.3522 18 10.1819 18 9C18 7.8181 17.7672 6.64778 17.3149 5.55585C16.8626 4.46392 16.1997 3.47177 15.364 2.63604C14.5282 1.80031 13.5361 1.13738 12.4442 0.685084C11.3522 0.232792 10.1819 0 9 0C7.8181 0 6.64778 0.232792 5.55585 0.685084C4.46392 1.13738 3.47177 1.80031 2.63604 2.63604C1.80031 3.47177 1.13738 4.46392 0.685084 5.55585C0.232792 6.64778 -1.76116e-08 7.8181 0 9Z" fill="black" />
                  <path d="M11.8 5.99918C11.6188 5.68494 11.3557 5.42588 11.0386 5.24973C10.7215 5.07358 10.3625 4.98698 10 4.99918H8C7.46957 4.99918 6.96086 5.20989 6.58579 5.58497C6.21071 5.96004 6 6.46875 6 6.99918C6 7.52961 6.21071 8.03832 6.58579 8.41339C6.96086 8.78847 7.46957 8.99918 8 8.99918H10C10.5304 8.99918 11.0391 9.20989 11.4142 9.58497C11.7893 9.96004 12 10.4687 12 10.9992C12 11.5296 11.7893 12.0383 11.4142 12.4134C11.0391 12.7885 10.5304 12.9992 10 12.9992H8C7.63749 13.0114 7.27849 12.9248 6.96142 12.7486C6.64435 12.5725 6.38115 12.3134 6.2 11.9992M9 4V14" stroke="#F5F5F5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Total Spend
              </div>
              <p className='text-[#57d386] text-[25px] mt-2 -tracking-[.75px] font-semibold'>{`$${getTotalSpend()}`}</p>
            </div>
            <div className="col-span-1 rounded-[10px] pt-4 px-6 pb-2 bg-white">
              <div className='text-black -tracking-[.48px] font-medium text-base flex items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="18" viewBox="0 0 14 18" fill="none" className='me-2'>
                  <path d="M0 18V2C0 1.46957 0.210714 0.960859 0.585786 0.585786C0.960859 0.210714 1.46957 0 2 0H12C12.5304 0 13.0391 0.210714 13.4142 0.585786C13.7893 0.960859 14 1.46957 14 2V18L11 16L9 18L7 16L5 18L3 16L0 18Z" fill="black" />
                  <path d="M9 5H6.5C6.10218 5 5.72064 5.15804 5.43934 5.43934C5.15804 5.72064 5 6.10218 5 6.5C5 6.89782 5.15804 7.27936 5.43934 7.56066C5.72064 7.84196 6.10218 8 6.5 8H7.5C7.89782 8 8.27936 8.15804 8.56066 8.43934C8.84196 8.72064 9 9.10218 9 9.5C9 9.89782 8.84196 10.2794 8.56066 10.5607C8.27936 10.842 7.89782 11 7.5 11H5M7 11V12.5M7 3.5V5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Total Billed
              </div>
              <p className='text-[#57d386] text-[25px] mt-1 -tracking-[.75px] font-semibold'>{`$${getTotalBilled()}`}</p>
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
                className='text-sm bg-[#edecf2] border-none p-0 ms-4 flex-1 focus:outline-0 focus:ring-0'
              />
            </div>
            {/* <select className='py-1.5 text-sm rounded-[5px] ms-4 border-[#7f8182] border-[1px] w-[23.5%] 2xl:w-[190px]'>
              <option>All</option>
            </select> */}
          </div>
          {/* <div className='mt-4'>
            <button
              className={`bg-[#7ffbae] font-[Inter] font-semibold text-sm px-6 py-2 rounded-lg ring-[#7f8182] ${currentTab === 'active' ? 'ring-[1px]' : 'ring-0'}`}
              onClick={() => setCurrentTab('active')}
            >
              Active Clients
            </button>
            <button
              className={`bg-[#ffc3c0] font-[Inter] font-semibold text-sm px-6 py-2 rounded-lg ms-4 ring-[#7f8182] ${currentTab === 'inactive' ? 'ring-[1px]' : 'ring-0'}`}
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
                        <p className='text-[#a3a3a3] text-[10px] font-[Inter] -tracking-[.36px]'>{item.name}</p>
                        <p className='font-[Inter] -tracking-[.3px] text-[10px] text-[#a3a3a3]'>{`ID: ${item.email}`}</p>
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
                    <p className='font-[Inter] text-[#43474a] text-xs font-medium -tracking-[.36px] mt-4'>{`$${item.spent}`}</p>
                  </div>
                  <div>
                    <p className='font-[Inter] text-[#a3a3a3] text-xs font-medium -tracking-[.36px]'>Account Manager</p>
                    <p className='font-[Inter] text-[#43474a] text-xs font-medium -tracking-[.36px] mt-4'>{adminName}</p>
                  </div>
                  <div className='flex flex-col items-center justify-center'>
                    <p className='font-[Inter] text-[#a3a3a3] text-xs font-medium -tracking-[.36px]'>Status</p>
                    <p className={`font-[Inter] text-black text-xs font-medium -tracking-[.36px] mt-4 px-2 rounded-full py-1 ${item.state === 'active' ? 'bg-[#7ffbae]' : 'bg-[#FF4D42]'}`}>{item.state === 'active' ? 'Active' : 'Inactive'}</p>
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
                    <Link className='w-full h-full text-[10px] rounded-lg bg-black font-medium text-white px-4 py-2' to={`/admin/client/${item.id}`}>Client Details</Link>
                  </div>
                  {/* <span className={`absolute rounded-full px-3 py-1 right-1 bg-black bottom-1 text-xs font-[Inter] ${item.state === 'inactive' ? 'text-[red]' : 'text-[#7ffbae]'}`}>{item.state}</span> */}
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