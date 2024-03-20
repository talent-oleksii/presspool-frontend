import { FC, useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Tooltip } from "antd";
import moment from "moment-timezone";

import APIInstance from "../../api";
import Loading from "../../components/Loading";
import { useSelector } from "react-redux";
import { selectData } from "../../store/dataSlice";
import { selectAuth } from "../../store/authSlice";

import DownloadImage from "../../assets/icon/download.png";
import Card from "../../components/Card";

const data01: Array<any> = [];

interface typeCampaignDetail {
  id?: string;
}

const CampaignDetail: FC<typeCampaignDetail> = ({ id }: typeCampaignDetail) => {
  const [data, setData] = useState<any>({
    click_count: 0,
  });
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<Array<any>>([]);
  const { clicked } = useSelector(selectData);
  const { email } = useSelector(selectAuth);
  const [newsletter, setNewsletter] = useState<Array<any>>([]);

  useEffect(() => {
    setLoading(true);
    APIInstance.get('/data/newsletter', { params: { email } }).then(data => {
      console.log('data:', data.data);
      setNewsletter(data.data.filter((item: any) => Number(item.campaign_id) === Number(id)));
    }).catch(error => {
      console.log('err:', error);
    }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSum = (a: Array<any>) => {
    let sum = 0;
    for (const i of a) {
      sum += Number(i.count);
    }
    return sum;
  };

  useEffect(() => {
    setLoading(true);
    APIInstance.get("data/campaign_detail", { params: { id } })
      .then((data) => {
        setData(data.data);
        let grouped: any = {};
        clicked
          .filter((item) => Number(item.campaign_id) === Number(id))
          .forEach((item) => {
            const date = moment(Number(item.create_time));
            const key = date.format("MM/DD/YYYY");
            if (!grouped[key]) {
              grouped[key] = [];
            }
            grouped[key].push(item);
          });

        const sorted = Object.keys(grouped).map((item) => {
          let sum = getSum(grouped[item]);
          return {
            impression: 0,
            click: sum,
            date: item,
          }
        }).sort((a: any, b: any) => moment(a.date, 'MM/DD/YYYY').valueOf() - moment(b.date, 'MM/DD/YYYY').valueOf());

        setChartData(sorted);
      })
      .finally(() => setLoading(false));
  }, [id, clicked]);

  const handleDownloadCSV = () => { };

  const getTraffic = (click: Number) => {
    let sumClick = 0;
    for (const item of newsletter) sumClick += Number(item.total_click);

    return Math.round(Number(click) * 100 / sumClick);
  };

  const avgCPC =
    data.price === 0 || data.unique_clicks === 0 ? 0 : data.price / data.unique_clicks > 10 ? 10 : data.price / data.unique_clicks;

  return (
    <div className="mt-5">
      {loading && <Loading />}
      <>
        <div className="rounded-[10px] grid grid-cols-4 gap-5 min-h-[200px]">
          <Card
            title={"Total Clicks"}
            value={data?.click_count ?? 0}
            percentageText={`200% from last 7 days`}
          />
          <Card
            title={"Unique Clicks"}
            value={data?.unique_clicks ?? 0}
            percentageText={`200% from last 7 days`}
          />
          <Card
            title={"Total Budget"}
            value={`$${data?.price ?? 0}`}
            percentageText={`200% from last 7 days`}
          />
          <Card
            title={"AVG CPC"}
            value={`$${avgCPC}`}
            percentageText={`200% from last 7 days`}
          />
        </div>

        <div
          className={`my-5 p-5 ${!!chartData.length ? " min-h-[450px] " : " min-h-[200px] "
            } rounded-[10px] bg-white shadow-md`}
        >
          <div className="flex justify-between items-baseline">
            <div>
              <h2 className="font-[Inter] text-lg font-semibold">
                {data.name || ""}
              </h2>
              <p className="font-[Inter] text-secondry1 mt-[5px] text-xs">
                Let's see how your campaign is performing
              </p>
            </div>
            <div>
              <button
                className="border-[1px] px-3 py-2 flex items-center font-[Inter] rounded-[10px] text-xs 2xl:text-xs font-medium border-black rounded-[10px]"
                onClick={handleDownloadCSV}
              >
                <img
                  src={DownloadImage}
                  className="w-[12px] me-2 -ms-1"
                  alt="download"
                />
                Download PDF
              </button>
              <div className="mt-[20px]">
                <p className="font-[Inter] text-primary text-[10px] 2xl:text-xs font-semibold mb-2">
                  Total Clicks
                </p>
                <p className="font-[Inter] text-secondry2 text-[10px] 2xl:text-xs mt-2 font-semibold">
                  Unique Clicks
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <div
              className={`flex w-full ${!!chartData.length ? " min-h-[350px] " : " min-h-[50px] "
                } items-center justify-center mt-5`}
            >
              {chartData.length > 0 ? (
                <ResponsiveContainer height={350}>
                  <LineChart
                    data={chartData}
                    margin={{ left: 0, bottom: 0, right: 50 }}
                  >
                    <Line type="linear" dataKey="click" stroke="#7F8182" />
                    <Line type="linear" dataKey="impression" stroke="black" />
                    <XAxis dataKey="date" />
                    <YAxis />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="font-[Inter] mt-4 text-xs">No data is available yet. Please create and launch your first campaign</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-1 p-5 flex flex-col items-center bg-white rounded-[10px] shadow-md">
          <p className="font-[Inter] text-primary mb-4 text-left font-semibold w-full text-md 2xl:text-lg">
            Newsletters (by the numbers)
          </p>
          <table className="w-full">
            <thead>
              <tr>
                <td className="text-[10px] font-[Inter]">Name</td>
                <td className="text-[10px] font-[Inter]">Total Clicks</td>
                <td className="text-[10px] font-[Inter]">Unique Clicks</td>
                <td className="text-[10px] font-[Inter]">Total Spend</td>
                {/* <td className="text-xs font-[Inter]">
                  <span className="flex items-center">
                    CTR
                    <Tooltip
                      title="The percentage of clicks from the total impressions."
                      color="#EDECF2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        className="h-[20px] w-[20px] 2xl:w-[24px] 2xl:h-[24px] ms-1"
                      >
                        <path d="M460-300h40v-220h-40v220Zm20-276.923q10.462 0 17.539-7.077 7.076-7.077 7.076-17.539 0-10.461-7.076-17.538-7.077-7.077-17.539-7.077-10.462 0-17.539 7.077-7.076 7.077-7.076 17.538 0 10.462 7.076 17.539 7.077 7.077 17.539 7.077ZM480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                      </svg>
                    </Tooltip>
                  </span>
                </td> */}
                <td className="text-xs font-[Inter]">
                  <span className="flex items-center">
                    % of Total Traffic
                    <Tooltip
                      title="The percentage of the individual newsletter’s impressions from  the total number of impressions."
                      color="#EDECF2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        className="h-[20px] w-[20px] 2xl:w-[24px] 2xl:h-[24px] ms-1"
                      >
                        <path d="M460-300h40v-220h-40v220Zm20-276.923q10.462 0 17.539-7.077 7.076-7.077 7.076-17.539 0-10.461-7.076-17.538-7.077-7.077-17.539-7.077-10.462 0-17.539 7.077-7.076 7.077-7.076 17.538 0 10.462 7.076 17.539 7.077 7.077 17.539 7.077ZM480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                      </svg>
                    </Tooltip>
                  </span>
                </td>
                <td className="text-xs font-[Inter]">Feedback</td>
              </tr>
            </thead>
            <tbody>
              {newsletter.map((item, index) => (
                <tr key={index} className="border-b-[1px] py-2" style={{ height: '30px' }}>
                  <td className="text-[10px] -tracking-[.24px] font-semibold">{item.name}</td>
                  <td className="text-[10px] -tracking-[.24px] font-semibold">{item.total_click}</td>
                  <td className="text-[10px] -tracking-[.24px] font-semibold">{`${item.unique_click}`}</td>
                  <td className="text-[10px] -tracking-[.24px] font-semibold">{`$${item.spent}`}</td>
                  <td className="text-[10px] -tracking-[.24px] font-semibold">{`${getTraffic(item.total_click)}%`}</td>
                  <td className="">
                    <button className="text-[10px]">👍</button>
                    <button className="text-[10px]">👎</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {
            newsletter.length <= 0 &&
            <p className="font-[Inter] mt-4 text-xs">
              No data is available yet. Please create and launch your first campaign
            </p>
          }
        </div>
      </>
    </div>
  );
};

export default CampaignDetail;
