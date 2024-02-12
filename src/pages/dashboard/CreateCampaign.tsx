import { FC, useState } from "react";
import { motion } from "framer-motion";

import Loading from "../../components/Loading";
import { FADE_UP_ANIMATION_VARIANTS } from "../../utils/TransitionConstants";
import CampaignDetails from "../../containers/dashboard/CreateCampaign/CampaignDetails";
import CampaignBudget from "../../containers/dashboard/CreateCampaign/CampaignBudget";
import CampaignContent from "../../containers/dashboard/CreateCampaign/CampaignContent";
import CampaignReview from "../../containers/dashboard/CreateCampaign/CampaignReview";
import FormProviderWrapper from "../../components/FormProviderWrapper";
import { useUpsertCampaign } from "../../hooks/forms/useUpsertCampaign";
import { FieldValues } from "react-hook-form";
import { useParams } from "react-router-dom";
import { selectAuth } from "../../store/authSlice";
import { useSelector } from "react-redux";
import APIInstance from "../../api";

const CreateCampaign: FC = () => {
  const { id } = useParams();
  console.log(id);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("detail");
  const { email } = useSelector(selectAuth);

  const {
    campaignDetailMethods,
    campaignBudgetMethods,
    campaignContentMethods,
    campaignReviewMethods,
  } = useUpsertCampaign(id);

  const handleClick = (tab: string) => {
    setCurrentTab(tab);
  };

  const getOffsetBack = () => {
    if (currentTab === "detail") return "left-1";
    if (currentTab === "budget") return "left-[25%]";
    if (currentTab === "content") return "left-[50%]";
    if (currentTab === "review") return "left-[74%]";
  };

  const handleCampaignDetailsSubmit = () => {
    setCurrentTab("budget");
  };

  const handleCampaignBudgetSubmit = () => {
    setCurrentTab("content");
  };

  const handleCampaignContentSubmit = () => {
    setCurrentTab("review");
  };

  const createUpdateCampaign = async (state: string) => {
    const campaignDetails = campaignDetailMethods.getValues();
    const campaignBudget = campaignBudgetMethods.getValues();
    const campaignContent = campaignContentMethods.getValues();
    const campaignReview = campaignReviewMethods.getValues();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("headLine", campaignContent.headLine);
    formData.append("cta", campaignContent.cta);
    formData.append("body", campaignContent.body);
    formData.append("pageUrl", campaignContent.pageUrl);
    if (typeof campaignContent !== "string")
      formData.append("image", campaignContent.image);
    // for (const aFile of campaignContent.additionalFiles) {
    //   formData.append("additional_file", aFile);
    // }

    const campaignData = {
      email,
      campaignName: campaignDetails.campaignName,
      url: campaignDetails.url,
      currentTarget: campaignDetails.currentTarget,
      currentAudience: campaignDetails.currentAudience,
      currentRegion: campaignDetails.currentRegion,
      currentPrice: campaignBudget.currentPrice,
      currentCard: campaignReview.currentCard,
      state: state,
    };

    if (id) {
      formData.append("id", id);
      await APIInstance.put("data/campaign_ui", formData);
    } else {
      const { data } = await APIInstance.post("data/campaign_ui", formData);
      await APIInstance.post("data/campaign", {
        ...campaignData,
        uiId: data.id,
      });
    }
  };

  const handleCampaignReviewSubmit = async () => {
    await createUpdateCampaign("active");
  };

  const handleSaveDraft = async () => {
    await createUpdateCampaign("draft");
  };

  const { currentAudience, currentTarget } = campaignDetailMethods.getValues();
  const { currentPrice } = campaignBudgetMethods.getValues();

  return (
    <motion.div
      className="text-left relative"
      initial="hidden"
      animate="show"
      variants={FADE_UP_ANIMATION_VARIANTS}
    >
      <div
        className={`relative bg-white rounded-lg text-left items-center shadow-xl flex flex-col px-[70px] pt-[15px] pb-[26px]`}
      >
        {loading && <Loading />}
        <h2 className="font-[Inter] text-[18px] font-bold my-[24px] text-center w-full">
          New Campaign
        </h2>
        <div className="grid grid-cols-4 h-[62px] py-4 px-2 rounded-[5px] bg-[#f5f5f5] z-0 relative w-[800px]">
          <button
            className={`w-full h-full flex items-center justify-center font-[Inter] rounded-[5px] text-sm 2xl:text-md transition-colors duration-500 ${
              currentTab === "detail" ? "text-white" : "text-black"
            }`}
            onClick={() => handleClick("detail")}
          >
            Campaign Details
          </button>
          <button
            className={`w-full h-full flex items-center justify-center font-[Inter] rounded-[5px] text-sm 2xl:text-md transition-colors duration-500 ${
              currentTab === "budget" ? "text-white" : "text-black"
            }`}
            onClick={() => handleClick("budget")}
          >
            Budget
          </button>
          <button
            className={`w-full h-full flex items-center justify-center font-[Inter] rounded-[5px] text-sm 2xl:text-md transition-colors duration-500 ${
              currentTab === "content" ? "text-white" : "text-black"
            }`}
            onClick={() => handleClick("content")}
          >
            Content
          </button>
          <button
            className={`w-full h-full flex items-center justify-center font-[Inter] rounded-[5px] text-sm 2xl:text-md transition-colors duration-500 ${
              currentTab === "review" ? "text-white" : "text-black"
            }`}
            onClick={() => handleClick("review")}
          >
            Review
          </button>
          <div
            className={`absolute h-[50px] bg-[#2D2C2D] w-1/4 rounded-[5px] top-1.5 z-[-1] transition-all duration-500 transform ${getOffsetBack()}`}
          />
        </div>
        <div className="pt-4">
          {currentTab === "detail" && (
            <FormProviderWrapper
              methods={campaignDetailMethods}
              onSubmit={handleCampaignDetailsSubmit}
            >
              <CampaignDetails />
            </FormProviderWrapper>
          )}
          {currentTab === "budget" && (
            <FormProviderWrapper
              methods={campaignBudgetMethods}
              onSubmit={handleCampaignBudgetSubmit}
            >
              <CampaignBudget />
            </FormProviderWrapper>
          )}
          {currentTab === "content" && (
            <FormProviderWrapper
              methods={campaignContentMethods}
              onSubmit={handleCampaignContentSubmit}
            >
              <CampaignContent />
            </FormProviderWrapper>
          )}
          {currentTab === "review" && (
            <FormProviderWrapper
              methods={campaignReviewMethods}
              onSubmit={handleCampaignReviewSubmit}
            >
              <CampaignReview
                currentAudience={currentAudience}
                currentPrice={currentPrice}
                currentTarget={currentTarget}
                handleSaveDraft={handleSaveDraft}
              />
            </FormProviderWrapper>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CreateCampaign;
