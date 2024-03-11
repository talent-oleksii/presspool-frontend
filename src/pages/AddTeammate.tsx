import { FC, Fragment, useState } from "react";
import validator from "validator";
import { Dialog, Transition } from "@headlessui/react";
import { Dropdown, Select } from "antd";
import { useSelector } from "react-redux";
import { selectData } from "../store/dataSlice";
import { selectAuth } from "../store/authSlice";
import Loading from "../components/Loading";
import APIInstance from "../api";
import DialogUtils from "../utils/DialogUtils";

interface typeAddTeammate {
  show: boolean;
  setShow: Function;
}

const AddTeammate: FC<typeAddTeammate> = ({
  show,
  setShow,
}: typeAddTeammate) => {
  const [loading, setLoading] = useState(false);
  const { email: owner } = useSelector(selectAuth);
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    setLoading(true);
    APIInstance.post("data/team-member", {
      owner,
      email,
      type: "",
      campaignIds: [],
    })
      .then((data) => {
        DialogUtils.show("success", "", data.data.mesage);
        setShow(false);
      })
      .catch((err) => {
        DialogUtils.show("error", "", err.response.data.message);
      })
      .finally(() => setLoading(false));
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
                className={`relative bg-white rounded-lg text-left shadow-xl items-center flex flex-col w-[600px] px-[40px] pt-[30px] pb-[26px]`}
              >
                {loading && <Loading />}
                <button
                  onClick={() => setShow(false)}
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
                <div className="text-left w-full">
                  <p className="text-xs font-[Inter] font-medium -tracking-[.48px]">
                    Email Address
                  </p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full text-xs font-[Inter] italic px-4 py-3 focus:ring-0 focus:border-black -tracking-[.48px] text-primary border-black underline border-[1px] rounded-[10px] bg-[#FBFBFB]"
                  />
                  <button
                    className="bg-black rounded-[5px] text-xs text-white font-semibold font-[Inter] py-3 w-full mt-8 disabled:bg-[#7f8183]"
                    onClick={handleSubmit}
                    disabled={!validator.isEmail(email)}
                  >
                    Add
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

export default AddTeammate;
