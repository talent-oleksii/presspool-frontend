import { FC, useEffect, useState, useMemo } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
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

import Card from "../../components/Card";
import { useSelector } from "react-redux";
import { selectAuth } from "../../store/authSlice";
import SelectList from "./dashboard/SelectList";
import AdminAPIInstance from "../../api/adminApi";
import Loading from "../../components/Loading";

const AdminDashboard: FC = () => {
  const { adminName, adminRole } = useSelector(selectAuth);
  const [loading, setLoading] = useState(false);

  console.log('role:', adminRole);
  const [accountManagers, setAccountManagers] = useState<Array<any>>([]);
  const [clients, setClients] = useState<Array<any>>([]);
  const [campaigns, setCampaigns] = useState<Array<any>>([]);

  const [currentAM, setCurrentAM] = useState<any>(0);
  const [currentClient, setCurrentClient] = useState<any>(0);
  const [currentCampaign, setCurrentCampaign] = useState<any>(0);
  const [chartData, setChartData] = useState<Array<any>>([]);

  const [data, setData] = useState<Array<any>>([]);
  const [clicked, setClicked] = useState<Array<any>>([]);

  useEffect(() => {
    // if (!location.pathname.includes('/overview') && !location.pathname.includes('/campaign') && !location.pathname.includes('/client'))
    //   navigator('/admin/dashboard/overview');
    setLoading(true);
    Promise.all([
      AdminAPIInstance.get('/user/account-manager'),
    ]).then((results: Array<any>) => {
      setAccountManagers(results[0].data);
    }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log('am:', currentAM);
    if (currentAM === 0) return;
    setLoading(true);
    setClients([]);
    setCampaigns([]);
    AdminAPIInstance.get('/users', { params: { accountManager: currentAM } }).then(data => {
      setClients(data.data);
    }).finally(() => setLoading(false));
  }, [currentAM]);

  useEffect(() => {
    if (currentClient === 0 || clients.length <= 0) return;
    console.log('dfdf:', clients, currentClient);

    setLoading(true);
    setCampaigns([]);
    AdminAPIInstance.get('/campaign', { params: { client: clients.find((value) => value.id === currentClient).email } }).then(data => {
      setCampaigns(data.data);
    }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentClient]);

  const generateColor = () => {
    return "#" + Math.random().toString(16).substr(-6);
  };

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

  const sumCountByEmailAndBlog = useMemo(() => {
    let sumEmail = 0;
    let sumBlog = 0;

    clicked.forEach((item: any) => {
      if (item.user_medium === "email") {
        sumEmail += item.count;
      } else if (item.user_medium === "blog") {
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
    clicked.forEach((item: any) => {
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

  return (
    <div className="w-full flex relative">
      {loading && <Loading />}
      <div className="text-left flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-[Inter] font-semibold -tracking-[.6px] text-[20px]">{`Welcome ${adminName} 🤝`}</h2>
            <p className="mt-1 text-[#43474a] font-[Inter] text-xs">Here's a snapshot of Presspool.ai, all in one place</p>
          </div>
        </div>
        <div className="mt-4">
          <button
            className={`inline-flex items-center justify-center text-[#505050] text-[14px] font-semibold px-4 py-[10px] font-[Inter] rounded-[15px] sm:w-[170px] me-4 bg-white border border-solid border-main shadow-md`}
          >
            Overview
          </button>
          <SelectList
            name={`${currentAM === 0 || !accountManagers.find((value) => value.id === currentAM) ? 'By Account Manager' : accountManagers.find((value) => value.id === currentAM).name}`}
            setValue={(v: any) => setCurrentAM(v)}
            items={accountManagers}
            id={currentAM}
          />
          <SelectList
            name={`${currentClient === 0 || !clients.find((value) => value.id === currentClient) ? 'By Client' : clients.find((value) => value.id === currentClient).name}`}
            setValue={(v: any) => setCurrentClient(v)}
            items={clients}
            id={currentAM}
          />
          <SelectList
            name={`${currentCampaign === 0 || !campaigns.find((value) => value.id === currentCampaign) ? 'By Campaign' : campaigns.find((value) => value.id === currentCampaign).name}`}
            setValue={(v: any) => setCurrentCampaign(v)}
            items={campaigns}
            id={currentCampaign}
          />
        </div>

        <div className="rounded-[20px] grid grid-cols-4 gap-3 min-h-[90px] mt-4">
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
            value={avgCPC.toFixed(2)}
            percentage={0}
            totalCountLast4Week={0}
          />
        </div>
        <div
          className={`my-3 p-5 ${!!chartData.length ? " min-h-[450px] " : " min-h-[200px] "
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
              className={`flex w-full ${!!chartData.length ? " min-h-[350px] " : " min-h-[50px] "
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
                    <XAxis dataKey="date" />
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
                  <div className="flex justify-between gap-8 items-center" key={index}>
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
        {/* <div className="mt-4">
          <Routes>
            <Route path="/overview" element={<AdminDashboardOverview />} />
            <Route path="/campaign/:id" element={<ADminDashboardCampaign />} />
            <Route path="/client" element={<AdminDashboardClient />} />
          </Routes>
        </div> */}
      </div>
    </div>
  );
};

export default AdminDashboard;