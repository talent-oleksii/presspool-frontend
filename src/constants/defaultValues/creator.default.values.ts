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
  subscribers: 0,
  image: undefined as any,
};

export const onboardingFormThreeFormData = {
  audience: "consumer",
};

export const onboardingFormFourFormData = {
  industry: [],
  position: [],
  geography: [],
  averageUniqueClick: 0,
  cpc: 0,
};
