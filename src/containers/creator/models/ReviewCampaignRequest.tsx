import { FC, Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Avatar } from "antd";
import moment from "moment";
import { getPlaceHolder } from "../../../utils/commonUtils";
import { capitalize } from "lodash";
import StripeUtil from "../../../utils/stripe";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../store/authSlice";
import Loading from "../../../components/Loading";
import { ConversionGoal } from "../../../constants/constant";
import CustomTooltip from "../../../components/CustomTooltip";

interface typeReviewCampaignRequest {
  show: boolean;
  onClose: Function;
  item: any;
  setShowScheduleModel: Function;
  setShowFeedbackModel: Function;
}

const ReviewCampaignRequest: FC<typeReviewCampaignRequest> = ({
  show,
  onClose,
  item,
  setShowScheduleModel,
  setShowFeedbackModel,
}: typeReviewCampaignRequest) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { creatorData } = useSelector(selectAuth);
  const { email } = creatorData;

  const handleAccept = async () => {
    setLoading(true);
    const isAccountLinked = await StripeUtil.isAccountLinked(email);
    if (!isAccountLinked) {
      const account = await StripeUtil.stripe.accounts.create({
        type: "standard",
        metadata: {
          work_email: email,
        },
      });
      const accountLink = await StripeUtil.stripe.accountLinks.create({
        account: account.id,
        refresh_url: `https://go.presspool.ai/publishers/dashboard?campaignId=${item.id}`,
        return_url: `https://go.presspool.ai/publishers/dashboard?campaignId=${item.id}`,
        type: "account_onboarding",
      });
      window.open(accountLink.url, "_self");
    } else {
      onClose();
      setShowScheduleModel(true);
      setLoading(false);
    }
  };

  const handleDeny = () => {
    onClose();
    setShowFeedbackModel(true);
  };

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {}}>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 bg-black/[.8]">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-100"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={`relative bg-white rounded-[10px] text-left flex flex-col shadow-xl border-[1px] border-black p-3 min-w-[500px] max-w-[500px]`}
              >
                {loading && <Loading />}
                <div className="flex flex-row gap-2 shrink-0 justify-between">
                  <div className="flex items-center">
                    <Avatar
                      src={item?.team_avatar}
                      className={`border border-solid border-secondry3 ${
                        item?.team_avatar ? "" : "bg-[#7f8182]"
                      }`}
                      size={66}
                    >
                      {!item?.team_avatar && getPlaceHolder(item.company)}
                    </Avatar>
                    <div className="ms-2">
                      <p className="text-primary text-[15px] font-[Inter] -tracking-[.36px]">
                        {item.name}
                      </p>
                      <p className="text-[#6C63FF] text-[10px] font-light font-[Inter] -tracking-[.36px] underline">
                        {item.url}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end	gap-[10px]">
                    <button onClick={() => onClose(false)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="34"
                        height="34"
                        viewBox="0 0 34 34"
                        fill="none"
                      >
                        <path
                          d="M13.4444 13.4444L20.5556 20.5556M20.5556 13.4444L13.4444 20.5556M17 1C29.8 1 33 4.2 33 17C33 29.8 29.8 33 17 33C4.2 33 1 29.8 1 17C1 4.2 4.2 1 17 1Z"
                          stroke="black"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <p className="font-normal text-[10px] text-secondry1">
                      Received on:{" "}
                      {moment(Number(item.create_time)).format("MM/DD/yyyy")}
                    </p>
                  </div>
                </div>
                <p className="text-center font-medium text-primary text-[14px]">
                  {item?.headline}
                </p>
                <div className="grid grid-cols-3 gap-3 my-4">
                  <div className="min-h-[43px] border-[1px] border-main rounded-[10px] p-2">
                    <p className="text-[#172935] text-[12px] font-[Inter] font-medium -tracking-[.36px]">
                      CPC Bid
                    </p>
                    <p className="text-primary text-base font-[Inter] font-semibold -tracking-[.36px]">
                      ${item.cpc}
                    </p>
                  </div>
                  <div className="min-h-[43px] border-[1px] border-main rounded-[10px] p-2">
                    <p className="text-[#172935] text-[12px] font-[Inter] font-medium -tracking-[.36px]">
                      Estimated Payout
                    </p>
                    <p className="text-primary text-base font-[Inter] font-semibold -tracking-[.36px]">
                      ${Number(item?.average_unique_click) * Number(item?.cpc)}
                    </p>
                  </div>
                  <div className="min-h-[43px] border-[1px] border-main rounded-[10px] p-2">
                    <p className="text-[#172935] text-[12px] font-[Inter] font-medium -tracking-[.36px]">
                      Accept By
                    </p>
                    <p className="text-primary text-base font-[Inter] font-semibold -tracking-[.36px]">
                      {moment(Number(item.create_time))
                        .add(10, "days")
                        .format("MM/DD/yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col h-full w-full ">
                  <p className="text-primary font-[Inter] text-[12px] font-semibold">
                    Headline
                  </p>
                  <h2 className="font-[Inter] text-primary font-light text-[12px] -tracking-[.42px] mb-2">
                    {item?.headline}
                  </h2>
                  <p className="text-primary font-[Inter] text-[12px] font-semibold">
                    Body
                  </p>
                  <h2 className="font-[Inter] text-primary font-light text-[12px] -tracking-[.42px] mb-2">
                    {item?.body}
                  </h2>
                  <p className="text-primary font-[Inter] text-[12px] font-semibold">
                    CTA Text
                  </p>
                  <h2 className="font-[Inter] text-primary font-light text-[12px] -tracking-[.42px] mb-2">
                    {item?.cta}
                  </h2>
                  <p className="text-primary font-[Inter] text-[12px] font-semibold flex items-center">
                    Landing Page Preview
                    <CustomTooltip title="Full tracking link will be provided after acceptance" />
                  </p>
                  <h2 className="font-[Inter] text-[#6C63FF] font-light text-[12px] -tracking-[.42px] mb-2">
                    {item?.page_url}
                  </h2>
                  <p className="text-primary font-[Inter] text-[12px] font-semibold">
                    Conversion Goal
                  </p>
                  <h2 className="font-[Inter] text-primary font-light text-[12px] -tracking-[.42px] mb-2">
                    {item?.conversion
                      ? ConversionGoal[item?.conversion as never]
                      : ""}
                  </h2>
                  <div className="flex items-end justify-between w-full mb-2">
                    <div className="w-auto">
                      <p className="text-primary font-[Inter] text-[12px] font-semibold">
                        Target Audience
                      </p>
                      <p className="text-primary font-[Inter] font-medium -tracking-[.47px] flex gap-1">
                        <button className="bg-black px-2 py-1 rounded text-white font-medium text-[12px] font-[Inter]">
                          {capitalize(item.demographic)}
                        </button>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-end justify-between w-full mb-2">
                    <div className="w-auto">
                      <p className="text-primary font-[Inter] text-[12px] font-semibold">
                        Target Industrie(s)
                      </p>
                      <p className="text-primary font-[Inter] font-medium -tracking-[.47px] flex gap-1 flex-wrap">
                        {(item.audience || []).map(
                          (aud: string, index: number) => (
                            <button
                              key={index}
                              className="bg-black px-2 py-1 rounded text-white font-medium text-[12px] font-[Inter]"
                            >
                              {aud}
                            </button>
                          )
                        )}
                      </p>
                    </div>
                  </div>
                  {item.position && (
                    <div className="flex items-end justify-between w-full mb-2">
                      <div className="w-auto">
                        <p className="text-primary font-[Inter] text-[12px] font-semibold">
                          Target Demographic(s)
                        </p>
                        <p className="text-primary font-[Inter] font-medium -tracking-[.47px] flex gap-1 flex-wrap">
                          {(item.position || []).map(
                            (pos: string, index: number) => (
                              <button
                                key={index}
                                className="bg-black px-2 py-1 rounded text-white font-medium text-[12px] font-[Inter]"
                              >
                                {pos}
                              </button>
                            )
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-end justify-between w-full mb-2">
                    <div className="w-auto">
                      <p className="text-primary font-[Inter] text-[12px] font-semibold">
                        Target Region(s)
                      </p>
                      <p className="text-primary font-[Inter] font-medium -tracking-[.47px] flex gap-1 flex-wrap">
                        {(item.region || []).map(
                          (reg: string, index: number) => (
                            <button
                              key={index}
                              className="bg-black px-2 py-1 rounded text-white font-medium text-[12px] font-[Inter]"
                            >
                              {reg}
                            </button>
                          )
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="text-primary font-[Inter] text-[12px] font-semibold">
                    Hero Image
                  </p>
                  <div className="font-[Inter] text-primary font-light text-[12px] -tracking-[.42px] mb-2">
                    <img
                      src={item?.image}
                      alt="sample logo"
                      className="h-[59px] w-[82px] object-cover rounded-[10px]"
                    />
                  </div>
                  {item?.additional_files ? (
                    <>
                      <p className="text-primary font-[Inter] text-[12px] font-semibold">
                        Additional Assets
                      </p>
                      <div className="font-[Inter] text-primary font-medium text-[12px] -tracking-[.42px] mb-2 flex gap-[10px]">
                        {item.additional_files
                          ?.split(",")
                          .map((url: string) => (
                            <img
                              src={url}
                              alt="sample logo"
                              className="h-[59px] w-[82px] object-cover rounded-[10px]"
                            />
                          ))}
                      </div>
                    </>
                  ) : null}
                </div>
                <div className="mt-9">
                  <p className="text-primary text-center font-[Inter] text-[14px] font-bold">
                    PLEASE NOTE
                  </p>
                  <p className="text-primary text-center font-[Inter] text-[14px] font-normal">
                    You do NOT have to use the exact copy. Please feel free to
                    modify, if needed, for your newsletter formatting.
                  </p>
                </div>
                <div className="w-full flex justify-center mt-9">
                  <button
                    className="font-[Inter] w-3/2 text-primary font-semibold bg-main rounded-[6px] px-[20px] py-2 me-2 text-xs 2xl:text-xs"
                    onClick={handleAccept}
                  >
                    Accept
                  </button>
                  <button
                    className="font-[Inter] w-3/2 text-[white] bg-error rounded-[6px] px-[20px] py-2 me-2 text-xs 2xl:text-xs"
                    onClick={handleDeny}
                  >
                    Reject
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ReviewCampaignRequest;
