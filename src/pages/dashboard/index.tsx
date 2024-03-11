import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { selectAuth } from "../../store/authSlice";
import { selectData } from "../../store/dataSlice";
import CampaignOverView from "./CampaignOverView";
import { MAIN_ROUTE_FADE_UP_ANIMATION_VARIANTS } from "../../utils/TransitionConstants";
import CampaignFilter from "../../containers/dashboard/CampaignFilter";
import Loading from "../../components/Loading";

const Dashboard: FC = () => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const { name } = useSelector(selectAuth);
  const { isCampaignLoading } = useSelector(selectData);
  useEffect(() => {
    setIsFirstLoad(false);
  }, []);
  return (
    <div className="text-left relative pt-1.5 h-full flex flex-col">
      <h1 className="font-semibold font-[Inter] text-[18px] md:text-xl -tracking-[.6px]">
        Welcome {name} 🤝
      </h1>
      <p className="text-[12px] md:text-sm xsm:mt-1.5 font-normal text-secondry1">
        Here’s a snapshot of your account, all in one place
      </p>

      <div className="flex md:hidden w-full border-[1px] focus:ring-0 border-main mt-4 rounded-[10px] p-2 text-sm font-normal bg-white leading-3.5">
        Open Presspool.ai on a large screen to launch and track referral
        campaigns
      </div>

      <motion.div
        className="flex xsm:hidden"
        initial="hidden"
        animate={`${isFirstLoad && isCampaignLoading ? "" : "show"}`}
        variants={MAIN_ROUTE_FADE_UP_ANIMATION_VARIANTS()}
      >
        <div className="flex-1">
          <CampaignFilter />
          {!isCampaignLoading && <CampaignOverView />}
          {/* ) : id === "news" ? (
            <NewsLetterDetail />
          ) : (
            <CampaignDetail id={id} />
          )} */}
        </div>
      </motion.div>
      {isCampaignLoading && (
        <div className="flex-auto relative">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
