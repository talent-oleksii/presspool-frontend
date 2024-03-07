import { FC, useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Pie,
  Cell,
  PieChart,
} from "recharts";
import moment from "moment-timezone";
import { useSelector } from "react-redux";
import { selectData } from "../../store/dataSlice";
import APIInstance from "../../api";
import Loading from "../../components/Loading";
import { selectAuth } from "../../store/authSlice";
import StripeUtil from "../../utils/stripe";

import Card from "../../components/Card";
import CampaignNewsletter from "../../containers/dashboard/CampaignNewsletter";

const CampaignOverView: FC = () => {
  const { campaign: data } = useSelector(selectData);
  const [chartData, setChartData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const { clicked } = useSelector(selectData);
  const { email } = useSelector(selectAuth);

  const getSum = (a: Array<any>) => {
    let sum = 0;
    for (const i of a) {
      sum += Number(i.count);
    }
    return sum;
  };

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

    console.log('group:', grouped);

    setChartData(
      Object.keys(grouped).map((item: any) => {
        let sum = getSum(grouped[item]);
        return {
          impression: 0,
          click: sum,
          date: item
        };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clicked]);

  const avgCPC = useMemo(
    () =>
      data.reduce((accumulator, currentValue) => {
        const spent = Number(currentValue.spent);
        const uniqueClicks = Number(currentValue.unique_clicks);
        if (!isNaN(spent) && !isNaN(uniqueClicks) && uniqueClicks !== 0) {
          accumulator += spent / uniqueClicks;
        }

        return accumulator;
      }, 0),
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
    () => data.reduce((prev, item) => prev + Number(item?.spent ?? 0), 0),
    [data]
  );

  const getUnbilled = () => {
    let unbilled = 0;
    for (const item of data) {
      unbilled += Number(item.spent) - Number(item.billed);
    }

    return unbilled;
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

  const data1 = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="mt-3 h-full">
      <div className="rounded-[20px] grid grid-cols-5 gap-3 min-h-[90px]">
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
        <Card
          title={"AVG CPC"}
          value={avgCPC}
          percentage={0}
          totalCountLast4Week={0}
        />
        <Card
          title={"AVG Time on Page"}
          value={`0:00`}
          percentage={0}
          totalCountLast4Week={0}
        />
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
              <p className="font-[Inter] mt-4 text-[10px]">
                No data is available yet. Please create and launch your first
                campaign
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-7">
        <div
          className={`my-3 p-5 min-h-[225px] rounded-[10px] bg-white shadow-md`}
        >
          <h2 className="font-[Inter] text-base font-semibold">
            Engagement by Channel
          </h2>
          <div className="flex justify-between flex w-full items-center mt-5">
            <div className="flex flex-col justify-between gap-1">
              <div className="pl-4 py-1 border-l-4 border-[#243c5a] text-sm font-normal">
                Email
              </div>
              <div className="py-1 pl-4 border-l-4 border-[blue] text-sm font-normal">
                Blog
              </div>
            </div>
            <PieChart width={200} height={200}>
              <Pie
                data={data1}
                cx={"50%"}
                cy={"95%"}
                startAngle={180}
                endAngle={0}
                innerRadius={80}
                outerRadius={85}
                fill="#8884d8"
                paddingAngle={0}
                dataKey="value"
              >
                {data1.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </div>
        </div>
        <div
          className={`my-3 p-5 min-h-[225px] rounded-[10px] bg-white shadow-md`}
        >
          <h2 className="font-[Inter] text-base font-semibold">
            Engagement by Country
          </h2>
          <div className="flex justify-between flex w-full items-center mt-5">
            <div className="flex flex-col justify-between gap-1">
              <div className="pl-4 py-1 border-l-4 border-[#243c5a] text-sm font-normal">
                United States
              </div>
              <div className="py-1 pl-4 border-l-4 border-[blue] text-sm font-normal">
                Mexico
              </div>
              <div className="py-1 pl-4 border-l-4 border-[red] text-sm font-normal">
                Canada
              </div>
            </div>
            <PieChart width={200} height={200}>
              <Pie
                data={data1}
                cx={100}
                cy={100}
                innerRadius={80}
                outerRadius={85}
                fill="#8884d8"
                paddingAngle={0}
                dataKey="value"
              >
                {data1.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </div>
        </div>
      </div>
      <CampaignNewsletter />
    </div>
  );
};

export default CampaignOverView;
