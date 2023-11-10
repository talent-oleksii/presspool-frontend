import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import { ArrowLongDownIcon } from '@heroicons/react/20/solid';

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
      <h1 className='font-semibold font-[Inter] text-[32px]'>Welcome {name}</h1>
      <p className='my-4 text-[#43474A]'>Here is your account at a glance</p>

      <button className='rounded-[10px] bg-[#6C63FF] font-[Inter] font-semibold text-[white] font-md px-4 py-3' onClick={() => setShowAddDialog(true)}>Create New Campaign</button>
      <div>
        <div className='transition-all ease-in-out duration-300'>
          <div className='flex justify-between items-center mt-4 bg-white rounded-[10px] p-2'>
            <div>
              <Link
                className={`text-left px-3 py-2 text-[Inter] rounded sm:min-w-[170px] me-2 ${id === 'all' ? 'bg-black text-white' : 'bg-white text-black'}`}
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
                  <ArrowLongDownIcon className='ms-3 h-[20px]' />
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
      </div>
    </div>
  );
};

export default Dashboard;