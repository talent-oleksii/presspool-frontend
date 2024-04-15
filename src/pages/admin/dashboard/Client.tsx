import { FC, useEffect, useState, useMemo, useRef, useCallback } from "react";
import Loading from "../../../components/Loading";
import AdminAPIInstance from "../../../api/adminApi";
import { Avatar, Menu, MenuProps } from "antd";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import { GetItem, MenuItem } from "../../../containers/shared/GetItem";
import AssignClient from "../ui/AssignClient";

const AdminDashboardClient: FC = () => {
  const { accountManagerId } = useParams();
  const [loading, setLoading] = useState(false);
  const [searchStr, setSearchStr] = useState("");
  const [accountManager, setAccountManager] = useState<any>({});
  const [data, setData] = useState<Array<any>>([]);
  const [showData, setShowData] = useState<Array<any>>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [sort, setSort] = useState<string>("Joined Date");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const ref = useRef<any>(null);

  const loadClients = useCallback(() => {
    setLoading(true);
    AdminAPIInstance.get("/dashboard/client", {
      params: { searchStr: "", accountManagerId },
    })
      .then((data) => {
        setData(data.data);
      })
      .finally(() => setLoading(false));
  }, [accountManagerId]);

  useEffect(() => {
    loadClients();
    if (accountManagerId) {
      AdminAPIInstance.get("/user/account-manager-detail", {
        params: { id: accountManagerId },
      }).then((data) => {
        setAccountManager(data.data);
      });
    }
  }, [accountManagerId, loadClients]);

  useEffect(() => {
    setShowData(
      data.filter(
        (item) =>
          item.name.toLowerCase().includes(searchStr.toLowerCase()) ||
          item.company.toLowerCase().includes(searchStr.toLowerCase())
      )
    );
  }, [data, searchStr]);

  const getPlaceHolder = (fullName: string) => {
    const names = fullName.split(" ");
    if (names.length === 2) {
      return `${names[0].at(0)}${names[1].at(0)}`;
    } else if (names.length === 1) {
      return `${names[0].at(0)}`;
    } else {
      return "";
    }
  };

  const totalCampaignCount = useMemo(
    () =>
      data.reduce((prev, item) => prev + Number(item?.campaign_count ?? 0), 0),
    [data]
  );

  const activeCampaignCount = useMemo(
    () =>
      data.reduce((prev, item) => prev + Number(item?.active_count ?? 0), 0),
    [data]
  );

  const draftCampaignCount = useMemo(
    () => data.reduce((prev, item) => prev + Number(item?.draft_count ?? 0), 0),
    [data]
  );

  const totalSpend = useMemo(
    () =>
      data.reduce((prev, item) => prev + Number(item?.total_budget ?? 0), 0),
    [data]
  );

  const totalBilled = useMemo(
    () => data.reduce((prev, item) => prev + Number(item?.billed ?? 0), 0),
    [data]
  );

  const completedCampaignCount = useMemo(
    () =>
      data.reduce((prev, item) => prev + Number(item?.completed_count ?? 0), 0),
    [data]
  );

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

  return (
    <div className="w-full flex">
      <div className="text-left flex-1">
        <h2 className="font-[Inter] font-semibold -tracking-[.6px] text-[20px]">
          Clients
        </h2>
        <div className="mt-4">
          {loading && <Loading />}
          <div className="flex items-center grid grid-cols-7 gap-2">
            <div className="col-span-1 rounded-[10px] pt-2 px-2 pb-2 bg-white">
              <p className="text-[#7F8182] -tracking-[.42px] font-medium text-sm flex items-center">
                Total Clients
              </p>
              <p className="text-black text-[25px] mt-2 -tracking-[.75px] font-semibold ms-2">
                {data?.length}
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
                Total Budget
              </p>
              <p className="text-black text-[25px] mt-2 -tracking-[.75px] font-semibold">{`$${totalSpend}`}</p>
            </div>
            <div className="col-span-1 rounded-[10px] pt-2 px-2 pb-2 bg-white">
              <p className="text-[#7F8182] -tracking-[.42px] font-medium text-sm flex items-center">
                Total Spent
              </p>
              <p className="text-[#57d386] text-[25px] mt-2 -tracking-[.75px] font-semibold">{`$${totalBilled}`}</p>
            </div>
          </div>
          {accountManagerId && (
            <div className="flex items-center w-full gap-5 mt-[24px]">
              <h2 className="font-[Inter] font-semibold -tracking-[.6px] text-[20px]">
                Assigned Clients
              </h2>
              <button
                className="px-6 py-2 rounded-[10px] text-white font-[Inter] text-xs font-semibold bg-primary disabled:bg-[#a3a3a3]"
                onClick={() => setShowAssignModal(true)}
              >
                + Assign Clients
              </button>
            </div>
          )}
          <div className="flex items-center w-full gap-5 mt-[24px]">
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
                placeholder="Search by Client/Company Name"
                value={searchStr}
                onChange={(e) => setSearchStr(e.target.value)}
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
          <div className="mt-4">
            {showData &&
              showData.map((item, index) => (
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
                          <p className="text-secondry1 text-xs font-[Inter] -tracking-[.36px]">
                            {item.company}
                          </p>
                          <p className="text-[#a3a3a3] text-xs font-[Inter] -tracking-[.36px]">
                            {item.name}
                          </p>
                          <p className="font-[Inter] -tracking-[.3px] text-xs text-[#a3a3a3]">
                            {item.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center w-[50px] shrink-0">
                      <span className="w-[1px] h-[25px] bg-[#A4A4A4]"></span>
                    </div>
                    <div className="flex flex-col items-center w-full">
                      <p className="font-semibold font-[Inter] text-xs mb-[17px] text-secondry1 -tracking-[.3px]">
                        Joined Date
                      </p>
                      <p className="font-normal text-primary font-[Inter] text-xs">
                        {moment(Number(item.create_time)).format("DD/MM/YYYY")}
                      </p>
                    </div>

                    <div className="flex flex-col items-center w-full">
                      <p className="font-semibold font-[Inter] text-xs mb-[17px] -tracking-[.3px] text-secondry1">
                        Total Camps
                      </p>
                      <p className="font-normal text-primary font-[Inter] text-xs">
                        {item?.campaign_count ?? 0}
                      </p>
                    </div>
                    <div className="flex flex-col items-center w-full">
                      <p className="font-semibold font-[Inter] text-xs mb-[17px] -tracking-[.3px] text-secondry1">
                        Active Camps
                      </p>
                      <p className="font-normal text-primary font-[Inter] text-xs">
                        {item?.active_count ?? 0}
                      </p>
                    </div>
                    <div className="flex flex-col items-center w-full">
                      <p className="font-semibold font-[Inter] text-xs mb-[17px] -tracking-[.3px] text-secondry1">
                        Draft Camps
                      </p>
                      <p className="font-normal text-primary font-[Inter] text-xs">
                        {item?.draft_count ?? 0}
                      </p>
                    </div>
                    <div className="flex flex-col items-center w-full">
                      <p className="font-semibold font-[Inter] text-xs mb-[17px] -tracking-[.3px] text-secondry1">
                        Completed Camps
                      </p>
                      <p className="font-normal text-primary font-[Inter] text-xs">
                        {item?.completed_count ?? 0}
                      </p>
                    </div>
                    <div className="flex flex-col items-center w-full">
                      <p className="font-semibold font-[Inter] text-xs mb-[17px] -tracking-[.3px] text-secondry1">
                        Total Budget
                      </p>
                      <p className="font-normal text-primary font-[Inter] text-xs">{`$${item?.total_budget}`}</p>
                    </div>
                    <div className="flex flex-col items-center w-full">
                      <p className="font-semibold font-[Inter] text-xs mb-[17px] -tracking-[.3px] text-secondry1">
                        Account Manager
                      </p>
                      <p className="font-normal text-primary font-[Inter] text-xs">
                        {item?.account_managers ?? "N/A"}
                      </p>
                    </div>
                    <div className="flex flex-col items-center w-full">
                      <Link
                        className="w-[90px] h-full text-center text-[10px] rounded-[10px] bg-black font-medium text-white px-2 py-2"
                        to={`/admin/client/${item.id}`}
                      >
                        Client Details
                      </Link>
                    </div>
                  </div>
                </div>
                // <div
                //   key={item.id}
                //   className={`bg-white mb-2 px-[20px] rounded-[10px] relative flex py-4 items-center justify-between ${
                //     index !== showData.length - 1 &&
                //     "border-b-[1px] border-[#d9d9d9]"
                //   }`}
                // >
                //   <div className="text-left min-w-[170px] pr-2">
                //     <div className="mt-1 flex items-center">
                //       <Avatar
                //         src={item.avatar}
                //         className="bg-[#7f8182]"
                //         size={40}
                //       >
                //         {!item.avatar && getPlaceHolder(item.name)}
                //       </Avatar>
                //       <div className="ms-2">
                //         <p className="text-secondry1 text-xs font-[Inter] -tracking-[.36px]">
                //           {item.company}
                //         </p>
                //         <p className="text-[#a3a3a3] text-xs font-[Inter] -tracking-[.36px]">
                //           {item.name}
                //         </p>
                //         <p className="font-[Inter] -tracking-[.3px] text-xs text-[#a3a3a3]">{`ID: ${item.email}`}</p>
                //       </div>
                //     </div>
                //   </div>
                //   <div className="w-[1px] h-[25px] bg-[#a4a4a4]" />
                //   <div>
                //     <p className="font-[Inter] text-[#a3a3a3] text-xs font-medium -tracking-[.36px]">
                //       Joined Date
                //     </p>
                //     <p className="font-[Inter] text-secondry1 text-xs font-medium -tracking-[.36px] mt-4">
                //       {moment(Number(item.create_time)).format("DD/MM/YYYY")}
                //     </p>
                //   </div>
                //   <div>
                //     <p className="font-[Inter] text-[#a3a3a3] text-xs font-medium -tracking-[.36px]">
                //       Users
                //     </p>
                //     <p className="font-[Inter] text-secondry1 text-xs font-medium -tracking-[.36px] mt-4">
                //       {1}
                //     </p>
                //   </div>
                //   <div>
                //     <p className="font-[Inter] text-[#a3a3a3] text-xs font-medium -tracking-[.36px]">
                //       Total Campaigns
                //     </p>
                //     <p className="font-[Inter] text-secondry1 text-xs font-medium -tracking-[.36px] mt-4">
                //       {item.campaign_count}
                //     </p>
                //   </div>
                //   <div>
                //     <p className="font-[Inter] text-[#a3a3a3] text-xs font-medium -tracking-[.36px]">
                //       Total Spend
                //     </p>
                //     <p className="font-[Inter] text-[#43474a] text-xs font-medium -tracking-[.36px] mt-4">{`$${item.price}`}</p>
                //   </div>
                //   <div>
                //     <p className="font-[Inter] text-[#a3a3a3] text-xs font-medium -tracking-[.36px]">
                //       Account Manager
                //     </p>
                //     <p className="font-[Inter] text-secondry1 text-xs font-medium -tracking-[.36px] mt-4">
                //       {adminName}
                //     </p>
                //   </div>
                //   <div className="items-center flex justify-center">
                //     {/* <Dropdown
                //       menu={{
                //         items: [{
                //           key: '1',
                //           label: <Link className='w-full h-full text-xs' to={`/admin/client/${item.id}`}>Details</Link>
                //         }, {
                //           key: '2',
                //           label: <span className='w-full h-full text-xs'>{item.state === 'active' ? '`Deactiv`ate User' : 'Activate User'}</span>,
                //           onClick: () => handleChangeState(item.id, item.state),
                //         }]
                //       }}
                //       placement="bottomRight"
                //     >
                //       <button className='px-1 py-1'>
                //         <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                //           <path d="M258.461-440q-16.5 0-28.25-11.75T218.461-480q0-16.5 11.75-28.25t28.25-11.75q16.501 0 28.251 11.75t11.75 28.25q0 16.5-11.75 28.25T258.461-440ZM480-440q-16.5 0-28.25-11.75T440-480q0-16.5 11.75-28.25T480-520q16.5 0 28.25 11.75T520-480q0 16.5-11.75 28.25T480-440Zm221.539 0q-16.501 0-28.251-11.75T661.538-480q0-16.5 11.75-28.25T701.539-520q16.5 0 28.25 11.75t11.75 28.25q0 16.5-11.75 28.25T701.539-440Z" />
                //         </svg>
                //       </button>
                //     </Dropdown> */}
                //     <Link
                //       className="w-full h-full text-xs rounded-[10px] bg-black font-medium text-white px-4 py-2"
                //       to={`/admin/client/${item.id}`}
                //     >
                //       Client Details
                //     </Link>
                //   </div>
                //   {/* <span className={`absolute rounded-[10px] px-3 py-1 right-1 bg-black bottom-1 text-xs font-[Inter] ${item.state === 'inactive' ? 'text-[red]' : 'text-main'}`}>{item.state}</span> */}
                // </div>
              ))}
          </div>
        </div>
      </div>
      <AssignClient
        show={showAssignModal}
        name={accountManager?.name}
        userId={accountManagerId ?? ""}
        afterAdd={loadClients}
        onClose={(show: boolean) => setShowAssignModal(show)}
        assignedClients={data}
      />
    </div>
  );
};

export default AdminDashboardClient;
