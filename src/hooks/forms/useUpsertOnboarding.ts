import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ICommonFormOptions } from "../../interfaces/common.interface";
import {
  onboardingFormFourFormData,
  onboardingFormOneFormData,
  onboardingFormThreeFormData,
  onboardingFormTwoFormData,
} from "../../constants/defaultValues/creator.default.values";
import {
  onboardingFormFourFormSchema,
  onboardingFormOneFormSchema,
  onboardingFormThreeFormSchema,
  onboardingFormTwoFormSchema,
} from "../../validators/creator.validator";
import { useCallback, useEffect } from "react";
import CreatorAPIInstance from "../../api/creatorAPIInstance";
import { CampaignTargetType } from "../../constants/constant";

const options: ICommonFormOptions = Object.freeze({
  mode: "all",
  reValidateMode: "onSubmit",
  resetOptions: {
    keepDirtyValues: true,
    keepErrors: true,
  },
});

export const useUpsertOnboarding = (publicationId?: number) => {
  const stepOneMethods = useForm({
    ...options,
    defaultValues: onboardingFormOneFormData,
    resolver: yupResolver(onboardingFormOneFormSchema),
  });

  const stepTwoMethods = useForm({
    ...options,
    defaultValues: onboardingFormTwoFormData,
    resolver: yupResolver(onboardingFormTwoFormSchema),
  });

  const { audience } = stepTwoMethods.getValues();
  const stepThreeMethods = useForm({
    ...options,
    defaultValues: onboardingFormThreeFormData,
    resolver: yupResolver(onboardingFormThreeFormSchema),
    context: {
      audience,
    },
  });

  const stepFourMethods = useForm({
    ...options,
    defaultValues: onboardingFormFourFormData,
    resolver: yupResolver(onboardingFormFourFormSchema),
  });

  const setFormValues = useCallback(
    (data: any) => {
      stepOneMethods.reset({
        subscribers: data.total_subscribers,
        image: data.proof_image,
      });
      stepTwoMethods.reset({
        audience: data.audience ?? CampaignTargetType.CUSTOMER,
      });
      stepThreeMethods.reset({
        industry: data.industry,
        position: data.position,
        geography: data.geography,
        averageUniqueClick: data.average_unique_click,
        cpc: data.cpc,
      });
      stepFourMethods.reset({
        avatar: data.avatar,
        teamAvatar: data.team_avatar,
      });
    },
    [stepOneMethods, stepTwoMethods, stepThreeMethods, stepFourMethods]
  );

  useEffect(() => {
    if (publicationId)
      CreatorAPIInstance.get("getPublicationDetail", {
        params: { publicationId },
      }).then(({ data }) => {
        setFormValues(data);
      });
  }, [publicationId, setFormValues]);

  return {
    stepOneMethods,
    stepTwoMethods,
    stepThreeMethods,
    stepFourMethods,
  };
};
