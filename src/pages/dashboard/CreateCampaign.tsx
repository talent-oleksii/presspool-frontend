import { FC, useState } from "react";
import { motion } from "framer-motion";

import Loading from "../../components/Loading";
import {
  FADE_RIGHT_ANIMATION_VARIANTS,
  FADE_UP_ANIMATION_VARIANTS,
} from "../../utils/TransitionConstants";
import CampaignDetails from "../../containers/dashboard/CreateCampaign/CampaignDetails";
import CampaignBudget from "../../containers/dashboard/CreateCampaign/CampaignBudget";
import CampaignContent from "../../containers/dashboard/CreateCampaign/CampaignContent";
import CampaignReview from "../../containers/dashboard/CreateCampaign/CampaignReview";
import FormProviderWrapper from "../../components/FormProviderWrapper";
import { useUpsertCampaign } from "../../hooks/forms/useUpsertCampaign";
import { useNavigate, useParams } from "react-router-dom";
import { selectAuth } from "../../store/authSlice";
import { useSelector } from "react-redux";
import APIInstance from "../../api";
import {
  CampaignState,
  CampaignTargetType,
  CreateCampaignTabs,
} from "../../constants/constant";
import DialogUtils from "../../utils/DialogUtils";

const CreateCampaign: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(CreateCampaignTabs.DETAIL);
  const { email } = useSelector(selectAuth);

  const {
    campaignDetailMethods,
    campaignBudgetMethods,
    campaignContentMethods,
    campaignReviewMethods,
  } = useUpsertCampaign(setLoading, id);

  const handleClick = (tab: string) => {
    setCurrentTab(tab);
  };

  const getOffsetBack = () => {
    if (currentTab === CreateCampaignTabs.DETAIL) return "left-1";
    if (currentTab === CreateCampaignTabs.BUDGET) return "left-[25%]";
    if (currentTab === CreateCampaignTabs.CONTENT) return "left-[50%]";
    if (currentTab === CreateCampaignTabs.REVIEW) return "left-[74%]";
  };

  const handleCampaignDetailsSubmit = () => {
    setCurrentTab(CreateCampaignTabs.BUDGET);
  };

  const handleCampaignBudgetSubmit = () => {
    setCurrentTab(CreateCampaignTabs.CONTENT);
  };

  const handleCampaignContentSubmit = (values: any) => {
    setCurrentTab(CreateCampaignTabs.REVIEW);
  };

  const createUpdateCampaign = async (state: string) => {
    try {
      setLoading(true);
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
      formData.append(
        "image",
        typeof campaignContent.image !== "string" ? campaignContent.image : ""
      );
      formData.append("conversion", campaignContent.conversion);
      formData.append(
        "conversionDetail",
        campaignContent?.conversionDetail ?? ""
      );
      if (!!campaignContent?.additionalFiles?.length) {
        for (const aFile of campaignContent.additionalFiles) {
          formData.append("additional_file", aFile);
        }
      }
      if (campaignReview.proofImage) {
        formData.append('proofImage', campaignReview.proofImage);
      }
      const campaignData = {
        email,
        campaignName: campaignDetails.campaignName,
        url: campaignDetails.url,
        currentTarget: campaignDetails.currentTarget,
        currentAudience: campaignDetails.currentAudience,
        currentRegion: campaignDetails.currentRegion,
        currentPrice: campaignBudget.currentPrice,
        state: state,
        type: "all",
        ...(campaignDetails.currentTarget === CampaignTargetType.PROFESSIONAL
          ? { currentPosition: campaignDetails.currentPosition }
          : {}),
      };

      if (id) {
        formData.append("id", (campaignContent?.uiId ?? "")?.toString());
        await APIInstance.put("data/campaign_ui", formData);
        await APIInstance.put("data/campaign_detail", {
          ...campaignData,
          uiId: campaignContent.uiId,
          id: id,
          currentCard: campaignReview.currentCard,
        });
      } else {
        const { data } = await APIInstance.post("data/campaign_ui", formData);
        const { data: data1 } = await APIInstance.post("data/campaign", {
          ...campaignData,
          uiId: data.id,
        });
        await APIInstance.put("data/campaign_detail", {
          ...campaignData,
          uiId: data.id,
          id: data1.id,
          currentCard: campaignReview.currentCard,
        });
      }
      setLoading(false);
      if (state === CampaignState.ACTIVE) {
        DialogUtils.show(
          "success",
          "",
          "Your campaign has been submitted! Our team will review the details and notify you as soon as its live."
        );
      }
      navigate("/detail");
    } catch (error) {
      setLoading(false);
    }
  };

  const validate = () => {
    let success = true;
    if (!campaignDetailMethods.formState.isValid) {
      setCurrentTab(CreateCampaignTabs.DETAIL);
      DialogUtils.show(
        "error",
        "",
        "Campaign details are incomplete. Please enter all required info"
      );
      success = false;
    } else if (!campaignBudgetMethods.formState.isValid) {
      setCurrentTab(CreateCampaignTabs.BUDGET);
      DialogUtils.show("error", "", "Minimum budget must be $10000.");
      success = false;
    } else if (!campaignContentMethods.formState.isValid) {
      setCurrentTab(CreateCampaignTabs.CONTENT);
      DialogUtils.show(
        "error",
        "",
        "Campaign content are incomplete. Please enter all info"
      );
      success = false;
    }
    return success;
  };

  const handleCampaignReviewSubmit = async () => {
    if (validate()) {
      await createUpdateCampaign(CampaignState.ACTIVE);
    }
  };

  const handleSaveDraft = async () => {
    if (validate()) {
      await createUpdateCampaign(CampaignState.DRAFT);
    }
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
        className={`relative bg-white rounded-[10px] text-left items-center shadow-xl flex flex-col px-[70px] pt-[15px] pb-[26px]`}
      >
        {loading && <Loading />}
        <h2 className="font-[Inter] text-xl font-bold my-[24px] text-center w-full">
          New Campaign
        </h2>
        <div className="grid grid-cols-4 h-[62px] py-4 px-2 rounded-[10px] bg-[#f5f5f5] z-0 relative w-[800px]">
          <button
            className={`w-full h-full flex items-center justify-center font-[Inter] rounded-[10px] leading-5 text-base transition-colors duration-500 ${currentTab === "detail"
              ? "text-white font-semibold"
              : "text-primary"
              }`}
            onClick={() => handleClick("detail")}
          >
            Campaign Details
          </button>
          <button
            className={`w-full h-full flex items-center justify-center font-[Inter] rounded-[10px] text-base transition-colors duration-500 ${currentTab === "budget"
              ? "text-white font-semibold"
              : "text-primary"
              }`}
            onClick={() => handleClick("budget")}
          >
            Budget
          </button>
          <button
            className={`w-full h-full flex items-center justify-center font-[Inter] rounded-[10px] text-base transition-colors duration-500 ${currentTab === "content"
              ? "text-white font-semibold"
              : "text-primary"
              }`}
            onClick={() => handleClick("content")}
          >
            Content
          </button>
          <button
            className={`w-full h-full flex items-center justify-center font-[Inter] rounded-[10px] text-base transition-colors duration-500 ${currentTab === "review"
              ? "text-white font-semibold"
              : "text-primary"
              }`}
            onClick={() => handleClick("review")}
          >
            Review
          </button>
          <div
            className={`absolute h-[50px] bg-[#2D2C2D] w-1/4 rounded-[10px] top-1.5 z-[-1] transition-all duration-500 transform ${getOffsetBack()}`}
          />
        </div>
        <div className="pt-4">
          <motion.div
            variants={FADE_RIGHT_ANIMATION_VARIANTS}
            initial="hidden"
            animate={`${currentTab !== "detail" ? "" : "show"}`}
            className={`${currentTab !== "detail" ? "hidden" : ""}`}
          >
            <FormProviderWrapper
              methods={campaignDetailMethods}
              onSubmit={handleCampaignDetailsSubmit}
            >
              <CampaignDetails />
            </FormProviderWrapper>
          </motion.div>
          <motion.div
            variants={FADE_RIGHT_ANIMATION_VARIANTS}
            initial="hidden"
            animate={`${currentTab !== "budget" ? "" : "show"}`}
            className={`${currentTab !== "budget" ? "hidden" : ""}`}
          >
            <FormProviderWrapper
              methods={campaignBudgetMethods}
              onSubmit={handleCampaignBudgetSubmit}
            >
              <CampaignBudget />
            </FormProviderWrapper>
          </motion.div>
          <motion.div
            variants={FADE_RIGHT_ANIMATION_VARIANTS}
            initial="hidden"
            animate={`${currentTab !== "content" ? "" : "show"}`}
            className={`${currentTab !== "content" ? "hidden" : ""}`}
          >
            <FormProviderWrapper
              methods={campaignContentMethods}
              onSubmit={handleCampaignContentSubmit}
            >
              <CampaignContent />
            </FormProviderWrapper>
          </motion.div>
          <motion.div
            variants={FADE_RIGHT_ANIMATION_VARIANTS}
            initial="hidden"
            animate={`${currentTab !== "review" ? "" : "show"}`}
            className={`${currentTab !== "review" ? "hidden" : ""}`}
          >
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
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateCampaign;
