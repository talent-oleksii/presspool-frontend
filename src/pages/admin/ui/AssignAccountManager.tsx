import { FC, Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Avatar, Checkbox, CheckboxProps, Select } from "antd";

import AdminAPIInstance from "../../../api/adminApi";

import "./AssignAccountManager.scss";
import Loading from "../../../components/Loading";
import { getPlaceHolder } from "../../../utils/commonUtils";
import DialogUtils from "../../../utils/DialogUtils";

interface typeAssignAccountManager {
  show: boolean;
  company: string;
  userId: string;
  afterAdd: Function;
  onClose: Function;
  assignedAdmins: Array<any>;
}

const AssignAccountManager: FC<typeAssignAccountManager> = ({
  show,
  company,
  onClose,
  userId,
  afterAdd,
  assignedAdmins,
}: typeAssignAccountManager) => {
  const [loading, setLoading] = useState(false);
  const [manager, setManager] = useState<number[]>([]);
  const [accountManagers, setAccountManagers] = useState<Array<any>>([]);
  const [searchStr, setSearchStr] = useState<string>("");

  useEffect(() => {
    setManager([...assignedAdmins.map((item) => item.id)]);
  }, [assignedAdmins, show]);

  useEffect(() => {
    setLoading(true);
    AdminAPIInstance.get("/user/account-manager")
      .then((data) => {
        setAccountManagers(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = () => {
    if (manager.length <= 0) return;
    setLoading(true);
    AdminAPIInstance.post("/user/account-manager", {
      userId,
      assignedIds: manager,
      removedIds: assignedAdmins
        .filter((admin) => !manager.includes(admin.id))
        .map((admin) => admin.id),
    })
      .then((data) => {
        onClose(false);
        if (afterAdd) afterAdd(data.data);
        DialogUtils.show("success", "", "Account manager assigned");
      })
      .finally(() => setLoading(false));
  };

  const onChange = (id: number) => {
    if (manager.includes(id)) {
      setManager([]);
    } else {
      setManager([id]);
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
                className={`relative bg-white rounded-[10px] text-left flex items-center justify-center flex-col shadow-xl border-[1px] border-black px-[36px] pt-[45px] pb-[26px] min-w-[500px]`}
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
                <h3 className="font-[Inter] -tracking-[.72px] text-center font-semibold text-lg">
                  Assign Account Manager
                </h3>
                <div className="flex flex-col gap-7 mt-9 w-full">
                  <div className="flex flex-col gap-3">
                    <p className="text-xs md:text-base font-[Inter] -tracking-[.48px] font-medium">
                      Company Name
                    </p>
                    <div className="rounded-[10px] border border-solid border-[#7f8182] px-5 py-3 text-[#7f8182] text-xs md:text-lg font-medium -tracking-[.5px]">
                      {company}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs md:text-base font-[Inter] -tracking-[.48px] font-medium mb-3">
                      Assigned Members
                    </p>
                    <input
                      placeholder="Search members and assign from the dropdown..."
                      className="rounded-[10px] w-full border border-solid border-[#7f8182] px-5 py-3 text-[#7f8182] text-[16px] font-medium -tracking-[.5px]"
                      onChange={(e) => setSearchStr(e.target.value)}
                    />
                    <div className="flex flex-col max-h-[285px] overflow-y-auto">
                      {(searchStr
                        ? accountManagers.filter((x) =>
                            x.name
                              .toLowerCase()
                              .includes(searchStr.toLowerCase())
                          )
                        : accountManagers
                      ).map((am, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-5 px-5 py-3 [&:not(:last-child)]:border-b border-solid border-[#D9D9D9]"
                        >
                          {/* <span className="rounded-full w-14 h-14 bg-red-500">
                            {getPlaceHolder(am?.name)}
                          </span> */}
                          <Avatar
                            src={am?.avatar}
                            className="bg-[#7f8182]"
                            size={40}
                          >
                            {!am?.avatar && getPlaceHolder(am?.name)}
                          </Avatar>
                          <div className="flex flex-col gap-1.5">
                            {/* <span className="text-[15px] color-[#43474A] font-[Inter] -tracking-[.45px] font-medium">
                              EnlightnAI
                            </span> */}
                            <span className="text-[12px] color-[#767676] font-[Inter] -tracking-[.36px] font-normal">
                              {am?.name}
                            </span>
                            <span className="text-[12px] color-[#767676] font-[Inter] -tracking-[.36px] font-normal">
                              {am?.email}
                            </span>
                          </div>
                          <Checkbox
                            className="custom-checkbox ml-auto"
                            checked={!!manager.includes(am.id)}
                            onChange={() => onChange(am.id)}
                          ></Checkbox>
                        </div>
                      ))}
                    </div>

                    {/* <Select
                    className="select-account-manager w-full mt-1"
                    mode="multiple"
                    allowClear
                    value={manager}
                    onChange={(e) => setManager(e)}
                    options={accountManagers.map((item: any) => ({
                      value: item.id,
                      label: item.name,
                    }))}
                  /> */}
                  </div>
                </div>
                <button
                  className="mt-4 text-xs font-semibold py-3 text-primary bg-main w-full rounded-[10px] disabled:bg-[gray]"
                  onClick={handleSubmit}
                  disabled={!manager || manager.length <= 0}
                >
                  Assign
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AssignAccountManager;
