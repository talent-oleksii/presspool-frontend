import { FC, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis } from 'recharts';
import { Tooltip } from 'antd';
import moment from 'moment-timezone';

import APIInstance from '../../api';
import Loading from '../../components/Loading';
import { useSelector } from 'react-redux';
import { selectData } from '../../store/dataSlice';

const data01: Array<any> = [];

interface typeCampaignDetail {
  id?: string;
}

const CampaignDetail: FC<typeCampaignDetail> = ({ id }: typeCampaignDetail) => {
  const [data, setData] = useState<any>(undefined);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any>();
  const { clicked } = useSelector(selectData);

  useEffect(() => {
    setLoading(true);
    APIInstance.get('data/campaign_detail', { params: { id } }).then(data => {
      setData(data.data);

      let grouped: any = {};
      clicked.filter(item => Number(item.campaign_id) === Number(id)).forEach((item) => {
        const date = moment(new Date(Number(item.create_time)));
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
    }).catch(error => {
      console.log('error:', error);
    }).finally(() => setLoading(false));
  }, [id, clicked]);

  return (
    <div className='relative'>
      {loading && <Loading />}
      {!loading && data && <>
        <div className='mt-[11px] rounded-[10px] grid grid-cols-4 gap-[16px]'>
          <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[20px] bg-white shadow-md'>
            <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>0</h2>
            <p className='text-[10px] 2xl:text-xs font-[Inter] font-normal mt-[5px] text-[#43474A]'>Total Impressions</p>
            <div className='bg-[#7ffbae] rounded-full mt-[12px] font-[Inter] py-[1px] px-[10px] text-[10px] 2xl:text-xs font-semibold text-black my-1'>0%</div>
            <p className='text-[#7F8182] text-[8px] mt-[5px] 2xl:text-[10px] font-semibold'>from 0 (last 4 weeks)</p>
          </div>
          <div className='col-span-1 py-5 px-4 flex flex-col justify-center items-center items-center rounded-[20px] bg-white'>
            <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{data.click_count}</h2>
            <p className='text-[10px] 2xl:text-xs font-[Inter] font-normal mt-[5px] text-[#43474A]'>Total Clicks</p>
            <div className='bg-[#7ffbae] rounded-full mt-[12px] font-[Inter] py-[1px] px-[10px] text-[10px] 2xl:text-xs font-semibold text-black my-1'>0%</div>
            <p className='text-[#7F8182] text-[8px] mt-[5px] 2xl:text-[10px] font-semibold'>from 0 (last 4 weeks)</p>
          </div>
          <div className='col-span-1 py-5 px-4 flex flex-col justify-center items-center items-center rounded-[20px] bg-white'>
            <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{`$${Number(data.click_count) * (data.demographic === 'consumer' ? 8 : 20)}`}</h2>
            <p className='text-[10px] 2xl:text-xs font-[Inter] font-normal mt-[5px] text-[#43474A]'>Total Spend</p>
            <div className='bg-[#7ffbae] rounded-full mt-[12px] font-[Inter] py-[1px] px-[10px] text-[10px] 2xl:text-xs font-semibold text-black my-1'>0%</div>
            <p className='text-[#7F8182] text-[8px] mt-[5px] 2xl:text-[10px] font-semibold'>from $0 (last 4 weeks)</p>
          </div>
          <div className='col-span-1 py-5 px-4 flex flex-col justify-center items-center items-center rounded-[20px] bg-white'>
            <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{`$${data.demographic === 'consumer' ? 8 : 20}`}</h2>
            <p className='text-[10px] 2xl:text-xs font-[Inter] font-normal mt-[5px] text-[#43474A]'>AVG CPC</p>
            <div className='bg-[#7ffbae] rounded-full mt-[12px] font-[Inter] py-[1px] px-[10px] text-[10px] 2xl:text-xs font-semibold text-black my-1'>0%</div>
            <p className='text-[#7F8182] text-[8px] mt-[5px] 2xl:text-[10px] font-semibold'>from $0 (last 4 weeks)</p>
          </div>
        </div>

        <div className='my-[14px] p-[25px] min-h-[250px] rounded-[10px] bg-white shadow-md'>
          <div className='flex justify-between items-center'>
            <div>
              <h2 className='font-[Inter] text-base 2xl:text-lg font-semibold'>
                {data.name}
              </h2>

              <span className='text-xs'>{`https://presspool-frontend.onrender.com/cul/${data.uid}`}</span>
              <p className='font-[Inter] text-[#43474A] mt-[5px] text-xs 2xl:text-sm'>Let's see how your campaign is performing</p>

            </div>
            <button className='border-[1px] px-2 py-1 font-[Inter] rounded-[5px] text-xs 2xl:text-sm font-semibold border-[#7f8182]'>
              Download as PDF
            </button>
          </div>

          <div className='flex relative'>
            <LineChart width={700} height={200} data={chartData} className='mt-[50px] w-full'>
              <Line type="linear" dataKey="click" stroke="black" />
              <Line type="linear" dataKey="impression" stroke="#7FFBAE" />
              <XAxis dataKey="date" />
              <YAxis />
            </LineChart>
            <div className='p-4 absolute right-[20px] top-0'>
              <p className='font-[Inter] text-black text-xs 2xl:text-sm font-semibold mb-2'>Total Impressions</p>
              <p className='font-[Inter] text-[#7F8182] text-xs 2xl:text-sm mt-2 font-semibold'>Total Clicks</p>
            </div>
          </div>
        </div>
        <div className='col-span-1 p-5 flex flex-col items-center bg-white rounded-[10px] shadow-md'>
          <p className='font-[Inter] text-black mb-4 text-left font-semibold w-full text-md 2xl:text-lg'>Newsletters (by the numbers)</p>
          <table className='w-full'>
            <thead>
              <tr>
                <td className='text-[10px] font-[Inter]'>Name</td>
                <td className='text-[10px] font-[Inter]'>Impressions</td>
                <td className='text-[10px] font-[Inter]'>Clicks</td>
                <td className='text-[10px] font-[Inter]'>Total Spend</td>
                <td className='text-[10px] font-[Inter]'>
                  <span className='flex items-center'>
                    CTR
                    <Tooltip
                      title="The percentage of clicks from the total impressions."
                      color='#EDECF2'
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className='h-[20px] w-[20px] 2xl:w-[24px] 2xl:h-[24px] ms-1'>
                        <path d="M460-300h40v-220h-40v220Zm20-276.923q10.462 0 17.539-7.077 7.076-7.077 7.076-17.539 0-10.461-7.076-17.538-7.077-7.077-17.539-7.077-10.462 0-17.539 7.077-7.076 7.077-7.076 17.538 0 10.462 7.076 17.539 7.077 7.077 17.539 7.077ZM480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                      </svg>
                    </Tooltip>
                  </span>
                </td>
                <td className='text-[10px] font-[Inter]'>
                  <span className='flex items-center'>
                    % of Total Traffic
                    <Tooltip
                      title="The percentage of the individual newsletter’s impressions from  the total number of impressions."
                      color='#EDECF2'
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className='h-[20px] w-[20px] 2xl:w-[24px] 2xl:h-[24px] ms-1'>
                        <path d="M460-300h40v-220h-40v220Zm20-276.923q10.462 0 17.539-7.077 7.076-7.077 7.076-17.539 0-10.461-7.076-17.538-7.077-7.077-17.539-7.077-10.462 0-17.539 7.077-7.076 7.077-7.076 17.538 0 10.462 7.076 17.539 7.077 7.077 17.539 7.077ZM480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                      </svg>
                    </Tooltip>
                  </span>
                </td>
                <td className='text-[10px] font-[Inter]'>Feedback</td>
              </tr>
            </thead>
            <tbody>
              {
                data01.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>15,000</td>
                    <td>250</td>
                    <td>1.67%</td>
                    <td className='flex'>
                      <button className='text-xs'>👍</button>
                      <button className='text-xs'>👎</button>
                    </td>
                  </tr>
                ))
              }

            </tbody>
          </table>
          <p className='font-[Inter] mt-4 text-sm'>No data is available. Please create and launch your first campaign</p>
        </div>
      </>
      }
    </div>
  );
};

export default CampaignDetail;