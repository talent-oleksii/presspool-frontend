import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import StepOneForm from "../../../containers/creator/onboarding/StepOneForm";
import StepTwoForm from "../../../containers/creator/onboarding/StepTwoForm";
import StepThreeForm from "../../../containers/creator/onboarding/StepThreeForm";
import { useUpsertOnboarding } from "../../../hooks/forms/useUpsertOnboarding";
import FormProviderWrapper from "../../../components/FormProviderWrapper";
import CreatorAPIInstance from "../../../api/creatorAPIInstance";
import { selectAuth } from "../../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import DialogUtils from "../../../utils/DialogUtils";
import Loading from "../../../components/Loading";
import FinalStepForm from "../../../containers/creator/onboarding/FinalStepForm";
import StepFourForm from "../../../containers/creator/onboarding/StepFourForm";
import {
  selectData,
  setPublications,
  setSelectedPublication,
} from "../../../store/dataSlice";

const Onboarding: FC = () => {
  const { creatorId } = useParams();
  const { selectedPubllication } = useSelector(selectData);
  const [loading, setLoading] = useState(false);
  const [isInvalidLink, setIsInvalidLink] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const navigator = useNavigate();
  const dispatch = useDispatch();

  const { stepOneMethods, stepTwoMethods, stepThreeMethods, stepFourMethods } =
    useUpsertOnboarding(Number(selectedPubllication.publication_id));

  const handleStepOneSubmit = () => {
    setActiveStep(1);
  };

  const handleStepTwoSubmit = () => {
    setActiveStep(2);
  };

  const handleStepThreeSubmit = () => {
    setActiveStep(3);
  };

  const handleStepFourSubmit = () => {
    setActiveStep(4);
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleFinalSubmit = () => {
    setLoading(true);
    const stepOneValues = stepOneMethods.getValues();
    const stepTwoValues = stepTwoMethods.getValues();
    const stepThreeValues = stepThreeMethods.getValues();
    const stepFourValues = stepFourMethods.getValues();
    const formData = new FormData();
    formData.append("publicationId", selectedPubllication.publication_id ?? "");
    formData.append("subscriber_proof", stepOneValues.image);
    const avatarFormData = new FormData();
    avatarFormData.append(
      "publicationId",
      selectedPubllication.publication_id ?? ""
    );
    if (typeof stepFourValues.avatar !== "string")
      avatarFormData.append("avatar", stepFourValues.avatar);
    if (typeof stepFourValues.teamAvatar !== "string") {
      avatarFormData.append("team_avatar", stepFourValues.teamAvatar);
    }

    const promises = [
      CreatorAPIInstance.post("updatePreferences", {
        ...stepTwoValues,
        ...stepThreeValues,
        subscribers: stepOneValues.subscribers,
        publicationId: selectedPubllication.publication_id,
      }),
    ];

    if (typeof stepOneValues.image !== "string") {
      promises.push(CreatorAPIInstance.put("updateSubscribeProof", formData));
    }

    if (
      typeof stepFourValues.avatar !== "string" ||
      typeof stepFourValues.teamAvatar !== "string"
    ) {
      promises.push(CreatorAPIInstance.put("updateAvatar", avatarFormData));
    }

    Promise.all(promises)
      .then((res) => {
        const data = res[0]?.data;
        dispatch(setSelectedPublication(data));
        navigator("/publishers/dashboard");
      })
      .finally(() => setLoading(false));
  };

  const { audience } = stepTwoMethods.getValues();

  useEffect(() => {
    if (creatorId) {
      setLoading(true);
      CreatorAPIInstance.get("getAllPublications", {
        params: { creatorId },
      })
        .then(({ data }) => {
          dispatch(setPublications(data));
          dispatch(setSelectedPublication(data[0]));
        })
        .catch(() => {
          setIsInvalidLink(true);
          DialogUtils.show("error", "Alert", "Invalid publishers detail");
        })
        .finally(() => setLoading(false));
    } else {
      setIsInvalidLink(true);
      DialogUtils.show("error", "Alert", "Invalid publishers detail");
    }
  }, [creatorId, dispatch]);

  return (
    <>
      {loading && <Loading />}
      {!isInvalidLink ? (
        <div className="w-full h-full flex flex-col items-center font-[inter] bg-white">
          <div className="px-32 py-14 w-full">
            {/* Back */}
            {activeStep !== 0 && (
              <div
                role="button"
                className="flex items-center gap-2.5 mb-10 self-start"
                onClick={handleBack}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="20"
                  viewBox="0 0 32 20"
                  fill="none"
                >
                  <path
                    d="M31 10L1 10M1 10L9.57143 19M1 10L9.57143 0.999999"
                    stroke="black"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-black text-[18px] -tracking-[.0.54px] font-medium">
                  Back
                </span>
              </div>
            )}

            {/* First Step  */}

            <div className={`${activeStep === 0 ? "" : "hidden"}`}>
              <FormProviderWrapper
                methods={stepOneMethods}
                onSubmit={handleStepOneSubmit}
              >
                <StepOneForm showHeader />
              </FormProviderWrapper>
            </div>

            {/* Second Step */}
            <div className={`${activeStep === 1 ? "" : "hidden"}`}>
              <FormProviderWrapper
                methods={stepTwoMethods}
                onSubmit={handleStepTwoSubmit}
              >
                <StepTwoForm showHeader />
              </FormProviderWrapper>
            </div>

            {/* Third Step */}
            <div className={`${activeStep === 2 ? "" : "hidden"}`}>
              <FormProviderWrapper
                methods={stepThreeMethods}
                onSubmit={handleStepThreeSubmit}
              >
                <StepThreeForm audience={audience} showHeader />
              </FormProviderWrapper>
            </div>

            {/* Fourth Step */}
            <div className={`${activeStep === 3 ? "" : "hidden"}`}>
              <FormProviderWrapper
                methods={stepFourMethods}
                onSubmit={handleStepFourSubmit}
              >
                <StepFourForm />
              </FormProviderWrapper>
            </div>

            {/* Fourth Step  */}
            {activeStep === 4 ? (
              <FinalStepForm handleFinalSubmit={handleFinalSubmit} />
            ) : null}
          </div>
        </div>
      ) : !loading ? (
        <div className="w-full h-full flex flex-col items-center font-[inter] bg-white">
          <div className="px-32 py-14 w-full">
            Oops! It seems like the link you're trying to access is invalid.
            Please double-check the URL and try again. If you believe this is an
            error, feel free to contact support for assistance. Thank you!
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Onboarding;
