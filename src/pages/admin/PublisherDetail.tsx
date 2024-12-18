import { Avatar, Collapse, Menu, MenuProps } from "antd";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { GetItem, MenuItem } from "../../containers/shared/GetItem";
import Loading from "../../components/Loading";
import { getPlaceHolder } from "../../utils/commonUtils";
import moment from "moment";
import { capitalize } from "lodash";
import AdminAPIInstance from "../../api/adminApi";
import { useParams } from "react-router";
import { DownOutlined } from "@ant-design/icons";
import ActiveCampaignView from "./cards/ActiveCampaignView";
import ScheduledCampaignView from "./cards/ScheduledCampaignView";
import CompletedCampaignView from "./cards/CompletedCampaignView";
import NewRequestCampaignView from "./cards/NewRequestCampaignView";

const panelStyle: React.CSSProperties = {
  marginBottom: 20,
  background: "#ffffff",
  borderRadius: 14,
  overflow: "hidden",
  boxShadow:
    "0 0 #0000, 0 0 #0000, 0 0 #0000, 0 0 #0000, 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
};

const PublisherDetail: FC = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [sort, setSort] = useState<string>("All Campaigns");
  const [searchStr, setSearchStr] = useState("");
  const [publicationDetail, setPublicationDetail] = useState<any>({});
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const ref = useRef<any>(null);
  const handleOpenChange = () => {
    setOpen(true);
  };

  const hide = () => {
    setOpen(false);
  };

  const items: MenuItem[] = [
    GetItem("All Campaigns", "All Campaigns"),
    GetItem("New Requests", "New Requests"),
    GetItem("Active", "Active"),
    GetItem("Scheduled", "Scheduled"),
    GetItem("Completed", "Completed"),
  ];

  const onClick: MenuProps["onClick"] = (e) => {
    setSearchStr("");
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

  const loadPublicationDetail = useCallback(async () => {
    if (id) {
      try {
        setDetailLoading(true);
        const { data } = await AdminAPIInstance.get(
          "/getPublicationDetailById",
          {
            params: { publicationId: id },
          }
        );
        setPublicationDetail(data);
      } finally {
        setDetailLoading(false);
      }
    }
  }, [id]);

  const loadCampaigns = useCallback(async () => {
    try {
      let status = "";
      if (sort === "New Requests") {
        status = "new";
      } else if (sort !== "All Campaigns") {
        status = sort;
      }
      setLoading(true);
      const { data } = await AdminAPIInstance.get(
        "/getCampaignsByPublicationId",
        {
          params: { state: status, publicationId: id },
        }
      );
      setCampaigns(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id, sort]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  useEffect(() => {
    loadPublicationDetail();
  }, [loadPublicationDetail]);

  const getItems = (item: any, panelStyle: any, detail: any) => {
    switch (item?.campaign_status?.toLowerCase()) {
      case "new":
        return NewRequestCampaignView(item, panelStyle);
      case "active":
        return ActiveCampaignView(item, panelStyle, detail);
      case "scheduled":
        return ScheduledCampaignView(item, panelStyle);
      case "completed":
        return CompletedCampaignView(item, panelStyle, detail);
      default:
        <></>;
        break;
    }
  };

  return (
    <div className="w-full flex">
      {(loading || detailLoading) && <Loading />}
      <div className="text-left flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-[Inter] font-semibold -tracking-[.6px] text-[20px]">
              Publishers
            </h2>
            <p className="mt-1 text-secondry1 font-[Inter] text-xs">
              Review and track Publishers
            </p>
          </div>
        </div>
        {!detailLoading ? (
          <>
            <div className="mt-4">
              <div className="flex items-start grid grid-cols-5 gap-2">
                <div className="flex items-center">
                  <Avatar
                    src={publicationDetail?.team_avatar}
                    className={`border border-solid border-secondry3 min-w-[87px] ${publicationDetail?.team_avatar ? "" : "bg-[#7f8182]"
                      }`}
                    size={87}
                  >
                    {getPlaceHolder(publicationDetail?.newsletter)}
                  </Avatar>
                  <div className="ms-2">
                    <p className="text-primary text-[15px] font-[Inter] -tracking-[.36px]">
                      {publicationDetail?.newsletter}
                    </p>
                    <p className="text-secondry1 text-[10px] font-light font-[Inter] -tracking-[.36px]">
                      {publicationDetail?.website_url}
                    </p>
                    <p className="text-secondry1 text-[10px] font-light font-[Inter] -tracking-[.36px]">
                      {publicationDetail?.email}
                    </p>
                    <p className="text-secondry1 text-[10px] font-light font-[Inter] -tracking-[.36px]">
                      Applied:{" "}
                      {moment(Number(publicationDetail?.create_time)).format(
                        "MM/DD/yyyy"
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 col-span-2">
                  <div className="flex flex-col gap-3">
                    <div className="w-auto">
                      <p className="text-primary font-[Inter] text-[12px] font-light">
                        Target Audience
                      </p>
                      <p className="text-primary font-[Inter] font-medium -tracking-[.47px] flex gap-1">
                        <button className="bg-black px-2 py-1 rounded text-white font-medium font-[Inter] text-[8px]">
                          {capitalize(publicationDetail?.audience)}
                        </button>
                      </p>
                    </div>
                    <div className="w-auto">
                      <p className="text-primary font-[Inter] text-[12px] font-light">
                        Target Industrie(s)
                      </p>
                      <p className="text-primary font-[Inter] font-medium -tracking-[.47px] flex gap-1 flex-wrap">
                        {(publicationDetail.industry || []).map(
                          (aud: string, index: number) => (
                            <button
                              key={index}
                              className="bg-black px-2 py-1 rounded text-white font-medium font-[Inter] text-[8px]"
                            >
                              {aud}
                            </button>
                          )
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    {publicationDetail?.position && (
                      <div className="flex items-end justify-between w-full">
                        <div className="w-auto">
                          <p className="text-primary font-[Inter] text-[12px] font-light">
                            Target Demographic(s)
                          </p>
                          <p className="text-primary font-[Inter] font-medium -tracking-[.47px] flex gap-1 flex-wrap">
                            {(publicationDetail?.position || []).map(
                              (pos: string, index: number) => (
                                <button
                                  key={index}
                                  className="bg-black px-2 py-1 rounded text-white font-semibold font-[Inter] text-[8px]"
                                >
                                  {pos}
                                </button>
                              )
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="w-auto">
                      <p className="text-primary font-[Inter] text-[12px] font-light">
                        Target Region(s)
                      </p>
                      <p className="text-primary font-[Inter] font-medium -tracking-[.47px] flex gap-1 flex-wrap">
                        {(publicationDetail?.geography || []).map(
                          (reg: string, index: number) => (
                            <button
                              key={index}
                              className="bg-black px-2 py-1 rounded text-white font-semibold font-[Inter] text-[8px]"
                            >
                              {reg}
                            </button>
                          )
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-auto">
                    <p className="text-primary font-[Inter] text-[12px] font-light">
                      Subscriber Count Verification
                    </p>
                    <div className="font-[Inter] text-primary font-medium text-[10px] -tracking-[.42px] mb-2">
                      <img
                        src={publicationDetail?.proof_image}
                        alt="proof logo"
                        className="h-[59px] w-[86px] object-cover rounded-[10px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center grid grid-cols-8 gap-2 mt-4">
                <div className="col-span-1 rounded-[10px] pt-2 px-2 pb-2 bg-white">
                  <p className="text-[#7F8182] -tracking-[.42px] font-medium text-sm flex items-center">
                    Subscribers
                  </p>
                  <p className="text-black text-[25px] mt-2 -tracking-[.75px] font-semibold ms-2">
                    {publicationDetail?.total_subscribers ?? 0}
                  </p>
                </div>
                <div className="col-span-1 rounded-[10px] pt-2 px-2 pb-2 bg-white">
                  <p className="text-[#7F8182] -tracking-[.42px] font-medium text-sm flex items-center">
                    CPC
                  </p>
                  <p className="text-black text-[25px] mt-2 -tracking-[.75px] font-semibold ms-2">
                    ${publicationDetail?.cpc ?? 0}
                  </p>
                </div>
                <div className="col-span-1 rounded-[10px] pt-2 px-2 pb-2 bg-white">
                  <p className="text-[#7F8182] -tracking-[.42px] font-medium text-sm flex items-center">
                    Avg Click Count
                  </p>
                  <p className="text-black text-[25px] mt-2 -tracking-[.75px] font-semibold ms-2">
                    {publicationDetail?.average_unique_click ?? 0}
                  </p>
                </div>
                <div className="col-span-1 rounded-[10px] pt-2 px-2 pb-2 bg-white">
                  <p className="text-[#7F8182] -tracking-[.42px] font-medium text-sm flex items-center">
                    NA
                  </p>
                  <p className="text-black text-[25px] mt-2 -tracking-[.75px] font-semibold ms-2">
                    ${0}
                  </p>
                </div>
                <div className="col-span-1 rounded-[10px] pt-2 px-2 pb-2 bg-white">
                  <p className="text-[#7F8182] -tracking-[.42px] font-medium text-sm flex items-center">
                    NA
                  </p>
                  <p className="text-black text-[25px] mt-2 -tracking-[.75px] font-semibold ms-2">
                    ${0}
                  </p>
                </div>
                <div className="col-span-1 rounded-[10px] pt-2 px-2 pb-2 bg-white">
                  <p className="text-[#7F8182] -tracking-[.42px] font-medium text-sm flex items-center">
                    NA
                  </p>
                  <p className="text-black text-[25px] mt-2 -tracking-[.75px] font-semibold">{`$${0}`}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center w-full gap-5 mt-[24px]">
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
                  placeholder="Type here to search by Publisher name"
                  value={searchStr}
                  onChange={(e) => setSearchStr(e.target.value)}
                />
              </div>
            </div>
          </>
        ) : null}
        <div className="mt-4 rounded-[10px]">
          {(searchStr
            ? campaigns.filter((x) =>
              x.name.toLowerCase().includes(searchStr.toLowerCase())
            )
            : campaigns
          ).map((item) => (
            <Collapse
              key={item.id}
              collapsible="header"
              expandIconPosition="end"
              expandIcon={({ isActive }) => (
                <DownOutlined rotate={isActive ? -180 : 0} />
              )}
              items={getItems(item, panelStyle, publicationDetail)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublisherDetail;
