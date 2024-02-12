import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  campaignBudgetSchema,
  campaignContentSchema,
  campaignDetailSchema,
  campaignReviewSchema,
} from "../../validators/campaign.validator";
import {
  defaultCampaignBudgetFormData,
  defaultCampaignContentFormData,
  defaultCampaignDetailsFormData,
  defaultCampaignReviewFormData,
} from "../../constants/defaultValues/campaign.default.values";
import { useCallback, useEffect } from "react";
import APIInstance from "../../api";
import { ICampaignDetail } from "../../interfaces/campaign.interface";

interface ICommonOptions {
  mode: "all" | "onSubmit" | "onBlur" | "onChange" | "onTouched";
  reValidateMode: "onSubmit" | "onBlur" | "onChange";
  resetOptions: {
    keepDirtyValues?: boolean | undefined;
    keepErrors?: boolean | undefined;
  };
}

const options: ICommonOptions = Object.freeze({
  mode: "all",
  reValidateMode: "onSubmit",
  resetOptions: {
    keepDirtyValues: true,
    keepErrors: true,
    keepDirty: false,
    keepValues: true,
    keepDefaultValues: true,
    keepIsSubmitted: true,
    keepIsSubmitSuccessful: true,
    keepTouched: true,
    keepIsValid: true,
    keepSubmitCount: true,
    validateOnBlur: false,
  },
});

export const useUpsertCampaign = (id?: string | undefined) => {
  const campaignDetailMethods = useForm({
    ...options,
    defaultValues: defaultCampaignDetailsFormData,
    resolver: yupResolver(campaignDetailSchema),
  });
  const campaignBudgetMethods = useForm({
    ...options,
    defaultValues: defaultCampaignBudgetFormData,
    resolver: yupResolver(campaignBudgetSchema),
  });
  const campaignContentMethods = useForm<any>({
    ...options,
    defaultValues: defaultCampaignContentFormData,
    resolver: yupResolver(campaignContentSchema),
  });
  const campaignReviewMethods = useForm({
    ...options,
    defaultValues: defaultCampaignReviewFormData,
    resolver: yupResolver(campaignReviewSchema),
  });

  const setFormValues = useCallback(
    (data: ICampaignDetail) => {
      campaignDetailMethods.reset({
        campaignName: data.name,
        url: data.url,
        currentTarget: data.demographic,
        currentAudience: data.audience,
        currentRegion: data.region,
      });
      campaignBudgetMethods.reset({
        currentPrice: data.price,
      });
      campaignContentMethods.reset({
        headLine: data.headline,
        body: data.body,
        cta: data.cta,
        pageUrl: data.page_url,
        image: data.image,
      });
      campaignReviewMethods.reset({
        currentCard: data.card_id,
        termsTermPrivacyPolicy: false,
      });
    },
    [
      campaignBudgetMethods,
      campaignContentMethods,
      campaignDetailMethods,
      campaignReviewMethods,
    ]
  );

  useEffect(() => {
    if (id) {
      APIInstance.get("data/campaign_detail", { params: { id } }).then((res) =>
        setFormValues(res.data)
      );
    }
  }, [id, setFormValues]);

  return {
    campaignDetailMethods,
    campaignBudgetMethods,
    campaignContentMethods,
    campaignReviewMethods,
  };
};
