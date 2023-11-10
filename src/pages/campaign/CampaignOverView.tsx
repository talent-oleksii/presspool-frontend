import { FC } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const data = [{
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

const CampaignOverView: FC = () => {
  return (
    <div>
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

      <div className='my-7 p-5 min-h-[250px] rounded-[10px] bg-white'>
        <h2 className='font-[Inter] text-[30px] font-semibold'>All Campaign(s) Overview</h2>
        <p className='font-[Inter] text-gray-500'>All Campaign Performance at a glance</p>

        <div className='flex'>
          <LineChart width={700} height={300} data={data} className='mx-2 my-4 w-full'>
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
    </div>
  );
};

export default CampaignOverView;