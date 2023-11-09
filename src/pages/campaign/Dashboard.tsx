import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ArrowLongDownIcon } from '@heroicons/react/20/solid';

import CreateCampaign from './CreateCampaign';
import APIInstance from '../../api';
import { selectAuth } from '../../store/authSlice';
import Loading from '../../components/Loading';

const Dashboard: FC = () => {
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [activePage, setActivePage] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState<Array<any>>([]);
  const [showList, setShowList] = useState(false);
  const [activeCampaign, setActiveCampaign] = useState<string>();

  const { email } = useSelector(selectAuth);

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
    <div className='px-[75px] py-[40px] text-left relative'>
      {loading && <Loading />}
      <h1 className='font-semibold font-[Inter] text-[32px]'>Welcome {email}</h1>
      <p className='my-4 text-[#43474A]'>Here is your account at a glance</p>

      <button className='rounded-[10px] bg-[#6C63FF] font-[Inter] font-semibold text-[white] font-md px-4 py-3' onClick={() => setShowAddDialog(true)}>Create New Campaign</button>
      <div className={`grid ${activePage === 'overview' ? 'grid-cols-1' : 'grid-cols-12'}`}>
        <div className={`transition-all ease-in-out duration-300 ${activePage === 'overview' ? 'col-span-full' : 'col-span-9'}`}>
          <div className='flex justify-between items-center mt-4 bg-white rounded-[10px] p-2'>
            <div>
              <button
                className={`text-left px-3 py-2 text-[Inter] rounded sm:min-w-[170px] me-2 ${activePage === 'overview' ? 'bg-black text-white' : 'bg-white text-black'}`}
                onClick={() => setActivePage('overview')}
              >
                Overview
              </button>
              <div className="group inline-flex flex-col">
                <button
                  onClick={() => setShowList(!showList)}
                  className={`text-left px-5 py-2 text-[Inter] flex justify-between items-center rounded sm:min-w-[170px] me-2 ${activePage === 'campaign' ? 'bg-black text-white' : 'bg-white text-black'}`}
                >
                  By Campaign
                  <ArrowLongDownIcon className='ms-3 h-[20px]' />
                </button>
                <div className='relative'>
                  <ul
                    className={`absolute bg-white border border-gray-300 sm:min-w-[200px] rounded border-[1px] border-gray-900 py-1 mt-2 w-32 ${showList ? 'block' : 'hidden'}`}
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
                              setActivePage('campaign');
                              setActiveCampaign(item.id);
                            }}
                          >
                            <p className='font-[Inter] text-md'>{item.name}</p>
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
            activePage === 'overview' &&
            <div className='mt-2 bg-white rounded-[10px] grid grid-cols-3'>
              <div className='col-span-1 py-5 px-4 flex items-center'>
                <div className='p-2'>
                  <p className='text-lg font-[Inter] text-semibold'>Active Campaigns</p>
                  <h2 className='text-[30px] font-[Inter] my-3 text-bold'>0</h2>
                  <p className='text-gray-700'>from 0 (last 4 weeks)</p>
                </div>
                <div className='bg-gray-300 rounded-full font-[Inter] py-1 px-3 text-md'>- 0%</div>
              </div>
              <div className='col-span-1 py-5 px-4 flex items-center border-x-[1px]'>
                <div className='p-2'>
                  <p className='text-lg font-[Inter] text-semibold'>Total Impressions</p>
                  <h2 className='text-[30px] font-[Inter] my-3 text-bold'>0</h2>
                  <p className='text-gray-700'>from 0 (last 4 weeks)</p>
                </div>
                <div className='bg-gray-300 rounded-full font-[Inter] py-1 px-3 text-md'>- 0%</div>
              </div>
              <div className='col-span-1 py-5 px-4 flex items-center'>
                <div className='p-2'>
                  <p className='text-lg font-[Inter] text-semibold'>Total Clicks</p>
                  <h2 className='text-[30px] font-[Inter] my-3 text-bold'>0</h2>
                  <p className='text-gray-700'>from 0 (last 4 weeks)</p>
                </div>
                <div className='bg-gray-300 rounded-full font-[Inter] py-1 px-3 text-md'>- 0%</div>
              </div>
            </div>
          }
          {
            activePage === 'campaign' &&
            <div className='mt-2 bg-white rounded-[10px] grid grid-cols-3'>
              <div className='col-span-1 py-5 px-4 flex items-center'>
                <div className='p-2'>
                  <p className='text-lg font-[Inter] text-semibold'>Total Impressions</p>
                  <h2 className='text-[30px] font-[Inter] my-3 text-bold'>0</h2>
                  <p className='text-gray-700'>from 0 (last 4 weeks)</p>
                </div>
                <div className='bg-gray-300 rounded-full font-[Inter] py-1 px-3 text-md'>- 0%</div>
              </div>
              <div className='col-span-1 py-5 px-4 flex items-center border-x-[1px]'>
                <div className='p-2'>
                  <p className='text-lg font-[Inter] text-semibold'>Total Clicks</p>
                  <h2 className='text-[30px] font-[Inter] my-3 text-bold'>0</h2>
                  <p className='text-gray-700'>from 0 (last 4 weeks)</p>
                </div>
                <div className='bg-gray-300 rounded-full font-[Inter] py-1 px-3 text-md'>- 0%</div>
              </div>
              <div className='col-span-1 py-5 px-4 flex items-center'>
                <div className='p-2'>
                  <p className='text-lg font-[Inter] text-semibold'>Avg Cost per Click</p>
                  <h2 className='text-[30px] font-[Inter] my-3 text-bold'>0</h2>
                  <p className='text-gray-700'>from 0 (last 4 weeks)</p>
                </div>
                <div className='bg-gray-300 rounded-full font-[Inter] py-1 px-3 text-md'>- 0%</div>
              </div>
            </div>
          }
          {
            activePage === 'newsletter' &&
            <div className='mt-2 bg-white rounded-[10px] p-4'>
              <div className='text-gray-700 font-[Inter] text-md'>
                Performance By:

                <span className='rounded-full bg-gray-900 px-3 py-1 text-white ms-3'>NewsLetter</span>
                <table className='w-full fot-[Inter] mt-5'>
                  <thead>
                    <tr className='border-b-[1px] border-gray-300'>
                      <th className='w-2/6 py-2 px-1'>NEWSLETTER</th>
                      <th className='w-1/6'>SPEND</th>
                      <th className='w-1/6'>REACH</th>
                      <th className='w-1/6'>CLICKS</th>
                      <th className='w-1/6'>CTR</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className='border-b-[1px] border-gray-300'>
                      <td className='py-2 px-2'>Good Energy Email</td>
                      <td>$6000</td>
                      <td>4641</td>
                      <td>2</td>
                      <td>0.04%</td>
                    </tr>
                    <tr className='border-b-[1px] border-gray-300'>
                      <td className='py-2 px-2'>Today Food</td>
                      <td>$9000</td>
                      <td>18488</td>
                      <td>3</td>
                      <td>0.02%</td>
                    </tr>
                    <tr className='border-b-[1px] border-gray-300'>
                      <td className='py-2 px-2'>FMG Newsletter</td>
                      <td>$3000</td>
                      <td>4633</td>
                      <td>1</td>
                      <td>0.02%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          }

          <div className='my-7 p-5 min-h-[250px] rounded-[10px] bg-white'>
            <h2 className='font-[Inter] text-[30px] font-semibold'>Campaign Overview</h2>
            <p className='font-[Inter] text-gray-500'>All Campaign Performance</p>
          </div>

          <CreateCampaign
            show={showAddDialog}
            setShow={(show: boolean) => setShowAddDialog(show)}
            afterAdd={(data: any) => setCampaign([...campaign, data])}
          />
        </div>
        {
          activePage !== 'overview' &&
          <div className='col-span-3 transition-all ease-in-out duration-300 bg-transparent px-2'>
            <input
              placeholder={`Search by ${activePage} name`}
              className='py-2 px-3 border-gray-900 rounded-[10px] mt-4 w-full border-[1px]'
            />
          </div>
        }
      </div>
    </div>
  );
};

export default Dashboard;