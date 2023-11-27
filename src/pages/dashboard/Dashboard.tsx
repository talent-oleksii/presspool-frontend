import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import { DatePicker } from 'antd';
import { Flowbite, Dropdown } from 'flowbite-react';

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
  const [range, setRange] = useState<any>([]);

  const { email, name } = useSelector(selectAuth);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      APIInstance.get('data/campaign', {
        params: {
          email,
          from: range && range[0] ? range[0].unix() : null,
          to: range && range[1] ? range[1].unix() : null,
        }
      }),
    ]).then((results: Array<any>) => {
      setCampaign(results[0].data);
    }).catch(err => {
      console.log('err:', err);
    }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  return (
    <div className='text-left relative'>
      {loading && <Loading />}
      <h1 className='font-semibold font-[Inter] text-[32px] -tracking-[1.02px]'>Welcome {name} 🤝</h1>
      <p className='my-2 text-[#43474A]'>Here’s a snapshot of your account, all in one place</p>

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
                <Flowbite theme={{
                  theme: {
                    button: {
                      base: 'rounded-[5px]',
                      color: {
                        black: 'bg-black text-white',
                        white: 'bg-white text-black',
                      },
                    }
                  }
                }}>
                  <Dropdown
                    label="By Campaign"
                    color={`${id !== 'all' && id !== 'news' ? 'black' : 'white'}`}
                    theme={{ floating: { item: { base: "p-0" } } }}
                    className='text-left'
                  >
                    {
                      campaign.map((item: any) => (
                        <Dropdown.Item key={item.id}>
                          <Link to={`/campaign/${item.id}`} className='font-[Inter] text-md w-full'>{item.name}</Link>
                        </Dropdown.Item>
                      ))
                    }
                  </Dropdown>
                </Flowbite>
              </div>
            </div>
            <DatePicker.RangePicker
              className='font-[Inter]'
              onChange={(e) => setRange(e)}
            />
          </div>
          {
            id === 'all' ? <CampaignOverView data={campaign} /> : id === 'news' ? <NewsLetterDetail /> : <CampaignDetail id={id} />
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
        <div className='w-[280px] pl-3'>
          <div className='relative h-[370px]'>
            <div className='bg-[#c1ffd9] p-[19px] rounded-t-[14px] absolute w-full top-0 z-10'>
              <p className='text-black text-base font-semibold text-[Inter]'>Quick Actions:</p>
              <p className='text-[#505050] font-[Inter] font-semibold text-xs mt-[4px]'>Let’s get you where you need to go</p>
            </div>
            <div className='bg-white py-3 pt-[30px] absolute top-[55px] w-full z-0 rounded-[14px]'>
              <button onClick={() => setShowAddDialog(true)} className='flex font-[Inter] font-medium font-sm items-center px-3 py-2'>
                <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='mx-2'>
                  <rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
                  <path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
                </svg>
                Create New Campaign
              </button>
              <Link to="/detail" className='flex font-[Inter] font-medium font-sm items-center px-3 py-2'>
                <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='mx-2'>
                  <rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
                  <path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
                </svg>
                Manage Campaigns
              </Link>
              <a href="https://forms.gle/j1HCrRcrGK9roPhGA" className='flex font-[Inter] font-medium font-sm items-center px-3 py-2' target='_blank' rel="noreferrer">
                <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='mx-2'>
                  <rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
                  <path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
                </svg>
                Feature Request
              </a>
              <Link to="/billing" className='flex font-[Inter] font-medium font-sm items-center px-3 py-2'>
                <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='mx-2'>
                  <rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
                  <path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
                </svg>
                View Billing
              </Link>
              <Link to="/support" className='flex font-[Inter] font-medium font-sm items-center px-3 py-2'>
                <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='mx-2'>
                  <rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
                  <path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
                </svg>
                Contact Support
              </Link>
              <a href="https://forms.gle/T9Kc6JvaVhzwozYR8" className='flex font-[Inter] font-medium font-sm items-center px-3 py-2' target='_blank' rel="noreferrer">
                <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='mx-2'>
                  <rect x="0.5" y="4.5" width="12" height="10" fill="white" stroke="#7F8182" />
                  <path d="M16.495 2.07071C16.534 1.79734 16.3441 1.54408 16.0707 1.50502L11.6159 0.868629C11.3426 0.829576 11.0893 1.01953 11.0503 1.29289C11.0112 1.56626 11.2011 1.81953 11.4745 1.85858L15.4343 2.42426L14.8686 6.38406C14.8296 6.65743 15.0195 6.91069 15.2929 6.94975C15.5663 6.9888 15.8195 6.79885 15.8586 6.52548L16.495 2.07071ZM8.3 8.4L16.3 2.4L15.7 1.6L7.7 7.6L8.3 8.4Z" fill="#7F8182" />
                </svg>
                Give Feedback
              </a>
            </div>
          </div>
          <div className='relative'>
            <div className='bg-[#D1CEFF] p-[19px] rounded-t-[14px] absolute w-full z-10'>
              <p className='text-black text-base font-semibold'>Resources</p>
              <p className='text-[#505050] font-[Inter] font-semibold text-xs mt-[5px]'>We are always here for you</p>
            </div>
            <div className='bg-white py-3 rounded-[14px] absolute w-full z-0 top-[75px]'>
              <a href="https://blog.presspool.ai" className='flex font-[Inter] text-semibold font-sm items-center px-3 py-2' rel='noreferrer' target='_blank'>
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
                Go to Slack
              </a>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Dashboard;