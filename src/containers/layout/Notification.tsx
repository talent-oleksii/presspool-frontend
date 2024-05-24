import React, { useCallback, useEffect, useRef, useState } from "react";
import { Badge, Menu, Space } from "antd";
import { ReactComponent as FlagIcon } from "../../assets/icon/flagIcon.svg";
import { ReactComponent as DownloadIcon } from "../../assets/icon/download_campaign.svg";
import CreatorAPIInstance from "../../api/creatorAPIInstance";
import { useSelector } from "react-redux";
import { selectAuth } from "../../store/authSlice";
import { downloadCSVFile, jsonToCSV } from "../../utils/commonUtils";
const Notification: React.FC = () => {
  const { creatorData } = useSelector(selectAuth);
  const { id } = creatorData;
  const [open, setOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Array<any>>([]);
  const ref = useRef<any>(null);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = () => {
    setOpen((prev) => !prev);
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

  const loadNotifications = useCallback(async () => {
    const { data } = await CreatorAPIInstance.get("getNotifications", {
      params: { creatorId: id },
    });
    setNotifications(data);
  }, [id]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleDownload = async (campaignId: number, company: string) => {
    try {
      const { data } = await CreatorAPIInstance.get("getCampaignDetail", {
        params: { id: campaignId },
      });
      if (Array.isArray(data) && data.length > 0) {
        const csv = jsonToCSV(data);
        downloadCSVFile(
          csv,
          `${company ? `${company}'s_` : ""}campaign_${campaignId}.csv`
        );
      } else {
        console.error("Unexpected data format");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div ref={ref} className="flex items-center relative">
      <button
        onClick={handleOpenChange}
        className="flex font-[Inter] rounded-[10px] h-7 px-3 py-[3px] gap-1 font-medium text-primary text-xs whitespace-nowrap items-center border border-solid border-main"
      >
        <span role="img" aria-label="support">
          <FlagIcon />
        </span>
        <span className="font-[Inter] text-xs">Notifications</span>
        <Badge
          count={notifications.length}
          showZero
          color="#7FFBAE"
          styles={{ indicator: { color: "#000" } }}
          size="default"
        />
      </button>
      {open && (
        <Menu className="min-w-[300px] absolute top-[calc(100%+8px)] right-[0] !shadow-md rounded-[10px] text-left z-[9]">
          {notifications.map((item, idx) => (
            <Menu.Item
              key={idx}
              onClick={() => handleDownload(item.campaign_id, item.company)}
              className="py-1 !h-auto !text-xs"
            >
              <Space size="large">
                <span>Download {item.company}’s campaign details</span>
                <DownloadIcon />
              </Space>
            </Menu.Item>
          ))}
        </Menu>
      )}
    </div>
  );
};

export default Notification;
