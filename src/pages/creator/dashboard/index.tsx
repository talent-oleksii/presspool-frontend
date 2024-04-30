import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MAIN_ROUTE_FADE_UP_ANIMATION_VARIANTS } from "../../../utils/TransitionConstants";
import NewCampaignRequests from "../../../containers/creator/dashboard/NewCampaignRequests";
import ReadyToPublishCampaigns from "../../../containers/creator/dashboard/ReadyToPublishCampaigns";
import ActiveCampaigns from "../../../containers/creator/dashboard/ActiveCampaigns";
import CompletedCampaigns from "../../../containers/creator/dashboard/CompletedCampaigns";

const CreatorDashboard = () => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  useEffect(() => {
    setIsFirstLoad(false);
  }, []);
  const [selectedTab, setSelectedTab] = useState("readyToPublish");

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  const renderSection = () => {
    switch (selectedTab) {
      case "new":
        return <NewCampaignRequests />;
      case "readyToPublish":
        return <ReadyToPublishCampaigns />;
      case "active":
        return <ActiveCampaigns />;
      case "completed":
        return <CompletedCampaigns />;
      default:
        <></>;
        break;
    }
  };

  return (
    <div className="text-left relative pt-1.5 h-full flex flex-col">
      <h1 className="font-semibold font-[Inter] text-[18px] md:text-xl -tracking-[.6px]">
        All Campaigns
      </h1>
      <p className="text-[12px] md:text-sm xsm:mt-1.5 font-normal text-secondry1">
        Your one-stop-shop to manage your campaigns from start to finish
      </p>

      <div className="flex md:hidden w-full border-[1px] focus:ring-0 border-main mt-4 rounded-[10px] p-2 text-sm font-normal bg-white leading-3.5">
        Open Presspool.ai on a large screen to launch and track referral
        campaigns
      </div>

      <motion.div
        className="flex xsm:hidden"
        initial="hidden"
        animate={`${isFirstLoad ? "" : "show"}`}
        variants={MAIN_ROUTE_FADE_UP_ANIMATION_VARIANTS()}
      >
        <div className="flex-1">
          <div className="flex justify-between items-center mt-4">
            <div>
              <button
                className={`inline-flex items-center justify-center text-primary text-[14px] font-semibold px-4 py-[10px] font-[Inter] rounded-[10px] sm:w-[170px] me-2 ${
                  selectedTab === "new"
                    ? "bg-white border border-solid border-main shadow-md"
                    : "bg-transparent ring-none"
                }`}
                onClick={() => handleTabClick("new")}
              >
                New Requests
              </button>
              <button
                className={`inline-flex items-center justify-center text-primary text-[14px] font-semibold px-4 py-[10px] font-[Inter] rounded-[10px] sm:w-[170px] me-2 ${
                  selectedTab === "readyToPublish"
                    ? "bg-white border border-solid border-main shadow-md"
                    : "bg-transparent ring-none"
                }`}
                onClick={() => handleTabClick("readyToPublish")}
              >
                Ready To Publish
              </button>
              <button
                className={`inline-flex items-center justify-center text-primary text-[14px] font-semibold px-4 py-[10px] font-[Inter] rounded-[10px] sm:w-[170px] me-2 ${
                  selectedTab === "active"
                    ? "bg-white border border-solid border-main shadow-md"
                    : "bg-transparent ring-none"
                }`}
                onClick={() => handleTabClick("active")}
              >
                Active Campaigns
              </button>
              <button
                className={`inline-flex items-center justify-center text-primary text-[14px] font-semibold px-4 py-[10px] font-[Inter] rounded-[10px] sm:w-[170px] me-2 ${
                  selectedTab === "completed"
                    ? "bg-white border border-solid border-main shadow-md"
                    : "bg-transparent ring-none"
                }`}
                onClick={() => handleTabClick("completed")}
              >
                Completed
              </button>
            </div>
          </div>
          {renderSection()}
        </div>
      </motion.div>
    </div>
  );
};

export default CreatorDashboard;
