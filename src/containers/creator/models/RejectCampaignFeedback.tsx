import { FC, Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Loading from "../../../components/Loading";
import { Input } from "rsuite";
import ErrorMessage from "../../../components/ErrorMessage";
import moment from "moment";
import CreatorAPIInstance from "../../../api/creatorAPIInstance";
import DialogUtils from "../../../utils/DialogUtils";

interface typeRejectCampaignFeedback {
  show: boolean;
  onClose: Function;
  item: any;
  loadCampaigns: Function;
}

const RejectCampaignFeedback: FC<typeRejectCampaignFeedback> = ({
  show,
  onClose,
  item,
  loadCampaigns,
}: typeRejectCampaignFeedback) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<any>(null);
  const [error, setError] = useState("");

  const handleChange = (value: any) => {
    setError("");
    setValue(value);
  };

  const handleSubmitClick = async () => {
    if (value) {
      try {
        setLoading(true);
        await CreatorAPIInstance.put("rejectCampaign", {
          requestId: item.requestid,
          rejectDate: moment(new Date()).unix(),
          notes: value,
        });
        setValue("");
        onClose();
        setLoading(false);
        DialogUtils.show("success", "", `Feedback submitted`);
        loadCampaigns();
      } catch (error: any) {
        DialogUtils.show("error", "", error.toString());
        setLoading(false);
      }
    } else {
      setError("Enter notes");
    }
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

                <div className="text-center">
                  <h2 className="text-xl font-semibold -tracking-[.72px]">
                    Feedback
                  </h2>
                  <p className="text-[#7F8182] text-normal text-sm">
                    Please share why this campaign isn't a fit. Your insights
                    help us refine future campaign proposals for you.
                  </p>
                </div>
                <p className="mt-4 text-xs w-full -tracking-[.48px] text-primary font-medium">
                  Notes (Required)*
                </p>
                <textarea
                  className="w-full px-4 border-[1px] border-[#7f8182] rounded-[10px] mt-1"
                  placeholder="Enter here..."
                  rows={6}
                  value={value}
                  onChange={(e) => handleChange(e.target.value)}
                />
                <div className="self-start">
                  {error && <ErrorMessage message={error} />}
                </div>
                <div className="w-full flex justify-center mt-9">
                  <button
                    className="font-[Inter] w-3/2 text-primary bg-main font-semibold rounded-[6px] px-[20px] py-3 me-2 text-xs 2xl:text-xs"
                    onClick={handleSubmitClick}
                  >
                    Submit Feedback
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

export default RejectCampaignFeedback;
