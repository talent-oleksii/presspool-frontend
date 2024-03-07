import React from "react";
import { Tooltip } from "antd";

const data01: Array<any> = [];

const CampaignNewsletter: React.FC = () => {
  return (
    <div className="col-span-1 p-5 flex flex-col items-center bg-white rounded-[10px] shadow-md">
      <p className="font-[Inter] text-black mb-4 text-left font-semibold w-full text-base">
        Newsletters (by the numbers)
      </p>
      <table className="w-full">
        <thead>
          <tr>
            <td className="text-[10px] font-[Inter]">Name</td>
            <td className="text-[10px] font-[Inter]">Impressions</td>
            <td className="text-[10px] font-[Inter]">Clicks</td>
            <td className="text-[10px] font-[Inter]">Total Spend</td>
            <td className="text-[10px] font-[Inter]">
              <span className="flex items-center">
                CTR
                <Tooltip
                  title="The percentage of clicks from the total impressions."
                  color="#EDECF2"
                  getPopupContainer={() =>
                    document.getElementById("ctr-tooltip") as HTMLElement
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    className="h-[20px] w-[20px] 2xl:w-[24px] 2xl:h-[24px] ms-1"
                  >
                    <path d="M460-300h40v-220h-40v220Zm20-276.923q10.462 0 17.539-7.077 7.076-7.077 7.076-17.539 0-10.461-7.076-17.538-7.077-7.077-17.539-7.077-10.462 0-17.539 7.077-7.076 7.077-7.076 17.538 0 10.462 7.076 17.539 7.077 7.077 17.539 7.077ZM480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                  </svg>
                </Tooltip>
                <div id="ctr-tooltip"></div>
              </span>
            </td>
            <td className="text-[10px] font-[Inter]">
              <span className="flex items-center">
                % of Total Traffic
                <Tooltip
                  title="The percentage of the individual newsletter’s impressions from  the total number of impressions."
                  color="#EDECF2"
                  getPopupContainer={() =>
                    document.getElementById("total-trafic") as HTMLElement
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    className="h-[20px] w-[20px] 2xl:w-[24px] 2xl:h-[24px] ms-1"
                  >
                    <path d="M460-300h40v-220h-40v220Zm20-276.923q10.462 0 17.539-7.077 7.076-7.077 7.076-17.539 0-10.461-7.076-17.538-7.077-7.077-17.539-7.077-10.462 0-17.539 7.077-7.076 7.077-7.076 17.538 0 10.462 7.076 17.539 7.077 7.077 17.539 7.077ZM480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                  </svg>
                </Tooltip>
                <div id="total-trafic"></div>
              </span>
            </td>
            <td className="text-[10px] font-[Inter]">Feedback</td>
          </tr>
        </thead>
        <tbody>
          {data01.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>15,000</td>
              <td>250</td>
              <td>1.67%</td>
              <td className="flex">
                <button className="text-[10px]">👍</button>
                <button className="text-[10px]">👎</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="font-[Inter] mt-4 text-[10px]">
        No data is available yet. Please create and launch your first campaign
      </p>
    </div>
  );
};

export default CampaignNewsletter;
