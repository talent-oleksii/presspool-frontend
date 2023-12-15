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
  }, [searchStr, fullCampaign]);

  const handleUpdate = (id: string, state: string) => {
    setLoading(true);
    APIInstance.put('data/campaign_detail', {
      state,
      id,
      type: 'state',
    }).then(() => {
      dispatch(updateCampaign({ id, data: { ...campaign.filter(item => item.id === id)[0], state } }));
      DialogUtils.show('success', state === 'paused' ? 'Campaign Paused' : 'Successfully Started the Campaign', '');
    }).catch(err => {
      console.log('err:', err);
      DialogUtils.show('error', '', err.response.data.message);
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
      <h2 className='text-[20px] 2xl:text-[24px] font-[Inter] text-black font-semibold -tracking-[.6px]'>{`${company}'s Campaigns 📈`}</h2>
      <p className='mt-[6px] text-[#43474A] font-normal text-sm'>Here's your account at a glance.</p>

      <div className='flex items-center justify-center w-full mt-[24px]'>
        <input
          className='me-2 font-[Inter] flex-1 px-4 py-2 rounded-[5px] text-sm focus:ring-0 focus:border-[#7F8182]'
          placeholder='Type here to search by campaign name'
          value={searchStr}
          onChange={e => setSearchStr(e.target.value)}
        />
        <select className='font-[Inter] rounded-[5px] border-[1px] text-sm focus:ring-0 focus:border-[#7F8182] min-w-[170px]'>
          <option value="nto">Newest to Oldest</option>
          <option value="otn">Oldest to Newest</option>
        </select>
      </div>

      <div className='mt-[7px]'>
        {campaign.map(item => (
          <Collapse
            key={item.id}
            collapsible='header'
            items={[{
              key: '1',
              label: (<div
                className='flex pl-[32px] pr-[72px] py-[20px] 2xl:p-[32px] bg-white rounded-t-[5px] justify-between items-center w-full relative'
              >
                <p className='font-semibold font-[Inter] text-sm min-w-[150px] -tracking-[.42px]'>{item.name}</p>
                <div className='flex flex-col items-center'>
                  <p className='font-semibold font-[Inter] text-[10px] mb-[17px] -tracking-[.3px]'>Start Date:</p>
                  <p className='font-semibold font-[Inter] text-[12px]'>{new Date(Number(item.create_time)).toLocaleDateString()}</p>
                </div>
                <div className='flex flex-col items-center'>
                  <p className='font-semibold font-[Inter] text-[10px] mb-[17px] -tracking-[.3px]'>Total Impressions:</p>
                  <p className='font-semibold font-[Inter] text-[12px]'>0</p>
                </div>
                <div className='flex flex-col items-center'>
                  <p className='font-semibold font-[Inter] text-[10px] mb-[17px] -tracking-[.3px]'>Total Total Clicks:</p>
                  <p className='font-semibold font-[Inter] text-[12px]'>{item.click_count}</p>
                </div>
                <div className='flex flex-col items-center'>
                  <p className='font-semibold font-[Inter] text-[10px] mb-[17px] -tracking-[.3px]'>AVG CPC:</p>
                  <p className='font-semibold font-[Inter] text-[12px]'>{`$${item.demographic === 'consumer' ? 8 : 20}`}</p>
                </div>
                <div className='flex flex-col items-center'>
                  <p className='font-semibold font-[Inter] text-[10px] mb-[17px] -tracking-[.3px]'>Total Spend:</p>
                  <p className='font-semibold font-[Inter] text-[12px]'>{`$${item.spent}`}</p>
                </div>
                <div className='flex flex-col items-center'>
                  <p className='font-semibold font-[Inter] text-[10px] mb-[17px] -tracking-[.3px]'>Budget Remaining:</p>
                  <p className='font-semibold font-[Inter] text-[12px] text-[#FF4D42]'>{`$${Number(item.price) - Number(item.spent)}`}</p>
                </div>
                <span className={`rounded-full text-[10px] px-[12px] mt-[25px] py-[4px] font-medium ${item.state === 'draft' ? 'bg-[#dbdbdb]' : item.state === 'paused' ? 'bg-[#fdbdbd]' : 'bg-[#7ffbae]'}`}>{item.state}</span>
                <span className="mx-1 absolute right-[12px] bottom-[9px] text-xs font-bold font-[Inter]">
                  ↓
                </span>
              </div>),
              children: (
                <div className='bg-white p-[25px] rounded-b-[5px]'>
                  <div className='flex'>
                    <img className='w-[242px] h-[133px] object-cover' alt="market" src={item.image} />
                    <div className='ms-[16px] py-[10px] flex flex-col items-start justify-center'>
                      <p className='text-black font-[Inter] text-xs font-normal'>Headline</p>
                      <h2 className='font-[Inter] text-black mt-[8px] font-semibold text-base -tracking-[.42px]'>{item.headline}</h2>
                      <p className='text-black font-[Inter] mt-[14px] text-xs font-normal mt-[14px]'>Description</p>
                      <p className='text-black font-[Inter] font-medium text-sm mt-[8px]'>{item.body}</p>
                      <p className='text-black font-[Inter] mt-[14px] text-xs font-normal mt-[14px]'>Audiences</p>
                      <p className='text-black font-[Inter] font-normal text-sm mt-[8px]'>{item.audience.join(',')}</p>
                    </div>
                  </div>
                  <div className='mt-[16px] flex items-center justify-end w-full'>
                    <button
                      className='bg-[#6c63ff] px-4 py-2 rounded text-white font-semibold font-[Inter] text-[10px] 2xl:text-xs'
                      onClick={() => {
                        setCurrentData({ ...item });
                        setShowEdit(true);
                      }}
                    >
                      Edit Campaign
                    </button>
                    {
                      item.state !== 'paused' ?
                        <button
                          className='underline font-[Inter] text-[#505050] px-4 py-2 me-2 text-[10px] 2xl:text-xs'
                          onClick={() => handleUpdate(item.id, 'paused')}
                        >
                          Pause
                        </button> :
                        <button
                          className='underline font-[Inter] text-[#505050] px-4 py-2 me-2 text-[10px] 2xl:text-xs'
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