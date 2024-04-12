import { FC, Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Avatar, Checkbox } from "antd";

import AdminAPIInstance from "../../../api/adminApi";

import "./AssignAccountManager.scss";
import Loading from "../../../components/Loading";
import { getPlaceHolder } from "../../../utils/commonUtils";

interface typeAssignAccountManager {
  show: boolean;
  name: string;
  userId: string;
  afterAdd: Function;
  onClose: Function;
  assignedClients: Array<any>;
}

const AssignClient: FC<typeAssignAccountManager> = ({
  show,
  name,
  onClose,
  userId,
  afterAdd,
  assignedClients,
}: typeAssignAccountManager) => {
  const [loading, setLoading] = useState(false);
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [clients, setClients] = useState<Array<any>>([]);
  const [searchStr, setSearchStr] = useState<string>("");

  useEffect(() => {
    setSelectedClients([...assignedClients.map((item) => item.id)]);
  }, [assignedClients, show]);

  useEffect(() => {
    setLoading(true);
    AdminAPIInstance.get("/dashboard/client", {
      params: { searchStr: "" },
    })
      .then((data) => {
        setClients(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = () => {
    if (selectedClients.length <= 0) return;
    setLoading(true);
    AdminAPIInstance.post("/dashboard/client", {
      userId,
      assignedIds: selectedClients,
    })
      .then(() => {
        if (afterAdd) afterAdd();
      })
      .finally(() => setLoading(false));
  };

  const onChange = (id: number) => {
    if (selectedClients.includes(id)) {
      setSelectedClients(selectedClients.filter((x) => x !== id));
    } else {
      setSelectedClients([...selectedClients, id]);
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
                      Account Manager Name
                    </p>
                    <div className="rounded-[10px] border border-solid border-[#7f8182] px-5 py-3 text-[#7f8182] text-xs md:text-lg font-medium -tracking-[.5px]">
                      {name}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs md:text-base font-[Inter] -tracking-[.48px] font-medium mb-3">
                      Assigned Clients
                    </p>
                    <input
                      placeholder="Search clients and assign from the dropdown..."
                      className="rounded-[10px] w-full border border-solid border-[#7f8182] px-5 py-3 text-[#7f8182] text-[16px] font-medium -tracking-[.5px]"
                      onChange={(e) => setSearchStr(e.target.value)}
                    />
                    <div className="flex flex-col max-h-[285px] overflow-y-auto">
                      {(searchStr
                        ? clients.filter((x) =>
                            x.name
                              .toLowerCase()
                              .includes(searchStr.toLowerCase())
                          )
                        : clients
                      ).map((client, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-5 px-5 py-3 [&:not(:last-child)]:border-b border-solid border-[#D9D9D9]"
                        >
                          <Avatar
                            src={client?.avatar}
                            className="bg-[#7f8182]"
                            size={40}
                          >
                            {!client?.avatar && getPlaceHolder(client?.name)}
                          </Avatar>
                          <div className="flex flex-col gap-1.5">
                            {/* <span className="text-[15px] color-[#43474A] font-[Inter] -tracking-[.45px] font-medium">
                              EnlightnAI
                            </span> */}
                            <span className="text-[12px] color-[#767676] font-[Inter] -tracking-[.36px] font-normal">
                              {client?.name}
                            </span>
                            <span className="text-[12px] color-[#767676] font-[Inter] -tracking-[.36px] font-normal">
                              {client?.email}
                            </span>
                          </div>
                          <Checkbox
                            className="custom-checkbox ml-auto"
                            checked={!!selectedClients.includes(client.id)}
                            onChange={() => onChange(client.id)}
                          ></Checkbox>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  className="mt-4 text-xs font-semibold py-3 text-primary bg-main w-full rounded-[10px] disabled:bg-[gray]"
                  onClick={handleSubmit}
                  disabled={!selectedClients || selectedClients.length <= 0}
                >
                  Update
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AssignClient;
