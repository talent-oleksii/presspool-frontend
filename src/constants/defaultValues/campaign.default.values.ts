import { CampaignTargetType } from "../constant";

export const defaultCampaignDetailsFormData = Object.freeze({
  campaignName: "",
  url: "",
  currentTarget: CampaignTargetType.CUSTOMER,
  currentAudience: [],
  currentRegion: [],
  currentPosition: [],
});

export const defaultCampaignBudgetFormData = {
  currentPrice: 10000,
};

export const defaultCampaignContentFormData = {
  headLine: "",
  body: "",
  cta: "",
  pageUrl: "",
  image: undefined as any,
};

export const defaultCampaignReviewFormData = {
  currentCard: "",
  termsTermPrivacyPolicy: false,
};
