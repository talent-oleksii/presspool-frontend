import { FC, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie } from 'recharts';

const data01: Array<any> = [];

interface typeOverView {
  data: Array<any>
}

const CampaignOverView: FC<typeOverView> = ({ data }: typeOverView) => {
  const [chartData, setChartData] = useState<any>();

  useEffect(() => {
    setChartData([{ click: getTotalClick(), impression: 0 }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const getTotalImpression = () => {
    return 0;
  };

  const getTotalClick = () => {
    let click = 0;

    for (const item of data) {
      click += Number(item.click_count);
    }
    return click;
  };

  const getAverageCPC = () => {
    if (data.length <= 0) return 0;
    let cpc = 0;
    for (const item of data) {
      cpc += item.demographic === 'consumer' ? 8 : 20;
    }

    return cpc / data.length;
  };

  const getTotalSpend = () => {
    let spend = 0;
    for (const item of data) {
      spend += (item.demographic === 'consumer' ? 8 : 20) * Number(item.click_count);
    }

    return spend;
  };

  return (
    <div>
      <div className='mt-2 rounded-[10px] grid grid-cols-4 gap-4'>
        <div className='col-span-1 py-5 px-4 flex flex-col justify-center items-center rounded-[20px] bg-white'>
          <h2 className='text-[25px] font-[Inter] font-semibold'>{getTotalImpression()}</h2>
          <p className='text-xs font-[Inter] font-normal my-1 text-gray-600'>Total Impressions</p>
          <div className='bg-[#7ffbae] rounded-full font-[Inter] py-1 px-4 text-xs font-semibold text-black my-1'>0%</div>
          <p className='text-gray-500 text-[10px]'>from 0 (last 4 weeks)</p>
        </div>
        <div className='col-span-1 py-5 px-4 flex flex-col justify-center items-center items-center rounded-[20px] bg-white'>
          <h2 className='text-[25px] font-[Inter] font-semibold'>{getTotalClick()}</h2>
          <p className='text-xs font-[Inter] font-normal my-1 text-gray-600'>Total Clicks</p>
          <div className='bg-[#7ffbae] rounded-full font-[Inter] py-1 px-4 text-xs font-semibold text-black my-1'>0%</div>
          <p className='text-gray-500 text-[10px]'>from 0 (last 4 weeks)</p>
        </div>
        <div className='col-span-1 py-5 px-4 flex flex-col justify-center items-center items-center rounded-[20px] bg-white'>
          <h2 className='text-[25px] font-[Inter] font-semibold'>{`$${getTotalSpend()}`}</h2>
          <p className='text-xs font-[Inter] font-normal my-1 text-gray-600'>Total Spend</p>
          <div className='bg-[#7ffbae] rounded-full font-[Inter] py-1 px-4 text-xs font-semibold text-black my-1'>0%</div>
          <p className='text-gray-500 text-[10px]'>from 0 (last 4 weeks)</p>
        </div>
        <div className='col-span-1 py-5 px-4 flex flex-col justify-center items-center items-center rounded-[20px] bg-white'>
          <h2 className='text-[25px] font-[Inter] font-semibold'>{`$${getAverageCPC()}`}</h2>
          <p className='text-xs font-[Inter] font-normal my-1 text-gray-600'>AVG CPC</p>
          <div className='bg-[#7ffbae] rounded-full font-[Inter] py-1 px-4 text-xs font-semibold text-black my-1'>0%</div>
          <p className='text-gray-500 text-[10px]'>from 0 (last 4 weeks)</p>
        </div>
      </div>

      <div className='my-5 p-5 min-h-[250px] rounded-[10px] bg-white'>
        <div className='flex justify-between items-center'>
          <div>
            <h2 className='font-[Inter] text-[20px] font-semibold'>All Campaigns</h2>
            <p className='font-[Inter] text-gray-500 text-sm'>Let’s see how your campaigns are performing</p>
          </div>

          <select className='border-[1px] px-2 py-2 font-[Inter] rounded-[5px] font-semibold border-[#7f8182]'>
            <option>Last 4 weeks</option>
            <option>Last 2 weeks</option>
          </select>
        </div>

        <div className='flex relative'>
          <LineChart width={700} height={200} data={chartData} className='mt-[50px] w-full'>
            <Line type="linear" dataKey="click" stroke="black" />
            <Line type="linear" dataKey="impression" stroke="#6c63ff" />
            {/* <CartesianGrid stroke="#ccc" strokeDasharray="5.5" /> */}
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
          </LineChart>
          <div className='p-4 absolute right-[20px] top-0'>
            <p className='font-[Inter] text-black text-sm mb-2'>Total Impressions</p>
            <p className='font-[Inter] text-[#6c63ff] text-sm mt-2'>Total Clicks</p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-8'>
        <div className='col-span-1 p-5 flex items-center bg-white rounded-[20px]'>
          <PieChart width={150} height={150}>
            {/* <Pie data={data01} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={50} fill="#8884d8" /> */}
            <Pie data={data01} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} fill="#82ca9d" />
          </PieChart>
          <div className='flex-1'>
            <p className='font-[Inter] text-xs text-gray-700 mb-2'>Newsletters (by attribution)</p>
            {
              data01.map((item, index) => (
                <div className='flex justify-between items-center' key={index}>
                  <div className='flex my-2'>
                    <div className={`w-[15px] h-[15px] rounded-[5px] me-2`} style={{ backgroundColor: item.color }} />
                    <p className='font-[Inter] font-semibold text-xs'>{item.name}</p>
                  </div>
                  <p>{`${item.value}%`}</p>
                </div>
              ))
            }
          </div>
        </div>
        <div className='col-span-1 p-5 flex flex-col items-center bg-white rounded-[20px]'>
          <p className='font-[Inter] text-gray-700 text-xs mb-2'>Newsletters (by the numbers)</p>
          <table className='w-full'>
            <thead>
              <tr>
                <td className='text-[10px] font-[Inter]'>Name</td>
                <td className='text-[10px] font-[Inter]'>Impressions</td>
                <td className='text-[10px] font-[Inter]'>Clicks</td>
                <td className='text-[10px] font-[Inter]'>CTR</td>
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
        </div>
      </div>
    </div>
  );
};

export default CampaignOverView;