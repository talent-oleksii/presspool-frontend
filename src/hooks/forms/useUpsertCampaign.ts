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
import { ICommonFormOptions } from "../../interfaces/common.interface";

const options: ICommonFormOptions = Object.freeze({
  mode: "all",
  reValidateMode: "onSubmit",
  resetOptions: {
    keepDirtyValues: true,
    keepErrors: true,
  },
});

export const useUpsertCampaign = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  id?: string | undefined
) => {
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
  const campaignContentMethods = useForm<{
    uiId?: number | undefined;
    headLine: string;
    body: string;
    cta: string;
    pageUrl: string;
    image: any;
    additionalFiles?: any;
    conversion: string;
    conversionDetail?: string | undefined;
  }>({
    ...options,
    defaultValues: defaultCampaignContentFormData,
    resolver: yupResolver(campaignContentSchema),
  });
  const campaignReviewMethods = useForm<{
    proofImage?: any | null | undefined;
    currentCard?: string | null | undefined;
    termsTermPrivacyPolicy: boolean;
  }>({
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
        currentPosition: data.position,
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
        additionalFiles: data.additional_files
          ? data.additional_files?.split(",")
          : undefined,
        uiId: data.ui_id ?? 0,
        conversion: data.conversion,
        conversionDetail: data.conversion_detail,
      });
      campaignReviewMethods.reset({
        currentCard: data.card_id,
        proofImage: data.paid_proof_image,
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
      setLoading(true);
      APIInstance.get("data/campaign_detail", { params: { id } })
        .then((res) => {
          setFormValues(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, setFormValues, setLoading]);

  return {
    campaignDetailMethods,
    campaignBudgetMethods,
    campaignContentMethods,
    campaignReviewMethods,
  };
};
