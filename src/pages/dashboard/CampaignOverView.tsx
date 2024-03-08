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

import Card from "../../components/Card";
import CampaignNewsletter from "../../containers/dashboard/CampaignNewsletter";

const CampaignOverView: FC = () => {
  const { campaign: data } = useSelector(selectData);
  const [chartData, setChartData] = useState<Array<any>>([]);
  const { clicked, selectedDateFilter } = useSelector(selectData);

  const getSum = (a: Array<any>) => {
    let total = 0;
    let uniqueClicks = 0;
    for (const i of a) {
      total += Number(i.count);
      uniqueClicks += Number(i.unique_click ?? 0);
    }
    return { total, uniqueClicks };
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

    const sortedKeys = Object.keys(grouped).sort(
      (a, b) =>
        moment(b, "DD/MM/YYYY").valueOf() - moment(a, "DD/MM/YYYY").valueOf()
    );

    setChartData(
      sortedKeys.map((item) => {
        let { total, uniqueClicks } = getSum(grouped[item]);
        return {
          uniqueClicks,
          total,
          date: item,
        };
      })
    );
    const halfPie = document.querySelector(".half-pie svg");
    halfPie?.setAttribute("viewBox", "60 95 140 150");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clicked]);

  const generateColor = () => {
    return "#" + Math.random().toString(16).substr(-6);
  };

  const sumCountByEmailAndBlog = useMemo(() => {
    let sumEmail = 0;
    let sumBlog = 0;

    clicked.forEach((item) => {
      if (item.user_medium === "newsletter") {
        sumEmail += item.count;
      } else {
        sumBlog += item.count;
      }
    });

    return {
      email: sumEmail,
      blog: sumBlog,
    };
  }, [clicked]);

  const groupByAndSumCountOnCountry = useMemo(() => {
    const ipCounts: { [x: string]: { total: number } } = {};
    clicked.forEach((item) => {
      const ip = item.ip;
      const count = item.count;

      if (!ipCounts[ip]) {
        ipCounts[ip] = { total: 0 };
      }
      ipCounts[ip].total += count;
    });
    const totalSum = Object.values(ipCounts).reduce(
      (acc: any, { total }: any) => acc + total,
      0
    );

    const result = [];
    for (const [ip, { total }] of Object.entries(ipCounts)) {
      const percentage = ((total / totalSum) * 100).toFixed(2);
      result.push({ ip, total, percentage, color: generateColor() });
    }
    return result;
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

  return (
    <div className="mt-3 h-full">
      <div className="rounded-[20px] grid grid-cols-4 gap-3 min-h-[90px]">
        <Card
          title={"Total Clicks"}
          value={totalClicks}
          percentageText={`0% from ${selectedDateFilter}`}
        />
        <Card
          title={"Unique Clicks"}
          value={uniqueClicks}
          percentageText={`0% from ${selectedDateFilter}`}
        />
        <Card
          title={"Total Spend"}
          value={`$${totalSpend}`}
          percentageText={`0% from ${selectedDateFilter}`}
        />
        <Card
          title={"AVG CPC"}
          value={avgCPC.toFixed(2)}
          percentageText={`0% from ${selectedDateFilter}`}
        />
        {/* <Card
          title={"AVG Time on Page"}
          value={avgTime}
          percentage={0}
          totalCountLast4Week={0}
        /> */}
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
              <p className="flex items-center gap-1 font-[Inter] text-black text-[10px] 2xl:text-xs font-semibold mb-2">
                <span className="w-4 h-[3px] shrink-0 rounded-full bg-main"></span>
                Total Clicks
              </p>
              <p className="flex items-center gap-1 font-[Inter] text-black text-[10px] 2xl:text-xs mt-2 font-semibold">
                <span className="w-4 h-[3px] shrink-0 rounded-full bg-[#6C63FF]"></span>
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
                  <Line
                    type="linear"
                    dataKey="total"
                    stroke="#7FFBAE"
                    strokeWidth={3}
                  />
                  <Line
                    type="linear"
                    dataKey="uniqueClicks"
                    stroke="#6C63FF"
                    strokeWidth={3}
                  />
                  <XAxis dataKey="date" reversed />
                  <YAxis strokeWidth={0} />
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
            <div className="flex flex-col justify-between gap-5 pl-8">
              <div className="pl-2 border-l-4 border-[#7FFBAE]  flex flex-col justify-between gap-1">
                <span className="text-sm leading-[14px] font-normal">
                  Email
                </span>
                <span className="text-xl leading-[20px] font-semibold">
                  {sumCountByEmailAndBlog.email}
                </span>
              </div>
              <div className="pl-2 border-l-4 border-[#6C63FF]  flex flex-col justify-between gap-1">
                <span className="text-sm leading-[14px] font-normal">Blog</span>
                <span className="text-xl leading-[20px] font-semibold">
                  {sumCountByEmailAndBlog.blog}
                </span>
              </div>
            </div>
            <PieChart width={260} height={200} className="half-pie">
              <Pie
                data={[
                  { name: "Email", value: sumCountByEmailAndBlog.email },
                  { name: "Blog", value: sumCountByEmailAndBlog.blog },
                ]}
                cx={"50%"}
                cy={"115%"}
                startAngle={180}
                endAngle={0}
                innerRadius={90}
                outerRadius={95}
                fill="#8884d8"
                paddingAngle={0}
                dataKey="value"
              >
                <Cell key={`cell-1`} fill={"#7FFBAE"} />
                <Cell key={`cell-1`} fill={"#6C63FF"} />
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
          <div className="flex justify-between w-full items-center mt-5">
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[200px]">
              {groupByAndSumCountOnCountry.map((item, index) => (
                <div className="flex justify-between gap-8 items-center">
                  <div
                    key={index}
                    className="flex items-center gap-3 shrink-0 text-sm font-normal h-8"
                  >
                    <span
                      style={{ backgroundColor: item.color }}
                      className={`w-[3px] h-full rounded-full`}
                    ></span>
                    {item.ip}
                  </div>
                  <span>{item.percentage}%</span>
                </div>
              ))}
            </div>
            <PieChart width={300} height={205}>
              <Pie
                data={groupByAndSumCountOnCountry.map((item) => ({
                  name: item.ip,
                  value: item.total,
                }))}
                cx={100}
                cy={100}
                innerRadius={93}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={0}
                dataKey="value"
              >
                {groupByAndSumCountOnCountry.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
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
