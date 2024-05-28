import React, { useCallback, useEffect, useRef, useState } from "react";
import { Badge, Menu, Space } from "antd";
import { ReactComponent as FlagIcon } from "../../assets/icon/flagIcon.svg";
import { ReactComponent as DownloadIcon } from "../../assets/icon/download_campaign.svg";
import CreatorAPIInstance from "../../api/creatorAPIInstance";
import { useSelector } from "react-redux";
import { selectAuth } from "../../store/authSlice";
// @ts-ignore
import html2pdf from "html2pdf.js";
import { capitalize } from "lodash";
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
        const [item] = data;
        const files = item?.additional_files?.split(",");
        const htmlContent = `
          <html>
          <head>
            <title>abc</title>
            <style>
              body {
                font-family: Arial, sans-serif;
              }
              h1 {
                color: #000000;
              }
              p {
                color: #000000;
                line-height: 1;
                padding-bottom: 15px;
              }
            </style>
          </head>
          <body style="height: 100%">
          <div style="padding: 20px; text-align: center;">
            <div style="background: #fffdfd; padding: 20px; border-radius: 10px; text-align: left;display: flex; flex-direction: column; gap: 5px">
              <div style="text-align:left; width:'100%';padding-top: 10px">
                <span><b>Campaign Name: </b></span> 
                <span>${item.name}</span>
              </div>
              <div style="text-align:left; width:'100%';padding-top: 10px">
                <span><b>Headline: </b></span> 
                <span>${item.headline}</span>
              </div>
              <div style="text-align:left; width:'100%';padding-top: 5px">
              <span><b>Body: </b></span>
                <span>${item.body}</span>
              </div>
              <div style="text-align:left; width:'100%';padding-top: 5px">
              <span><b>CTA Text: </b></span>
                <span>${item.cta}</span>
              </div>
              <div style="text-align:left; width:'100%';padding-top: 5px">
              <span><b>Landing Page Preview: </b></span>
                <span>${item.pageurl}</span>
              </div>
              <div style="text-align:left; width:'100%';padding-top: 5px">
              <h1><b>Tracking Link</b></h1> 
                <a href="${item.trackinglink}">${item.trackinglink}</a>
              </div>
              <div style="text-align:left; width:'100%';padding-top: 5px">
              <span><b>Target Audience: </b></span>
                <span>
                ${capitalize(item.demographic)}
                </span>
              </div>
              <div style="text-align:left; width:'100%';padding-top: 5px">
              <span><b>Target Industrie(s): </b></span>
                <span>
                  ${(item.audience || []).join(",")}
                </span>
              </div>
              <div style="text-align:left; width:'100%';padding-top: 5px">
              <span><b>Target Demographic(s): </b></span>
                <span>
                ${(item.position || []).join(",")}
                </span>
              </div>
              <div style="text-align:left; width:'100%';padding-top: 5px">
              <span><b>Target Region(s): </b></span>
                <span>
                ${(item.region || []).join(",")}
                </span>
              </div>
              <div style="text-align:left; width:'100%';padding-top: 5px">
              <span><b>Hero Image: </b></span>
                <span>
                ${item.image}
                </span>
              </div>
              <div style="text-align:left; width:'100%';padding-top: 5px">
              <span><b>Additional Assetts: </b></span>
                <span>
                ${item?.additional_files}
                </span>
              </div>
            </div>
          </div>
          </body>
        </html>
        `;

        var opt = {
          filename: `${
            company ? `${company}'s_` : ""
          }campaign_${campaignId}.pdf`,
        };
        // Convert HTML content to PDF
        html2pdf().from(htmlContent).set(opt).save();
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
