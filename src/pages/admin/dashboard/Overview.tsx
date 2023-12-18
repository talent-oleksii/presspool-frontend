import { FC, useState, useEffect } from 'react';
import AdminAPIInstance from '../../../api/adminApi';
import Loading from '../../../components/Loading';

const AdminDashboardOverview: FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    setLoading(true);
    AdminAPIInstance.get('/dashboard/overview').then(data => {
      console.log('data:', data.data);
      setData(data.data);
    }).catch(err => {
      console.log('err:', err);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {loading && <Loading />}
      <div className='grid grid-cols-4 gap-4'>
        <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[20px] bg-white shadow-md'>
          <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{data.totalClient || 0}</h2>
          <p className='text-xs font-[Inter] font-semibold mt-[5px] text-[#43474A]'>Total Clients</p>
          <div className='bg-[#7ffbae] rounded-full mt-[12px] font-[Inter] py-[1px] px-[10px] text-[10px] 2xl:text-xs font-semibold text-black my-1'>0%</div>
          <p className='text-[#7F8182] text-[8px] mt-[5px] 2xl:text-[10px] font-semibold'>from 0 (last 4 weeks)</p>
        </div>
        <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[20px] bg-white shadow-md'>
          <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{data.inactiveClient || 0}</h2>
          <p className='text-xs font-[Inter] font-semibold mt-[5px] text-[#43474A]'>Inactive Clients</p>
          <div className='bg-[#7ffbae] rounded-full mt-[12px] font-[Inter] py-[1px] px-[10px] text-[10px] 2xl:text-xs font-semibold text-black my-1'>0%</div>
          <p className='text-[#7F8182] text-[8px] mt-[5px] 2xl:text-[10px] font-semibold'>from 0 (last 4 weeks)</p>
        </div>
        <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[20px] bg-white shadow-md'>
          <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{data.activeCampaign || 0}</h2>
          <p className='text-xs font-[Inter] font-semibold mt-[5px] text-[#43474A]'>Active Campaigns</p>
          <div className='bg-[#7ffbae] rounded-full mt-[12px] font-[Inter] py-[1px] px-[10px] text-[10px] 2xl:text-xs font-semibold text-black my-1'>0%</div>
          <p className='text-[#7F8182] text-[8px] mt-[5px] 2xl:text-[10px] font-semibold'>from 0 (last 4 weeks)</p>
        </div>
        <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[20px] bg-white shadow-md'>
          <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{data.draftCampaign || 0}</h2>
          <p className='text-xs font-[Inter] font-semibold mt-[5px] text-[#43474A]'>Drafted Campaigns</p>
          <div className='bg-[#7ffbae] rounded-full mt-[12px] font-[Inter] py-[1px] px-[10px] text-[10px] 2xl:text-xs font-semibold text-black my-1'>0%</div>
          <p className='text-[#7F8182] text-[8px] mt-[5px] 2xl:text-[10px] font-semibold'>from 0 (last 4 weeks)</p>
        </div>
        <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[20px] bg-white shadow-md'>
          <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{`$${data.totalRevenue || 0}`}</h2>
          <p className='text-xs font-[Inter] font-semibold mt-[5px] text-[#43474A]'>Total Revenue</p>
          <div className='bg-[#7ffbae] rounded-full mt-[12px] font-[Inter] py-[1px] px-[10px] text-[10px] 2xl:text-xs font-semibold text-black my-1'>0%</div>
          <p className='text-[#7F8182] text-[8px] mt-[5px] 2xl:text-[10px] font-semibold'>from 0 (last 4 weeks)</p>
        </div>
        <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[20px] bg-white shadow-md'>
          <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{`$${data.totalSpent || 0}`}</h2>
          <p className='text-xs font-[Inter] font-semibold mt-[5px] text-[#43474A]'>Total Spend</p>
          <div className='bg-[#7ffbae] rounded-full mt-[12px] font-[Inter] py-[1px] px-[10px] text-[10px] 2xl:text-xs font-semibold text-black my-1'>0%</div>
          <p className='text-[#7F8182] text-[8px] mt-[5px] 2xl:text-[10px] font-semibold'>from 0 (last 4 weeks)</p>
        </div>
        <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[20px] bg-white shadow-md'>
          <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{`$${data.totalProfit || 0}`}</h2>
          <p className='text-xs font-[Inter] font-semibold mt-[5px] text-[#43474A]'>Total Profit</p>
          <div className='bg-[#7ffbae] rounded-full mt-[12px] font-[Inter] py-[1px] px-[10px] text-[10px] 2xl:text-xs font-semibold text-black my-1'>0%</div>
          <p className='text-[#7F8182] text-[8px] mt-[5px] 2xl:text-[10px] font-semibold'>from 0 (last 4 weeks)</p>
        </div>
        <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[20px] bg-white shadow-md'>
          <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{`$${data.unpaid || 0}`}</h2>
          <p className='text-xs font-[Inter] font-semibold mt-[5px] text-[#43474A]'>Unpaid Invoices</p>
          <div className='bg-[#7ffbae] rounded-full mt-[12px] font-[Inter] py-[1px] px-[10px] text-[10px] 2xl:text-xs font-semibold text-black my-1'>0%</div>
          <p className='text-[#7F8182] text-[8px] mt-[5px] 2xl:text-[10px] font-semibold'>from 0 (last 4 weeks)</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOverview;