import { FC, useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Avatar, Button } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import CreatorAPIInstance from "../../../api/creatorAPIInstance";
import { MAIN_ROUTE_FADE_UP_ANIMATION_VARIANTS } from "../../../utils/TransitionConstants";
import Loading from "../../../components/Loading";
import { getPlaceHolder } from "../../../utils/commonUtils";
import DialogUtils from "../../../utils/DialogUtils";
import { selectAuth } from "../../../store/authSlice";
import StripeUtil from "../../../utils/stripe";
import { OnboardingTabs } from "../../../constants/constant";
import FormProviderWrapper from "../../../components/FormProviderWrapper";
import StepTwoForm from "../../../containers/creator/onboarding/StepTwoForm";
import StepThreeForm from "../../../containers/creator/onboarding/StepThreeForm";
import { useUpsertOnboarding } from "../../../hooks/forms/useUpsertOnboarding";
import StepOneForm from "../../../containers/creator/onboarding/StepOneForm";
import { selectData, setSelectedPublication } from "../../../store/dataSlice";

const CreatorProfile: FC = () => {
  const { selectedPubllication } = useSelector(selectData);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const companyfileInputRef = useRef<HTMLInputElement>(null);
  const { creatorData } = useSelector(selectAuth);
  const { email, audience, token, name, create_time } = creatorData;
  const [loading, setLoading] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [image, setImage] = useState<any>(null);
  const [companyImage, setCompanyImage] = useState<any>(null);
  const [text, setText] = useState("Connected");
  const [chargeEnabled, setChargeEnabled] = useState(false);
  const [currentTab, setCurrentTab] = useState(OnboardingTabs.AUDIENCESIZE);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPubllication.publication_id) {
      setLoading(true);
      CreatorAPIInstance.get("getPublicationDetail", {
        params: { publicationId: selectedPubllication.publication_id ?? "" },
      })
        .then(({ data }) => {
          setSelectedPublication(data);
          setImage(data.avatar);
          setCompanyImage(data.team_avatar);
        })
        .finally(() => setLoading(false));
    }
  }, [selectedPubllication.publication_id]);

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
      const formData = new FormData();
      formData.append(
        "publicationId",
        selectedPubllication.publication_id ?? ""
      );
      formData.append("avatar", file);
      CreatorAPIInstance.put("updateAvatar", formData)
        .then(() => {
          // here comes the data, you can use it.
          //   dispatch(setAvatar({ avatar: data.data.avatar }));
          DialogUtils.show(
            "success",
            "",
            "Your profile has successfully updated!"
          );
        })
        .finally(() => setLoading(false));
    }
  };

  const handleCompanyFileChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyImage(reader.result);
      };
      reader.readAsDataURL(file);
      const formData = new FormData();
      formData.append(
        "publicationId",
        selectedPubllication.publication_id ?? ""
      );
      formData.append("team_avatar", file);
      CreatorAPIInstance.put("updateAvatar", formData)
        .then(() => {
          // here comes the data, you can use it.
          //   dispatch(setAvatar({ avatar: data.data.avatar }));
          DialogUtils.show(
            "success",
            "",
            "Your newsletter logo successfully updated!"
          );
        })
        .finally(() => setLoading(false));
    }
  };

  const checkIfAccountConnected = useCallback(async () => {
    const isChargeEnabled = await StripeUtil.isAccountLinked(email);
    setChargeEnabled(isChargeEnabled);
  }, [email]);

  useEffect(() => {
    checkIfAccountConnected();
  }, [checkIfAccountConnected, email]);

  const handleConnectPaymentMethod = async () => {
    // create account for this account manager:
    setStripeLoading(true);
    const account = await StripeUtil.stripe.accounts.create({
      type: "standard",
      metadata: {
        work_email: email,
      },
    });
    const accountLink = await StripeUtil.stripe.accountLinks.create({
      account: account.id,
      refresh_url: "https://go.presspool.ai/publishers/profile",
      return_url: "https://go.presspool.ai/publishers/profile",
      type: "account_onboarding",
    });

    setStripeLoading(false);
    window.open(accountLink.url, "_self");
  };

  const handleHover = () => {
    setText("Go to Your Dashboard");
  };

  const handleLeave = () => {
    setText("Connected");
  };

  const handleClick = (tab: string) => {
    setCurrentTab(tab);
  };

  const { stepOneMethods, stepTwoMethods, stepThreeMethods } =
    useUpsertOnboarding(Number(selectedPubllication.publication_id));

  const handleStepOneSubmit = async () => {
    setLoading(true);
    const stepOneValues = stepOneMethods.getValues();
    if (stepOneValues.image && typeof stepOneValues.image !== "string") {
      const formData = new FormData();
      formData.append(
        "publicationId",
        selectedPubllication.publication_id ?? ""
      );
      formData.append("subscriber_proof", stepOneValues.image);
      await CreatorAPIInstance.put("updateSubscribeProof", formData);
    }

    CreatorAPIInstance.post("updateAudienceSize", {
      subscribers: stepOneValues.subscribers,
      publicationId: selectedPubllication.publication_id ?? "",
    })
      .then(({ data }) => {
        dispatch(setSelectedPublication({ ...data, token }));
      })
      .finally(() => setLoading(false));
  };

  const handleStepTwoSubmit = () => {
    setLoading(true);
    const stepTwoValues = stepTwoMethods.getValues();
    CreatorAPIInstance.post("updateAudience", {
      audience: stepTwoValues.audience,
      publicationId: selectedPubllication.publication_id ?? "",
    })
      .then(({ data }) => {
        dispatch(setSelectedPublication({ ...data, token }));
      })
      .finally(() => setLoading(false));
  };

  const handleStepThreeSubmit = () => {
    setLoading(true);
    const stepThreeValues = stepThreeMethods.getValues();
    CreatorAPIInstance.post("updateTargeting", {
      industry: stepThreeValues.industry,
      position: stepThreeValues.position,
      geography: stepThreeValues.geography,
      averageUniqueClick: stepThreeValues.averageUniqueClick,
      cpc: stepThreeValues.cpc,
      publicationId: selectedPubllication.publication_id ?? "",
    })
      .then(({ data }) => {
        dispatch(setSelectedPublication({ ...data, token }));
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div className="flex items-center justify-between pr-4 pt-1.5">
        <h1 className="font-semibold font-[Inter] text-xl 2xl:text-xl -tracking-[1.02px]">
          Account Details
        </h1>
      </div>
      <motion.div
        className="text-left flex flex-col"
        initial="hidden"
        animate="show"
        variants={MAIN_ROUTE_FADE_UP_ANIMATION_VARIANTS()}
      >
        {loading && <Loading />}

        <div className="mt-4 p-6 bg-white rounded-[10px] shadow-md">
          <div className="bg-white pb-7 flex flex-col-2 justify-between border-b-[1px] border-[#bcbcbc]">
            <div className="flex-1">
              <p className="text-primary text-lg font-medium -tracking-[.6px]">
                Personal
              </p>
              <div className="items-center flex mt-4 gap-5">
                <div className="flex flex-col">
                  <button className="relative">
                    {image ? (
                      <Avatar
                        src={image}
                        className="z-[0] transition-all duration-150  hover:blur-[1.5px] w-[100px] h-[100px]"
                      />
                    ) : (
                      <div className="z-[0] transition-all duration-150 hover:blur-[1.5px] w-[100px] h-[100px] bg-main rounded-full flex items-center justify-center font-[Inter] text-3xl">
                        {getPlaceHolder(name)}
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      className="w-[75px] h-[75px]"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </button>
                  <button
                    className="text-[#0af] text-xs -tracking-[.36px] font-medium mt-4"
                    onClick={() => {
                      if (fileInputRef.current) fileInputRef.current.click();
                    }}
                  >
                    Edit
                  </button>
                </div>
                <div className="text-left ms-2 flex flex-col gap-1">
                  <p className="font-[Inter] text-primary text-base font-semibold -tracking-[.36px] leading-[16px]">
                    {name}
                  </p>
                  <p className="font-[Inter] text-secondry1 text-sm font-normal -tracking-[.3px]">
                    {email}
                  </p>
                  <p className="font-[Inter] text-secondry2 text-sm font-normal -tracking-[.3px]">
                    {`Date Joined : ${moment(
                      new Date(Number(create_time))
                    ).format("DD MMM, YYYY")}`}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-primary text-lg font-medium -tracking-[.6px]">
                Newsletter
              </p>
              <div className="items-center flex mt-4 gap-5">
                <div className="flex flex-col">
                  <button className="relative">
                    {companyImage ? (
                      <Avatar
                        src={companyImage}
                        className="z-[0] transition-all duration-150  hover:blur-[1.5px] w-[100px] h-[100px]"
                      />
                    ) : (
                      <div className="z-[0] transition-all duration-150 hover:blur-[1.5px] w-[100px] h-[100px] bg-main rounded-full flex items-center justify-center font-[Inter] text-3xl">
                        {getPlaceHolder(selectedPubllication?.newsletter)}
                      </div>
                    )}
                    <input
                      ref={companyfileInputRef}
                      type="file"
                      hidden
                      className="w-[75px] h-[75px]"
                      accept="image/*"
                      onChange={handleCompanyFileChange}
                    />
                  </button>
                  <button
                    className="text-[#0af] text-xs -tracking-[.36px] font-medium mt-4"
                    onClick={() => {
                      if (companyfileInputRef.current)
                        companyfileInputRef.current.click();
                    }}
                  >
                    Edit
                  </button>
                </div>
                <div className="text-left ms-2 flex flex-col gap-1">
                  <p className="font-[Inter] text-primary text-base font-semibold -tracking-[.36px] leading-[16px]">
                    {selectedPubllication?.newsletter}
                  </p>
                  <p className="font-[Inter] text-secondry1 text-sm font-normal -tracking-[.3px]">
                    {selectedPubllication?.website_url}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 mt-7 pb-7 border-b-[1px] border-[#bcbcbc]">
            <h4 className="text-base font-[Inter] font-medium text-primary mt-3 -tracking-[.48px]">
              Payment Methods
            </h4>
            <div className="mt-1">
              {!chargeEnabled ? (
                <Button
                  className="w-[206px] p-2 rounded-[10px] shadow-md text-white -tracking-[.42px] font-medium text-sm bg-[#6c63ff] flex items-center"
                  onClick={handleConnectPaymentMethod}
                  loading={stripeLoading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                    className="me-2"
                  >
                    <path
                      d="M6 8.5H11M8.5 6V11M1 8.5C1 9.48491 1.19399 10.4602 1.5709 11.3701C1.94781 12.2801 2.50026 13.1069 3.1967 13.8033C3.89314 14.4997 4.71993 15.0522 5.62987 15.4291C6.53982 15.806 7.51509 16 8.5 16C9.48491 16 10.4602 15.806 11.3701 15.4291C12.2801 15.0522 13.1069 14.4997 13.8033 13.8033C14.4997 13.1069 15.0522 12.2801 15.4291 11.3701C15.806 10.4602 16 9.48491 16 8.5C16 6.51088 15.2098 4.60322 13.8033 3.1967C12.3968 1.79018 10.4891 1 8.5 1C6.51088 1 4.60322 1.79018 3.1967 3.1967C1.79018 4.60322 1 6.51088 1 8.5Z"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Connect Payment Method
                </Button>
              ) : (
                <a
                  className="inline-flex py-2 px-4 rounded-[10px] shadow-md -tracking-[.42px] font-medium text-sm bg-[#7FFBAE] flex items-center"
                  href="https://dashboard.stripe.com"
                  target="_blank"
                  rel="noreferrer"
                  onMouseOver={handleHover}
                  onMouseLeave={handleLeave}
                >
                  {text}
                </a>
              )}
            </div>
          </div>
          <div className="col-span-1 mt-7 pb-7">
            <h4 className="text-base font-[Inter] font-medium text-primary mt-3 -tracking-[.48px]">
              Targeting
            </h4>
            <div className="mt-1 flex justify-center flex-col items-center">
              <div className="grid grid-cols-3 h-[62px] py-4 px-2 rounded-[10px] z-0 relative w-[500px]">
                <button
                  className={`w-full min-h-[50px] h-full flex items-center justify-center font-[Inter] rounded-[10px] leading-5 text-base transition-colors duration-500 ${
                    currentTab === OnboardingTabs.AUDIENCESIZE
                      ? "text-white font-semibold bg-[#2D2C2D]"
                      : "text-primary"
                  }`}
                  onClick={() => handleClick(OnboardingTabs.AUDIENCESIZE)}
                >
                  Audience Size
                </button>
                <button
                  className={`w-full min-h-[50px] h-full flex items-center justify-center font-[Inter] rounded-[10px] text-base transition-colors duration-500 ${
                    currentTab === OnboardingTabs.AUDIENCE
                      ? "text-white font-semibold bg-[#2D2C2D]"
                      : "text-primary"
                  }`}
                  onClick={() => handleClick(OnboardingTabs.AUDIENCE)}
                >
                  Audience
                </button>
                <button
                  className={`w-full min-h-[50px] h-full flex items-center justify-center font-[Inter] rounded-[10px] text-base transition-colors duration-500 ${
                    currentTab === OnboardingTabs.TARGETTING
                      ? "text-white font-semibold bg-[#2D2C2D]"
                      : "text-primary"
                  }`}
                  onClick={() => handleClick(OnboardingTabs.TARGETTING)}
                >
                  Targeting
                </button>
              </div>
              <div className={`flex justify-center mt-7`}>
                <div
                  className={`${
                    currentTab === OnboardingTabs.AUDIENCESIZE ? "" : "hidden"
                  }`}
                >
                  <FormProviderWrapper
                    methods={stepOneMethods}
                    onSubmit={handleStepOneSubmit}
                  >
                    <StepOneForm buttonText="Save Changes" />
                  </FormProviderWrapper>
                </div>

                {/* Third Step */}
                <div
                  className={`${
                    currentTab === OnboardingTabs.AUDIENCE ? "" : "hidden"
                  }`}
                >
                  <FormProviderWrapper
                    methods={stepTwoMethods}
                    onSubmit={handleStepTwoSubmit}
                  >
                    <StepTwoForm buttonText="Save Changes" />
                  </FormProviderWrapper>
                </div>

                {/* Fourth Step */}
                <div
                  className={`${
                    currentTab === OnboardingTabs.TARGETTING ? "" : "hidden"
                  }`}
                >
                  <FormProviderWrapper
                    methods={stepThreeMethods}
                    onSubmit={handleStepThreeSubmit}
                  >
                    <StepThreeForm
                      audience={audience}
                      buttonText="Save Changes"
                    />
                  </FormProviderWrapper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default CreatorProfile;
