import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ICommonFormOptions } from "../../interfaces/common.interface";
import {
  onboardingFormOneFormData,
  onboardingFormThreeFormData,
  onboardingFormTwoFormData,
} from "../../constants/defaultValues/creator.default.values";
import {
  onboardingFormOneFormSchema,
  onboardingFormThreeFormSchema,
  onboardingFormTwoFormSchema,
} from "../../validators/creator.validator";

const options: ICommonFormOptions = Object.freeze({
  mode: "all",
  reValidateMode: "onSubmit",
  resetOptions: {
    keepDirtyValues: true,
    keepErrors: true,
  },
});

export const useUpsertOnboarding = () => {
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

  return {
    stepOneMethods,
    stepTwoMethods,
    stepThreeMethods,
  };
};
