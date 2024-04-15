import { FC, useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { Avatar, Menu, MenuProps } from "antd";
import { selectAuth } from "../../store/authSlice";
import AdminAPIInstance from "../../api/adminApi";
import moment from "moment";
import { Link } from "react-router-dom";
import { GetItem, MenuItem } from "../../containers/shared/GetItem";

const AdminMember: FC = () => {
  const [searchKey, setSearchKey] = useState("");
  const [accountManagers, setAccountManagers] = useState<Array<any>>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [sort, setSort] = useState<string>("Joined Date");
  const ref = useRef<any>(null);

  const { adminRole } = useSelector(selectAuth);

  useEffect(() => {
    AdminAPIInstance.get("/user/account-manager").then((res) => {
      setAccountManagers(res.data);
    });
  }, []);

  const getPlaceHolder = (name: string) => {
    if (!name) return "";
    const names = name.split(" ");
    if (names.length === 2) {
      return `${names[0].at(0)}${names[1].at(0)}`;
    } else if (names.length === 1) {
      return `${names[0].at(0)}`;
    } else {
      return "";
    }
  };

  const handleOpenChange = () => {
    setOpen(true);
  };

  const hide = () => {
    setOpen(false);
  };

  const items: MenuItem[] = [GetItem("Joined Date", "Joined Date")];

  const onClick: MenuProps["onClick"] = (e) => {
    setSort(e.key);
    hide();
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        hide();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const totalCampaignCount = useMemo(
    () =>
      accountManagers.reduce(
        (prev, item) => prev + Number(item?.campaign_count ?? 0),
        0
      ),
    [accountManagers]
  );

  const activeCampaignCount = useMemo(
    () =>
      accountManagers.reduce(
        (prev, item) => prev + Number(item?.active_count ?? 0),
        0
      ),
    [accountManagers]
  );

  const draftCampaignCount = useMemo(
    () =>
      accountManagers.reduce(
        (prev, item) => prev + Number(item?.draft_count ?? 0),
        0
      ),
    [accountManagers]
  );

  const totalBilled = useMemo(
    () =>
      accountManagers.reduce(
        (prev, item) => prev + Number(item?.billed ?? 0),
        0
      ),
    [accountManagers]
  );

  const completedCampaignCount = useMemo(
    () =>
      accountManagers.reduce(
        (prev, item) => prev + Number(item?.completed_count ?? 0),
        0
      ),
    [accountManagers]
  );

  return (
    <div className="min-h-full w-full flex">
      <div className="text-left flex-1">
        <h2 className="font-[Inter] font-semibold -tracking-[.6px] text-[20px]">
          Presspool Team
        </h2>
        <div className="mt-4">
          <div className="flex items-center grid grid-cols-7 gap-2">
            <div className="col-span-1 rounded-[10px] pt-2 px-2 pb-2 bg-white">
              <p className="text-[#7F8182] -tracking-[.42px] font-medium text-sm flex items-center">
                Total AMs
              </p>
              <p className="text-black text-[25px] mt-2 -tracking-[.75px] font-semibold ms-2">
                {accountManagers.length}
              </p>
            </div>
            <div className="col-span-1 rounded-[10px] pt-2 px-2 pb-2 bg-white">
              <p className="text-[#7F8182] -tracking-[.42px] font-medium text-sm flex items-center">
                Total Campaigns
              </p>
              <p className="text-black text-[25px] mt-2 -tracking-[.75px] font-semibold ms-2">
                {totalCampaignCount}
              </p>
            </div>
            <div className="col-span-1 rounded-[10px] pt-2 px-2 pb-2 bg-white">
              <p className="text-[#7F8182] -tracking-[.42px] font-medium text-sm flex items-center">
                Active Campaigns
              </p>
              <p className="text-black text-[25px] mt-2 -tracking-[.75px] font-semibold ms-2">
                {activeCampaignCount}
              </p>
            </div>
            <div className="col-span-1 rounded-[10px] pt-2 px-2 pb-2 bg-white">
              <p className="text-[#7F8182] -tracking-[.42px] font-medium text-sm flex items-center">
                Draft Campaigns
              </p>
              <p className="text-black text-[25px] mt-2 -tracking-[.75px] font-semibold ms-2">
                {draftCampaignCount}
              </p>
            </div>
            <div className="col-span-1 rounded-[10px] pt-2 px-2 pb-2 bg-white">
              <p className="text-[#7F8182] -tracking-[.42px] font-medium text-sm flex items-center">
                Completed Campaigns
              </p>
              <p className="text-black text-[25px] mt-2 -tracking-[.75px] font-semibold ms-2">
                {completedCampaignCount}
              </p>
            </div>
            <div className="col-span-1 rounded-[10px] pt-2 px-2 pb-2 bg-white">
              <p className="text-[#7F8182] -tracking-[.42px] font-medium text-sm flex items-center">
                Total Revenue
              </p>
              <p className="text-black text-[25px] mt-2 -tracking-[.75px] font-semibold">{`$${totalBilled}`}</p>
            </div>
            <div className="col-span-1 rounded-[10px] pt-2 px-2 pb-2 bg-white">
              <p className="text-[#7F8182] -tracking-[.42px] font-medium text-sm flex items-center">
                Total Commission
              </p>
              <p className="text-[#57d386] text-[25px] mt-2 -tracking-[.75px] font-semibold">{`$${
                Number(totalBilled) * 0.1
              }`}</p>
            </div>
          </div>
          <div className="flex items-center w-full mt-[24px] gap-5">
            <div className="flex w-[342px] border-[2px] rounded-[10px] border-main items-center px-4 py-2 bg-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="20"
                className="me-4"
                viewBox="0 0 21 20"
                fill="none"
              >
                <path
                  d="M12.0016 1.07199C12.9542 1.62201 13.7832 2.36255 14.4368 3.24735C15.0903 4.13216 15.5544 5.14222 15.8 6.21444C16.0456 7.28666 16.0675 8.39801 15.8643 9.47908C15.6611 10.5601 15.2372 11.5877 14.619 12.4976L19.5637 17.4412C19.839 17.7125 19.9989 18.0795 20.0102 18.4659C20.0216 18.8522 19.8833 19.228 19.6244 19.5149C19.3655 19.8018 19.0058 19.9777 18.6203 20.006C18.2349 20.0342 17.8534 19.9126 17.5554 19.6665L17.4414 19.5635L12.4977 14.6188C11.3149 15.4222 9.93848 15.894 8.51156 15.9851C7.08464 16.0761 5.65938 15.7832 4.38408 15.1366C3.10878 14.4901 2.03003 13.5136 1.26007 12.3088C0.490105 11.104 0.0570647 9.71489 0.00600086 8.28598L0 8.00094L0.0050008 7.7159C0.0542013 6.33646 0.459431 4.99321 1.18131 3.8167C1.90318 2.64019 2.91715 1.67044 4.12465 1.00171C5.33216 0.332977 6.69213 -0.0119965 8.07239 0.00031853C9.45265 0.0126336 10.8063 0.381819 12.0016 1.07199Z"
                  fill="#7F8182"
                />
                <circle cx="8.00586" cy="8.00488" r="6" fill="#F5F5F5" />
              </svg>
              <input
                className="me-2 font-[Inter] flex-1 border-0 text-sm text-primary focus:ring-0 p-0 focus:border-secondry2"
                placeholder="Search by Account Manager Name"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
              />
            </div>
            <div
              ref={ref}
              className="group inline-flex flex-col min-w-[100px] relative"
            >
              <button
                onMouseEnter={handleOpenChange}
                className={`font-[Inter] text-[14px] font-normal items-center justify-center text-primary justify-between flex px-4 py-2 gap-4 rounded-[10px] bg-white ring-2 ring-main shadow-md focus:ring-main`}
              >
                {sort}
                <svg
                  width="18"
                  height="12"
                  viewBox="0 0 18 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    y1="1.75"
                    x2="18"
                    y2="1.75"
                    stroke="#505050"
                    strokeWidth="2.5"
                  />
                  <line
                    x1="2"
                    y1="5"
                    x2="16"
                    y2="5"
                    stroke="#505050"
                    strokeWidth="2"
                  />
                  <line x1="7" y1="11.5" x2="11" y2="11.5" stroke="#505050" />
                  <line
                    x1="4"
                    y1="8.25"
                    x2="14"
                    y2="8.25"
                    stroke="#505050"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
              {open && (
                <Menu
                  selectedKeys={[sort]}
                  onClick={onClick}
                  items={items}
                  className="w-[300px] absolute top-[calc(100%+5px)] !shadow-md rounded-[10px] text-left z-[9] !focus:ring-main"
                />
              )}
            </div>
          </div>
          <div className="mt-4 flex">
            {adminRole === "super_admin" && (
              <div className="w-full">
                {(searchKey
                  ? accountManagers.filter((item) =>
                      item.name.toLowerCase().includes(searchKey.toLowerCase())
                    )
                  : accountManagers
                ).map((item: any, index) => (
                  <div
                    key={index}
                    className="bg-white mb-5 rounded-[10px] shadow-lg"
                  >
                    <div className="flex pl-[24px] pr-[20px] py-[20px] justify-evenly items-center text-left w-full relative">
                      <div className="flex flex-col w-[250px] max-w-[250px] gap-2 shrink-0">
                        <div className="mt-1 flex items-center">
                          <Avatar
                            src={item.avatar}
                            className="bg-[#7f8182]"
                            size={40}
                          >
                            {!item.avatar && getPlaceHolder(item.name)}
                          </Avatar>
                          <div className="ms-2">
                            <p className="text-secondry1 text-xs font-medium font-[Inter] -tracking-[.36px]">
                              {item.name}
                            </p>
                            <p className="font-[Inter] -tracking-[.3px] text-[10px] text-[#a3a3a3]">{`${item.email}`}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center w-[50px] shrink-0">
                        <span className="w-[1px] h-[25px] bg-[#A4A4A4]"></span>
                      </div>
                      <div className="flex flex-col items-center w-full">
                        <p className="font-medium font-[Inter] text-xs mb-[17px] text-secondry3 -tracking-[.3px]">
                          Joined Date
                        </p>
                        <p className="font-normal text-secondry1 font-[Inter] text-xs">
                          {moment(Number(item.create_time)).format(
                            "DD/MM/YYYY"
                          )}
                        </p>
                      </div>

                      <div className="flex flex-col items-center w-full">
                        <p className="font-medium font-[Inter] text-xs mb-[17px] -tracking-[.3px] text-secondry3">
                          Total Clients
                        </p>
                        <p className="font-normal text-secondry1 font-[Inter] text-xs">
                          {item?.client_count ?? 0}
                        </p>
                      </div>
                      <div className="flex flex-col items-center w-full">
                        <p className="font-medium font-[Inter] text-xs mb-[17px] -tracking-[.3px] text-secondry3">
                          Active Camps
                        </p>
                        <p className="font-normal text-secondry1 font-[Inter] text-xs">
                          {item?.active_count ?? 0}
                        </p>
                      </div>
                      <div className="flex flex-col items-center w-full">
                        <p className="font-medium font-[Inter] text-xs mb-[17px] -tracking-[.3px] text-secondry3">
                          Draft Camps
                        </p>
                        <p className="font-normal text-secondry1 font-[Inter] text-xs">
                          {item?.draft_count ?? 0}
                        </p>
                      </div>
                      <div className="flex flex-col items-center w-full">
                        <p className="font-medium font-[Inter] text-xs mb-[17px] -tracking-[.3px] text-secondry3">
                          Completed Camps
                        </p>
                        <p className="font-normal text-secondry1 font-[Inter] text-xs">
                          {item?.completed_count ?? 0}
                        </p>
                      </div>
                      <div className="flex flex-col items-center w-full">
                        <p className="font-medium font-[Inter] text-xs mb-[17px] -tracking-[.3px] text-secondry3">
                          Total Revenue
                        </p>
                        <p className="font-normal text-secondry1 font-[Inter] text-xs">{`$${
                          item?.billed ?? 0
                        }`}</p>
                      </div>
                      <div className="flex flex-col items-center w-full">
                        <Link
                          className="w-[90px] h-full text-center text-[10px] rounded-[10px] bg-black font-medium text-white px-2 py-2"
                          to={`/admin/${item.id}/client`}
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMember;
