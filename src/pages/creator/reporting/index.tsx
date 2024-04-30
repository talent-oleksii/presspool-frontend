import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectData,
  setCampaign,
  setCampaignLoading,
  setClicked,
  setNewsletter,
  setPrevRangeData,
} from "../../../store/dataSlice";
import { motion } from "framer-motion";
import { MAIN_ROUTE_FADE_UP_ANIMATION_VARIANTS } from "../../../utils/TransitionConstants";
import CampaignFilter from "../../../containers/dashboard/CampaignFilter";
import CampaignOverView from "../../dashboard/CampaignOverView";
import Loading from "../../../components/Loading";
import { IDateRange } from "../../../interfaces/common.interface";
import CreatorAPIInstance from "../../../api/creatorAPIInstance";

const CreatorReporting = () => {
  const dispatch = useDispatch();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const { isCampaignLoading } = useSelector(selectData);
  useEffect(() => {
    setIsFirstLoad(false);
  }, []);

  const loadCampaignData = useCallback(
    (
      dateRange: IDateRange,
      identifier: string,
      selectedCampaigns: string[]
    ) => {
      dispatch(setCampaignLoading(true));
      Promise.all([
        CreatorAPIInstance.get("getCampaign", {
          params: {
            creatorId: identifier,
            ...(dateRange.endDate &&
              dateRange.startDate && {
                from: dateRange.startDate,
                to: dateRange.endDate,
              }),
            ...(selectedCampaigns.length > 0 && {
              campaignIds: selectedCampaigns,
            }),
          },
        }),
        CreatorAPIInstance.get("getNewsletter", {
          params: {
            creatorId: identifier,
            ...(dateRange.endDate &&
              dateRange.startDate && {
                from: dateRange.startDate,
                to: dateRange.endDate,
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
          dispatch(setPrevRangeData(res[0].data.prevData));
          dispatch(setNewsletter(res[1].data));
        })
        .finally(() => {
          dispatch(setCampaignLoading(false));
        });
    },
    [dispatch]
  );

  return (
    <div className="text-left relative pt-1.5 h-full flex flex-col">
      <h1 className="font-semibold font-[Inter] text-[18px] md:text-xl -tracking-[.6px]">
        Reporting
      </h1>
      <p className="text-[12px] md:text-sm xsm:mt-1.5 font-normal text-secondry1">
        Here’s a snapshot of your campaigns, all in one place
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
          <CampaignFilter loadCampaignData={loadCampaignData} />
          {!isCampaignLoading && <CampaignOverView />}
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

export default CreatorReporting;
