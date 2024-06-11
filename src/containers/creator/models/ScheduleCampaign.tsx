import { FC, Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Loading from "../../../components/Loading";
import { Input } from "rsuite";
import ErrorMessage from "../../../components/ErrorMessage";
import moment from "moment";
import CreatorAPIInstance from "../../../api/creatorAPIInstance";
import DialogUtils from "../../../utils/DialogUtils";
import { message } from "antd";

interface typeInviteAccountManager {
  show: boolean;
  onClose: Function;
  item: any;
  loadCampaigns: Function;
  isReschedule?: boolean;
  setShowPreviewModel?: Function;
  loadNotifications?: Function;
}

const ScheduleCampaign: FC<typeInviteAccountManager> = ({
  show,
  onClose,
  item,
  loadCampaigns,
  isReschedule,
  setShowPreviewModel,
  loadNotifications,
}: typeInviteAccountManager) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<any>(null);
  const [isReviewClicked, setIsReviewClicked] = useState(false);
  const [error, setError] = useState("");
  const [minDateTime, setMinDateTime] = useState("");
  const [maxDateTime, setMaxDateTime] = useState("");

  useEffect(() => {
    const now = new Date();
    const future = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    const formatDateTime = (date: any) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    setMinDateTime(formatDateTime(now));
    setMaxDateTime(formatDateTime(future));
  }, []);

  const handleChange = (value: any) => {
    setError("");
    setValue(value);
  };

  const handleReviewClick = () => {
    if (value) {
      setIsReviewClicked(true);
    } else {
      setError("Select publish date");
    }
  };

  const handleConfirmClick = async () => {
    try {
      setLoading(true);
      await CreatorAPIInstance.put("scheduleCampaign", {
        requestid: item.requestid,
        scheduleDate: moment(value).unix(),
        isReschedule: !!isReschedule,
      });
      onClose();
      setLoading(false);
      messageApi.open({
        type: "success",
        content: `You have successfully scheduled ${item.company}'s campaign for publishing.`,
      });
      setIsReviewClicked(false);
      setValue(null);
      loadCampaigns();
      loadNotifications?.();
      setShowPreviewModel?.();
    } catch (error: any) {
      DialogUtils.show("error", "", error.toString());
      setLoading(false);
    }
  };

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {}}>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          {contextHolder}
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
                className={`relative bg-white rounded-[10px] text-left flex items-center justify-center flex-col shadow-xl border-[1px] border-black px-[36px] pt-[45px] pb-[26px] min-w-[600px] max-w-[600px]`}
              >
                {loading && <Loading />}
                <button
                  onClick={() => onClose(false)}
                  className="absolute right-4 top-4"
                >
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
                {isReviewClicked ? (
                  <>
                    <div className="text-center">
                      <h2 className="text-xl font-semibold -tracking-[.72px]">
                        Accept and confirm
                      </h2>
                      <p className="text-[#7F8182] text-normal text-sm">
                        You’ve selected to send Enlightn AI’s campaign on{" "}
                        <b className="text-primary">
                          {moment(value).format("MMM D, YYYY")}
                        </b>
                        . This campaign will pay{" "}
                        <b className="text-primary">${item?.cpc}</b> for each
                        verified click generated within 72 hours of your
                        selected date, with an estimated payout and total budget
                        of{" "}
                        <b className="text-primary">
                          {" "}
                          $
                          {Number(item?.average_unique_click) *
                            Number(item?.cpc)}
                        </b>
                        .
                      </p>
                      <p className="text-[#7F8182] text-normal text-sm mt-3">
                        By clicking confirm, you acknowledge the above and your
                        responsibility to publish on the selected date. Payouts
                        are subject to change based on the number of verified
                        clicks generated.
                      </p>
                    </div>
                    <div className="w-full flex justify-center mt-9">
                      <button
                        className="font-[Inter] w-3/2 text-primary bg-main rounded-[6px] px-[20px] py-3 me-2 text-xs 2xl:text-xs"
                        onClick={handleConfirmClick}
                      >
                        Confirm
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <h2 className="text-xl font-semibold -tracking-[.72px]">
                        Schedule
                      </h2>
                      <p className="text-[#7F8182] text-normal text-sm">
                        Schedule for a specific date and time in the future
                      </p>
                    </div>
                    <p className="mt-4 text-xs w-full -tracking-[.48px] text-primary font-medium">
                      Publish Date
                    </p>
                    <Input
                      className="mt-2 w-full px-4 py-2.5 border-[1px] rounded-[10px] border-[#7f8182]"
                      type="datetime-local"
                      value={value}
                      onChange={handleChange}
                      min={minDateTime}
                      max={maxDateTime}
                    />
                    <div className="self-start">
                      {error && <ErrorMessage message={error} />}
                    </div>
                    <div className="w-full flex justify-center mt-9">
                      <button
                        className="font-[Inter] w-3/2 text-primary font-semibold bg-main rounded-[6px] px-[20px] py-3 me-2 text-xs 2xl:text-xs"
                        onClick={handleReviewClick}
                      >
                        Review
                      </button>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ScheduleCampaign;
