import { FC, useEffect, useMemo, useState } from "react";
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  Pie,
  Cell,
  PieChart,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import moment from "moment-timezone";
import { useSelector } from "react-redux";
import { selectData } from "../../store/dataSlice";
import CampaignNewsletter from "../../containers/dashboard/CampaignNewsletter";
import { CustomLineChartTooltip } from "../../containers/shared/CustomLineChartTooltip";
import { Legend } from "recharts";
import { useParams } from "react-router";
import { CustomEngagementChannelLegend } from "../../containers/shared/CustomEngagementChannelLegend";
import CampaignStatsCard from "../../containers/dashboard/CampaignStatsCard";
import CustomTooltip from "../../components/CustomTooltip";
import { getVerifiedClick } from "../../utils/commonUtils";
import useAnalytics from "../../hooks/useAnalytics";

const CampaignOverView: FC = () => {
  const { id } = useParams();
  const {
    campaign: data,
    clicked,
    selectedDateFilter,
  } = useSelector(selectData);
  const [chartData, setChartData] = useState<Array<any>>([]);

  const { avgCPC } = useAnalytics(clicked, data);

  const getSum = (a: Array<any>) => {
    let total = 0;
    let uniqueClicks = 0;
    let verifiedClicks = 0;
    for (const i of a) {
      total += Number(i.count);
      uniqueClicks += Number(i.unique_click ?? 0);
      verifiedClicks += getVerifiedClick(i);
    }
    return { total, uniqueClicks, verifiedClicks };
  };

  useEffect(() => {
    let grouped: any = {};
    if (selectedDateFilter === "Last 24 Hours") {
      for (let i = 23; i >= 0; i--) {
        const hour = moment().subtract(i, "hours").format("h A");
        grouped[hour] = [];
      }
      clicked.forEach((item) => {
        const createTime = new Date(Number(item.create_time));
        const hour = moment(createTime).format("h A");
        grouped[hour].push(item);
      });

      const sortedKeys = Object.keys(grouped).sort((a, b) => {
        const momentA = moment(a, "h A");
        const momentB = moment(b, "h A");
        return momentB.valueOf() - momentA.valueOf();
      });

      setChartData(
        sortedKeys.map((item) => {
          let { total, uniqueClicks, verifiedClicks } = getSum(grouped[item]);
          return {
            uniqueClicks,
            total,
            verifiedClicks,
            date: item,
          };
        })
      );
    } else {
      clicked.forEach((item) => {
        const date = moment(Number(item.create_time));
        const key = date.format("MM/DD/YYYY");
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(item);
      });

      const sortedKeys = Object.keys(grouped).sort(
        (a, b) =>
          moment(b, "MM/DD/YYYY").valueOf() - moment(a, "MM/DD/YYYY").valueOf()
      );

      setChartData(
        sortedKeys.map((item) => {
          let { total, uniqueClicks, verifiedClicks } = getSum(grouped[item]);
          return {
            uniqueClicks,
            total,
            verifiedClicks,
            date: item,
          };
        })
      );
    }

    const halfPie = document.querySelector(".half-pie svg");
    halfPie?.setAttribute("viewBox", "65 70 130 180");

    const fullPie = document.querySelector(".full-pie svg");
    fullPie?.setAttribute("viewBox", "70 5 130 200");

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
        sumEmail += Number(item.unique_click);
      } else if (item.user_medium === "referral") {
        sumBlog += Number(item.unique_click);
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
      const percentage = Number(((total / totalSum) * 100).toFixed(2));
      result.push({ ip, total, percentage, color: generateColor() });
    }
    return result.sort((a, b) => b.percentage - a.percentage);
  }, [clicked]);

  return (
    <div className="mt-3 h-full">
      <CampaignStatsCard />
      <div
        className={`my-3 p-5 ${!!chartData.length ? " min-h-[450px] " : " min-h-[200px] "
          } rounded-[10px] bg-white shadow-md`}
      >
        <div className="flex justify-between items-baseline relative">
          <div>
            <h2 className="font-[Inter] text-base font-semibold">
              All Campaigns
            </h2>
            <p className="font-[Inter] text-secondry1 mt-[5px] text-xs">
              Let’s see how your campaigns are performing
            </p>
          </div>
          <div className="absolute right-6">
            <div className="mt-[20px]">
              <p className="flex items-center gap-1 font-[Inter] text-primary text-[10px] 2xl:text-xs font-semibold mb-2">
                <span className="w-4 h-[3px] shrink-0 rounded-[10px] bg-main"></span>
                Total Clicks
              </p>
              {/* <p className="flex items-center gap-1 font-[Inter] text-primary text-[10px] 2xl:text-xs mt-2 font-semibold">
                <span className="w-4 h-[3px] shrink-0 rounded-[10px] bg-[#6C63FF]"></span>
                Unique Clicks
              </p> */}
              <p className="flex items-center gap-1 font-[Inter] text-primary text-[10px] 2xl:text-xs mt-2 font-semibold">
                <span className="w-4 h-[3px] shrink-0 rounded-[10px] bg-[#FDE006]"></span>
                Verified Clicks
              </p>
              {/* <p className="flex items-center gap-1 font-[Inter] text-primary text-[10px] 2xl:text-xs mt-2 font-semibold">
                <span className="w-4 h-[3px] shrink-0 rounded-[10px] bg-[#FDE006]"></span>
                Verified Clicks
              </p> */}
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div
            className={`flex w-full ${!!chartData.length ? " min-h-[350px] " : " min-h-[50px] "
              } items-center justify-center mt-12`}
          >
            {chartData.length > 0 ? (
              <ResponsiveContainer height={350}>
                <AreaChart
                  data={chartData}
                  margin={{ left: 0, bottom: 0, right: 30 }}
                >
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7FFBAE" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#7FFBAE" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorUniqueClicks"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#FDE006" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FDE006" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" reversed />
                  <YAxis />
                  <Tooltip content={<CustomLineChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#7FFBAE"
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                  />
                  <Area
                    type="monotone"
                    dataKey="uniqueClicks"
                    stroke="#FDE006"
                    fillOpacity={1}
                    fill="url(#colorUniqueClicks)"
                  />
                </AreaChart>
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
      {id?.toLowerCase() !== "all" ? (
        <CampaignNewsletter avgCPC={avgCPC} />
      ) : null}
      <div className="grid grid-cols-2 gap-7">
        {/* <div
          className={`my-3 p-5 min-h-[225px] rounded-[10px] bg-white shadow-md`}
        >
          <h2 className="font-[Inter] text-base font-semibold flex items-center">
            Engagement by Channel
            <CustomTooltip
              title={
                <>
                  <span className="font-normal">
                    Newsletter means the clicks came directly via email
                  </span>
                  <br />
                  <span className="font-normal">
                    Referral means the clicks came directly via website/blog
                  </span>
                </>
              }
            />
          </h2>
          <div className="flex justify-between flex w-full items-center mt-5">
            <div className="flex flex-col justify-between gap-5 pl-8">
              <div className="pl-2 border-l-4 border-[#6C63FF]  flex flex-col justify-between gap-1">
                <span className="text-sm leading-[14px] font-normal">
                  Newsletter
                </span>
                <span className="text-xl leading-[20px] font-semibold">
                  {sumCountByEmailAndBlog.email}
                </span>
              </div>
              <div className="pl-2 border-l-4 border-[#7FFBAE]  flex flex-col justify-between gap-1">
                <span className="text-sm leading-[14px] font-normal">
                  Referral
                </span>
                <span className="text-xl leading-[20px] font-semibold">
                  {sumCountByEmailAndBlog.blog}
                </span>
              </div>
            </div>
            <PieChart
              width={260}
              height={200}
              className="half-pie flex flex-1 justify-center"
            >
              <Pie
                data={[
                  { name: "Email", value: sumCountByEmailAndBlog.blog },
                  { name: "Blog", value: sumCountByEmailAndBlog.email },
                ]}
                cx={"50%"}
                cy={"115%"}
                startAngle={-45}
                endAngle={225}
                innerRadius={90}
                outerRadius={96}
                fill="#8884d8"
                paddingAngle={0}
                dataKey="value"
              >
                <Cell key={`cell-1`} fill={"#7FFBAE"} />
                <Cell key={`cell-1`} fill={"#6C63FF"} />
              </Pie>
              <Legend content={<CustomEngagementChannelLegend />} />
            </PieChart>
          </div>
        </div> */}
        <div
          className={`my-3 p-5 min-h-[225px] rounded-[10px] bg-white shadow-md`}
        >
          <h2 className="font-[Inter] text-base font-semibold">
            Engagement by Country
          </h2>
          <div className="flex justify-between w-full items-center mt-5">
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[200px]">
              {groupByAndSumCountOnCountry.map((item, index) => (
                <div
                  className="flex justify-between gap-8 items-center"
                  key={index}
                >
                  <div
                    key={index}
                    className="flex items-center gap-3 shrink-0 text-sm font-normal h-8"
                  >
                    <span
                      style={{ backgroundColor: item.color }}
                      className={`w-[3px] h-full rounded-[10px]`}
                    ></span>
                    {item.ip}
                  </div>
                  <span>{item.percentage}%</span>
                </div>
              ))}
            </div>

            <PieChart
              width={260}
              height={210}
              className="full-pie flex flex-1 justify-center"
            >
              <Pie
                data={groupByAndSumCountOnCountry.map((item) => ({
                  name: item.ip,
                  value: item.total,
                }))}
                cx={130}
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
    </div>
  );
};

export default CampaignOverView;
