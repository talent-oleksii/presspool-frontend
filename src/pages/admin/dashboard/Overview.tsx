import { FC, useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis } from 'recharts';
import moment from 'moment';

import AdminAPIInstance from '../../../api/adminApi';
import Loading from '../../../components/Loading';

const AdminDashboardOverview: FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});
  const [chartData, setChartData] = useState<any>();

  useEffect(() => {
    setLoading(true);
    AdminAPIInstance.get('/dashboard/overview').then(data => {
      setData(data.data);

      let grouped: any = {};
      if (data.data.clicked) {
        data.data.clicked.forEach((item: any) => {
          const date = moment(Number(item.create_time));
          const key = date.format('DD/MM/YYYY');
          if (!grouped[key]) {
            grouped[key] = [];
          }
          grouped[key].push(item);
        });

        setChartData(Object.keys(grouped).map(item => ({
          impression: 0,
          click: grouped[item].length,
          date: item,
        })));
      }
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {loading && <Loading />}
      <div className='grid grid-cols-4 gap-4'>
        <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[10px] bg-white shadow-md'>
          <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{data.totalClient || 0}</h2>
          <p className='text-xs font-[Inter] font-semibold mt-[5px] text-secondry1'>Total Clients</p>
          <div className='bg-main rounded-[10px] mt-[12px] font-[Inter] py-[1px] px-[10px] text-xs 2xl:text-xs font-semibold text-primary my-1'>0%</div>
          <p className='text-secondry2 text-[8px] mt-[5px] 2xl:text-xs font-semibold'>from 0 (last 4 weeks)</p>
        </div>
        <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[10px] bg-white shadow-md'>
          <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{data.inactiveClient || 0}</h2>
          <p className='text-xs font-[Inter] font-semibold mt-[5px] text-secondry1'>Inactive Clients</p>
          <div className='bg-main rounded-[10px] mt-[12px] font-[Inter] py-[1px] px-[10px] text-xs 2xl:text-xs font-semibold text-primary my-1'>0%</div>
          <p className='text-secondry2 text-[8px] mt-[5px] 2xl:text-xs font-semibold'>from 0 (last 4 weeks)</p>
        </div>
        <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[10px] bg-white shadow-md'>
          <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{data.activeCampaign || 0}</h2>
          <p className='text-xs font-[Inter] font-semibold mt-[5px] text-secondry1'>Active Campaigns</p>
          <div className='bg-main rounded-[10px] mt-[12px] font-[Inter] py-[1px] px-[10px] text-xs 2xl:text-xs font-semibold text-primary my-1'>0%</div>
          <p className='text-secondry2 text-[8px] mt-[5px] 2xl:text-xs font-semibold'>from 0 (last 4 weeks)</p>
        </div>
        <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[10px] bg-white shadow-md'>
          <h2 className='text-[25px] 2xl:text-[28px] text-[red] font-[Inter] font-semibold'>{data.draftCampaign || 0}</h2>
          <p className='text-xs font-[Inter] font-semibold mt-[5px] text-secondry1'>Drafted Campaigns</p>
          <div className='bg-main rounded-[10px] mt-[12px] font-[Inter] py-[1px] px-[10px] text-xs 2xl:text-xs font-semibold text-primary my-1'>0%</div>
          <p className='text-secondry2 text-[8px] mt-[5px] 2xl:text-xs font-semibold'>from 0 (last 4 weeks)</p>
        </div>
        <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[10px] bg-white shadow-md'>
          <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{`$${data.totalRevenue || 0}`}</h2>
          <p className='text-xs font-[Inter] font-semibold mt-[5px] text-secondry1'>Total Revenue</p>
          <div className='bg-main rounded-[10px] mt-[12px] font-[Inter] py-[1px] px-[10px] text-xs 2xl:text-xs font-semibold text-primary my-1'>0%</div>
          <p className='text-secondry2 text-[8px] mt-[5px] 2xl:text-xs font-semibold'>from 0 (last 4 weeks)</p>
        </div>
        <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[10px] bg-white shadow-md'>
          <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{`$${data.totalSpent || 0}`}</h2>
          <p className='text-xs font-[Inter] font-semibold mt-[5px] text-secondry1'>Total Spend</p>
          <div className='bg-main rounded-[10px] mt-[12px] font-[Inter] py-[1px] px-[10px] text-xs 2xl:text-xs font-semibold text-primary my-1'>0%</div>
          <p className='text-secondry2 text-[8px] mt-[5px] 2xl:text-xs font-semibold'>from 0 (last 4 weeks)</p>
        </div>
        <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[10px] bg-white shadow-md'>
          <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{`$${data.totalProfit || 0}`}</h2>
          <p className='text-xs font-[Inter] font-semibold mt-[5px] text-secondry1'>Total Payout</p>
          <div className='bg-main rounded-[10px] mt-[12px] font-[Inter] py-[1px] px-[10px] text-xs 2xl:text-xs font-semibold text-primary my-1'>0%</div>
          <p className='text-secondry2 text-[8px] mt-[5px] 2xl:text-xs font-semibold'>from 0 (last 4 weeks)</p>
        </div>
        <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[10px] bg-white shadow-md'>
          <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold text-[red]'>{`$${data.unpaid || 0}`}</h2>
          <p className='text-xs font-[Inter] font-semibold mt-[5px] text-secondry1'>Unpaid Invoices</p>
          <div className='bg-main rounded-[10px] mt-[12px] font-[Inter] py-[1px] px-[10px] text-xs 2xl:text-xs font-semibold text-primary my-1'>0%</div>
          <p className='text-secondry2 text-[8px] mt-[5px] 2xl:text-xs font-semibold'>from 0 (last 4 weeks)</p>
        </div>
      </div>

      <div className='my-[14px] p-[25px] min-h-[250px] rounded-[10px] bg-white shadow-md'>
        <div className='flex justify-between items-center'>
          <div>
            <h2 className='font-[Inter] text-xs 2xl:text-lg font-semibold'>All Campaigns</h2>
            <p className='font-[Inter] text-secondry1 mt-[5px] text-xs 2xl:text-xs'>Let’s see how your campaigns are performing</p>
          </div>

          {/* <button className='border-[1px] px-2 py-1 font-[Inter] rounded-[10px] text-xs 2xl:text-md font-semibold border-[#7f8182]' onClick={handleDownloadCSV}>
            Download as CSV
          </button> */}
        </div>

        <div className='flex relative'>
          <LineChart width={700} height={200} data={chartData} className='mt-[50px] w-full'>
            <Line type="linear" dataKey="click" stroke="#7F8182" />
            <Line type="linear" dataKey="impression" stroke="black" />
            <XAxis dataKey="date" />
            <YAxis />
          </LineChart>
          <div className='absolute right-[20px] top-0'>
            <p className='font-[Inter] text-primary text-xs 2xl:text-xs font-semibold mb-2'>Total Impressions</p>
            <p className='font-[Inter] text-secondry2 text-xs 2xl:text-xs mt-2 font-semibold'>Total Clicks</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOverview;