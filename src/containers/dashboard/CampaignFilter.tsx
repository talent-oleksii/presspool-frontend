import { FC, useEffect, useRef, useState } from "react";
import { Menu, MenuProps, Space } from "antd";
import { CaretDownOutlined, CloudDownloadOutlined } from "@ant-design/icons";
import APIInstance from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "../../store/authSlice";
import { selectData, setSelectedDateFilter } from "../../store/dataSlice";
import ByCampaignButton from "./ByCampaignButton";
import { useNavigate, useParams } from "react-router";
import moment from "moment";
import { GetItem, MenuItem } from "../shared/GetItem";
import { capitalize } from "lodash";
import { IDateRange } from "../../interfaces/common.interface";
import CreatorAPIInstance from "../../api/creatorAPIInstance";

interface ICampaignFilter {
  loadCampaignData: (
    dateRange: IDateRange,
    email: string,
    selectedCampaigns: string[],
  ) => void;
}

const CampaignFilter: FC<ICampaignFilter> = ({ loadCampaignData }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [completionDate, setCompletionDate] = useState<string | null>(null);
  const [campStats, setCampStats] = useState<any>({});
  const dispatch = useDispatch();
  const { email, isCreatorAuthenticated, creatorData } =
    useSelector(selectAuth);
  const identifier = isCreatorAuthenticated ? creatorData.id : email;
  console.log(identifier);
  const [selectedCampaigns, setSelectedCampaigns] = useState<Array<string>>(
    id !== "all" ? (id ? id?.split(",") : []) : []
  );
  const [dateRange, setDateRange] = useState<IDateRange>({
    startDate: null,
    endDate: null,
  });

  const { campaign, selectedDateFilter } = useSelector(selectData);
  const [campaignList, setCampaignList] = useState<Array<any>>([]);
  const ref = useRef<any>(null);

  useEffect(() => {
    if (isCreatorAuthenticated) {
      CreatorAPIInstance.get("getCampaignList", {
        params: { creatorId: identifier },
      }).then((data) => {
        setCampaignList(data.data);
      });
    } else {
      APIInstance.get("/data/campaign_list", {
        params: { email: identifier },
      }).then((data) => {
        setCampaignList(data.data);
      });
    }
  }, [identifier, isCreatorAuthenticated]);

  const handleOpenChange = () => {
    setOpen(true);
  };

  const hide = () => {
    setOpen(false);
  };

  const items: MenuItem[] = [
    GetItem("All Time", "All Time"),
    GetItem("Last 24 Hours", "Last 24 Hours"),
    GetItem("Last 7 Days", "Last 7 Days"),
    GetItem("Last 4 Weeks", "Last 4 Weeks"),
    GetItem("Last 12 Months", "Last 12 Months"),
    GetItem("Month to Date", "Month to Date"),
    GetItem("Quarter to Date", "Quarter to Date"),
    GetItem("Year to Date", "Year to Date"),
  ];

  const onClick: MenuProps["onClick"] = (e) => {
    setDateRange(getDateRange(e.key));
    dispatch(setSelectedDateFilter(e.key));
    hide();
  };

  const getDateRange = (item: string): IDateRange => {
    const today: Date = new Date();
    let startDate: Date | null = null,
      endDate: Date | null = null;

    switch (item) {
      case "Last 24 Hours":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 1);
        endDate = today;
        break;
      case "Last 7 Days":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        endDate = today;
        break;
      case "Last 4 Weeks":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 28);
        endDate = today;
        break;
      case "Last 12 Months":
        startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 1);
        endDate = today;
        break;
      case "Month to Date":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = today;
        break;
      case "Quarter to Date":
        startDate = new Date(
          today.getFullYear(),
          Math.floor(today.getMonth() / 3) * 3,
          1
        );
        endDate = today;
        break;
      case "Year to Date":
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = today;
        break;
      default:
        startDate = null;
        endDate = null;
        break;
    }

    return { startDate, endDate };
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

  useEffect(() => {
    loadCampaignData(dateRange, identifier, selectedCampaigns);
  }, [
    dateRange,
    identifier,
    loadCampaignData,
    selectedCampaigns,
    selectedDateFilter,
    isCreatorAuthenticated,
  ]);

  const handleDownloadCSV = () => {
    var csv =
      "Date, URL, DEMOGRAPHIC, HEADLINE, BODY, CTA, CLICK_COUNT, PAGE_URL\n";

    //merge the data with CSV
    campaign.forEach(function (row) {
      csv += moment(Number(row.create_time)).format("mm-dd-yyyy") + ",";
      csv += row.url + ",";
      csv += row.demographic + ",";
      csv += `"${row.headline}",`;
      csv += `"${row.body}",`;
      csv += `"${row.cta}",`;
      csv += `"${row.click_count}",`;
      csv += `"${row.page_url}"`;

      csv += "\n";
    });

    //display the created CSV data on the web browser

    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";

    //provide the name for the CSV file to be downloaded
    hiddenElement.download = "Reports.csv";
    hiddenElement.click();
  };

  const handleOverviewClick = () => {
    setCompletionDate(null);
    setSelectedCampaigns([]);
    navigate(isCreatorAuthenticated ? `/publishers/reporting/all` : "/campaign/all");
  };

  useEffect(() => {
    if (selectedCampaigns.length > 0) {
      APIInstance.get("/data/getCampStatByCampId", {
        params: {
          campaignId: selectedCampaigns[0],
        },
      }).then(({ data }) => {
        setCampStats(data);
        const { totalSpend, totalBudget, completeDate } = data;
        if (totalSpend >= totalBudget) {
          const date = moment(Number(completeDate));
          const formattedDate = date.format("MM/DD/YYYY");
          setCompletionDate(formattedDate);
        } else {
          setCompletionDate(null);
        }
      });
    }
  }, [selectedCampaigns]);

  return (
    <div className="flex justify-between items-center mt-4">
      <div>
        <button
          className={`inline-flex items-center justify-center text-primary text-[14px] font-semibold px-4 py-[10px] font-[Inter] rounded-[10px] sm:w-[170px] me-2 ${
            id === "all"
              ? "bg-white border border-solid border-main shadow-md"
              : "bg-transparent ring-none"
          }`}
          onClick={handleOverviewClick}
        >
          Overview
        </button>
        <ByCampaignButton
          id={id}
          items={campaignList}
          setSelectedCampaigns={setSelectedCampaigns}
          selectedCampaigns={selectedCampaigns}
          isCreator={isCreatorAuthenticated}
        />
        {selectedCampaigns.length > 0 ? (
          completionDate ? (
            <button
              className={`ms-2 inline-flex items-center justify-center text-primary px-4 py-[2px] font-[Inter] rounded-[10px] sm:w-[170px] me-2 bg-white border border-solid border-main shadow-md`}
            >
              <span className="text-[12px] font-normal">Completed: </span>
              <span className="text-[12px] font-light">{completionDate}</span>
            </button>
          ) : (
            <p className="ms-2 font-medium font-[Inter] inline-flex">
              <span
                className={`rounded-[10px] text-xs px-[12px] mt-[25px] py-[4px] font-normal ${
                  campStats.state === "draft"
                    ? "bg-[#dbdbdb] text-primary"
                    : campStats.state === "paused"
                    ? "bg-[#fdbdbd]"
                    : "bg-main text-primary"
                }`}
              >
                {capitalize(campStats.state)}
              </span>
            </p>
          )
        ) : null}
      </div>
      <div className="flex gap-5">
        <div
          ref={ref}
          className="group inline-flex flex-col min-w-[100px] relative"
        >
          <button
            onMouseEnter={handleOpenChange}
            className={`font-[Inter] text-[14px] font-semibold items-center justify-center text-primary justify-between flex px-4 py-[10px] gap-4 rounded-[10px] bg-white ring-1 ring-main shadow-md`}
          >
            {selectedDateFilter}
            <CaretDownOutlined />
          </button>
          {open && (
            <Menu
              selectedKeys={[selectedDateFilter]}
              onClick={onClick}
              items={items}
              className="w-[300px] absolute top-[calc(100%+5px)] !shadow-md rounded-[10px] text-left z-[9]"
            />
          )}
        </div>
        <button
          className="inline-flex items-center justify-center text-primary text-[14px] font-semibold px-4 py-[10px] font-[Inter] rounded-[10px] me-2 bg-white border border-solid border-main shadow-md disabled:text-[#a3a3a3] disabled:border-none"
          onClick={handleDownloadCSV}
          disabled
        >
          <Space>
            <CloudDownloadOutlined style={{ fontSize: "18px" }} />
            Download Report
          </Space>
        </button>
      </div>
    </div>
  );
};

export default CampaignFilter;
