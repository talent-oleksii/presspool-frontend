import { FC, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Avatar, Collapse } from "antd";
import Loading from "../../components/Loading";
import AdminAPIInstance from "../../api/adminApi";
import { motion } from "framer-motion";
import { MAIN_ROUTE_FADE_UP_ANIMATION_VARIANTS } from "../../utils/TransitionConstants";
import { capitalize } from "lodash";
import SampleLogo from "../../assets/logo/logo_with_name.png";
import ALogoImage from "../../assets/icon/alogo.png";

const AdminClientCampaign: FC = () => {
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState<any>({});
  const [clicked, setClicked] = useState<Array<any>>([]);
  const { campaignId } = useParams();

  const navigator = useNavigate();

  const loadCampaign = useCallback(async () => {
    setLoading(true);
    const {
      data: { data, clicked },
    } = await AdminAPIInstance.get("/client-campaign", {
      params: { campaignId },
    });
    console.log(data);
    setCampaign(data);
    setClicked(clicked);
    setLoading(false);
  }, [campaignId]);

  useEffect(() => {
    loadCampaign();
  }, [loadCampaign]);

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

  const verifiedClicks = (campaignId: number) => {
    return clicked
      .filter((x) => x.campaign_id === campaignId)
      .reduce(
        (prev, item) =>
          prev +
          Number(
            (item?.user_medium === "newsletter" ||
              item?.user_medium === "referral") &&
              item?.duration > item?.count * 1.5 &&
              item?.duration > 0
              ? item?.unique_click
              : 0
          ),
        0
      );
  };

  const getAvgCPC = (price: number, id: number) => {
    return price === 0 || verifiedClicks(id) === 0
      ? 0
      : price / verifiedClicks(id) > 10
      ? 10
      : Number(price / verifiedClicks(id));
  };

  const panelStyle: React.CSSProperties = {
    marginBottom: 20,
    background: "#ffffff",
    borderRadius: 14,
    overflow: "hidden",
    boxShadow:
      "0 0 #0000, 0 0 #0000, 0 0 #0000, 0 0 #0000, 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  };

  const getItems = (item: any, panelStyle: any) => {
    const totalVerifiedClick = verifiedClicks(item.id);
    const avgCPC = getAvgCPC(item.price, item.id);
    const totalSpend = (totalVerifiedClick * avgCPC).toFixed(2);
    return [
      {
        key: "1",
        label: (
          <div className="flex pl-[24px] pr-[72px] py-[20px] justify-evenly items-center text-left w-full relative">
            <div className="flex flex-col items-center w-full border-r border-black border-solid border-0.5 gap-2 pr-8">
              <p className="font-semibold font-[Inter] text-sm min-w-[150px] -tracking-[.42px] w-full text-center">
                {item.campaign_name}
              </p>
              <p className="font-medium font-[Inter]">
                <span
                  className={`rounded-[10px] text-xs px-[12px] mt-[25px] py-[4px] font-normal ${
                    item.state === "draft"
                      ? "bg-[#dbdbdb] text-primary"
                      : item.state === "paused"
                      ? "bg-[#fdbdbd]"
                      : Number(totalSpend) >= Number(item.price)
                      ? "bg-white ring-2 ring-main"
                      : "bg-main text-primary"
                  }`}
                >
                  {capitalize(
                    Number(totalSpend) >= Number(item.price)
                      ? "Completed"
                      : item.state
                  )}
                </span>
              </p>
              <p className="font-normal font-[Inter] text-[8px] -tracking-[.42px] w-full text-center">
                {Number(totalSpend) >= Number(item.price)
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
            <div className="flex flex-col items-center w-full">
              <p className="font-semibold font-[Inter] text-xs mb-[17px] -tracking-[.3px] text-secondry1">
                Unique Clicks
              </p>
              <p className="font-normal text-primary font-[Inter] text-xs">
                {item.unique_clicks}
              </p>
            </div>
            <div className="flex flex-col items-center w-full">
              <p className="font-semibold font-[Inter] text-xs mb-[17px] -tracking-[.3px] text-secondry1">
                Verified Clicks
              </p>
              <p className="font-normal text-primary font-[Inter] text-xs">
                {totalVerifiedClick}
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
                Budget Remaining
              </p>
              <p className="font-normal font-[Inter] text-xs text-[#FF4D42]">{`$${
                Number(item.price) - Number(totalSpend)
              }`}</p>
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
                <p className="text-primary font-[Inter] font-normal text-xs">
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
    <div>
      {loading ? (
        <Loading />
      ) : (
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
            <span>{campaign?.client_name}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 -960 960 960"
              width="20"
              className="mx-1"
            >
              <path d="M683.154-460H200v-40h483.154L451.461-731.692 480-760l280 280-280 280-28.539-28.308L683.154-460Z" />
            </svg>
            <span>Campaigns</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 -960 960 960"
              width="20"
              className="mx-1"
            >
              <path d="M683.154-460H200v-40h483.154L451.461-731.692 480-760l280 280-280 280-28.539-28.308L683.154-460Z" />
            </svg>
            <span>{campaign?.campaign_name}</span>
          </h2>
          <div className="mt-4 flex justify-between items-center border-b-[1px] border-[#bcbcbc] py-4">
            <div className="flex items-center">
              <Avatar size={77} src={campaign?.avatar} className="bg-[#7f8182]">
                {!campaign?.avatar && getPlaceHolder(campaign?.client_name)}
              </Avatar>
              <div className="ms-2 py-[20px]">
                <p className="font-[Inter] text-lg text-secondry1 -tracking-[.54px]">
                  {campaign?.company}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-white rounded-[10px] px-[20px] pt-[12px] min-w-[160px]">
                <div className="flex items-center font-[Inter] text-xs font-medium -tracking-[.48px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
                    viewBox="0 0 21 21"
                    fill="none"
                    className="me-2"
                  >
                    <path
                      d="M1 10H4"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 1V4"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.80156 5.79961L3.60156 3.59961"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14.1992 5.79961L16.3992 3.59961"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.80156 14.1992L3.60156 16.3992"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 8L21 12.3333L15.2222 15.2222L12.3333 21L8 8Z"
                      fill="black"
                    />
                  </svg>
                  Total Clicks
                </div>
                <p className="text-[25px] font-[Inter] text-[#7ffbae] font-semibold -tracking-[.75px] mt-2 mb-0">
                  {campaign?.click_count}
                </p>
              </div>
              <div className="bg-white rounded-[10px] px-[20px] pt-[12px] pb-[7px] min-w-[160px]">
                <div className="flex items-center font-[Inter] text-xs font-medium -tracking-[.48px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="20"
                    viewBox="0 0 17 20"
                    fill="none"
                    className="me-2"
                  >
                    <path
                      d="M12.5556 4.55469C13.2588 4.55469 13.9462 4.76322 14.5309 5.15391C15.1156 5.5446 15.5713 6.0999 15.8405 6.74959C16.1096 7.39928 16.18 8.11419 16.0428 8.8039C15.9056 9.49361 15.567 10.1271 15.0697 10.6244C14.5725 11.1217 13.9389 11.4603 13.2492 11.5975C12.5595 11.7347 11.8446 11.6643 11.1949 11.3951C10.5452 11.126 9.98991 10.6703 9.59922 10.0856C9.20853 9.50089 9 8.81346 9 8.11024L9.00356 7.95593C9.04332 7.04055 9.43492 6.17586 10.0967 5.54218C10.7585 4.90849 11.6393 4.55474 12.5556 4.55469Z"
                      fill="black"
                    />
                    <path
                      d="M13.5084 13.4453C14.4345 13.4453 15.3227 13.7965 15.9776 14.4216C16.6325 15.0467 17.0004 15.8946 17.0004 16.7786V17.4453C17.0004 17.7989 16.8533 18.1381 16.5913 18.3881C16.3294 18.6382 15.9741 18.7786 15.6036 18.7786H8.61948C8.24902 18.7786 7.89373 18.6382 7.63178 18.3881C7.36982 18.1381 7.22266 17.7989 7.22266 17.4453V16.7786C7.22266 15.8946 7.59057 15.0467 8.24546 14.4216C8.90035 13.7965 9.78857 13.4453 10.7147 13.4453H13.5084Z"
                      fill="black"
                    />
                    <path
                      d="M7.22179 1C8.10082 1 8.9601 1.26066 9.69099 1.74902C10.4219 2.23739 10.9915 2.93151 11.3279 3.74363C11.6643 4.55575 11.7523 5.44937 11.5808 6.31151C11.4093 7.17365 10.9861 7.96557 10.3645 8.58714C9.74292 9.20871 8.95099 9.632 8.08886 9.80349C7.22672 9.97498 6.33309 9.88697 5.52097 9.55058C4.70886 9.21419 4.01473 8.64453 3.52637 7.91365C3.03801 7.18276 2.77734 6.32347 2.77734 5.44444L2.78179 5.25156C2.83149 4.10733 3.32099 3.02647 4.14821 2.23436C4.97542 1.44226 6.07649 1.00007 7.22179 1Z"
                      fill="black"
                      stroke="white"
                      strokeWidth="0.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 11.666C10.1787 11.666 11.3092 12.1343 12.1427 12.9678C12.9762 13.8013 13.4444 14.9317 13.4444 16.1105V16.9993C13.4444 17.4708 13.2571 17.923 12.9237 18.2564C12.5903 18.5898 12.1382 18.7771 11.6667 18.7771H2.77778C2.30628 18.7771 1.8541 18.5898 1.5207 18.2564C1.1873 17.923 1 17.4708 1 16.9993V16.1105C1 14.9317 1.46825 13.8013 2.30175 12.9678C3.13524 12.1343 4.2657 11.666 5.44444 11.666H9Z"
                      fill="black"
                      stroke="white"
                      strokeWidth="0.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Total Unique Clicks
                </div>
                <p className="text-[25px] font-[Inter] text-[#7ffbae] font-semibold -tracking-[.75px] mt-2 mb-0">
                  {campaign?.unique_clicks}
                </p>
              </div>
              <div className="bg-white rounded-[10px] px-[20px] pt-[12px] pb-[7px] min-w-[160px]">
                <div className="flex items-center font-[Inter] text-xs font-medium -tracking-[.48px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="20"
                    viewBox="0 0 17 20"
                    fill="none"
                    className="me-2"
                  >
                    <path
                      d="M12.5556 4.55469C13.2588 4.55469 13.9462 4.76322 14.5309 5.15391C15.1156 5.5446 15.5713 6.0999 15.8405 6.74959C16.1096 7.39928 16.18 8.11419 16.0428 8.8039C15.9056 9.49361 15.567 10.1271 15.0697 10.6244C14.5725 11.1217 13.9389 11.4603 13.2492 11.5975C12.5595 11.7347 11.8446 11.6643 11.1949 11.3951C10.5452 11.126 9.98991 10.6703 9.59922 10.0856C9.20853 9.50089 9 8.81346 9 8.11024L9.00356 7.95593C9.04332 7.04055 9.43492 6.17586 10.0967 5.54218C10.7585 4.90849 11.6393 4.55474 12.5556 4.55469Z"
                      fill="black"
                    />
                    <path
                      d="M13.5084 13.4453C14.4345 13.4453 15.3227 13.7965 15.9776 14.4216C16.6325 15.0467 17.0004 15.8946 17.0004 16.7786V17.4453C17.0004 17.7989 16.8533 18.1381 16.5913 18.3881C16.3294 18.6382 15.9741 18.7786 15.6036 18.7786H8.61948C8.24902 18.7786 7.89373 18.6382 7.63178 18.3881C7.36982 18.1381 7.22266 17.7989 7.22266 17.4453V16.7786C7.22266 15.8946 7.59057 15.0467 8.24546 14.4216C8.90035 13.7965 9.78857 13.4453 10.7147 13.4453H13.5084Z"
                      fill="black"
                    />
                    <path
                      d="M7.22179 1C8.10082 1 8.9601 1.26066 9.69099 1.74902C10.4219 2.23739 10.9915 2.93151 11.3279 3.74363C11.6643 4.55575 11.7523 5.44937 11.5808 6.31151C11.4093 7.17365 10.9861 7.96557 10.3645 8.58714C9.74292 9.20871 8.95099 9.632 8.08886 9.80349C7.22672 9.97498 6.33309 9.88697 5.52097 9.55058C4.70886 9.21419 4.01473 8.64453 3.52637 7.91365C3.03801 7.18276 2.77734 6.32347 2.77734 5.44444L2.78179 5.25156C2.83149 4.10733 3.32099 3.02647 4.14821 2.23436C4.97542 1.44226 6.07649 1.00007 7.22179 1Z"
                      fill="black"
                      stroke="white"
                      strokeWidth="0.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 11.666C10.1787 11.666 11.3092 12.1343 12.1427 12.9678C12.9762 13.8013 13.4444 14.9317 13.4444 16.1105V16.9993C13.4444 17.4708 13.2571 17.923 12.9237 18.2564C12.5903 18.5898 12.1382 18.7771 11.6667 18.7771H2.77778C2.30628 18.7771 1.8541 18.5898 1.5207 18.2564C1.1873 17.923 1 17.4708 1 16.9993V16.1105C1 14.9317 1.46825 13.8013 2.30175 12.9678C3.13524 12.1343 4.2657 11.666 5.44444 11.666H9Z"
                      fill="black"
                      stroke="white"
                      strokeWidth="0.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Verified Clicks
                </div>
                <p className="text-[25px] font-[Inter] text-[#7ffbae] font-semibold -tracking-[.75px] mt-2 mb-0">
                  {campaign?.id ? verifiedClicks(campaign.id) : 0}
                </p>
              </div>
              <div className="bg-white rounded-[10px] px-[20px] pt-[12px] pb-[7px] min-w-[160px]">
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
                <p className="text-[25px] font-[Inter] text-[#7ffbae] font-semibold -tracking-[.75px] mt-2 mb-0">
                  ${campaign?.billed}
                </p>
              </div>
              <div className="bg-white rounded-[10px] px-[20px] pt-[12px] pb-[7px] min-w-[160px]">
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
                  Total Unbilled
                </div>
                <p className="text-[25px] font-[Inter] text-error font-semibold -tracking-[.75px] mt-2 mb-0">
                  $
                  {Number(campaign?.price ?? 0) - Number(campaign?.billed ?? 0)}
                </p>
              </div>
            </div>
          </div>
          <motion.div
            className="mt-4 rounded-[10px] h-full"
            initial="hidden"
            animate="show"
            variants={MAIN_ROUTE_FADE_UP_ANIMATION_VARIANTS()}
          >
            <Collapse
              activeKey={"1"}
              collapsible="header"
              expandIconPosition="end"
              expandIcon={() => <></>}
              items={getItems(campaign, panelStyle)}
            />
            <div className="flex flex-col gap-1">
              <div className="font-[Inter] text-xs 2xl:text-base font-semibold flex items-center">
                Ad Preview
              </div>
              <div className="h-full overflow-hidden relative flex flex-col items-center bg-primary rounded-[10px] px-2.5 py-6">
                {/* Content for Campaign */}
                <div className="bg-white w-full flex items-center justify-center rounded-[10px]">
                  {/* <p className='text-primary border-black border-[5px] p-3 text-3xl 2xl:text-lg font-bold'>ALOGO</p> */}
                  <img
                    alt="alogo"
                    src={ALogoImage}
                    className="h-[100px] scale-150"
                  />
                </div>
                <div className="w-full">
                  <p className="text-white my-4 text-xs font-normal pr-20">
                    <span>Happy Friday AI legends,</span>
                    <br />
                    <br />
                    <span>
                      Today we are diving deep into some of the newest AI
                      solutions that are taking place this week.
                    </span>
                    <br />
                    <br />
                    <span>
                      With GPT’s just being released, the excitement has
                      continued to grow at an unprecedented rate for AI products
                      and solutions that are reshaping how consumers and
                      executives alike do their work better, faster and easier.
                    </span>
                  </p>
                </div>

                <div className="bg-white z-10 w-full rounded-[10px] flex flex-col h-full">
                  <div
                    className={`${
                      campaign?.headline ? "py-4" : "py-2"
                    } px-4 flex`}
                  >
                    <div className="text-left w-full">
                      <h2 className="w-full text-left font-semibold font-[Inter] text-primary text-base break-words leading-4">
                        {campaign?.headline}
                      </h2>
                    </div>
                  </div>
                  <div className="pb-4 px-4 flex items-center justify-start">
                    <img
                      src={campaign?.image || SampleLogo}
                      alt="sample logo"
                      className={`h-[173px] w-full object-cover rounded-[10px]`}
                    />
                  </div>
                  <div className="pb-3 px-4 flex flex-col items-center justify-between flex-1">
                    <div className="text-left w-full">
                      <p className="w-full text-left font-[Inter] font-normal text-primary text-xs break-words">
                        {campaign?.body}
                      </p>
                    </div>
                    {campaign?.cta && (
                      <div className="mt-4 flex justify-between w-full items-center">
                        <button
                          type="button"
                          className="font-[Inter] font-normal bg-main text-primary px-4 py-2 rounded-[10px] border-[1px] text-xs font-medium"
                        >
                          {campaign?.cta}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminClientCampaign;
