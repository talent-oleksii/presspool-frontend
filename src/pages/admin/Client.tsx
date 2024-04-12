import { Table, Avatar, Menu, MenuProps } from "antd";
import { FC, useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import moment from "moment-timezone";
import { useSelector } from "react-redux";

import AdminAPIInstance from "../../api/adminApi";
import Loading from "../../components/Loading";
import { selectAuth } from "../../store/authSlice";
import AssignAccountManager from "./ui/AssignAccountManager";
import { GetItem, MenuItem } from "../../containers/shared/GetItem";
import { selectData } from "../../store/dataSlice";
import { CaretDownOutlined } from "@ant-design/icons";
import { capitalize } from "lodash";

const { Column } = Table;

const AdminClient: FC = () => {
  const { id } = useParams();
  const navigator = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>({});
  const [campaignData, setCampaignData] = useState<Array<any>>([]);
  const [filteredData, setFilteredData] = useState<Array<any>>([]);
  const [accountManager, setAccountManager] = useState<Array<any>>([]);
  const [currentTab, setCurrentTab] = useState("campaign");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [range, setRange] = useState<any>([]);
  const [note, setNote] = useState("");
  const [fileData, setFileData] = useState<Array<any>>([]);
  const [searchKey, setSearchKey] = useState("");
  const { selectedDateFilter } = useSelector(selectData);
  const [open, setOpen] = useState<boolean>(false);
  const [openTime, setOpenTime] = useState<boolean>(false);
  const [sort, setSort] = useState<string>("Joined Date");
  const ref = useRef<any>(null);

  const { adminRole } = useSelector(selectAuth);

  useEffect(() => {
    setLoading(true);
    AdminAPIInstance.get("/client", { params: { id } })
      .then((data) => {
        setUserData(data.data.userData);
        setNote(data.data.userData.note || "");
        setCampaignData(data.data.campaignData);
        setAccountManager(data.data.assignedAdmins);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    // set campaign data
    const temp: Array<any> = [];
    campaignData.forEach((item: any, index: number) => {
      if (item.additional_files) {
        const files = item.additional_files.split(",");
        files.forEach(async (fileName: string, fileIndex: number) => {
          const parts = fileName.split("/");
          // const fetchData = await fetch(fileName);
          temp.push({
            key: index * campaignData.length + fileIndex,
            name: parts[parts.length - 1],
            date: moment(Number(item.create_time)).format("MM/DD/YYYY HH:MM"),
            // size: Number(fetchData) / 1024 / 1024,
            fullUrl: fileName,
            campaignName: item.name,
          });
        });
      }
    });
    setFileData(temp);

    if (!range || !range[1] || !range[0]) {
      setFilteredData(
        campaignData.filter((item) => item.name.includes(searchKey))
      );
      return;
    }
    setFilteredData(
      campaignData.filter(
        (item) =>
          Number(item.create_time) >= range[0].valueOf() &&
          Number(item.create_time) <= range[1].valueOf() &&
          item.name.includes(searchKey)
      )
    );
  }, [campaignData, range, searchKey]);

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

  const goBack = () => {
    navigator(-1);
  };

  const getPlaceHolder = (fullName: string) => {
    if (!fullName) return "";
    const names = fullName.split(" ");
    if (names.length === 2) {
      return `${names[0].at(0)}${names[1].at(0)}`;
    } else if (names.length === 1) {
      return `${names[0].at(0)}`;
    } else {
      return "";
    }
  };

  const handleRemove = (id: number) => {
    AdminAPIInstance.put("/user/account-manager", {
      userId: userData.id,
      manager: id,
    })
      .then((res) => {
        setAccountManager(res.data);
      })
      .finally(() => setLoading(false));
  };

  const handleDownload = (url: string, fileName: string) => {
    const aElement = document.createElement("a");
    aElement.href = url;
    aElement.download = fileName;
    document.body.appendChild(aElement);
    aElement.click();
    document.body.removeChild(aElement);
  };

  const handleOpenChange = () => {
    setOpen(true);
  };
  const handleOpenChangeTime = () => {
    setOpenTime(true);
  };

  const hide = () => {
    setOpen(false);
    setOpenTime(false);
  };

  const items: MenuItem[] = [GetItem("Joined Date", "Joined Date")];

  const timeItems: MenuItem[] = [
    getItem("All Time", "All Time"),
    getItem("Last 24 Hours", "Last 24 Hours"),
    getItem("Last 7 Days", "Last 7 Days"),
    getItem("Last 4 Weeks", "Last 4 Weeks"),
    getItem("Last 12 Months", "Last 12 Months"),
    getItem("Month to Date", "Month to Date"),
    getItem("Quarter to Date", "Quarter to Date"),
    getItem("Year to Date", "Year to Date"),
  ];

  const onClick: MenuProps["onClick"] = (e) => {
    setSort(e.key);
    hide();
  };

  const onClickTime: MenuProps["onClick"] = (e) => {
    setSort(e.key);
    hide();
  };

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

  const totalBudget = useMemo(
    () =>
      campaignData
        .map((item) => (item.state !== "draft" ? Number(item.price) : 0))
        .reduce((acc, current) => acc + current, 0),
    [campaignData]
  );

  const totalBilled = useMemo(
    () =>
      campaignData
        .map((item) => Number(item.billed))
        .reduce((acc, current) => acc + current, 0),
    [campaignData]
  );

  return (
    <div>
      {loading && <Loading />}
      {!loading && (
        <div className="text-left">
          <h2 className="font-[Inter] text-lg font-semibold -tracking-[.6px] flex items-center">
            <button className="underline" onClick={goBack}>
              Dashboard
            </button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 -960 960 960"
              width="20"
              className="mx-1"
            >
              <path d="M683.154-460H200v-40h483.154L451.461-731.692 480-760l280 280-280 280-28.539-28.308L683.154-460Z" />
            </svg>
            <span>{userData.name}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 -960 960 960"
              width="20"
              className="mx-1"
            >
              <path d="M683.154-460H200v-40h483.154L451.461-731.692 480-760l280 280-280 280-28.539-28.308L683.154-460Z" />
            </svg>
            <span>{currentTab === "user" ? "Details" : "Campaigns"}</span>
          </h2>
          {/* <p className='text-secondry1 text-xs font-[Inter] mt-1'>One-stop shop to manage all clients</p> */}
          <div className="mt-4 flex justify-between items-center border-b-[1px] border-[#bcbcbc] py-4">
            <div className="flex items-center">
              <Avatar size={77} src={userData.avatar} className="bg-[#7f8182]">
                {!userData.avatar && getPlaceHolder(userData.name)}
              </Avatar>
              <div className="ms-2 py-[20px]">
                {/* <p className='font-[Inter] text-xs text-[#a3a3a3] -tracking-[.36px]'>{`ID: ${userData.id}`}</p> */}
                <p className="font-[Inter] text-lg text-secondry1 -tracking-[.54px]">
                  {userData.company}
                </p>
                <p className="text-[#a3a3a3] text-xs font-medium -tracking-[.48px]">{`Date Joined: ${moment(
                  Number(userData.create_time)
                )
                  .format("DD MMM, yyyy")
                  .toString()}`}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-white rounded-[10px] px-[20px] pt-[12px] min-w-[240px]">
                <div className="flex items-center font-[Inter] text-xs font-medium -tracking-[.48px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 -960 960 960"
                    width="20"
                    className="me-2"
                  >
                    <path d="M718.461-450.001v-59.998h144.615v59.998H718.461Zm45.693 269.23-115.692-86.768 36.461-47.845 115.691 86.768-36.46 47.845Zm-80.77-465.383-36.46-47.845 115.691-86.769 36.461 47.845-115.692 86.769ZM210.001-220.771v-156.153h-40.77q-29.922 0-51.115-21.192-21.192-21.193-21.192-51.115v-61.538q0-29.922 21.192-51.115 21.193-21.192 51.115-21.192h154.615l179.23-106.922v419.996l-179.23-106.922h-53.847v156.153h-59.998Zm348.46-134.46v-249.538q23.539 21.308 37.923 53.692 14.385 32.385 14.385 71.077t-14.385 71.077Q582-376.539 558.461-355.231Z" />
                  </svg>
                  Total Campaigns
                </div>
                <p className="text-[25px] font-[Inter] text-main font-semibold -tracking-[.75px] mt-2 mb-0">
                  {campaignData.length}
                </p>
              </div>
              <div className="bg-white rounded-[10px] px-[20px] pt-[12px] pb-[7px] min-w-[240px]">
                <div className="flex items-center font-[Inter] text-xs font-medium -tracking-[.48px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 -960 960 960"
                    width="20"
                    className="me-2"
                  >
                    <path d="M459.385-215.385h39.23v-46.923q43.077-3.615 82.539-30.923 39.461-27.307 39.461-84.769 0-42-25.538-71.615-25.538-29.616-97.538-55.616-66.154-23.077-84.539-39.615-18.385-16.539-18.385-47.154 0-30.615 23.885-51t63.5-20.385q30.462 0 50.769 13.962 20.308 13.962 32.923 35.423l34.77-13.692q-14.077-28.846-41.27-48.308-27.192-19.462-58.577-21.692v-46.923h-39.23v46.923q-52.308 8.692-79.154 39-26.846 30.307-26.846 66.692 0 43.154 27.115 69.077Q409.615-497 474-473.692q64.538 23.769 86.731 42.923 22.192 19.154 22.192 52.769 0 42.231-30.808 60.808-30.807 18.577-66.115 18.577-34.538 0-62.346-20.116-27.808-20.115-44.423-57.269L344-360.769q17.077 41.077 45.808 64.038 28.73 22.962 69.577 32.423v48.923ZM480-120q-74.539 0-140.231-28.423t-114.308-77.038q-48.615-48.616-77.038-114.308Q120-405.461 120-480t28.423-140.231q28.423-65.692 77.038-114.308 48.616-48.615 114.308-77.038Q405.461-840 480-840t140.231 28.423q65.692 28.423 114.308 77.038 48.615 48.616 77.038 114.308Q840-554.539 840-480t-28.423 140.231q-28.423 65.692-77.038 114.308-48.616 48.615-114.308 77.038Q554.539-120 480-120Z" />
                  </svg>
                  Total Budget
                </div>
                <p className="text-[25px] font-[Inter] text-main font-semibold -tracking-[.75px] mt-2 mb-0">{`$${totalBudget}`}</p>
              </div>
              <div className="bg-white rounded-[10px] px-[20px] pt-[12px] pb-[7px] min-w-[240px]">
                <div className="flex items-center font-[Inter] text-xs font-medium -tracking-[.48px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 -960 960 960"
                    width="20"
                    className="me-2"
                  >
                    <path d="M264.615-120Q237-120 218.5-138.5 200-157 200-184.615v-590.77Q200-803 218.5-821.5 237-840 264.615-840H580l180 180v475.385Q760-157 741.5-138.5 723-120 695.385-120h-430.77Zm209.231-110h40v-40h60q8.5 0 14.25-5.75t5.75-14.25v-120q0-8.5-5.75-14.25t-14.25-5.75h-140v-80h160v-40h-80v-40h-40v40h-60q-8.5 0-14.25 5.75t-5.75 14.25v120q0 8.5 5.75 14.25t14.25 5.75h140v80h-160v40h80v40Zm89.308-430h140l-140-140v140Z" />
                  </svg>
                  Total Billed
                </div>
                <p className="text-[25px] font-[Inter] text-main font-semibold -tracking-[.75px] mt-2 mb-0">{`$${totalBilled}`}</p>
              </div>
              <div className="bg-white rounded-[10px] px-[20px] pt-[12px] pb-[7px] min-w-[240px]">
                <div className="flex items-center font-[Inter] text-xs font-medium -tracking-[.48px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 -960 960 960"
                    width="20"
                    className="me-2"
                  >
                    <path d="M264.615-120Q237-120 218.5-138.5 200-157 200-184.615v-590.77Q200-803 218.5-821.5 237-840 264.615-840H580l180 180v475.385Q760-157 741.5-138.5 723-120 695.385-120h-430.77Zm209.231-110h40v-40h60q8.5 0 14.25-5.75t5.75-14.25v-120q0-8.5-5.75-14.25t-14.25-5.75h-140v-80h160v-40h-80v-40h-40v40h-60q-8.5 0-14.25 5.75t-5.75 14.25v120q0 8.5 5.75 14.25t14.25 5.75h140v80h-160v40h80v40Zm89.308-430h140l-140-140v140Z" />
                  </svg>
                  Unbilled Revenue
                </div>
                <p className="text-[25px] font-[Inter] text-error font-semibold -tracking-[.75px] mt-2 mb-0">{`$${
                  totalBudget - totalBilled
                }`}</p>
              </div>
            </div>
          </div>
          <div className="my-4 flex items-center justify-between">
            <div className="group inline-flex min-w-[170px] relative me-4">
              <button
                className={`inline-flex items-center justify-center text-primary text-[14px] px-4 py-[10px] font-[Inter] rounded-[10px] sm:w-[170px] me-4 ${
                  currentTab === "campaign"
                    ? "bg-white border border-solid border-main shadow-md font-semibold"
                    : "font-normal"
                }`}
                onClick={() => setCurrentTab("campaign")}
              >
                Campaigns
              </button>
              <button
                className={`inline-flex font-[Inter] text-[14px]  items-center gap-4 justify-between text-primary flex px-4 py-[10px] rounded-[10px] ${
                  currentTab === "user"
                    ? "bg-white border border-solid border-main shadow-md font-semibold"
                    : "font-normal"
                }`}
                onClick={() => setCurrentTab("user")}
              >
                Client Details
              </button>
            </div>
          </div>
          {currentTab === "user" && (
            <div>
              <div className="mt-4 rounded-[10px] bg-white px-[23px] py-[28px] ">
                <div className="grid grid-cols-5 gap-16 border-b-[1px] border-[#bcbcbc] pb-5">
                  <div className="col-span-3">
                    <p className="font-[Inter] text-lg -tracking-[.6px] font-medium mb-4">
                      Company Users
                    </p>
                  </div>
                  <div className="col-span-2">
                    {adminRole === "super_admin" && (
                      <div>
                        <p className="text-lg font-[Inter] font-medium -tracking-[.6px]">
                          Assign Account Manager(s)
                        </p>
                        {accountManager.map((am, index) => (
                          <div
                            key={index}
                            className="rounded-[10px] bg-[#fbfbfb] border-[1px] border-[#7f8183]/[.13] my-2 px-4 py-2 flex items-center justify-between"
                          >
                            <p className="text-secondry1 font-[Inter] -tracking-[.5px] font-medium text-xs">
                              {am?.name}
                            </p>
                            <button
                              className="text-xs font-[Inter] text-white px-3 py-1 rounded-[10px] bg-[#e3392e] flex items-center justify-center"
                              onClick={() => handleRemove(am.id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="13"
                                height="14"
                                viewBox="0 0 13 14"
                                fill="none"
                              >
                                <path
                                  d="M11.5358 2.82128C11.7001 2.82147 11.8581 2.889 11.9776 3.01006C12.0971 3.13112 12.169 3.29658 12.1787 3.47262C12.1883 3.64867 12.1349 3.82202 12.0295 3.95725C11.924 4.09248 11.7744 4.17939 11.6112 4.20022L11.5358 4.20506H11.4835L10.891 11.8159C10.8911 12.3453 10.7026 12.8548 10.3641 13.24C10.0257 13.6252 9.56284 13.857 9.07034 13.8881L8.95687 13.8915H3.79908C2.76881 13.8915 1.9268 13.0274 1.87006 11.9888L1.86684 11.8733L1.27176 4.20506H1.22018C1.05585 4.20487 0.897799 4.13734 0.778308 4.01628C0.658818 3.89522 0.586911 3.72977 0.577281 3.55372C0.567651 3.37767 0.621023 3.20432 0.726494 3.06909C0.831964 2.93386 0.981572 2.84695 1.14475 2.82612L1.22018 2.82128H11.5358ZM5.41798 6.3776C5.2829 6.29131 5.12309 6.26095 4.96861 6.29224C4.81414 6.32354 4.67564 6.41432 4.57916 6.54752C4.48268 6.68072 4.43488 6.84716 4.44474 7.01553C4.4546 7.1839 4.52145 7.34261 4.63271 7.4618L5.46569 8.35641L4.63271 9.25103L4.57919 9.31607C4.479 9.45513 4.43188 9.62991 4.44741 9.80491C4.46295 9.9799 4.53997 10.142 4.66283 10.2583C4.78569 10.3745 4.94518 10.4362 5.10891 10.4309C5.27264 10.4255 5.42832 10.3535 5.54435 10.2294L6.37797 9.33544L7.2116 10.2294L7.27221 10.2868C7.40179 10.3943 7.56465 10.4449 7.72772 10.4282C7.89079 10.4115 8.04182 10.3289 8.15016 10.197C8.25849 10.0652 8.316 9.89403 8.311 9.71832C8.306 9.54262 8.23887 9.37554 8.12324 9.25103L7.29026 8.35641L8.12324 7.4618L8.17675 7.39676C8.27695 7.2577 8.32407 7.08292 8.30853 6.90792C8.293 6.73292 8.21598 6.57084 8.09312 6.45457C7.97026 6.33831 7.81077 6.2766 7.64704 6.28196C7.48331 6.28733 7.32762 6.35937 7.2116 6.48346L6.37797 7.37739L5.54435 6.48346L5.48374 6.42604L5.41798 6.3776Z"
                                  fill="white"
                                />
                                <path
                                  d="M7.66688 0.0537109C8.00886 0.0537109 8.33684 0.199502 8.57865 0.459012C8.82047 0.718522 8.95632 1.07049 8.95632 1.43749C8.95614 1.61384 8.89322 1.78346 8.78041 1.9117C8.66761 2.03993 8.51343 2.11709 8.34938 2.12743C8.18534 2.13776 8.02381 2.08049 7.8978 1.9673C7.77178 1.85411 7.6908 1.69356 7.67139 1.51845L7.66688 1.43749H5.08798L5.08347 1.51845C5.06406 1.69356 4.98307 1.85411 4.85706 1.9673C4.73105 2.08049 4.56952 2.13776 4.40547 2.12743C4.24143 2.11709 4.08725 2.03993 3.97444 1.9117C3.86164 1.78346 3.79871 1.61384 3.79853 1.43749C3.79843 1.08838 3.92129 0.75213 4.14249 0.496143C4.36369 0.240155 4.66688 0.0833539 4.99127 0.0571705L5.08798 0.0537109H7.66688Z"
                                  fill="white"
                                />
                              </svg>
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          className="mt-4 px-6 py-2 rounded-[10px] text-white font-[Inter] text-xs font-semibold bg-secondry3 disabled:bg-[#a3a3a3]"
                          disabled={userData.accountManager}
                          onClick={() => setShowAssignModal(true)}
                        >
                          + Assign
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="py-4">
                  <p className="font-[Inter] text-lg -tracking-[.6px] font-medium mb-4 mt-4">
                    Company Files
                  </p>
                  <div className="py-4">
                    <Table className="file-table" dataSource={fileData}>
                      <Column
                        title="Name"
                        key="name"
                        className="!text-xs !text-secondry1"
                        render={(_: any, record: any) => (
                          <>
                            <span className="!text-xs !font-normal !text-secondry2">
                              {record.name}
                            </span>
                          </>
                        )}
                      />
                      <Column
                        title="Campaign Name"
                        key="campaign name"
                        className="!text-xs !text-secondry1"
                        render={(_: any, record: any) => (
                          <>
                            <span className="!text-xs !font-normal !text-secondry2">
                              {record.campaignName}
                            </span>
                          </>
                        )}
                      />
                      <Column
                        title="Date Added"
                        key="date"
                        className="!text-xs !text-secondry1"
                        render={(_: any, record: any) => (
                          <>
                            <span className="!text-xs !font-normal !text-secondry2">
                              {record.date}
                            </span>
                          </>
                        )}
                      />
                      <Column
                        title={" "}
                        key="action"
                        render={(_: any, record: any) => (
                          <>
                            <button
                              className="text-xs font-bold -tracking-[.45px] text-secondry2"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDownload(record.fullUrl, record.name);
                              }}
                            >
                              VIEW
                            </button>
                            {/* <button className='text-xs font-bold -tracking-[.45px] text-[#7f8182] ms-2'>DELETE</button> */}
                          </>
                        )}
                      />
                    </Table>
                  </div>
                </div>
              </div>
              <AssignAccountManager
                assignedAdmins={accountManager}
                show={showAssignModal}
                company={userData.company}
                userId={userData.id}
                afterAdd={(data: any) => setAccountManager(data)}
                onClose={(show: boolean) => setShowAssignModal(show)}
              />
            </div>
          )}
          {currentTab === "campaign" && (
            <div className="rounded-[10px] bg-white px-[16px] py-[16px] ">
              <div className="flex justify-between items-center w-full gap-5">
                <div className="flex gap-5">
                  <div className="flex w-[342px] border-[2px] rounded-[10px] border-main items-center px-4 py-2 bg-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="20"
                      className="me-4"
                      viewBox="0 0 21 20"
                      fill="none"
                    >
                      <path
                        d="M12.0016 1.07199C12.9542 1.62201 13.7832 2.36255 14.4368 3.24735C15.0903 4.13216 15.5544 5.14222 15.8 6.21444C16.0456 7.28666 16.0675 8.39801 15.8643 9.47908C15.6611 10.5601 15.2372 11.5877 14.619 12.4976L19.5637 17.4412C19.839 17.7125 19.9989 18.0795 20.0102 18.4659C20.0216 18.8522 19.8833 19.228 19.6244 19.5149C19.3655 19.8018 19.0058 19.9777 18.6203 20.006C18.2349 20.0342 17.8534 19.9126 17.5554 19.6665L17.4414 19.5635L12.4977 14.6188C11.3149 15.4222 9.93848 15.894 8.51156 15.9851C7.08464 16.0761 5.65938 15.7832 4.38408 15.1366C3.10878 14.4901 2.03003 13.5136 1.26007 12.3088C0.490105 11.104 0.0570647 9.71489 0.00600086 8.28598L0 8.00094L0.0050008 7.7159C0.0542013 6.33646 0.459431 4.99321 1.18131 3.8167C1.90318 2.64019 2.91715 1.67044 4.12465 1.00171C5.33216 0.332977 6.69213 -0.0119965 8.07239 0.00031853C9.45265 0.0126336 10.8063 0.381819 12.0016 1.07199Z"
                        fill="#7F8182"
                      />
                      <circle cx="8.00586" cy="8.00488" r="6" fill="#F5F5F5" />
                    </svg>
                    <input
                      className="me-2 font-[Inter] flex-1 border-0 text-sm text-primary focus:ring-0 p-0 focus:border-secondry2"
                      placeholder="Search by Campaign Name"
                      value={searchKey}
                      onChange={(e) => setSearchKey(e.target.value)}
                    />
                  </div>
                  <div
                    ref={ref}
                    className="group inline-flex flex-col min-w-[100px] relative"
                  >
                    <button
                      onMouseEnter={handleOpenChange}
                      className={`font-[Inter] text-[14px] font-normal items-center justify-center text-primary justify-between flex px-4 py-2 gap-4 rounded-[10px] bg-white ring-2 ring-main shadow-md focus:ring-main`}
                    >
                      {sort}
                      <svg
                        width="18"
                        height="12"
                        viewBox="0 0 18 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <line
                          y1="1.75"
                          x2="18"
                          y2="1.75"
                          stroke="#505050"
                          strokeWidth="2.5"
                        />
                        <line
                          x1="2"
                          y1="5"
                          x2="16"
                          y2="5"
                          stroke="#505050"
                          strokeWidth="2"
                        />
                        <line
                          x1="7"
                          y1="11.5"
                          x2="11"
                          y2="11.5"
                          stroke="#505050"
                        />
                        <line
                          x1="4"
                          y1="8.25"
                          x2="14"
                          y2="8.25"
                          stroke="#505050"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </button>
                    {open && (
                      <Menu
                        selectedKeys={[sort]}
                        onClick={onClick}
                        items={items}
                        className="w-[300px] absolute top-[calc(100%+5px)] !shadow-md rounded-[10px] text-left z-[9] !focus:ring-main"
                      />
                    )}
                  </div>
                </div>
                <div className="flex">
                  <div
                    ref={ref}
                    className="group inline-flex flex-col min-w-[100px] relative"
                  >
                    <button
                      onMouseEnter={handleOpenChangeTime}
                      className={`font-[Inter] text-[14px] font-semibold items-center justify-center text-primary justify-between flex px-4 py-[10px] gap-4 rounded-[10px] bg-white ring-1 ring-main shadow-md`}
                    >
                      {selectedDateFilter}
                      <CaretDownOutlined />
                    </button>
                    {openTime && (
                      <Menu
                        selectedKeys={[selectedDateFilter]}
                        onClick={onClickTime}
                        items={timeItems}
                        className="w-[300px] absolute top-[calc(100%+5px)] !shadow-md rounded-[10px] text-left z-[9]"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-8">
                {filteredData.map((item) => (
                  <div className="col-span-1" key={item.id}>
                    <div className="rounded-[10px] bg-[#f5f5f5] w-full px-[20px] py-[16px]">
                      <p className="font-[Inter] text-[16px] font-semibold -tracking-[.39px]">
                        {" "}
                        {item.name}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-center">
                          <p className="text-xs font-semibold -tracking-[.48px] font-[Inter] text-[#a3a3a3]">
                            Date Created
                          </p>
                          <p className="mt-2 text-[14px] font-[Inter] font-medium -tracking-[.39px]">
                            {item.state !== "draft"
                              ? `${moment(Number(item.create_time)).format(
                                  "MM/DD/yyyy"
                                )}`
                              : "NA"}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-semibold -tracking-[.48px] font-[Inter] text-[#a3a3a3]">
                            Budget Cap
                          </p>
                          <p className="mt-2 text-[14px] font-[Inter] font-medium text-secondry1">{`$${Number(
                            item.price
                          )}`}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-semibold -tracking-[.48px] font-[Inter] text-[#a3a3a3]">
                            Status
                          </p>
                          {item.complete_date ? (
                            <button
                              className={`ms-2 inline-flex items-center justify-center text-primary px-4 py-[2px] font-[Inter] rounded-[10px] sm:w-[170px] me-2 bg-white border border-solid border-main shadow-md`}
                            >
                              <span className="text-[12px] font-normal">
                                Completed:{" "}
                              </span>
                              <span className="text-[12px] font-light">
                                {moment(Number(item.complete_date)).format(
                                  "MM/DD/YYYY"
                                )}
                              </span>
                            </button>
                          ) : (
                            <p className="font-medium font-[Inter] inline-flex">
                              <span
                                className={`rounded-[10px] text-xs px-[12px] mt-2 py-[4px] font-normal ${
                                  item.state === "draft"
                                    ? "bg-[#dbdbdb] text-primary"
                                    : item.state === "paused"
                                    ? "bg-[#fdbdbd]"
                                    : "bg-main text-primary"
                                }`}
                              >
                                {capitalize(item.state)}
                              </span>
                            </p>
                          )}
                        </div>
                        {/* <div className="">
                          <p className="text-xs font-semibold -tracking-[.48px] font-[Inter] text-[#a3a3a3]">
                            Date Submitted
                          </p>
                          <p className="mt-2 text-[14px] font-[Inter] font-medium text-secondry1">
                            {item.start_date
                              ? `${moment(Number(item.start_date)).format(
                                  "MM/DD/yyyy"
                                )}`
                              : "NA"}
                          </p>
                        </div> */}
                      </div>
                      <Link
                        to={`/admin/client/${id}/campaign/${item.id}`}
                        className="block flex items-center justify-center w-full bg-[#7ffbae] py-[10px] mt-4 rounded-[10px] font-semibold text-[15px] font-[Inter]"
                      >
                        View Campaign
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminClient;
