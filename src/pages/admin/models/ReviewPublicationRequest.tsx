import { FC, Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Avatar } from "antd";
import { getPlaceHolder } from "../../../utils/commonUtils";
import { capitalize } from "lodash";
import Loading from "../../../components/Loading";
import AdminAPIInstance from "../../../api/adminApi";

interface typeReviewPublicationRequest {
  show: boolean;
  onClose: Function;
  item: any;
  setShowFeedbackModel: Function;
  loadPublications: Function;
}

const ReviewPublicationRequest: FC<typeReviewPublicationRequest> = ({
  show,
  onClose,
  item,
  setShowFeedbackModel,
  loadPublications,
}: typeReviewPublicationRequest) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleAccept = async () => {
    try {
      setLoading(true);
      await AdminAPIInstance.put("/approvePublication", {
        publicationId: item.publication_id,
      });
      loadPublications();
      setLoading(false);
      onClose();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleDeny = () => {
    onClose();
    setShowFeedbackModel(true);
  };

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => onClose()}>
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
                <div className="flex shrink-0 justify-between mb-[12px]">
                  <div className="flex items-center">
                    <Avatar
                      src={item?.team_avatar}
                      className={`${item?.team_avatar ? "" : "bg-[#7f8182]"}`}
                      size={48}
                    >
                      {!item?.team_avatar && getPlaceHolder(item.name)}
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
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="min-h-[43px] border-[1px] border-main rounded-[10px] p-2">
                    <p className="text-[#172935] text-[12px] font-[Inter] font-medium -tracking-[.36px]">
                      Subscribers
                    </p>
                    <p className="text-primary text-base font-[Inter] font-semibold -tracking-[.36px]">
                      {item?.total_subscribers}
                    </p>
                  </div>
                  <div className="min-h-[43px] border-[1px] border-main rounded-[10px] p-2">
                    <p className="text-[#172935] text-[12px] font-[Inter] font-medium -tracking-[.36px]">
                      CPC
                    </p>
                    <p className="text-primary text-base font-[Inter] font-semibold -tracking-[.36px]">
                      ${item?.cpc ?? 0}
                    </p>
                  </div>
                  <div className="min-h-[43px] border-[1px] border-main rounded-[10px] p-2">
                    <p className="text-[#172935] text-[12px] font-[Inter] font-medium -tracking-[.36px]">
                      72hr Clicks
                    </p>
                    <p className="text-primary text-base font-[Inter] font-semibold -tracking-[.36px]">
                      {item?.average_unique_click}
                    </p>
                  </div>
                </div>
                <div className="w-full flex flex-col items-start justify-center mb-3">
                  <div className="flex items-end justify-between w-full mb-2 mt-3">
                    <div className="w-auto">
                      <p className="text-[#A3A3A3] font-[Inter] text-[10px] font-medium">
                        Subscriber Count Verification
                      </p>
                      <div className="font-[Inter] text-primary font-medium text-[10px] -tracking-[.42px] mb-2">
                        <img
                          src={item?.proof_image}
                          alt="sample logo"
                          className="h-[59px] w-[82px] object-cover rounded-[10px]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end justify-between w-full mb-2 mt-3">
                    <div className="w-auto">
                      <p className="text-[#A3A3A3] font-[Inter] text-[10px] font-medium">
                        Target Audience
                      </p>
                      <p className="text-primary font-[Inter] font-medium -tracking-[.47px] flex gap-1">
                        <button className="bg-black px-2 py-1 rounded text-white font-medium font-[Inter] text-[8px]">
                          {capitalize(item.audience)}
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
                        {(item.industry || []).map(
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
                        {(item.geography || []).map(
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
                  {item.state === "REJECTED" && (
                    <div className="flex items-end justify-between w-full mb-2">
                      <div className="w-full">
                        <p className="text-[#A3A3A3] font-[Inter] text-[10px] font-medium">
                          Rejection Note
                        </p>
                        <div className="font-[Inter] text-primary font-medium text-[10px] -tracking-[.42px] mb-2 min-h-[78px] w-full border-[1px] border-[#7f8182] rounded-[10px] p-1">
                          {item.rejected_notes}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {item.state === "PENDING" && (
                  <div className="w-full flex justify-center">
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
                      Deny
                    </button>
                  </div>
                )}
                {item.state === "APPROVED" && (
                  <div className="w-full flex justify-center">
                    <button
                      className="font-[Inter] w-3/2 text-white font-semibold bg-black rounded-[6px] px-[20px] py-2 me-2 text-xs 2xl:text-xs"
                      onClick={handleAccept}
                    >
                      Campaigns
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ReviewPublicationRequest;
