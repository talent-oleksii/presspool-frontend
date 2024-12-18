import { FC, useState, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Collapse, Menu, MenuProps } from "antd";
import { Link } from "react-router-dom";
import { capitalize } from "lodash";
import { selectAuth } from "../../store/authSlice";
import { selectData, setCampaign, setClicked } from "../../store/dataSlice";
import APIInstance from "../../api";
import Loading from "../../components/Loading";
import DialogUtils from "../../utils/DialogUtils";

import { MAIN_ROUTE_FADE_UP_ANIMATION_VARIANTS } from "../../utils/TransitionConstants";
import { DownOutlined } from "@ant-design/icons";
import { GetItem, MenuItem } from "../../containers/shared/GetItem";
import { getVerifiedClick } from "../../utils/commonUtils";

const Campaign: FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchStr, setSearchStr] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const { company, email } = useSelector(selectAuth);
  const { campaign: fullCampaign, clicked } = useSelector(selectData);
  const [campaign, setCampaigns] = useState<Array<any>>([]);
  const [sort, setSort] = useState<string>("Newest to Oldest");
  const ref = useRef<any>(null);

  const dispatch = useDispatch();

  const loadCampaigns = useCallback(async () => {
    if (email) {
      const {
        data: { data, clicked },
      } = await APIInstance.get("data/campaign", {
        params: { email: email },
      });
      dispatch(setCampaign({ campaign: data }));
      dispatch(setClicked(clicked));
    }
  }, [dispatch, email]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  useEffect(() => {
    const campaignData = fullCampaign.filter((item) => {
      return item.name.indexOf(searchStr) > -1;
    });
    setCampaigns(campaignData);
  }, [searchStr, fullCampaign]);

  const handleDeleteCampaign = async (campaignId: string) => {
    setLoading(true);
    await APIInstance.delete("data/campaign", {
      params: { id: campaignId },
    });
    loadCampaigns();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleDeleteConfirm = (id: string) => {
    DialogUtils.ask(
      "Are you sure you want to delete this Campaign?",
      "Please ensure you actually want to remove it.",
      "Yes, Delete",
      "No",
      () => handleDeleteCampaign(id)
    );
  };

  const panelStyle: React.CSSProperties = {
    marginBottom: 20,
    background: "#ffffff",
    borderRadius: 14,
    overflow: "hidden",
    boxShadow:
      "0 0 #0000, 0 0 #0000, 0 0 #0000, 0 0 #0000, 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  };

  const verifiedClicks = (campaignId: number) => {
    return clicked
      .filter((x) => x.campaign_id === campaignId)
      .reduce((prev, item) => prev + getVerifiedClick(item), 0);
  };

  const getAvgCPC = (price: number, id: number) => {
    return price === 0 || verifiedClicks(id) === 0
      ? 0
      : price / verifiedClicks(id) > 11
        ? 11
        : Number(price / verifiedClicks(id));
  };

  const handleOpenChange = () => {
    setOpen(true);
  };

  const hide = () => {
    setOpen(false);
  };

  const items: MenuItem[] = [
    GetItem("Newest to Oldest", "Newest to Oldest"),
    GetItem("Oldest to Newest", "Oldest to Newest"),
  ];

  const getItems = (item: any, panelStyle: any) => {
    const totalVerifiedClick = verifiedClicks(item.id);
    const avgCPC = getAvgCPC(item.price, item.id);
    // const totalSpend = (totalVerifiedClick * avgCPC).toFixed(2);
    const totalSpend = Number(item.billed);
    return [
      {
        key: "1",
        label: (
          <div className="flex pl-[24px] pr-[72px] py-[20px] justify-evenly items-center text-left w-full relative">
            <div className="flex flex-col items-center w-full border-r border-black border-solid border-0.5 gap-2 pr-8">
              <p className="font-semibold font-[Inter] text-sm min-w-[150px] -tracking-[.42px] w-full text-center">
                {item.name}
              </p>
              <p className="font-medium font-[Inter]">
                <span
                  className={`rounded-[10px] text-xs px-[12px] mt-[25px] py-[4px] font-normal ${item.state === "draft"
                    ? "bg-[#dbdbdb] text-primary"
                    : item.state === "paused"
                      ? "bg-[#fdbdbd]"
                      : Number(totalSpend) >= Number(item.price) && item.complete_date
                        ? "bg-white ring-2 ring-main"
                        : "bg-main text-primary"
                    }`}
                >
                  {capitalize(
                    Number(totalSpend) >= Number(item.price) && item.complete_date
                      ? "Completed"
                      : item.state
                  )}
                </span>
              </p>
              <p className="font-normal font-[Inter] text-[8px] -tracking-[.42px] w-full text-center">
                {Number(totalSpend) >= Number(item.price) && item.complete_date
                  ? new Date(Number(item.complete_date)).toLocaleDateString()
                  : ""}
              </p>
            </div>
            <div className="flex flex-col items-center w-full">
              <p className="font-semibold font-[Inter] text-xs mb-[17px] text-secondry1 -tracking-[.3px]">
                Start Date
              </p>
              <p className="font-normal text-primary font-[Inter] text-xs">
                {new Date(Number(item.create_time)).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col items-center w-full">
              <p className="font-semibold font-[Inter] text-xs mb-[17px] -tracking-[.3px] text-secondry1">
                Total Clicks
              </p>
              <p className="font-normal text-primary font-[Inter] text-xs">
                {item.click_count}
              </p>
            </div>
            {/* <div className="flex flex-col items-center w-full">
              <p className="font-semibold font-[Inter] text-xs mb-[17px] -tracking-[.3px] text-secondry1">
                Unique Clicks
              </p>
              <p className="font-normal text-primary font-[Inter] text-xs">
                {item.unique_clicks}
              </p>
            </div> */}
            <div className="flex flex-col items-center w-full">
              <p className="font-semibold font-[Inter] text-xs mb-[17px] -tracking-[.3px] text-secondry1">
                Verified Clicks
              </p>
              <p className="font-normal text-primary font-[Inter] text-xs">
                {item.unique_clicks}
              </p>
            </div>
            <div className="flex flex-col items-center w-full">
              <p className="font-semibold font-[Inter] text-xs mb-[17px] -tracking-[.3px] text-secondry1">
                AVG CPC
              </p>
              <p className="font-normal text-primary font-[Inter] text-xs">{`$${avgCPC.toFixed(
                2
              )}`}</p>
            </div>
            <div className="flex flex-col items-center w-full">
              <p className="font-semibold font-[Inter] text-xs mb-[17px] -tracking-[.3px] text-secondry1">
                Total Spend
              </p>
              <p className="font-normal text-primary font-[Inter] text-xs">{`$${totalSpend}`}</p>
            </div>
            <div className="flex flex-col items-center w-full">
              <p className="font-semibold font-[Inter] text-xs mb-[17px] -tracking-[.3px] text-secondry1">
                Budget Allocated
              </p>
              <p className="font-normal font-[Inter] text-xs text-[#FF4D42]">{`$${Number(
                item.price
              )}`}</p>
            </div>
          </div>
        ),
        children: (
          <div className="bg-white py-3">
            <div className="grid grid-cols-[1fr_400px] gap-7">
              <div className="w-full flex flex-col items-start justify-center">
                <p className="text-primary font-[Inter] text-sm font-semibold font-normal">
                  Headline
                </p>
                <h2 className="font-[Inter] text-primary font-normal text-xs -tracking-[.42px]">
                  {item.headline}
                </h2>
                <p className="text-primary font-[Inter] mt-[14px] text-sm font-semibold mt-[14px]">
                  Description
                </p>
                <p className="text-primary font-[Inter] font-normal text-xs whitespace-pre-wrap">
                  {item.body}
                </p>
                <p className="text-primary font-[Inter] mt-[14px] text-sm font-semibold mt-[14px]">
                  Landing Page Link
                </p>
                <p className="text-[#6C63FF] font-[Inter] font-medium text-xs">
                  {item.page_url}
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
                  <img
                    className="w-full min-h-[200px] max-h-[200px] object-cover rounded-[10px]"
                    alt="market"
                    src={item.image}
                  />
                  <div className="mt-[16px] flex items-center justify-end">
                    {item.state === "active" && (
                      <Link
                        to={`/raise-budget/${item.id}`}
                        className="bg-black px-4 py-2 rounded text-white font-semibold font-[Inter] text-xs 2xl:text-xs"
                      >
                        Raise Budget
                      </Link>
                    )}
                    {item.state !== "active" && (
                      <>
                        <button
                          className="font-[Inter] text-primary text-[red] px-4 py-2 me-2 text-xs 2xl:text-xs"
                          onClick={() => handleDeleteConfirm(item.id)}
                        >
                          Delete
                        </button>
                        <Link
                          to={`/edit/${item.id}`}
                          className="bg-black px-4 py-2 rounded text-white font-semibold font-[Inter] text-xs 2xl:text-xs"
                        >
                          Edit Campaign
                        </Link>
                      </>
                    )}
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

  const onClick: MenuProps["onClick"] = (e) => {
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

  return (
    <div className="text-left relative pt-1.5">
      {loading && <Loading />}
      <h1 className="font-semibold font-[Inter] text-xl -tracking-[.6px]">{`${company}'s Campaigns 📈`}</h1>
      <p className="text-sm text-secondry1">Here's your account at a glance.</p>

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

      <motion.div
        className="mt-4 rounded-[10px] h-full"
        initial="hidden"
        animate="show"
        variants={MAIN_ROUTE_FADE_UP_ANIMATION_VARIANTS()}
      >
        {campaign.length <= 0 && (
          <p className="text-sm">
            Please create your first campaign to be able to see, manage and
            track your campaigns here.
          </p>
        )}
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
      </motion.div>

      {/* <EditCampaign
        show={showEdit}
        setShow={(show: boolean) => setShowEdit(show)}
        data={currentData}
      /> */}
    </div>
  );
};

export default Campaign;
