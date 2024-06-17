import { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, Collapse, Menu, MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { GetItem, MenuItem } from "../../shared/GetItem";
import CreatorAPIInstance from "../../../api/creatorAPIInstance";
import { capitalize } from "lodash";
import { getPlaceHolder } from "../../../utils/commonUtils";
import Loading from "../../../components/Loading";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../store/authSlice";
import { ConversionGoal } from "../../../constants/constant";

const CompletedCampaigns = () => {
  const { creatorData } = useSelector(selectAuth);
  const { id } = creatorData;
  const [campaign, setCampaigns] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchStr, setSearchStr] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [sort, setSort] = useState<string>("Newest to Oldest");
  const ref = useRef<any>(null);

  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    const { data } = await CreatorAPIInstance.get("getCompletedCampaigns", {
      params: { creatorId: id },
    });
    setCampaigns(data);
    setLoading(false);
  }, [id]);

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
    const files = !!item.additional_files
      ? item.additional_files.split(",")
      : [];
    return [
      {
        key: "1",
        label: (
          <div className="flex flex-col w-full pl-[24px] pr-[72px] py-[20px] gap-3">
            <div className="flex items-center w-full gap-3">
              <p className="font-normal font-[Inter]">
                <span
                  className={`bg-white ring-2 ring-main rounded-[10px] text-xs px-[12px] mt-[25px] py-[4px] font-normal`}
                >
                  Completed :{" "}
                  {new Date(Number(item.complete_date)).toLocaleDateString()}
                </span>
              </p>
              <p className="font-semibold font-[Inter] text-sm -tracking-[.42px] text-left">
                {item?.name}
              </p>
            </div>
            <div className="flex w-full justify-between">
              <div className="grid grid-cols-6 gap-3">
                <div className="min-h-[43px] border-[1px] border-main rounded-[10px] p-2">
                  <p className="text-[#172935] text-[12px] font-[Inter] font-medium -tracking-[.36px]">
                    Start Date
                  </p>
                  <p className="text-primary text-base font-[Inter] font-semibold -tracking-[.36px]">
                    {new Date(Number(item.start_date)).toLocaleDateString()}
                  </p>
                </div>
                <div className="min-h-[43px] border-[1px] border-main rounded-[10px] p-2">
                  <p className="text-[#172935] text-[12px] font-[Inter] font-medium -tracking-[.36px]">
                    Verified Clicks
                  </p>
                  <p className="text-primary text-base font-[Inter] font-semibold -tracking-[.36px]">
                    {item?.verified_clicks ?? 0}
                  </p>
                </div>
                <div className="min-h-[43px] border-[1px] border-main rounded-[10px] p-2">
                  <p className="text-[#172935] text-[12px] font-[Inter] font-medium -tracking-[.36px]">
                    CPC Bid
                  </p>
                  <p className="text-primary text-base font-[Inter] font-semibold -tracking-[.36px]">
                    ${item?.cpc}
                  </p>
                </div>
                <div className="min-h-[43px] border-[1px] border-main rounded-[10px] p-2">
                  <p className="text-[#172935] text-[12px] font-[Inter] font-medium -tracking-[.36px]">
                    Payout Cap
                  </p>
                  <p className="text-primary text-base font-[Inter] font-semibold -tracking-[.36px]">
                    ${Number(item?.average_unique_click) * Number(item?.cpc)}
                  </p>
                </div>
                <div className="min-h-[43px] border-[1px] border-main rounded-[10px] p-2">
                  <p className="text-[#172935] text-[12px] font-[Inter] font-medium -tracking-[.36px]">
                    Amount Earned
                  </p>
                  <p className="text-primary text-base font-[Inter] font-semibold -tracking-[.36px]">
                    ${Number(item?.verified_clicks) * Number(item?.cpc)}
                  </p>
                </div>
                <div className="min-h-[43px] border-[1px] border-main rounded-[10px] p-2">
                  <p className="text-[#172935] text-[12px] font-[Inter] font-medium -tracking-[.36px]">
                    Amount Paid
                  </p>
                  <p className="text-primary text-base font-[Inter] font-semibold -tracking-[.36px]">
                    ${0}
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-2 pr-8">
                <Avatar
                  src={item?.team_avatar}
                  className={`${item?.team_avatar ? "" : "bg-[#7f8182]"}`}
                  size={66}
                >
                  {!item?.team_avatar && getPlaceHolder(item.company)}
                </Avatar>
                <div className="text-left ms-2 flex flex-col justify-center">
                  <p className="font-medium font-[Inter] text-sm min-w-[150px] -tracking-[.42px] w-full text-left">
                    {item?.company}
                  </p>
                  <p className="font-light font-[Inter] text-[10px] min-w-[150px] -tracking-[.42px] w-full text-left">
                    {item?.url}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ),
        children: (
          <div className="bg-white py-6">
            <div className="grid grid-cols-[1fr_400px] gap-7">
              <div className="w-full flex flex-col items-start justify-center">
                <p className="text-primary font-[Inter] text-sm font-semibold font-normal">
                  Headline
                </p>
                <h2 className="font-[Inter] text-primary font-normal text-sm -tracking-[.42px]">
                  {item.headline}
                </h2>
                <p className="text-primary font-[Inter] mt-[14px] text-sm font-semibold mt-[14px]">
                  Body
                </p>
                <p
                  className="text-primary font-[Inter] font-normal text-sm whitespace-pre-wrap"
                  style={{ wordBreak: "break-word" }}
                >
                  {item.body}
                </p>
                <p className="text-primary font-[Inter] mt-[14px] text-sm font-semibold mt-[14px]">
                  Tracking Link
                </p>
                <p className="text-[#6C63FF] font-[Inter] font-medium text-sm max-w-[700px] break-words">
                  {`https://track.presspool.ai/${item?.uid}`}
                </p>
                <p className="text-primary font-[Inter] mt-[14px] text-sm font-semibold mt-[14px]">
                  CTA Text
                </p>
                <p className="text-primary font-[Inter] font-normal text-sm whitespace-pre-wrap">
                  {item.cta}
                </p>
                <p className="text-primary font-[Inter] mt-[14px] text-sm font-semibold mt-[14px]">
                  Conversion Goal
                </p>
                <p className="text-primary font-[Inter] font-normal text-sm whitespace-pre-wrap">
                  {item?.conversion
                    ? ConversionGoal[item?.conversion as never]
                    : "N/A"}
                </p>
                <div className="flex items-end justify-between w-full">
                  <div className="w-auto">
                    <p className="text-primary font-[Inter] mt-[14px] text-sm font-semibold mt-[14px]">
                      Target Audience
                    </p>
                    <p className="text-primary font-[Inter] font-medium text-base -tracking-[.47px] flex gap-1">
                      <button className="bg-black px-2 py-1 rounded text-white font-medium font-[Inter] text-xs 2xl:text-xs">
                        {capitalize(item.demographic)}
                      </button>
                    </p>
                  </div>
                </div>
                <div className="flex items-end justify-between w-full">
                  <div className="w-auto">
                    <p className="text-primary font-[Inter] mt-[14px] text-sm font-semibold mt-[14px]">
                      Target Industrie(s)
                    </p>
                    <p className="text-primary font-[Inter] font-medium text-base -tracking-[.47px] flex gap-1 flex-wrap">
                      {(item.audience || []).map(
                        (aud: string, index: number) => (
                          <button
                            key={index}
                            className="bg-black px-2 py-1 rounded text-white font-medium font-[Inter] text-xs 2xl:text-xs"
                          >
                            {aud}
                          </button>
                        )
                      )}
                    </p>
                  </div>
                </div>
                {item.position && (
                  <div className="flex items-end justify-between w-full">
                    <div className="w-auto">
                      <p className="text-primary font-[Inter] mt-[14px] text-sm font-semibold mt-[14px]">
                        Target Demographic(s)
                      </p>
                      <p className="text-primary font-[Inter] font-medium text-base -tracking-[.47px] flex gap-1 flex-wrap">
                        {(item.position || []).map(
                          (pos: string, index: number) => (
                            <button
                              key={index}
                              className="bg-black px-2 py-1 rounded text-white font-semibold font-[Inter] text-xs 2xl:text-xs"
                            >
                              {pos}
                            </button>
                          )
                        )}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-end justify-between w-full">
                  <div className="w-auto">
                    <p className="text-primary font-[Inter] mt-[14px] text-sm font-semibold mt-[14px]">
                      Target Region(s)
                    </p>
                    <p className="text-primary font-[Inter] font-medium text-base -tracking-[.47px] flex gap-1 flex-wrap">
                      {(item.region || []).map((reg: string, index: number) => (
                        <button
                          key={index}
                          className="bg-black px-2 py-1 rounded text-white font-semibold font-[Inter] text-xs 2xl:text-xs"
                        >
                          {reg}
                        </button>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col items-start justify-center">
                <div className="flex flex-col h-full w-full justify-between">
                  <div>
                    <div className="font-[Inter] leading-3.5 text-sm font-semibold mb-0 flex items-center pb-1 gap-2">
                      Logo Image{" "}
                    </div>
                    <img
                      className="w-full min-h-[200px] max-h-[200px] object-cover rounded-[10px]"
                      alt="market"
                      src={item.image}
                    />
                    {files.length > 0 ? (
                      <>
                        <div className="font-[Inter] leading-3.5 text-sm font-semibold mb-0 flex items-center pt-2 pb-1 gap-2">
                          Cover Image(s){" "}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {files.map((url: string) => (
                            <img
                              className="w-full w-full min-h-[88px] max-h-[88px] object-cover rounded-[10px]"
                              alt="market"
                              src={url}
                            />
                          ))}
                        </div>
                      </>
                    ) : null}
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
        <div className="top-35vh relative">{loading && <Loading />}</div>
        <div className="flex items-center w-full gap-5">
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
          {(searchStr
            ? campaign.filter((x) =>
                x.name.toLowerCase().includes(searchStr.toLowerCase())
              )
            : campaign
          ).map((item) => (
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
