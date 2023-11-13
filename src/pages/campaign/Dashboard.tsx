import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import { HiArrowSmDown } from 'react-icons/hi';

import CreateCampaign from './CreateCampaign';
import APIInstance from '../../api';
import { selectAuth } from '../../store/authSlice';
import Loading from '../../components/Loading';
import CampaignOverView from './CampaignOverView';
import CampaignDetail from './CampaignDetail';
import NewsLetterDetail from './NewsLetterDetail';

const Dashboard: FC = () => {
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState<Array<any>>([]);
  const [showList, setShowList] = useState(false);

  const { email, name } = useSelector(selectAuth);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      APIInstance.get('data/campaign', { params: { email } }),
    ]).then((results: Array<any>) => {
      console.log('data:', results);
      setCampaign(results[0].data);
    }).catch(err => {
      console.log('err:', err);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className='text-left relative'>
      {loading && <Loading />}
      <h1 className='font-semibold font-[Inter] text-[32px]'>Welcome {name} 🤝</h1>
      <p className='my-4 text-[#43474A]'>Here’s a snapshot of your account, all in one place</p>

      <button className='rounded-[5px] bg-[#6C63FF] font-[Inter] font-semibold text-[white] font-md px-4 py-2' onClick={() => setShowAddDialog(true)}>Create New Campaign</button>
      <div className='flex'>
        <div className='flex-1 transition-all ease-in-out duration-300'>
          <div className='flex justify-between items-center mt-4 bg-white rounded-[10px] p-2'>
            <div>
              <Link
                className={`inline-flex text-left px-3 py-2 text-[Inter] rounded sm:w-[170px] me-2 ${id === 'all' ? 'bg-black text-white' : 'bg-white text-black'}`}
                to="/campaign/all"
              >
                Overview
              </Link>
              <div className="group inline-flex flex-col">
                <button
                  onClick={() => setShowList(!showList)}
                  className={`text-left px-5 py-2 text-[Inter] flex justify-between items-center rounded sm:min-w-[170px] me-2 ${id !== 'all' && id !== 'news' ? 'bg-black text-white' : 'bg-white text-black'}`}
                >
                  By Campaign
                  <HiArrowSmDown className='ms-3 h-[20px]' />
                </button>
                <div className='relative'>
                  <ul
                    className={`z-30 absolute bg-white border border-gray-300 sm:min-w-[200px] rounded border-[1px] border-gray-900 py-1 mt-2 w-32 ${showList ? 'block' : 'hidden'}`}
                    onMouseOver={() => setShowList(true)}
                    onMouseLeave={() => setShowList(false)}
                  >
                    {
                      campaign.map((item: any) => {
                        return (
                          <li
                            key={item.id}
                            className='px-2 flex justify-between items-center block text-gray-800 hover:bg-gray-900 hover:text-white cursor-pointer'
                            onClick={() => {
                              setShowList(false);
                            }}
                          >
                            <Link to={`/campaign/${item.id}`} className='font-[Inter] text-md w-full'>{item.name}</Link>
                          </li>
                        );
                      })
                    }
                  </ul>
                </div>
              </div>
              {/* <button
                className={`text-left px-5 py-2 text-[Inter] rounded sm:min-w-[170px] me-2 ${activePage === 'newsletter' ? 'bg-black text-white' : 'bg-white text-black'}`}
                onClick={() => setActivePage('newsletter')}
              >
                By Newsletter
              </button> */}
            </div>
            <select className='border-[1px] px-2 py-2 font-[Inter] rounded font-semibold'>
              <option>Last 4 weeks</option>
              <option>Last 2 weeks</option>
            </select>
          </div>
          {
            id === 'all' ? <CampaignOverView /> : id === 'news' ? <NewsLetterDetail /> : <CampaignDetail id={id} />
          }

          <CreateCampaign
            show={showAddDialog}
            setShow={(show: boolean) => setShowAddDialog(show)}
            afterAdd={(data: any) => {
              const newArray = [...campaign, data];
              const uniqueIds = new Set();
              setCampaign(newArray.filter(obj => {
                const id = obj.id;
                if (!uniqueIds.has(id)) {
                  uniqueIds.add(id);
                  return true;
                }
                return false;
              }))
            }}
          />
        </div>
        <div className='w-[280px] p-3 '>
          <div className='border-[#7f8182] border-[1px]'>
            <div className='bg-[#c1ffd9] p-[19px]'>
              <p className='text-black text-base font-semibold'>Quick Actions:</p>
              <p className='text-[#505050] font-[Inter] font-semibold text-xs'>Let’s get you where you need to go</p>
            </div>
            <div className='bg-white py-3'>
              <button onClick={() => setShowAddDialog(true)} className='flex font-[Inter] text-semibold font-sm items-center px-3 py-2'>
                <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='mx-2'>
                  <rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
                  <path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
                </svg>
                Create New Campaign
              </button>
              <Link to="/detail" className='flex font-[Inter] text-semibold font-sm items-center px-3 py-2'>
                <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='mx-2'>
                  <rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
                  <path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
                </svg>
                Manage Campaigns
              </Link>
              <Link to="/detail" className='flex font-[Inter] text-semibold font-sm items-center px-3 py-2'>
                <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='mx-2'>
                  <rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
                  <path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
                </svg>
                View Reports
              </Link>
              <Link to="/billing" className='flex font-[Inter] text-semibold font-sm items-center px-3 py-2'>
                <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='mx-2'>
                  <rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
                  <path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
                </svg>
                View Billing
              </Link>
              <Link to="/support" className='flex font-[Inter] text-semibold font-sm items-center px-3 py-2'>
                <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='mx-2'>
                  <rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
                  <path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
                </svg>
                Contact Support
              </Link>
              <Link to="/feedback" className='flex font-[Inter] text-semibold font-sm items-center px-3 py-2'>
                <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='mx-2'>
                  <rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
                  <path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
                </svg>
                Give Feedback
              </Link>
            </div>
          </div>
          <div className='border-[#7f8182] border-[1px] mt-4'>
            <div className='bg-[#D1CEFF] p-[19px]'>
              <p className='text-black text-base font-semibold'>Resources</p>
              <p className='text-[#505050] font-[Inter] font-semibold text-xs'>We are always here for you</p>
            </div>
            <div className='bg-white py-3'>
              <a href="https://blog.com" className='flex font-[Inter] text-semibold font-sm items-center px-3 py-2' rel='noreferrer' target='_blank'>
                <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='mx-2'>
                  <rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
                  <path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
                </svg>
                Blog
              </a>
              <a href="https://join.slack.com/t/presspoolsupport/shared_invite/zt-1ytywzzld-974gUfTB8zCYlP4~f5XT1Q" className='flex font-[Inter] text-semibold font-sm items-center px-3 py-2' target='_blank' rel='noreferrer'>
                <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='mx-2'>
                  <rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
                  <path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
                </svg>
                Manage Campaigns
              </a>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Dashboard;