import { FC } from "react";
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

const Dashboard: FC = () => {
  return (
    <div>
      <div className="grid grid-cols-4 rounded-[10px]">
        <div className="p-5 flex items-center justify-between rounded-l-[10px] border-[1px] bg-white">
          <div className="text-left">
            <p className="font-semibold text-[Inter] text-[20px]">Total Users</p>
            <p className="font-bold text-[Inter] text-black text-[30px] my-3">0</p>
            <p className="text-[Inter] text-gray-500">from 0 (last 4 weeks)</p>
          </div>
          <span className="rounded-full bg-gray-300 px-4 py-1">- 0%</span>
        </div>
        <div className="p-5 flex items-center justify-between border-[1px] bg-white">
          <div className="text-left">
            <p className="font-semibold text-[Inter] text-[20px]">Total Clicks</p>
            <p className="font-bold text-[Inter] text-black text-[30px] my-3">0</p>
            <p className="text-[Inter] text-gray-500">from 0 (last 4 weeks)</p>
          </div>
          <span className="rounded-full bg-gray-300 px-4 py-1">- 0%</span>
        </div>
        <div className="p-5 flex items-center justify-between border-[1px] bg-white">
          <div className="text-left">
            <p className="font-semibold text-[Inter] text-[20px]">Money In</p>
            <p className="font-bold text-[Inter] text-black text-[30px] my-3">0</p>
            <p className="text-[Inter] text-gray-500">from 0 (last 4 weeks)</p>
          </div>
          <span className="rounded-full bg-gray-300 px-4 py-1">- 0%</span>
        </div>
        <div className="p-5 flex items-center justify-between rounded-r-[10px] border-[1px] bg-white">
          <div className="text-left">
            <p className="font-semibold text-[Inter] text-[20px]">Money Out</p>
            <p className="font-bold text-[Inter] text-black text-[30px] my-3">0</p>
            <p className="text-[Inter] text-gray-500">from 0 (last 4 weeks)</p>
          </div>
          <span className="rounded-full bg-gray-300 px-4 py-1">- 0%</span>
        </div>
      </div>

      <div className="my-6 p-5 bg-white w-full rounded-[10px]">
        <h2 className="text-[20px] font-semibold font-[Inter]">Campaign Overview</h2>
        <p className="text-md text-gray-500 font-[Inter]">Total performance of all campaigns</p>

        <div className='relative'>
          <LineChart width={700} height={300} data={data} className='mx-2 my-4 w-full'>
            <Line type="monotone" dataKey="click" stroke="#6c63ff" />
            <Line type="monotone" dataKey="impression" stroke="#ff0000" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5.5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
          </LineChart>
          <div className='p-4 absolute right-0 top-0'>
            <p className='font-[Inter] text-[#6c63ff] text-md'>Clicks</p>
            <p className='font-[Inter] text-[#ff0000] text-md'>Impressions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;