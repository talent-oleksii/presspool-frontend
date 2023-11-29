import { FC, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from "framer-motion";
import { Collapse } from 'antd';

import { selectAuth } from '../../store/authSlice';
import { selectData, updateCampaign } from '../../store/dataSlice';

import APIInstance from '../../api';
import Loading from '../../components/Loading';
import DialogUtils from '../../utils/DialogUtils';
import EditCampaign from './EditCampaign';

import { FADE_UP_ANIMATION_VARIANTS } from '../../utils/TransitionConstants';

const Campaign: FC = () => {
  const [showEdit, setShowEdit] = useState(false);
  const [currentData, setCurrentData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [searchStr, setSearchStr] = useState('');
  const { company } = useSelector(selectAuth);
  const { campaign: fullCampaign } = useSelector(selectData);
  const [campaign, setCampaign] = useState<Array<any>>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const campaignData = fullCampaign.filter(item => {
      return item.name.indexOf(searchStr) > -1;
    });
    setCampaign(campaignData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchStr]);

  const handleUpdate = (id: string, state: string) => {
    setLoading(true);
    APIInstance.put('data/campaign_detail', {
      state,
      id,
      type: 'state',
    }).then(() => {
      dispatch(updateCampaign({ id, state }));
      DialogUtils.show('success', state === 'paused' ? 'Campaign Paused' : 'Successfully Started the Campaign', '');
    }).catch(err => {
      console.log('puaseing error:', err);
    }).finally(() => setLoading(false));
  };

  return (
    <motion.div
      className='text-left relative'
      initial="hidden"
      animate="show"
      variants={FADE_UP_ANIMATION_VARIANTS}
    >
      {loading && <Loading />}
      <h2 className='text-[26px] 2xl:text-[32px] font-[Inter] text-black font-semibold -tracking-[1.02px]'>{`${company}'s Campaigns 📈`}</h2>
      <p className='my-2 text-[#43474A] font-normal text-sm 2xl:text-md'>Here's your account at a glance.</p>

      <div className='flex items-center justify-center w-full'>
        <input
          className='me-2 mt-2 font-[Inter] flex-1 px-4 py-2 rounded-[5px] border-gray-300 text-sm 2xl:text-md focus:ring-0 focus:border-[#7F8182]'
          placeholder='Type here to search by campaign name'
          value={searchStr}
          onChange={e => setSearchStr(e.target.value)}
        />
        <select className='font-[Inter] mt-2 rounded-[5px] border-[1px] border-gray-300 text-sm 2xl:text-md focus:ring-0 focus:border-[#7F8182]'>
          <option value="nto">Newest to Oldest</option>
          <option value="otn">Oldest to Newest</option>
        </select>
      </div>

      <div className='mt-1'>
        {campaign.map(item => (
          <Collapse
            key={item.id}
            collapsible='header'
            items={[{
              key: '1',
              label: (<div
                className='flex pl-[32px] pr-[72px] py-[20px] 2xl:p-[32px] bg-white rounded-[5px] justify-between items-center w-full relative'
              >
                <p className='font-semibold font-[Inter] text-[16px] min-w-[150px]'>{item.name}</p>
                <div className='flex flex-col items-center'>
                  <p className='font-semibold font-[Inter] text-[10px] mb-3'>Start Date:</p>
                  <p className='font-semibold font-[Inter] text-[12px]'>{new Date(Number(item.create_time)).toLocaleDateString()}</p>
                </div>
                <div className='flex flex-col items-center'>
                  <p className='font-semibold font-[Inter] text-[10px] mb-3'>Total Impressions:</p>
                  <p className='font-semibold font-[Inter] text-[12px]'>0</p>
                </div>
                <div className='flex flex-col items-center'>
                  <p className='font-semibold font-[Inter] text-[10px] mb-3'>Total Total Clicks:</p>
                  <p className='font-semibold font-[Inter] text-[12px]'>{item.click_count}</p>
                </div>
                <div className='flex flex-col items-center'>
                  <p className='font-semibold font-[Inter] text-[10px] mb-3'>AVG CPC:</p>
                  <p className='font-semibold font-[Inter] text-[12px]'>{`$${item.demographic === 'consumer' ? 8 : 20}`}</p>
                </div>
                <div className='flex flex-col items-center'>
                  <p className='font-semibold font-[Inter] text-[10px] mb-3'>Total Spend:</p>
                  <p className='font-semibold font-[Inter] text-[12px]'>{`$${item.click_count * (item.demographic === 'consumer' ? 8 : 20)}`}</p>
                </div>
                <div className='flex flex-col items-center'>
                  <p className='font-semibold font-[Inter] text-[10px] mb-3'>Budget Remaining:</p>
                  <p className='font-semibold font-[Inter] text-[12px] text-[#FF4D42]'>{`$${item.price}`}</p>
                </div>
                <span className={`rounded-full text-[10px] px-[12px] py-[4px] font-medium ${item.state === 'draft' ? 'bg-[#dbdbdb]' : item.state === 'paused' ? 'bg-[#fdbdbd]' : 'bg-[#7ffbae]'}`}>{item.state}</span>
                <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16" className="mx-1 absolute right-[12px] bottom-[9px]">
                  <path d="M450.001-779.999v485.077L222.154-522.768 180.001-480 480-180.001 779.999-480l-42.153-42.768-227.847 227.846v-485.077h-59.998Z" />
                </svg>
              </div>),
              children: (
                <div className='bg-white p-[25px] rounded-b-[5px]'>
                  <div className='flex'>
                    <img className='w-[242px] h-[133px] object-none' alt="market" src={item.image} />
                    <div className='ms-[16px] py-[10px] flex flex-col items-start justify-center'>
                      <p className='text-black font-[Inter] text-xs font-normal'>Headline</p>
                      <h2 className='font-[Inter] text-black font-semibold text-base'>{item.headline}</h2>
                      <p className='text-black font-[Inter] mt-[14px] text-xs font-normal'>Description</p>
                      <p className='text-black font-[Inter] font-medium text-sm'>{item.body}</p>
                      <p className='text-black font-[Inter] mt-[14px] text-xs font-normal'>Audiences</p>
                      <p className='text-black font-[Inter] font-normal text-sm'>{item.audience.join(',')}</p>
                    </div>
                  </div>
                  <div className='mt-[16px] flex items-center justify-end w-full'>
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
              )
            }]}
          />
        ))
        }
      </div>

      <EditCampaign
        show={showEdit}
        setShow={(show: boolean) => setShowEdit(show)}
        data={currentData}
      />
    </motion.div>
  );
};

export default Campaign;