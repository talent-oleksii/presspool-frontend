import { FC, useEffect, useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Space, Tooltip } from "antd";
import moment from "moment-timezone";
import { useSelector } from "react-redux";
import { selectData } from "../../store/dataSlice";
import APIInstance from "../../api";
import Loading from "../../components/Loading";
import { selectAuth } from "../../store/authSlice";
import StripeUtil from "../../utils/stripe";

import DownloadImage from "../../assets/icon/download.png";
import Card from "../../components/Card";
import { CloudDownloadOutlined } from "@ant-design/icons";

const data01: Array<any> = [];

interface typeOverView {
  data: Array<any>;
}

const CampaignOverView: FC<typeOverView> = ({ data }: typeOverView) => {
  const [chartData, setChartData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const { clicked } = useSelector(selectData);
  const { email } = useSelector(selectAuth);

  useEffect(() => {
    let grouped: any = {};
    clicked.forEach((item) => {
      const date = moment(Number(item.create_time));
      const key = date.format("DD/MM/YYYY");
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });

    setChartData(
      Object.keys(grouped).map((item) => ({
        impression: 0,
        click: grouped[item].length,
        date: item,
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clicked]);

  const activeCampaigns = useMemo(
    () => data.filter((item) => item.state === "active").length ?? 0,
    [data]
  );

  const totalClicks = useMemo(
    () => data.reduce((prev, item) => prev + Number(item?.click_count ?? 0), 0),
    [data]
  );

  const uniqueClicks = useMemo(
    () =>
      data.reduce((prev, item) => prev + Number(item?.unique_clicks ?? 0), 0),
    [data]
  );

  const totalSpend = useMemo(
    () =>
      data.reduce(
        (prev, item) =>
          prev +
          (item.demographic === "consumer" ? 8 : 20) *
            Number(item.unique_clicks),
        0
      ),
    [data]
  );

  const getUnbilled = () => {
    let unbilled = 0;
    for (const item of data) {
      unbilled += Number(item.spent) - Number(item.billed);
    }

    return unbilled;
  };

  const handleDownloadCSV = () => {
    var csv =
      "Date, URL, DEMOGRAPHIC, HEADLINE, BODY, CTA, CLICK_COUNT, PAGE_URL\n";

    //merge the data with CSV
    data.forEach(function (row) {
      csv += moment(Number(row.create_time)).format("mm-dd-yyyy") + ",";
      csv += row.url + ",";
      csv += row.demographic + ",";
      csv += `"${row.headline}",`;
      csv += `"${row.body}",`;
      csv += `"${row.cta}",`;
      csv += `"${row.click_count}",`;
      csv += `"${row.page_url}"`;

      csv += "\n";
    });

    //display the created CSV data on the web browser

    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";

    //provide the name for the CSV file to be downloaded
    hiddenElement.download = "Reports.csv";
    hiddenElement.click();
  };

  const handlePayNow = () => {
    setLoading(true);
    APIInstance.get("data/unbilled", { params: { email } })
      .then(async (data) => {
        if (Number(data.data.unbilled) <= 0) return;
        const customerId = await StripeUtil.getCustomerId(email);

        const newPrice = await StripeUtil.stripe.prices.create({
          currency: "usd",
          unit_amount: Number(data.data.unbilled) * 100,
          product_data: {
            name: "Presspool AI Unbilled Services",
          },
          metadata: { state: "unbilled" },
        });

        const session = await StripeUtil.stripe.checkout.sessions.create({
          customer: customerId,
          mode: "payment",
          line_items: [{ price: newPrice.id, quantity: 1 }],
          success_url: "https://go.presspool.ai/campaign/all",
          cancel_url: "https://go.presspool.ai/campaign/all",
          payment_intent_data: {
            metadata: {
              state: "unbilled",
            },
          },
        });

        (await StripeUtil.stripePromise)?.redirectToCheckout({
          sessionId: session.id,
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="mt-3">
      {loading && <Loading />}
      <div className="rounded-[20px] grid grid-cols-4 gap-3 min-h-[200px]">
        <Card
          title={"Active Campaigns"}
          value={activeCampaigns}
          percentage={0}
          totalCountLast4Week={0}
        />
        <Card
          title={"Total Clicks"}
          value={totalClicks}
          percentage={0}
          totalCountLast4Week={0}
        />
        <Card
          title={"Unique Clicks"}
          value={uniqueClicks}
          percentage={0}
          totalCountLast4Week={0}
        />
        <Card
          title={"Total Spend"}
          value={`$${totalSpend}`}
          percentage={0}
          totalCountLast4Week={0}
        />
        {/* <div className='col-span-1 py-5 px-4 flex flex-col justify-center items-center items-center rounded-[20px] bg-white'>
          <h2 className='text-[20px] 2xl:text-[25px] font-[Inter] font-semibold'>{`$${getAverageCPC()}`}</h2>
          <p className='text-xs font-[Inter] font-normal my-1 text-gray-600'>AVG CPC</p>
          <div className='bg-main rounded-full font-[Inter] py-1 px-4 text-xs font-semibold text-black my-1'>0%</div>
          <p className='text-gray-500 text-xs'>from 0 (last 4 weeks)</p>
        </div> */}
      </div>
      <div
        className={`my-3 p-5 ${
          !!chartData.length ? " min-h-[450px] " : " min-h-[200px] "
        } rounded-[10px] bg-white shadow-md`}
      >
        <div className="flex justify-between items-baseline">
          <div>
            <h2 className="font-[Inter] text-base font-semibold">
              All Campaigns
            </h2>
            <p className="font-[Inter] text-[#43474A] mt-[5px] text-xs">
              Let’s see how your campaigns are performing
            </p>
          </div>
          <div>
            <button
              className="border-[1px] px-3 py-2 flex items-center font-[Inter] rounded-[5px] text-xs 2xl:text-xs font-medium border-black rounded-lg"
              onClick={handleDownloadCSV}
            >
              <Space>
                <CloudDownloadOutlined style={{ fontSize: "18px" }} />
                Download PDF
              </Space>
            </button>
            <div className="mt-[20px]">
              <p className="font-[Inter] text-black text-[10px] 2xl:text-xs font-semibold mb-2">
                Total Clicks
              </p>
              <p className="font-[Inter] text-[#7F8182] text-[10px] 2xl:text-xs mt-2 font-semibold">
                Unique Clicks
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div
            className={`flex w-full ${
              !!chartData.length ? " min-h-[350px] " : " min-h-[50px] "
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
              <p className="font-[Inter] mt-4 text-[10px]">No active data yet.</p>
            )}
          </div>
        </div>
      </div>
      <div className="col-span-1 p-5 flex flex-col items-center bg-white rounded-[10px] shadow-md">
        <p className="font-[Inter] text-black mb-4 text-left font-semibold w-full text-base">
          Newsletters (by the numbers)
        </p>
        <table className="w-full">
          <thead>
            <tr>
              <td className="text-[10px] font-[Inter]">Name</td>
              <td className="text-[10px] font-[Inter]">Impressions</td>
              <td className="text-[10px] font-[Inter]">Clicks</td>
              <td className="text-[10px] font-[Inter]">Total Spend</td>
              <td className="text-[10px] font-[Inter]">
                <span className="flex items-center">
                  CTR
                  <Tooltip
                    title="The percentage of clicks from the total impressions."
                    color="#EDECF2"
                    getPopupContainer={() =>
                      document.getElementById("ctr-tooltip") as HTMLElement
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 -960 960 960"
                      className="h-[20px] w-[20px] 2xl:w-[24px] 2xl:h-[24px] ms-1"
                    >
                      <path d="M460-300h40v-220h-40v220Zm20-276.923q10.462 0 17.539-7.077 7.076-7.077 7.076-17.539 0-10.461-7.076-17.538-7.077-7.077-17.539-7.077-10.462 0-17.539 7.077-7.076 7.077-7.076 17.538 0 10.462 7.076 17.539 7.077 7.077 17.539 7.077ZM480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                    </svg>
                  </Tooltip>
                  <div id="ctr-tooltip"></div>
                </span>
              </td>
              <td className="text-[10px] font-[Inter]">
                <span className="flex items-center">
                  % of Total Traffic
                  <Tooltip
                    title="The percentage of the individual newsletter’s impressions from  the total number of impressions."
                    color="#EDECF2"
                    getPopupContainer={() =>
                      document.getElementById("total-trafic") as HTMLElement
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 -960 960 960"
                      className="h-[20px] w-[20px] 2xl:w-[24px] 2xl:h-[24px] ms-1"
                    >
                      <path d="M460-300h40v-220h-40v220Zm20-276.923q10.462 0 17.539-7.077 7.076-7.077 7.076-17.539 0-10.461-7.076-17.538-7.077-7.077-17.539-7.077-10.462 0-17.539 7.077-7.076 7.077-7.076 17.538 0 10.462 7.076 17.539 7.077 7.077 17.539 7.077ZM480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                    </svg>
                  </Tooltip>
                  <div id="total-trafic"></div>
                </span>
              </td>
              <td className="text-[10px] font-[Inter]">Feedback</td>
            </tr>
          </thead>
          <tbody>
            {data01.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>15,000</td>
                <td>250</td>
                <td>1.67%</td>
                <td className="flex">
                  <button className="text-[10px]">👍</button>
                  <button className="text-[10px]">👎</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="font-[Inter] mt-4 text-[10px]">
          No data is available yet. Please create and launch your first campaign
        </p>
      </div>
    </div>
  );
};

export default CampaignOverView;
