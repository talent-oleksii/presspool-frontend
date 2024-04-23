import * as yup from "yup";
import { CampaignTargetType } from "../constants/constant";

export const creatorLoginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Enter email address")
    .email("Invalid email address"),
  password: yup.string().required("Enter password"),
});

export const creatorSignupSchema = yup.object().shape({
  fullName: yup.string().required("Enter fullName"),
  newsletter: yup.string().required("Enter Publication / Newsletter Name"),
  email: yup
    .string()
    .required("Enter email address")
    .email("Invalid email address"),
  password: yup.string().required("Enter password"),
  agreeTerm: yup
    .boolean()
    .test(
      "is-true",
      "Must accept terms of service and privacy policy",
      (value) => value === true
    )
    .required(),
});

export const onboardingFormOneFormSchema = yup.object().shape({
  audienceSize: yup.string().required("Select audience size"),
});

export const onboardingFormTwoFormSchema = yup.object().shape({
  audience: yup.string().required("Select audience"),
});

export const onboardingFormThreeFormSchema = yup.object().shape({
  industry: yup
    .array()
    .of(yup.string())
    .min(1, "Select minimum one audience industry")
    .required("Select audience industry"),
  position: yup
    .array()
    .of(yup.string())
    .min(1, "Select minimum one position")
    .when(["$audience"], {
      is: CampaignTargetType.PROFESSIONAL,
      then: () =>
        yup
          .array()
          .min(1, "Select minimum one position")
          .required("Select position"),
      otherwise: () => yup.array().notRequired(),
    }),
  geography: yup
    .array()
    .of(yup.string())
    .min(1, "Select minimum one geography/region")
    .required("Select audience geography/region"),
  averageUniqueClick: yup
    .number()
    .positive("average unique click must be greater then 0")
    .typeError("average unique click must be a number")
    .required("Enter average unique click"),
  cpc: yup
    .number()
    .positive("cpc must be greater then 0")
    .max(4)
    .typeError("cpc must be a number")
    .required("Enter cpc"),
});
