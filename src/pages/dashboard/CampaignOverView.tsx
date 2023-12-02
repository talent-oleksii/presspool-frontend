import { FC, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis } from 'recharts';
import { Tooltip } from 'antd';
import moment from 'moment-timezone';

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

  const getActiveCampaigns = () => {
    return data.filter(item => item.state === 'active').length;
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

  const handleDownloadCSV = () => {
    var csv = 'Date, URL, DEMOGRAPHIC, HEADLINE, BODY, CTA, CLICK_COUNT, PAGE_URL\n';

    //merge the data with CSV  
    data.forEach(function (row) {
      csv += moment(new Date(Number(row.create_time))).format('mm-dd-yyyy') + ',';
      csv += row.url + ',';
      csv += row.demographic + ',';
      csv += `"${row.headline}",`;
      csv += `"${row.body}",`;
      csv += `"${row.cta}",`;
      csv += `"${row.click_count}",`;
      csv += `"${row.page_url}"`;

      csv += "\n";
    });

    //display the created CSV data on the web browser   

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';

    //provide the name for the CSV file to be downloaded  
    hiddenElement.download = 'Reports.csv';
    hiddenElement.click();
  };

  return (
    <div>
      <div className='mt-[11px] rounded-[10px] grid grid-cols-4 gap-4'>
        <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[20px] bg-white shadow-md'>
          <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{getActiveCampaigns()}</h2>
          <p className='text-[10px] 2xl:text-xs font-[Inter] font-normal mt-[5px] text-[#43474A]'>Active Campaigns</p>
          <div className='bg-[#7ffbae] rounded-full mt-[12px] font-[Inter] py-[1px] px-[10px] text-[10px] 2xl:text-xs font-semibold text-black my-1'>0%</div>
          <p className='text-[#7F8182] text-[8px] mt-[5px] 2xl:text-[10px] font-semibold'>from 0 (last 4 weeks)</p>
        </div>
        <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[20px] bg-white shadow-md'>
          <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{getTotalImpression()}</h2>
          <p className='text-[10px] 2xl:text-xs font-[Inter] font-normal mt-[5px] text-[#43474A]'>Total Impressions</p>
          <div className='bg-[#7ffbae] rounded-full mt-[12px] font-[Inter] py-[1px] px-[10px] text-[10px] 2xl:text-xs font-semibold text-black my-1'>0%</div>
          <p className='text-[#7F8182] text-[8px] mt-[5px] 2xl:text-[10px] font-semibold'>from 0 (last 4 weeks)</p>
        </div>
        <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[20px] bg-white shadow-md'>
          <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{getTotalClick()}</h2>
          <p className='text-[10px] 2xl:text-xs font-[Inter] font-normal mt-[5px] text-[#43474A]'>Total Clicks</p>
          <div className='bg-[#7ffbae] rounded-full mt-[12px] font-[Inter] py-[1px] px-[10px] text-[10px] 2xl:text-xs font-semibold text-black my-1'>0%</div>
          <p className='text-[#7F8182] text-[8px] mt-[5px] 2xl:text-[10px] font-semibold'>from 0 (last 4 weeks)</p>
        </div>
        <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[20px] bg-white shadow-md'>
          <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{`$${getTotalSpend()}`}</h2>
          <p className='text-[10px] 2xl:text-xs font-[Inter] font-normal mt-[5px] text-[#43474A]'>Total Spend</p>
          <div className='bg-[#7ffbae] rounded-full mt-[12px] font-[Inter] py-[1px] px-[10px] text-[10px] 2xl:text-xs font-semibold text-black my-1'>0%</div>
          <p className='text-[#7F8182] text-[8px] mt-[5px] 2xl:text-[10px] font-semibold'>from 0 (last 4 weeks)</p>
        </div>
        {/* <div className='col-span-1 py-5 px-4 flex flex-col justify-center items-center items-center rounded-[20px] bg-white'>
          <h2 className='text-[20px] 2xl:text-[25px] font-[Inter] font-semibold'>{`$${getAverageCPC()}`}</h2>
          <p className='text-xs font-[Inter] font-normal my-1 text-gray-600'>AVG CPC</p>
          <div className='bg-[#7ffbae] rounded-full font-[Inter] py-1 px-4 text-xs font-semibold text-black my-1'>0%</div>
          <p className='text-gray-500 text-[10px]'>from 0 (last 4 weeks)</p>
        </div> */}
      </div>

      <div className='my-5 p-5 min-h-[250px] rounded-[10px] bg-white shadow-md'>
        <div className='flex justify-between items-center'>
          <div>
            <h2 className='font-[Inter] text-md 2xl:text-lg font-semibold'>All Campaigns</h2>
            <p className='font-[Inter] text-gray-500 text-xs 2xl:text-sm'>Let’s see how your campaigns are performing</p>
          </div>

          {/* <button className='border-[1px] px-2 py-1 font-[Inter] rounded-[5px] text-sm 2xl:text-md font-semibold border-[#7f8182]' onClick={handleDownloadCSV}>
            Download as CSV
          </button> */}
        </div>

        <div className='flex relative'>
          <LineChart width={700} height={200} data={chartData} className='mt-[50px] w-full'>
            <Line type="linear" dataKey="click" stroke="black" />
            <Line type="linear" dataKey="impression" stroke="#7FFBAE" />
            {/* <CartesianGrid stroke="#ccc" strokeDasharray="5.5" /> */}
            <XAxis dataKey="name" />
            <YAxis />
          </LineChart>
          <div className='p-4 absolute right-[20px] top-0'>
            <p className='font-[Inter] text-black text-xs 2xl:text-sm mb-2'>Total Impressions</p>
            <p className='font-[Inter] text-[#7F8182] text-xs 2xl:text-sm mt-2'>Total Clicks</p>
          </div>
        </div>
      </div>

      {/* <div className='grid grid-cols-2 gap-8'> */}
      {/* <div className='col-span-1 p-5 flex items-center bg-white rounded-[20px]'>
          <PieChart width={150} height={150}>
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
        </div> */}
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
      {/* </div> */}
    </div>
  );
};

export default CampaignOverView;