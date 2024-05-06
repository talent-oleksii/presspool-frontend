import { FC, Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Avatar } from "antd";
import { getPlaceHolder } from "../../../utils/commonUtils";
import { capitalize } from "lodash";

interface typeInviteAccountManager {
  show: boolean;
  onClose: Function;
  item: any;
}

const ReviewCampaignRequest: FC<typeInviteAccountManager> = ({
  show,
  onClose,
  item,
}: typeInviteAccountManager) => {
  const [emails, setEmails] = useState("");

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
                className={`relative bg-white rounded-[10px] text-left flex flex-col shadow-xl border-[1px] border-black p-3 max-w-[500px]`}
              >
                <div className="flex shrink-0 justify-between mb-[12px]">
                  <div className="flex items-center">
                    <Avatar
                      src={item?.team_avatar}
                      className={`${item?.team_avatar ? "" : "bg-[#7f8182]"}`}
                      size={48}
                    >
                      {!item?.team_avatar && getPlaceHolder(item.company)}
                    </Avatar>
                    <div className="ms-2">
                      <p className="text-primary text-[15px] font-[Inter] -tracking-[.36px]">
                        {item.name}
                      </p>
                    </div>
                  </div>
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
                </div>
                <hr />
                <div className="w-full flex flex-col items-start justify-center mt-5 mb-3">
                  <div className="flex flex-col h-full w-full ">
                    <p className="text-[#A3A3A3] font-[Inter] text-[10px] font-medium">
                      Headline
                    </p>
                    <h2 className="font-[Inter] text-primary font-medium text-[10px] -tracking-[.42px] mb-2">
                      {item?.headline}
                    </h2>
                    <p className="text-[#A3A3A3] font-[Inter] text-[10px] font-medium">
                      Body
                    </p>
                    <h2 className="font-[Inter] text-primary font-medium text-[10px] -tracking-[.42px] mb-2">
                      {item?.body}
                    </h2>
                    <p className="text-[#A3A3A3] font-[Inter] text-[10px] font-medium">
                      CTA Text
                    </p>
                    <h2 className="font-[Inter] text-primary font-medium text-[10px] -tracking-[.42px] mb-2">
                      {item?.cta}
                    </h2>
                    <p className="text-[#A3A3A3] font-[Inter] text-[10px] font-medium">
                      CTA Link
                    </p>
                    <h2 className="font-[Inter] text-primary font-medium text-[10px] -tracking-[.42px] mb-2">
                      {item?.page_url}
                    </h2>
                  </div>
                </div>
                <hr />
                <div className="w-full flex flex-col items-start justify-center mt-3 mb-3">
                  <p className="text-primary font-[Inter] text-[12px] font-medium">
                    Targeting
                  </p>
                  <div className="flex items-end justify-between w-full mb-2 mt-3">
                    <div className="w-auto">
                      <p className="text-[#A3A3A3] font-[Inter] text-[10px] font-medium">
                        Target Audience
                      </p>
                      <p className="text-primary font-[Inter] font-medium -tracking-[.47px] flex gap-1">
                        <button className="bg-black px-2 py-1 rounded text-white font-medium font-[Inter] text-[8px]">
                          {capitalize(item.demographic)}
                        </button>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-end justify-between w-full mb-2">
                    <div className="w-auto">
                      <p className="text-[#A3A3A3] font-[Inter] text-[10px] font-medium">
                        Target Industrie(s)
                      </p>
                      <p className="text-primary font-[Inter] font-medium -tracking-[.47px] flex gap-1 flex-wrap">
                        {(item.audience || []).map(
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
                  {item.position && (
                    <div className="flex items-end justify-between w-full mb-2">
                      <div className="w-auto">
                        <p className="text-[#A3A3A3] font-[Inter] text-[10px] font-medium">
                          Target Demographic(s)
                        </p>
                        <p className="text-primary font-[Inter] font-medium -tracking-[.47px] flex gap-1 flex-wrap">
                          {(item.position || []).map(
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
                  <div className="flex items-end justify-between w-full mb-2">
                    <div className="w-auto">
                      <p className="text-[#A3A3A3] font-[Inter] text-[10px] font-medium">
                        Target Region(s)
                      </p>
                      <p className="text-primary font-[Inter] font-medium -tracking-[.47px] flex gap-1 flex-wrap">
                        {(item.region || []).map(
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
                <hr />
                <div className="w-full flex flex-col items-start justify-center mt-3 mb-3">
                  <p className="text-primary font-[Inter] text-[12px] font-medium">
                    Payment 💰
                  </p>
                  <div className="flex flex-col h-full w-full ">
                    <p className="text-[#A3A3A3] font-[Inter] text-[10px] font-medium">
                      Estimated Payout
                    </p>
                    <h2 className="font-[Inter] text-primary font-medium text-[10px] -tracking-[.42px] mb-2">
                      ${Number(item?.average_unique_click) * Number(item?.cpc)}
                    </h2>
                    <p className="text-[#A3A3A3] font-[Inter] text-[10px] font-medium">
                      CPC Bid
                    </p>
                    <h2 className="font-[Inter] text-primary font-medium text-[10px] -tracking-[.42px] mb-2">
                      ${item.cpc}
                    </h2>
                  </div>
                </div>
                <div className="w-full flex justify-center">
                  <button className="font-[Inter] w-3/2 text-primary bg-main rounded-[6px] px-[20px] py-2 me-2 text-xs 2xl:text-xs">
                    Accept
                  </button>
                  <button className="font-[Inter] w-3/2 text-[white] bg-error rounded-[6px] px-[20px] py-2 me-2 text-xs 2xl:text-xs">
                    Deny
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
