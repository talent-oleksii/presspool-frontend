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

  useEffect(() => {
    setLoading(true);
    AdminAPIInstance.get('/dashboard/client', { params: { searchStr } }).then(data => {
      setData(data.data);
    }).catch(err => {
      console.log('err:', err);
    }).finally(() => setLoading(false));
  }, [searchStr]);

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

  return (
    <div className="w-full flex">
      <div className="text-left flex-1">
        <h2 className="font-[Inter] font-semibold -tracking-[.6px] text-[20px]">Clients</h2>
        <div className='mt-4'>
          {loading && <Loading />}
          <div className='flex items-center'>
            <input
              value={searchStr}
              onChange={e => setSearchStr(e.target.value)}
              className='border-[1px] rounded-[5px] text-sm bg-white flex-1 border-[#7f8182] py-1.5 px-4'
            />
            <select className='py-1.5 text-sm rounded-[5px] ms-4 border-[#7f8182] border-[1px] w-[23.5%] 2xl:w-[190px]'>
              <option>All</option>
            </select>
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
          <div className='mt-4 bg-white rounded-[15px] px-[20px]'>
            {
              data && data.map((item, index) => (
                <div key={item.id} className={`relative flex py-4 items-center justify-between ${index !== data.length - 1 && 'border-b-[1px] border-[#d9d9d9]'}`}>
                  <div className='text-left min-w-[170px] pr-2'>
                    <div className='mt-1 flex items-center'>
                      <Avatar src={item.avatar} className='bg-[#7f8182]' size={40}>
                        {!item.avatar && getPlaceHolder(item.name)}
                      </Avatar>
                      <div className='ms-2'>
                        <p className='text-[#43474a] text-xs font-[Inter] -tracking-[.36px]'>{item.company}</p>
                        <p className='text-[#43474a] text-xs font-[Inter] -tracking-[.36px]'>{item.name}</p>
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