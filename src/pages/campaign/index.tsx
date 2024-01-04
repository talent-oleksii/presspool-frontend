import { FC, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from "framer-motion";
import { Collapse } from 'antd';
import { Link } from 'react-router-dom';

import { selectAuth } from '../../store/authSlice';
import { selectData, updateCampaign } from '../../store/dataSlice';

import APIInstance from '../../api';
import Loading from '../../components/Loading';
import DialogUtils from '../../utils/DialogUtils';

import { FADE_UP_ANIMATION_VARIANTS } from '../../utils/TransitionConstants';

const Campaign: FC = () => {
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
        <div className='flex w-full border-[1px] rounded-[5px] border-[#7F8182] items-center px-4 py-2'>
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" className='me-4' viewBox="0 0 21 20" fill="none">
            <path d="M12.0016 1.07199C12.9542 1.62201 13.7832 2.36255 14.4368 3.24735C15.0903 4.13216 15.5544 5.14222 15.8 6.21444C16.0456 7.28666 16.0675 8.39801 15.8643 9.47908C15.6611 10.5601 15.2372 11.5877 14.619 12.4976L19.5637 17.4412C19.839 17.7125 19.9989 18.0795 20.0102 18.4659C20.0216 18.8522 19.8833 19.228 19.6244 19.5149C19.3655 19.8018 19.0058 19.9777 18.6203 20.006C18.2349 20.0342 17.8534 19.9126 17.5554 19.6665L17.4414 19.5635L12.4977 14.6188C11.3149 15.4222 9.93848 15.894 8.51156 15.9851C7.08464 16.0761 5.65938 15.7832 4.38408 15.1366C3.10878 14.4901 2.03003 13.5136 1.26007 12.3088C0.490105 11.104 0.0570647 9.71489 0.00600086 8.28598L0 8.00094L0.0050008 7.7159C0.0542013 6.33646 0.459431 4.99321 1.18131 3.8167C1.90318 2.64019 2.91715 1.67044 4.12465 1.00171C5.33216 0.332977 6.69213 -0.0119965 8.07239 0.00031853C9.45265 0.0126336 10.8063 0.381819 12.0016 1.07199Z" fill="#7F8182" />
            <circle cx="8.00586" cy="8.00488" r="6" fill="#F5F5F5" />
          </svg>
          <input
            className='me-2 font-[Inter] flex-1 border-0 text-sm focus:ring-0 p-0 focus:border-[#7F8182] bg-transparent'
            placeholder='Type here to search by campaign name'
            value={searchStr}
            onChange={e => setSearchStr(e.target.value)}
          />
        </div>
        <select className='font-[Inter] rounded-[5px] border-[1px] text-sm focus:ring-0 focus:border-[#7F8182] bg-transparent min-w-[200px] ms-4'>
          <option value="nto">Newest to Oldest</option>
          <option value="otn">Oldest to Newest</option>
        </select>
      </div>

      <div className='mt-4'>
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
                  <p className='font-semibold font-[Inter] text-[10px] mb-[17px] -tracking-[.3px]'>Total Clicks:</p>
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
                      <p className='text-black font-[Inter] mt-[14px] text-xs font-normal mt-[14px]'>Landing Page Link</p>
                      <p className='text-[#6C63FF] font-[Inter] font-medium text-sm mt-[8px]'>{item.page_url}</p>
                      <div className='flex items-center justify-between w-full'>
                        <div className='w-auto'>
                          <p className='text-black font-[Inter] mt-[14px] text-xs font-normal mt-[14px]'>Audience Tags</p>
                          <p className='text-black font-[Inter] font-medium text-sm mt-[8px] -tracking-[.47px]'>{item.audience.join(',')}</p>
                        </div>
                        <div className='mt-[16px] flex items-center justify-end'>
                          <Link
                            to={`/edit/${item.id}`}
                            className='px-4 py-2 rounded text-[#6c63ff] font-semibold font-[Inter] text-[10px] 2xl:text-xs'
                          >
                            Raise Budget
                          </Link>
                          <Link
                            to={`/edit/${item.id}`}
                            className='bg-black px-4 py-2 rounded text-white font-semibold font-[Inter] text-[10px] 2xl:text-xs'
                          >
                            Edit Campaign
                          </Link>
                          {/* {
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
                    } */}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )
            }]}
          />
        ))
        }
      </div>

      {/* <EditCampaign
        show={showEdit}
        setShow={(show: boolean) => setShowEdit(show)}
        data={currentData}
      /> */}
    </motion.div>
  );
};

export default Campaign;