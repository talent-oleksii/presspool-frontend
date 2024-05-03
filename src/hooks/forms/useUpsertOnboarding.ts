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

  return {
    stepOneMethods,
    stepTwoMethods,
    stepThreeMethods,
    stepFourMethods,
  };
};
