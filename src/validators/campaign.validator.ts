//@ts-nocheck
import * as yup from "yup";
import { CampaignTargetType } from "../constants/constant";

export const campaignDetailSchema = yup.object().shape({
  campaignName: yup.string().required("Enter campaign name"),
  url: yup
    .string()
    .required("Enter website url")
    .url("Invalid website url format"),
  currentTarget: yup.string().required(),
  currentAudience: yup
    .array()
    .of(yup.string())
    .min(1, "Select minimum one audience industry")
    .required("Select audience industry"),
  currentPosition: yup
    .array()
    .of(yup.string())
    .min(1, "Select minimum one position")
    .when("currentTarget", {
      is: CampaignTargetType.PROFESSIONAL,
      then: () => yup.array().min(1, "Select minimum one position").required("Select position"),
      otherwise: () => yup.array().notRequired(),
    }),
  currentRegion: yup
    .array()
    .of(yup.string())
    .min(1, "Select minimum one geography/region")
    .required("Select audience geography/region"),
});

export const campaignBudgetSchema = yup.object().shape({
  currentPrice: yup
    .number()
    .required("Current price is required")
    .min(10000, "Minimum current price must be $10000"),
});

export const campaignContentSchema = yup.object().shape({
  headLine: yup.string().required("Enter content headline"),
  body: yup.string().required("Enter content body"),
  cta: yup.string().required("Enter CTA text"),
  pageUrl: yup
    .string()
    .required("Enter CTA link")
    .url("Invalid CTA link url format")
    .matches(/^https:\/\//, "URL must start with https://"),
  image: yup.mixed().required("Please select an image file"),
  additionalFiles: yup.mixed(),
  uiId: yup.number(),
});

export const campaignReviewSchema = yup.object().shape({
  currentCard: yup.string().required("Select a card"),
  termsTermPrivacyPolicy: yup
    .boolean()
    .test(
      "is-true",
      "Must accept terms of service and privacy policy",
      (value) => value === true
    )
    .required(),
});
