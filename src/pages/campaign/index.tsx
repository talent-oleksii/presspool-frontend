import { FC, useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';

import CreateCampaign from '../dashboard/CreateCampaign';
import { selectAuth } from '../../store/authSlice';

import StripeUtil from '../../utils/stripe';
import APIInstance from '../../api';
import Loading from '../../components/Loading';
import DetailDialog from './DetailDialog';

const Campaign: FC = () => {
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState<Array<any>>([]);
  const [showDetail, setShowDetail] = useState(false);
  const [currentData, setCurrentData] = useState(undefined);
  const [show, setShow] = useState(false);
  const { company } = useSelector(selectAuth);

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

  const handleBudget = async (data: any) => {
    let priceId: any = '';
    const price = data.price;
    if (price === 10000) priceId = process.env.REACT_APP_PRICE_10000;
    else if (price === 15000) priceId = process.env.REACT_APP_PRICE_15000;
    else if (price === 20000) priceId = process.env.REACT_APP_PRICE_20000;
    else if (price === 25000) priceId = process.env.REACT_APP_PRICE_25000;
    else priceId = process.env.REACT_APP_PRICE_50000;

    const url = await StripeUtil.getCampaignPayUrl(email, data.id, 'https://presspool-frontend.onrender.com/#/campaign/all', priceId);
    if (!url) return;
    window.open(url, '_self');
  };

  return (
    <div className='text-left relative'>
      {loading && <Loading />}
      <h2 className='text-[32px] font-[Inter] text-black font-semibold'>{`${company}'s Campaigns 📈`}</h2>
      <p className='my-2 text-[#43474A] font-normal'>Here's your account at a glance.</p>

      <button className='rounded-[5px] bg-[#6C63FF] font-[Inter] font-semibold text-[white] font-md px-4 py-2 my-4' onClick={() => setShowAddDialog(true)}>Create New Campaign</button>

      <div className='flex items-center justify-center w-full'>
        <input
          className='me-2 font-[Inter] flex-1 px-4 py-2 border-gray-500 border-[1px] rounded-[5px]'
          placeholder='Type here to search by campaign name'
        />
        <select className='font-[Inter] px-3 py-2 rounded-[5px] border-[1px] border-gray-500'>
          <option value="nto">Newest to Oldest</option>
          <option value="otn">Oldest to Newest</option>
        </select>
      </div>

      <div className='mt-1'>
        {campaign.map(item => (
          <div
            className='flex p-5 bg-white my-2 rounded-[10px] justify-around items-center w-full'
            key={item.id}
          >
            <p className='font-semibold font-[Inter] text-[16px]'>{item.name}</p>
            <div className='flex flex-col items-center'>
              <p className='font-semibold font-[Inter] text-[10px]'>Start Date:</p>
              <p className='font-semibold font-[Inter] text-[12px]'>0</p>
            </div>
            <div className='flex flex-col items-center'>
              <p className='font-semibold font-[Inter] text-[10px]'>Total Impressions:</p>
              <p className='font-semibold font-[Inter] text-[12px]'>0</p>
            </div>
            <div className='flex flex-col items-center'>
              <p className='font-semibold font-[Inter] text-[10px]'>Total Total Clicks:</p>
              <p className='font-semibold font-[Inter] text-[12px]'>0</p>
            </div>
            <div className='flex flex-col items-center'>
              <p className='font-semibold font-[Inter] text-[10px]'>Total Spend:</p>
              <p className='font-semibold font-[Inter] text-[12px]'>$0</p>
            </div>
            <div className='flex'>
              <button
                className='underline font-[Inter] text-[#6c63ff] px-4 py-2 me-2'
                onClick={handleBudget}
              >
                {`${item.state === 'purchased' ? 'Raise Budget' : 'Purchase'}`}
              </button>
              <button
                className='bg-[#6c63ff] px-4 py-2 rounded text-white font-[Inter]'
                onClick={() => {
                  setCurrentData(item);
                  setShowDetail(true);
                }}
              >
                View Details
              </button>
            </div>
          </div>
        ))
        }
      </div>

      <DetailDialog
        data={currentData}
        show={showDetail}
        setShow={(() => setShowDetail(false))}
      />

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
  );
};

export default Campaign;