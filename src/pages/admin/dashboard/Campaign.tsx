import { FC, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Select } from 'antd';
import moment from 'moment';
import { LineChart, Line, XAxis, YAxis } from 'recharts';

import DialogUtils from '../../../utils/DialogUtils';
import AdminAPIInstance from '../../../api/adminApi';
import APIInstance from '../../../api';
import Loading from '../../../components/Loading';

const AdminDashboardCampaign: FC = () => {
  const [chartData, setChartData] = useState<any>();
  const [currentId, setCurrentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [nameList, setNameList] = useState<Array<any>>([]);
  const [data, setData] = useState<any>({});
  const { id } = useParams();
  const navigator = useNavigate();
  const filterOptions = [{
    label: 'All',
    value: 'all'
    // }, {
    //   label: 'Active',
    //   value: 'acive'
    // }, {
    //   label: 'Paused',
    //   value: 'paused',
    // }, {
    //   label: 'Draft',
    //   value: 'draft'
  }];

  useEffect(() => {
    loadData('');
  }, []);

  useEffect(() => {
    if (id === 'list') return;
    setLoading(true);
    AdminAPIInstance.get('/dashboard/campaign/detail', { params: { id } }).then(data => {
      setData(data.data);

      let grouped: any = {};
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
    }).finally(() => setLoading(false));
  }, [id]);

  const loadData = (searchStr: string) => {
    setFetching(true);
    AdminAPIInstance.get('/dashboard/campaign/list', { params: { searchStr } }).then(data => {
      setNameList(data.data);
    }).finally(() => setFetching(false));
  };

  const handleSearch = (value: string) => {
    loadData(value);
  };

  const handlePauseCampaign = () => {
    const newState = data.state === 'active' ? 'paused' : 'active';
    setLoading(true);
    APIInstance.put('data/campaign_detail', {
      state: newState,
      id,
      type: 'state',
    }).then(() => {
      setData({
        ...data,
        state: newState,
      })
      DialogUtils.show('success', newState === 'paused' ? 'Campaign Paused' : 'Successfully Started the Campaign', '');
    }).catch(err => {
      DialogUtils.show('error', '', err.response.data.message);
    }).finally(() => setLoading(false));
  };

  return (
    <div>
      {loading && <Loading />}
      <div className='flex items-center'>
        <Select
          showSearch
          value={currentId}
          placeholder="Type here to search by campaign name or select from the dropdown"
          // style={props.style}
          loading={fetching}
          defaultActiveFirstOption={false}
          suffixIcon={null}
          filterOption={false}
          onSearch={handleSearch}
          onChange={value => {
            setCurrentId(value);
            navigator(`/admin/dashboard/campaign/${value}`);
          }}
          className='flex-1 h-full'
          notFoundContent={null}
          options={(nameList || []).map((d) => ({
            value: d.id,
            label: d.name,
          }))}
        />
        <select
          className='rounded-[10px] border-[1px] border-[#7f8182] bg-white py-1.5 ms-4 w-[23.5%] 2xl:w-[190px] font-[Inter] text-xs'
        >
          {filterOptions.map(item => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </div>
      {id === 'list' && <p className='mt-2 text-xs font-[Inter]'>Select Campaign to see the details here</p>}
      <div className='mt-2'>
        <div className='grid grid-cols-4 gap-4'>
          <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[10px] bg-white shadow-md'>
            <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{data.unique_clicks || 0}</h2>
            <p className='text-xs font-[Inter] font-semibold mt-[5px] text-secondry1'>Unique Clicks</p>
            <div className='bg-main rounded-[10px] mt-[12px] font-[Inter] py-[1px] px-[10px] text-xs 2xl:text-xs font-semibold text-primary my-1'>0%</div>
            <p className='text-secondry2 text-[8px] mt-[5px] 2xl:text-xs font-semibold'>from 0 (last 4 weeks)</p>
          </div>
          <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[10px] bg-white shadow-md'>
            <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{(data.clicked && data.clicked.length) || 0}</h2>
            <p className='text-xs font-[Inter] font-semibold mt-[5px] text-secondry1'>Total Clicks</p>
            <div className='bg-main rounded-[10px] mt-[12px] font-[Inter] py-[1px] px-[10px] text-xs 2xl:text-xs font-semibold text-primary my-1'>0%</div>
            <p className='text-secondry2 text-[8px] mt-[5px] 2xl:text-xs font-semibold'>from 0 (last 4 weeks)</p>
          </div>
          <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[10px] bg-white shadow-md'>
            <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{`$${data.price || 0}`}</h2>
            <p className='text-xs font-[Inter] font-semibold mt-[5px] text-secondry1'>Budget</p>
            <div className='bg-main rounded-[10px] mt-[12px] font-[Inter] py-[1px] px-[10px] text-xs 2xl:text-xs font-semibold text-primary my-1'>0%</div>
            <p className='text-secondry2 text-[8px] mt-[5px] 2xl:text-xs font-semibold'>from 0 (last 4 weeks)</p>
          </div>
          <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[10px] bg-white shadow-md'>
            <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{`$${Number(data.price || 0) - Number(data.spent || 0)}`}</h2>
            <p className='text-xs font-[Inter] font-semibold mt-[5px] text-secondry1'>Budget Remaining</p>
            <div className='bg-main rounded-[10px] mt-[12px] font-[Inter] py-[1px] px-[10px] text-xs 2xl:text-xs font-semibold text-primary my-1'>0%</div>
            <p className='text-secondry2 text-[8px] mt-[5px] 2xl:text-xs font-semibold'>from 0 (last 4 weeks)</p>
          </div>
          <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[10px] bg-white shadow-md'>
            <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{`$${Number(data.price || 0)}`}</h2>
            <p className='text-xs font-[Inter] font-semibold mt-[5px] text-secondry1'>Total Revenue</p>
            <div className='bg-main rounded-[10px] mt-[12px] font-[Inter] py-[1px] px-[10px] text-xs 2xl:text-xs font-semibold text-primary my-1'>0%</div>
            <p className='text-secondry2 text-[8px] mt-[5px] 2xl:text-xs font-semibold'>from 0 (last 4 weeks)</p>
          </div>
          <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[10px] bg-white shadow-md'>
            <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{`$${data.spent || 0}`}</h2>
            <p className='text-xs font-[Inter] font-semibold mt-[5px] text-secondry1'>Total Spend</p>
            <div className='bg-main rounded-[10px] mt-[12px] font-[Inter] py-[1px] px-[10px] text-xs 2xl:text-xs font-semibold text-primary my-1'>0%</div>
            <p className='text-secondry2 text-[8px] mt-[5px] 2xl:text-xs font-semibold'>from 0 (last 4 weeks)</p>
          </div>
          <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[10px] bg-white shadow-md'>
            <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{`$${data.billed || 0}`}</h2>
            <p className='text-xs font-[Inter] font-semibold mt-[5px] text-secondry1'>Total Profit</p>
            <div className='bg-main rounded-[10px] mt-[12px] font-[Inter] py-[1px] px-[10px] text-xs 2xl:text-xs font-semibold text-primary my-1'>0%</div>
            <p className='text-secondry2 text-[8px] mt-[5px] 2xl:text-xs font-semibold'>from 0 (last 4 weeks)</p>
          </div>
          <div className='col-span-1 pt-[25px] pb-[20px] flex flex-col justify-center items-center rounded-[10px] bg-white shadow-md'>
            <h2 className='text-[25px] 2xl:text-[28px] font-[Inter] font-semibold'>{`$${Number(data.spent || 0) - Number(data.billed || 0)}`}</h2>
            <p className='text-xs font-[Inter] font-semibold mt-[5px] text-secondry1'>Unpaid Invoices</p>
            <div className='bg-main rounded-[10px] mt-[12px] font-[Inter] py-[1px] px-[10px] text-xs 2xl:text-xs font-semibold text-primary my-1'>0%</div>
            <p className='text-secondry2 text-[8px] mt-[5px] 2xl:text-xs font-semibold'>from 0 (last 4 weeks)</p>
          </div>
        </div>
      </div>
      <div className='my-[14px] p-[25px] min-h-[250px] rounded-[10px] bg-white shadow-md'>
        <div className='flex justify-between items-center'>
          <div>
            {data.state && <span className={`rounded-[10px] text-xs px-[12px] py-[4px] font-medium ${data.state === 'draft' ? 'bg-[#dbdbdb]' : data.state === 'paused' ? 'bg-[#fdbdbd]' : 'bg-main'}`}>{data.state}</span>}
            <h2 className='font-[Inter] mt-4 text-xs 2xl:text-lg font-semibold'>{data.name || ''}</h2>
            <p className='text-xs'>{`https://track.presspool.ai/${data.uid || 1}`}</p>
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
      {data.state &&
        <>
          <p className='text-[red] text-xs'>Do not use this features now. It's still in consideration cuz we admins can not change client's payment method</p>
          <div className='mt-4'>
            <Link
              className='px-4 py-2 text-white bg-black rounded-[10px] text-xs font-semibold'
              to={`/edit/${data.id}`}
            >
              Edit Campaign
            </Link>
            <button
              className='px-4 py-2 text-[red] text-xs font-semibold'
              onClick={handlePauseCampaign}
            >
              {data.state !== 'active' ? 'Start Campaign' : 'Pause Campaign'}
            </button>
          </div>
        </>
      }
      {/* {
        data.state &&
        <EditCampaign
          show={showEdit}
          setShow={(show: boolean) => setShowEdit(show)}
          data={data}
        />
      } */}
    </div>
  );
};

export default AdminDashboardCampaign;