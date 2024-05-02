import { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, Collapse, Menu, MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { GetItem, MenuItem } from "../../shared/GetItem";
import CreatorAPIInstance from "../../../api/creatorAPIInstance";
import { capitalize } from "lodash";
import { getPlaceHolder } from "../../../utils/commonUtils";
import Loading from "../../../components/Loading";

const CompletedCampaigns = () => {
  const [campaign, setCampaigns] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchStr, setSearchStr] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [sort, setSort] = useState<string>("Newest to Oldest");
  const ref = useRef<any>(null);

  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    const { data } = await CreatorAPIInstance.get("getCompletedCampaigns", {
      params: { creatorId: 5 },
    });
    setCampaigns(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const handleOpenChange = () => {
    setOpen(true);
  };

  const onClick: MenuProps["onClick"] = (e) => {
    setSort(e.key);
    hide();
  };

  const hide = () => {
    setOpen(false);
  };

  const panelStyle: React.CSSProperties = {
    marginBottom: 20,
    background: "#ffffff",
    borderRadius: 14,
    overflow: "hidden",
    boxShadow:
      "0 0 #0000, 0 0 #0000, 0 0 #0000, 0 0 #0000, 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  };

  const items: MenuItem[] = [
    GetItem("Newest to Oldest", "Newest to Oldest"),
    GetItem("Oldest to Newest", "Oldest to Newest"),
  ];

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

  const getItems = (item: any, panelStyle: any) => {
    return [
      {
        key: "1",
        label: (
          <div className="flex pl-[24px] pr-[72px] py-[20px] justify-evenly items-center text-left w-full relative">
            <div className="flex flex-row items-center w-full gap-2 pr-8">
              <Avatar
                src={item?.team_avatar}
                className={`${item?.team_avatar ? "" : "bg-[#7f8182]"}`}
                size={42}
              >
                {!item?.team_avatar && getPlaceHolder(item.company)}
              </Avatar>
              <p className="font-semibold font-[Inter] text-sm min-w-[150px] -tracking-[.42px] w-full text-left">
                {item?.name}
              </p>
            </div>
            <div className="flex flex-col items-center w-full">
              <p className="font-semibold font-[Inter] text-xs mb-[17px] text-secondry1 -tracking-[.3px]">
                Publish Date
              </p>
              <p className="font-normal text-primary font-[Inter] text-xs">
                {new Date(Number(item.start_date)).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col items-center w-full">
              <p className="font-semibold font-[Inter] text-xs mb-[17px] -tracking-[.3px] text-secondry1">
                verified Clicks
              </p>
              <p className="font-normal text-primary font-[Inter] text-xs">
                {item?.verified_clicks}
              </p>
            </div>
            <div className="flex flex-col items-center w-full">
              <p className="font-semibold font-[Inter] text-xs mb-[17px] -tracking-[.3px] text-secondry1">
                CPC
              </p>
              <p className="font-normal text-primary font-[Inter] text-xs">
                {item?.cpc}
              </p>
            </div>
            <div className="flex flex-col items-center w-full">
              <p className="font-semibold font-[Inter] text-xs mb-[17px] -tracking-[.3px] text-secondry1">
                Campaign Budget
              </p>
              <p className="font-normal text-primary font-[Inter] text-xs">
                {Number(item?.average_unique_click) * Number(item?.cpc)}
              </p>
            </div>
            <div className="flex flex-col items-center w-full">
              <p className="font-semibold font-[Inter] text-xs mb-[17px] -tracking-[.3px] text-secondry1">
                Campaign Revenue
              </p>
              <p className="font-normal text-primary font-[Inter] text-xs">
                ${Number(item?.verified_clicks) * Number(item?.cpc)}
              </p>
            </div>
            <div className="flex flex-col items-center w-full">
              <p className="font-semibold font-[Inter] text-xs mb-[17px] -tracking-[.3px] text-secondry1">
                Amount Paid
              </p>
              <p className="font-normal text-primary font-[Inter] text-xs">
                ${0}
              </p>
            </div>
            <div className="flex flex-col items-center w-full">
              <p className="font-semibold font-[Inter] text-xs mb-[17px] -tracking-[.3px] text-secondry1">
                Status
              </p>
              <p className="font-normal font-[Inter]">
                <span
                  className={`rounded-[10px] text-xs px-[12px] mt-[25px] py-[4px] font-normal bg-[#FFA29C] text-primary`}
                >
                  Completed
                </span>
              </p>
            </div>
          </div>
        ),
        children: (
          <div className="bg-white py-3">
            <div className="grid grid-cols-[1fr_700px] gap-7">
              <div className="w-full flex flex-col items-start justify-start">
                <img
                  className="min-w-[350px] w-3/2 min-h-[200px] max-h-[200px] object-cover rounded-[10px]"
                  alt="market"
                  src={item.image}
                />
              </div>
              <div className="w-full flex flex-col items-start justify-center">
                <div className="flex flex-col h-full w-full ">
                  <p className="text-primary font-[Inter] text-sm font-normal font-normal mb-2">
                    Headline
                  </p>
                  <h2 className="font-[Inter] text-primary font-semibold text-lg -tracking-[.42px]">
                    {item.headline}
                  </h2>
                  <p className="text-primary font-[Inter] mt-[14px] text-sm font-normal mb-2">
                    Description
                  </p>
                  <p className="text-primary font-[Inter] font-medium text-sm whitespace-pre-wrap">
                    {item.body}
                  </p>
                  <p className="text-primary font-[Inter] mt-[14px] text-sm font-normal mb-2">
                    Landing Page Link
                  </p>
                  <p className="text-[#6C63FF] font-[Inter] font-medium text-xs">
                    {item.page_url}
                  </p>
                  <p className="text-primary font-[Inter] mt-[14px] text-sm font-normal mb-2">
                    Audience Tags
                  </p>
                  <div className="flex justify-between">
                    <h2 className="font-[Inter] text-primary font-normal text-sm -tracking-[.42px] mt-[5px]">
                      {capitalize(item.demographic)}
                    </h2>
                    <button className="font-[Inter] w-3/2 text-[white] bg-black rounded-[6px] px-[20px] py-2 me-2 text-xs 2xl:text-xs">
                      Give Feedback
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ),
        style: panelStyle,
        showArrow: true,
      },
    ];
  };
  return (
    <div className="mt-3 h-full">
      <div className="text-left relative pt-1.5">
        {loading && <Loading />}
        <div className="flex items-center w-full mt-[24px] gap-5">
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
              placeholder="Type here to search by campaign name"
              value={searchStr}
              onChange={(e) => setSearchStr(e.target.value)}
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
                <line x1="7" y1="11.5" x2="11" y2="11.5" stroke="#505050" />
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
        <div className="mt-4 rounded-[10px] h-full">
          {campaign.map((item) => (
            <Collapse
              key={item.id}
              collapsible="header"
              expandIconPosition="end"
              expandIcon={({ isActive }) => (
                <DownOutlined rotate={isActive ? -180 : 0} />
              )}
              items={getItems(item, panelStyle)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompletedCampaigns;
