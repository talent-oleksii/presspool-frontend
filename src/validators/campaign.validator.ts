import * as yup from "yup";

export const campaignDetailSchema = yup.object().shape({
  campaignName: yup.string().required(),
  url: yup.string().url().required(),
  currentTarget: yup.string().required(),
  currentAudience: yup.array().of(yup.string()).min(1).required(),
  currentRegion: yup.array().of(yup.string()).min(1).required(),
});

export const campaignBudgetSchema = yup.object().shape({
  currentPrice: yup
    .number()
    .required("Current price is required")
    .min(10000, "Minimum current price must be $10000"),
});

export const campaignContentSchema = yup.object().shape({
  headLine: yup.string().required(),
  body: yup.string().required(),
  cta: yup.string().required(),
  pageUrl: yup.string().url().required(),
  image: yup.mixed().required("Please select an image file"),
});

export const campaignReviewSchema = yup.object().shape({
  currentCard: yup.string().required(),
  termsTermPrivacyPolicy: yup.boolean().required(),
});
