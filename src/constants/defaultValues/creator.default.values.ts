import { AudienceSize } from "../constant";

export const defaultCreatorLoginFormData = {
  email: "",
  password: "",
};

export const defaultCreatorSignupFormData = {
  fullName: "",
  newsletter: "",
  website_url: "",
  email: "",
  password: "",
  agreeTerm: false,
};

export const onboardingFormOneFormData = {
  audienceSize: AudienceSize.GROWING,
};

export const onboardingFormTwoFormData = {
  audience: "consumer",
};

export const onboardingFormThreeFormData = {
  industry: [],
  position: [],
  geography: [],
  averageUniqueClick: 0,
  cpc: 0,
};
