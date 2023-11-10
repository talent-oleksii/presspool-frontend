import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

import APIInstance from '../../api';
import StripeUtil from '../../utils/stripe';
import { selectAuth } from '../../store/authSlice';
import EditCampaignUI from './EditCampaignUI';
import Loading from '../../components/Loading';

const chartData = [{
  name: '08 Oct 2023',
  click: 4,
  impression: 2,
}, {
  name: '09 Oct 2023',
  click: 5,
  impression: 3,
}, {
  name: '12 Oct 2023',
  click: 2.6,
  impression: 12,
}];

interface typeCampaignDetail {
  id?: string;
}

const CampaignDetail: FC<typeCampaignDetail> = ({ id }: typeCampaignDetail) => {
  const [data, setData] = useState<any>(undefined);
  const [uiData, setUIData] = useState<any>(undefined);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const { email } = useSelector(selectAuth);

  useEffect(() => {
    setLoading(true);
    APIInstance.get('data/campaign_detail', { params: { id } }).then(data => {
      console.log('data:', data);
      setData(data.data.campaignData);
      setUIData(data.data.uiData);
    }).catch(error => {
      console.log('error:', error);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleEditCampaign: React.MouseEventHandler<HTMLButtonElement> = () => {
    setShow(true);
  };

  const handleBudget = async () => {
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
    <div className='relative'>
      {loading && <Loading />}
      {!loading && data && <>
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

        <div className='my-4 p-5 min-h-[250px] rounded-[10px] bg-white'>
          <h2 className='font-[Inter] text-[30px] font-semibold'>Campaign Overview</h2>
          <p className='font-[Inter] text-gray-500'>All Campaign Performance</p>

          <div className='flex'>
            <LineChart width={700} height={300} data={chartData} className='mx-2 my-4 w-full'>
              <Line type="monotone" dataKey="click" stroke="#6c63ff" />
              <Line type="monotone" dataKey="impression" stroke="#ff0000" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5.5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
            </LineChart>
            <div className='p-4'>
              <p className='font-[Inter] text-[#6c63ff] text-lg'>Clicks</p>
              <p className='font-[Inter] text-[#ff0000] text-lg'>Impressions</p>
            </div>
          </div>
        </div>
        <div className='flex p-5 bg-white rounded-[10px] justify-around items-center w-full'>
          <p className='font-semibold font-[Inter] text-lg'>{data.name}</p>
          <div className='flex flex-col items-center'>
            <p className='font-semibold font-[Inter] text-lg'>Total Impressions:</p>
            <p className='font-semibold font-[Inter] text-lg'>0</p>
          </div>
          <div className='flex flex-col items-center'>
            <p className='font-semibold font-[Inter] text-lg'>Total Total Clicks:</p>
            <p className='font-semibold font-[Inter] text-lg'>0</p>
          </div>
          <div className='flex flex-col items-center'>
            <p className='font-semibold font-[Inter] text-lg'>Total Spend:</p>
            <p className='font-semibold font-[Inter] text-lg'>$0</p>
          </div>
          <div className='flex'>
            <button className='underline font-[Inter] text-[#6c63ff] px-4 py-2 me-2' onClick={handleBudget}>{`${data.state === 'purchased' ? 'Raise Budget' : 'Purchase'}`}</button>
            <button className='bg-[#6c63ff] px-4 py-2 rounded text-white font-[Inter]' onClick={handleEditCampaign}>Edit Campaign</button>
          </div>
        </div>
      </>
      }
      <EditCampaignUI show={show} setShow={(show: boolean) => setShow(show)} uiData={uiData} afterChange={(data: any) => setUIData(data)} />
    </div>
  );
};

export default CampaignDetail;