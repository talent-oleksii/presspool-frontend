import { FC, useEffect, useState, useMemo, useRef } from "react";
import { CaretDownOutlined, CloudDownloadOutlined } from "@ant-design/icons";
import { Menu, MenuProps, Space } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Pie,
  Cell,
  PieChart,
  Legend,
  Tooltip,
} from "recharts";

import Card from "../../components/Card";
import { useSelector } from "react-redux";
import { selectAuth } from "../../store/authSlice";
import SelectList from "./dashboard/SelectList";
import AdminAPIInstance from "../../api/adminApi";
import Loading from "../../components/Loading";
import { getUnixTimestamp } from "../../utils/DateUtils";
import moment from "moment";
import { CustomLineChartTooltip } from "../../containers/shared/CustomLineChartTooltip";

type MenuItem = Required<MenuProps>["items"][number];
const getItem = (
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  theme?: "light" | "dark"
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
    theme,
  } as MenuItem;
};

interface IDateRange {
  startDate: Date | null;
  endDate: Date | null;
}

const AdminDashboard: FC = () => {
  const { adminName, adminRole, adminId } = useSelector(selectAuth);
  const [loading, setLoading] = useState(false);

  const [accountManagers, setAccountManagers] = useState<Array<any>>([]);
  const [clients, setClients] = useState<Array<any>>([]);
  const [campaigns, setCampaigns] = useState<Array<any>>([]);
  console.log(clients);
  const [currentAM, setCurrentAM] = useState<any>(0);
  const [currentClient, setCurrentClient] = useState<any>(0);
  const [currentCampaign, setCurrentCampaign] = useState<any>(0);
  const [chartData, setChartData] = useState<Array<any>>([]);

  const [data, setData] = useState<Array<any>>([]);
  const [clicked, setClicked] = useState<Array<any>>([]);
  const [selectedDateFilter, setSelectedDateFilter] = useState("All Time");
  const [open, setOpen] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<IDateRange>({
    startDate: null,
    endDate: null,
  });

  const ref = useRef<any>(null);
  const items: MenuItem[] = [
    getItem("All Time", "All Time"),
    getItem("Last 24 Hours", "Last 24 Hours"),
    getItem("Last 7 Days", "Last 7 Days"),
    getItem("Last 4 Weeks", "Last 4 Weeks"),
    getItem("Last 12 Months", "Last 12 Months"),
    getItem("Month to Date", "Month to Date"),
    getItem("Quarter to Date", "Quarter to Date"),
    getItem("Year to Date", "Year to Date"),
  ];

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
    // if (!location.pathname.includes('/overview') && !location.pathname.includes('/campaign') && !location.pathname.includes('/client'))
    //   navigator('/admin/dashboard/overview');
    setLoading(true);
    Promise.all([AdminAPIInstance.get("/user/account-manager")])
      .then((results: Array<any>) => {
        setAccountManagers(results[0].data);
      })
      .finally(() => setLoading(false));

    if (adminRole === "account_manager") {
      setCurrentAM(adminId);
    }
    onOverViewClicked();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        hide();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let grouped: any = {};
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
        let { total, uniqueClicks } = getSum(grouped[item]);
        return {
          uniqueClicks,
          total,
          date: item,
        };
      })
    );
    const halfPie = document.querySelector(".half-pie svg");
    halfPie?.setAttribute("viewBox", "65 120 130 180");

    const fullPie = document.querySelector(".full-pie svg");
    fullPie?.setAttribute("viewBox", "70 5 130 200");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clicked]);

  useEffect(() => {
    if (currentAM === 0) return;
    setLoading(true);
    setClients([]);
    setCurrentClient(0);
    setCampaigns([]);
    AdminAPIInstance.get("/users", { params: { accountManager: currentAM } })
      .then((data) => {
        setClients(data.data);
      })
      .finally(() => setLoading(false));
  }, [currentAM]);

  useEffect(() => {
    if (currentClient === 0 || clients.length <= 0) return;

    setLoading(true);
    setCurrentCampaign(0);
    setCampaigns([]);
    AdminAPIInstance.get("/campaign", {
      params: {
        client: clients.find((value) => value.id === currentClient).email,
      },
    })
      .then((data) => {
        setCampaigns(data.data);
      })
      .finally(() => setLoading(false));
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
    () => data.reduce((prev, item) => prev + Number(item?.price ?? 0), 0),
    [data]
  );

  const avgCPC =
    totalSpend === 0 || uniqueClicks === 0
      ? 0
      : totalSpend / uniqueClicks > 10
      ? 10
      : totalSpend / uniqueClicks;

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

  const handleOpenChange = () => {
    setOpen(true);
  };

  const hide = () => {
    setOpen(false);
  };

  const getDateRange = (item: string): IDateRange => {
    const today: Date = new Date();
    let startDate: Date | null = null,
      endDate: Date | null = null;

    switch (item) {
      case "Last 24 Hours":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 1);
        endDate = today;
        break;
      case "Last 7 Days":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        endDate = today;
        break;
      case "Last 4 Weeks":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 28);
        endDate = today;
        break;
      case "Last 12 Months":
        startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 1);
        endDate = today;
        break;
      case "Month to Date":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = today;
        break;
      case "Quarter to Date":
        startDate = new Date(
          today.getFullYear(),
          Math.floor(today.getMonth() / 3) * 3,
          1
        );
        endDate = today;
        break;
      case "Year to Date":
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = today;
        break;
      default:
        startDate = null;
        endDate = null;
        break;
    }

    return { startDate, endDate };
  };

  const onClick: MenuProps["onClick"] = (e) => {
    setDateRange(getDateRange(e.key));
    setSelectedDateFilter(e.key);
    hide();
  };

  const onAccountManagerClicked = (e: any) => {
    if (Number(e) === Number(currentAM)) return;
    callAPI(e, 0, 0);
  };

  const onClientClicked = (e: any) => {
    if (Number(e) === Number(currentClient)) return;
    callAPI(currentAM, e, 0);
  };

  const onCampaignClicked = (e: any) => {
    if (Number(e) === Number(currentCampaign)) return;
    callAPI(currentAM, currentClient, e);
  };

  const onOverViewClicked = () => {
    if (adminRole === "super_admin") {
      setCurrentAM(0);
    }
    setCurrentCampaign(0);
    setCurrentClient(0);
    if (adminRole === "super_admin") {
      callAPI(0, 0, 0);
    } else {
      callAPI(adminId, 0, 0);
    }
  };

  const callAPI = (am: any, client: any, campaign: any) => {
    setLoading(true);
    AdminAPIInstance.get("/dashboard/overview", {
      params: {
        accountManagerId: am,
        clientId: client,
        campaignId: campaign,
        ...(dateRange.endDate &&
          dateRange.startDate && {
            from: getUnixTimestamp(dateRange.startDate),
            to: getUnixTimestamp(dateRange.endDate),
          }),
      },
    })
      .then((data) => {
        setClicked(data.data.clicked);
        setData(data.data.campaign);
      })
      .finally(() => setLoading(false));
  };

  const isOverview = useMemo(() => {
    if (adminRole === "super_admin")
      return !!!currentCampaign && !!!currentClient && !!!currentAM;
    else return !!!currentCampaign && !!!currentClient;
  }, [currentCampaign, currentClient, currentAM, adminRole]);

  return (
    <div className="w-full flex relative">
      {loading && <Loading />}
      <div className="text-left flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-[Inter] font-semibold -tracking-[.6px] text-[20px]">{`Welcome ${adminName} 🤝`}</h2>
            <p className="mt-1 text-secondry1 font-[Inter] text-xs">
              Here's a snapshot of Presspool.ai, all in one place
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div>
            <button
              className={`inline-flex items-center justify-center text-primary text-[14px] font-semibold px-4 py-[10px] font-[Inter] rounded-[10px] sm:w-[170px] me-4 ${
                isOverview
                  ? "bg-white border border-solid border-main shadow-md"
                  : ""
              } `}
              onClick={onOverViewClicked}
            >
              Overview
            </button>
            {adminRole === "super_admin" && (
              <SelectList
                name={`${
                  currentAM === 0 ||
                  !accountManagers.find((value) => value.id === currentAM)
                    ? "By Account Manager"
                    : accountManagers.find((value) => value.id === currentAM)
                        .name
                }`}
                setValue={(v: any) => {
                  setCurrentAM(v);
                  onAccountManagerClicked(v);
                }}
                items={accountManagers}
                id={currentAM}
              />
            )}
            <SelectList
              name={`${
                currentClient === 0 ||
                !clients.find((value) => value.id === currentClient)
                  ? "By Company"
                  : clients.find((value) => value.id === currentClient).company
              }`}
              setValue={(v: any) => {
                setCurrentClient(v);
                onClientClicked(v);
              }}
              items={clients.map((x) => ({ id: x.id, name: x.company }))}
              id={currentClient}
            />
            <SelectList
              name={`${
                currentCampaign === 0 ||
                !campaigns.find((value) => value.id === currentCampaign)
                  ? "By Campaign"
                  : campaigns.find((value) => value.id === currentCampaign).name
              }`}
              setValue={(v: any) => {
                setCurrentCampaign(v);
                onCampaignClicked(v);
              }}
              items={campaigns}
              id={currentCampaign}
            />
          </div>
          <div className="flex gap-5">
            <div
              ref={ref}
              className="group inline-flex flex-col min-w-[100px] relative"
            >
              <button
                onMouseEnter={handleOpenChange}
                className={`font-[Inter] text-[14px] font-semibold items-center justify-center text-primary justify-between flex px-4 py-[10px] gap-4 rounded-[10px] bg-white ring-1 ring-main shadow-md`}
              >
                {selectedDateFilter}
                <CaretDownOutlined />
              </button>
              {open && (
                <Menu
                  selectedKeys={[selectedDateFilter]}
                  onClick={onClick}
                  items={items}
                  className="w-[300px] absolute top-[calc(100%+5px)] !shadow-md rounded-[10px] text-left z-[9]"
                />
              )}
            </div>
            <button
              className="inline-flex items-center justify-center text-primary text-[14px] font-semibold px-4 py-[10px] font-[Inter] rounded-[10px] me-2 bg-white border border-solid border-main shadow-md disabled:text-[#a3a3a3] disabled:border-none"
              // onClick={handleDownloadCSV}
              disabled
            >
              <Space>
                <CloudDownloadOutlined style={{ fontSize: "18px" }} />
                Download Report
              </Space>
            </button>
          </div>
        </div>

        <div className="rounded-[10px] grid grid-cols-4 gap-3 min-h-[90px] mt-4">
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
            title={"Total Budget"}
            value={`$${totalSpend}`}
            percentageText={`0% from ${selectedDateFilter}`}
          />
          <Card
            title={"AVG CPC"}
            value={avgCPC.toFixed(2)}
            percentageText={`0% from ${selectedDateFilter}`}
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
              <p className="font-[Inter] text-secondry1 mt-[5px] text-xs">
                Let’s see how your campaigns are performing
              </p>
            </div>
            <div>
              <div className="mt-[20px]">
                <p className="flex items-center gap-1 font-[Inter] text-primary text-[10px] 2xl:text-xs font-semibold mb-2">
                  <span className="w-4 h-[3px] shrink-0 rounded-[10px] bg-main"></span>
                  Total Clicks
                </p>
                <p className="flex items-center gap-1 font-[Inter] text-primary text-[10px] 2xl:text-xs mt-2 font-semibold">
                  <span className="w-4 h-[3px] shrink-0 rounded-[10px] bg-[#6C63FF]"></span>
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
                    <Tooltip content={<CustomLineChartTooltip />} />
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
                  <span className="text-sm leading-[14px] font-normal">
                    Blog
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
                    { name: "Email", value: sumCountByEmailAndBlog.email },
                    { name: "Blog", value: sumCountByEmailAndBlog.blog },
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
                <Legend
                  content={
                    <div>
                      <div className="text-xl font-semibold">
                        {sumCountByEmailAndBlog.email +
                          sumCountByEmailAndBlog.blog}
                      </div>
                      <div className="text-sm font-normal">
                        Total Engagement
                      </div>
                    </div>
                  }
                  align="center"
                  className="h-[0px]"
                />
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
