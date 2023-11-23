import { FC, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Collapsible from 'react-collapsible';

import CreateCampaign from '../dashboard/CreateCampaign';
import { selectAuth } from '../../store/authSlice';

import APIInstance from '../../api';
import Loading from '../../components/Loading';
import DialogUtils from '../../utils/DialogUtils';
import EditCampaign from './EditCampaign';

const Campaign: FC = () => {
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState(false);
  const [currentData, setCurrentData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [searchStr, setSearchStr] = useState('');
  const [campaign, setCampaign] = useState<Array<any>>([]);
  const { company } = useSelector(selectAuth);

  const { email } = useSelector(selectAuth);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      APIInstance.get('data/campaign', { params: { email, searchStr } }),
    ]).then((results: Array<any>) => {
      setCampaign(results[0].data);
    }).catch(err => {
      console.log('err:', err);
    }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchStr]);

  const handleUpdate = (id: string, state: string) => {
    setLoading(true);
    APIInstance.put('data/campaign_detail', {
      state,
      id,
      type: 'state',
    }).then(() => {
      setCampaign(campaign.map(item => {
        if (item.id === id) {
          return { ...item, state };
        }
        return item;
      }));
      DialogUtils.show('success', state === 'paused' ? 'Successfully Paused the Campaign' : 'Successfully Started the Campaign', '');
    }).catch(err => {
      console.log('puaseing error:', err);
    }).finally(() => setLoading(false));
  };

  return (
    <div className='text-left relative'>
      {loading && <Loading />}
      <h2 className='text-[32px] font-[Inter] text-black font-semibold'>{`${company}'s Campaigns 📈`}</h2>
      <p className='my-2 text-[#43474A] font-normal'>Here's your account at a glance.</p>

      <button className='rounded-[5px] bg-[#6C63FF] font-[Inter] font-semibold text-[white] font-md px-4 py-2' onClick={() => setShowAddDialog(true)}>Create New Campaign</button>

      <div className='flex items-center justify-center w-full'>
        <input
          className='me-2 mt-4 font-[Inter] flex-1 px-4 py-2 border-gray-500 border-[1px] rounded-[5px]'
          placeholder='Type here to search by campaign name'
          value={searchStr}
          onChange={e => setSearchStr(e.target.value)}
        />
        <select className='font-[Inter] mt-4 px-3 py-2 rounded-[5px] border-[1px] border-gray-500'>
          <option value="nto">Newest to Oldest</option>
          <option value="otn">Oldest to Newest</option>
        </select>
      </div>

      <div className='mt-1'>
        {campaign.map(item => (
          <Collapsible key={item.id} trigger={(
            <div
              className='flex p-[32px] bg-white my-2 rounded-[10px] justify-between items-center w-full relative'
            >
              <p className='font-semibold font-[Inter] text-[16px]'>{item.name}</p>
              <div className='flex flex-col items-center'>
                <p className='font-semibold font-[Inter] text-[10px]'>Start Date:</p>
                <p className='font-semibold font-[Inter] text-[12px]'>{new Date(Number(item.create_time)).toLocaleDateString()}</p>
              </div>
              <div className='flex flex-col items-center'>
                <p className='font-semibold font-[Inter] text-[10px]'>Total Impressions:</p>
                <p className='font-semibold font-[Inter] text-[12px]'>0</p>
              </div>
              <div className='flex flex-col items-center'>
                <p className='font-semibold font-[Inter] text-[10px]'>Total Total Clicks:</p>
                <p className='font-semibold font-[Inter] text-[12px]'>{item.click_count}</p>
              </div>
              <div className='flex flex-col items-center'>
                <p className='font-semibold font-[Inter] text-[10px]'>AVG CPC:</p>
                <p className='font-semibold font-[Inter] text-[12px]'>{`$${item.demographic === 'consumer' ? 8 : 20}`}</p>
              </div>
              <div className='flex flex-col items-center'>
                <p className='font-semibold font-[Inter] text-[10px]'>Total Spend:</p>
                <p className='font-semibold font-[Inter] text-[12px]'>{`$${item.click_count * (item.demographic === 'consumer' ? 8 : 20)}`}</p>
              </div>
              <div className='flex flex-col items-center'>
                <p className='font-semibold font-[Inter] text-[10px]'>Budget Remaining:</p>
                <p className='font-semibold font-[Inter] text-[12px]'>{`$${item.price}`}</p>
              </div>
              <span className={`rounded-full text-[10px] px-[12px] py-[4px] ${item.state === 'draft' ? 'bg-[#dbdbdb]' : item.state === 'paused' ? 'bg-[#fdbdbd]' : 'bg-[#7ffbae]'}`}>{item.state}</span>
            </div>
          )}
          >
            <div className='border-t-[1px] border-black/[.12] bg-white p-[25px] rounded-[10px]'>
              <div className='flex'>
                <img className='w-[242px] h-[133px] object-none' alt="market" src={item.image} />
                <div className='ms-[16px] py-[10px] flex flex-col items-start justify-center'>
                  <p className='text-black font-[Inter] text-xs font-normal'>Headline</p>
                  <h2 className='font-[Inter] text-black font-semibold text-base'>{item.headline}</h2>
                  <p className='text-black font-[Inter] mt-[14px] text-xs font-normal'>Description</p>
                  <p className='text-black font-[Inter] font-normal text-xs'>{item.body}</p>
                  <p className='text-black font-[Inter] mt-[14px] text-xs font-normal'>Audiences</p>
                  <p className='text-black font-[Inter] font-normal text-xs'>{item.audience.join(',')}</p>
                </div>
              </div>
              <div className='mt-[16px] flex items-center justify-end w-full'>
                {/* <button
                  className='underline font-[Inter] text-[#6c63ff] px-4 py-2 me-2 text-[10px]'
                  onClick={() => {
                    setCurrentData({ ...item, currentTab: 'budget' });
                    setShowEdit(true);
                  }}
                >
                  Raise Budget
                </button> */}
                <button
                  className='bg-[#6c63ff] px-4 py-2 rounded text-white font-[Inter] text-[10px]'
                  onClick={() => {
                    setCurrentData({ ...item, currentTab: 'budget' });
                    setShowEdit(true);
                  }}
                >
                  Edit Campaign
                </button>
                {
                  item.state !== 'paused' ?
                    <button
                      className='underline font-[Inter] text-[#505050] px-4 py-2 me-2 text-[10px]'
                      onClick={() => handleUpdate(item.id, 'paused')}
                    >
                      Pause
                    </button> :
                    <button
                      className='underline font-[Inter] text-[#505050] px-4 py-2 me-2 text-[10px]'
                      onClick={() => handleUpdate(item.id, 'active')}
                    >
                      Start
                    </button>
                }
              </div>
            </div>
          </Collapsible>
        ))
        }
      </div>

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

      <EditCampaign
        show={showEdit}
        setShow={(show: boolean) => setShowEdit(show)}
        data={currentData}
      />
    </div>
  );
};

export default Campaign;