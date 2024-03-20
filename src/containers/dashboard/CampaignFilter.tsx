import { FC, useEffect, useRef, useState } from "react";
import { Menu, MenuProps, Space } from "antd";
import { CaretDownOutlined, CloudDownloadOutlined } from "@ant-design/icons";
import APIInstance from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "../../store/authSlice";
import {
  selectData,
  setCampaign,
  setCampaignLoading,
  setClicked,
  setNewsletter,
  setSelectedDateFilter,
} from "../../store/dataSlice";
import { getUnixTimestamp } from "../../utils/DateUtils";
import ByCampaignButton from "./ByCampaignButton";
import { useNavigate, useParams } from "react-router";
import moment from "moment";
import { GetItem, MenuItem } from "../shared/GetItem";

interface IDateRange {
  startDate: Date | null;
  endDate: Date | null;
}

const CampaignFilter: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { email } = useSelector(selectAuth);
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
    setLoading(true);
    APIInstance.get("/data/campaign_list", { params: { email } })
      .then((data) => {
        setCampaignList(data.data);
      })
      .finally(() => setLoading(false));
  }, [email]);

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
    dispatch(setCampaignLoading(true));
    Promise.all([
      APIInstance.get("data/campaign", {
        params: {
          email,
          ...(dateRange.endDate &&
            dateRange.startDate && {
              from: getUnixTimestamp(dateRange.startDate),
              to: getUnixTimestamp(dateRange.endDate),
            }),
          ...(selectedCampaigns.length > 0 && {
            campaignIds: selectedCampaigns,
          }),
        },
      }),
      APIInstance.get("/data/newsletter", {
        params: {
          email,
          ...(dateRange.endDate &&
            dateRange.startDate && {
              from: getUnixTimestamp(dateRange.startDate),
              to: getUnixTimestamp(dateRange.endDate),
            }),
          ...(selectedCampaigns.length > 0 && {
            campaignIds: selectedCampaigns,
          }),
        },
      }),
    ])
      .then((res: Array<any>) => {
        dispatch(setClicked(res[0].data.clicked));
        dispatch(setCampaign({ campaign: res[0].data.data }));
        dispatch(setNewsletter(res[1].data));
      })
      .finally(() => {
        dispatch(setCampaignLoading(false));
      });
    // APIInstance.get("data/campaign", {
    //   params: {
    //     email,
    //     ...(dateRange.endDate &&
    //       dateRange.startDate && {
    //         from: getUnixTimestamp(dateRange.startDate),
    //         to: getUnixTimestamp(dateRange.endDate),
    //       }),
    //     ...(selectedCampaigns.length > 0 && {
    //       campaignIds: selectedCampaigns,
    //     }),
    //   },
    // })
    //   .then((res) => {
    //     dispatch(setClicked(res.data.clicked));
    //     dispatch(setCampaign({ campaign: res.data.data }));
    //   })
    //   .finally(() => {
    //     dispatch(setCampaignLoading(false));
    //   });
  }, [dateRange, dispatch, email, selectedCampaigns, selectedDateFilter]);

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
    setSelectedCampaigns([]);
    navigate(`/campaign/all`);
  };

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
        />
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
