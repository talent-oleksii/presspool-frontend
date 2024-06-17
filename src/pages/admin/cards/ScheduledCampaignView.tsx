import { capitalize } from "lodash";
import { ConversionGoal } from "../../../constants/constant";
import { getPlaceHolder } from "../../../utils/commonUtils";
import { Avatar } from "antd";

const ScheduledCampaignView = (item: any, panelStyle: any) => {
  const files = !!item.additional_files ? item.additional_files.split(",") : [];
  return [
    {
      key: "1",
      label: (
        <div className="flex flex-col w-full pl-[24px] pr-[72px] py-[20px] gap-3">
          <div className="flex items-center w-full gap-3">
            <p className="font-normal font-[Inter]">
              <span
                className={`bg-[#FFD076] rounded-[10px] text-xs px-[12px] mt-[25px] py-[4px] font-normal`}
              >
                Scheduled :{" "}
                {new Date(
                  Number(item.scheduled_date * 1000)
                ).toLocaleDateString()}
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
                  NA
                </p>
              </div>
              <div className="min-h-[43px] border-[1px] border-main rounded-[10px] p-2">
                <p className="text-[#172935] text-[12px] font-[Inter] font-medium -tracking-[.36px]">
                  Total Clicks
                </p>
                <p className="text-primary text-base font-[Inter] font-semibold -tracking-[.36px]">
                  NA
                </p>
              </div>
              <div className="min-h-[43px] border-[1px] border-main rounded-[10px] p-2">
                <p className="text-[#172935] text-[12px] font-[Inter] font-medium -tracking-[.36px]">
                  Verified Clicks
                </p>
                <p className="text-primary text-base font-[Inter] font-semibold -tracking-[.36px]">
                  NA
                </p>
              </div>
              <div className="min-h-[43px] border-[1px] border-main rounded-[10px] p-2">
                <p className="text-[#172935] text-[12px] font-[Inter] font-medium -tracking-[.36px]">
                  AVG CPC
                </p>
                <p className="text-primary text-base font-[Inter] font-semibold -tracking-[.36px]">
                  NA
                </p>
              </div>
              <div className="min-h-[43px] border-[1px] border-main rounded-[10px] p-2">
                <p className="text-[#172935] text-[12px] font-[Inter] font-medium -tracking-[.36px]">
                  Total Spend
                </p>
                <p className="text-primary text-base font-[Inter] font-semibold -tracking-[.36px]">
                  NA
                </p>
              </div>
              <div className="min-h-[43px] border-[1px] border-main rounded-[10px] p-2">
                <p className="text-[#172935] text-[12px] font-[Inter] font-medium -tracking-[.36px]">
                  Budget Remaining
                </p>
                <p className="text-error text-base font-[Inter] font-semibold -tracking-[.36px]">
                  $
                  {Math.max(
                    0,
                    Number(item?.average_unique_click) * Number(item?.cpc) -
                    Number(item?.verified_clicks) * Number(item?.cpc)
                  )}
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-2">
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
              <p className="text-primary font-[Inter] text-sm font-semibold font-normal flex gap-2">
                Headline{" "}
              </p>
              <h2 className="font-[Inter] text-primary font-normal text-sm -tracking-[.42px]">
                {item.headline}
              </h2>
              <p className="text-primary font-[Inter] mt-[14px] text-sm font-semibold mt-[14px] flex gap-2">
                Body{" "}
              </p>
              <p
                className="text-primary font-[Inter] font-normal text-sm whitespace-pre-wrap"
                style={{ wordBreak: "break-word" }}
              >
                {item.body}
              </p>
              <p className="text-primary font-[Inter] mt-[14px] text-sm font-semibold mt-[14px] flex gap-2">
                Tracking Link (MUST USE THIS EXACT LINK FOR ACCURATE TRACKING){" "}
              </p>
              <p className="text-[#6C63FF] font-[Inter] font-medium text-sm max-w-[700px] break-words">
                {`https://track.presspool.ai/${item?.uid}`}
              </p>
              <p className="text-primary font-[Inter] mt-[14px] text-sm font-semibold mt-[14px] flex gap-2">
                CTA Text{" "}
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
                    {(item.audience || []).map((aud: string, index: number) => (
                      <button
                        key={index}
                        className="bg-black px-2 py-1 rounded text-white font-medium font-[Inter] text-xs 2xl:text-xs"
                      >
                        {aud}
                      </button>
                    ))}
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
                <div className="mt-[16px] flex items-center justify-end">
                  <button className="font-[Inter] w-3/2 text-[white] bg-black font-semibold rounded-[6px] px-[20px] py-2 me-2 text-xs 2xl:text-xs">
                    Re-assign
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

export default ScheduledCampaignView;
