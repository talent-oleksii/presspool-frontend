import { Avatar, Menu, MenuProps } from "antd";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { GetItem, MenuItem } from "../../containers/shared/GetItem";
import { getPlaceHolder } from "../../utils/commonUtils";
import ReviewPublicationRequest from "./models/ReviewPublicationRequest";
import AdminAPIInstance from "../../api/adminApi";
import RejectPublicationFeedback from "./models/RejectPublicationFeedback";
import Loading from "../../components/Loading";
import moment from "moment";

const Publishers: FC = () => {
  const [loading, setLoading] = useState(false);
  const [showReviewModel, setShowReviewModel] = useState(false);
  const [showFeedbackModel, setShowFeedbackModel] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<any>({});
  const [publications, setPublications] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [sort, setSort] = useState<string>("All Publications");
  const [searchStr, setSearchStr] = useState("");
  const ref = useRef<any>(null);
  const handleOpenChange = () => {
    setOpen(true);
  };

  const hide = () => {
    setOpen(false);
  };

  const items: MenuItem[] = [
    GetItem("All Publications", "All Publications"),
    GetItem("New Applications", "New Applications"),
    GetItem("Approved", "Approved"),
    GetItem("Rejected", "Rejected"),
  ];

  const onClick: MenuProps["onClick"] = (e) => {
    setSearchStr("");
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

  const handleReviewClick = (item: any) => {
    setSelectedPublication(item);
    setShowReviewModel(true);
  };

  const loadPublications = useCallback(async () => {
    try {
      let status = "";
      if (sort === "New Applications") {
        status = "PENDING";
      } else if (sort !== "All Publications") {
        status = sort.toUpperCase();
      }
      setLoading(true);
      const { data } = await AdminAPIInstance.get("/getPublications", {
        params: { state: status },
      });
      setPublications(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [sort]);

  useEffect(() => {
    loadPublications();
  }, [loadPublications]);

  return (
    <div className="w-full flex">
      {loading && <Loading />}
      <div className="text-left flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-[Inter] font-semibold -tracking-[.6px] text-[20px]">
              Publishers
            </h2>
            <p className="mt-1 text-secondry1 font-[Inter] text-xs">
              Review and track Publishers
            </p>
          </div>
        </div>
        <div className="flex items-center w-full gap-5 mt-[24px]">
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
              placeholder="Type here to search by Publisher name"
              value={searchStr}
              onChange={(e) => setSearchStr(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-3 h-full">
          <div className={`rounded-[10px] grid grid-cols-3 gap-4`}>
            {(searchStr
              ? publications.filter((x) =>
                  x.newsletter.toLowerCase().includes(searchStr.toLowerCase())
                )
              : publications
            ).map((item, index) => (
              <div
                key={index}
                className={`card rounded-[10px] bg-white min-h-[183px] p-3 ${
                  item.state === "APPROVED"
                    ? "!shadow-green"
                    : item.state === "REJECTED"
                    ? "!shadow-red"
                    : ""
                }`}
              >
                <div className="flex flex-row gap-2 shrink-0 justify-between">
                  <div className="flex items-center">
                    <Avatar
                      src={item?.team_avatar}
                      className={`border border-solid border-secondry3 ${
                        item?.team_avatar ? "" : "bg-[#7f8182]"
                      }`}
                      size={66}
                    >
                      {getPlaceHolder(item?.newsletter)}
                    </Avatar>
                    <div className="ms-2">
                      <p className="text-primary text-[15px] font-[Inter] -tracking-[.36px]">
                        {item?.newsletter}
                      </p>
                      <p className="text-secondry1 text-[10px] font-light font-[Inter] -tracking-[.36px]">
                        {item?.website_url}
                      </p>
                      <p className="text-secondry1 text-[10px] font-light font-[Inter] -tracking-[.36px]">
                        {item?.email}
                      </p>
                    </div>
                  </div>
                  <p className="font-normal text-[10px] text-secondry1">
                    Applied:{" "}
                    {moment(Number(item.create_time)).format("MM/DD/yyyy")}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 my-4">
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
                <div className="w-full flex justify-center">
                  <button
                    onClick={() => handleReviewClick(item)}
                    className="font-[Inter] w-3/2 text-[white] bg-black rounded-[6px] px-[20px] py-2 me-2 text-xs 2xl:text-xs"
                  >
                    More Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ReviewPublicationRequest
        show={showReviewModel}
        onClose={() => setShowReviewModel(false)}
        item={selectedPublication}
        setShowFeedbackModel={setShowFeedbackModel}
        loadPublications={loadPublications}
      />
      <RejectPublicationFeedback
        show={showFeedbackModel}
        onClose={() => setShowFeedbackModel(false)}
        item={selectedPublication}
        loadPublications={loadPublications}
      />
    </div>
  );
};

export default Publishers;
