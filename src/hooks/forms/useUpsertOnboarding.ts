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

const options: ICommonFormOptions = Object.freeze({
  mode: "all",
  reValidateMode: "onSubmit",
  resetOptions: {
    keepDirtyValues: true,
    keepErrors: true,
  },
});

export const useUpsertOnboarding = (id?: number) => {
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

  const stepThreeMethods = useForm({
    ...options,
    defaultValues: onboardingFormThreeFormData,
    resolver: yupResolver(onboardingFormThreeFormSchema),
  });

  const { audience } = stepThreeMethods.getValues();
  const stepFourMethods = useForm({
    ...options,
    defaultValues: onboardingFormFourFormData,
    resolver: yupResolver(onboardingFormFourFormSchema),
    context: {
      audience,
    },
  });

  const setFormValues = useCallback(
    (data: any) => {
      stepTwoMethods.reset({
        subscribers: data.total_subscribers,
        image: data.proof_image,
      });
      stepThreeMethods.reset({
        audience: data.audience,
      });
      stepFourMethods.reset({
        industry: data.industry,
        position: data.position,
        geography: data.geography,
        averageUniqueClick: data.average_unique_click,
        cpc: data.cpc,
      });
    },
    [stepTwoMethods, stepThreeMethods, stepFourMethods]
  );

  useEffect(() => {
    if (id)
      CreatorAPIInstance.get("getCreatorDetail", {
        params: { creatorId: id },
      }).then(({ data }) => {
        setFormValues(data);
      });
  }, [id, setFormValues]);

  return {
    stepOneMethods,
    stepTwoMethods,
    stepThreeMethods,
    stepFourMethods,
  };
};
