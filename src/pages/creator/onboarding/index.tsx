import { FC, useState } from "react";
import useQuery from "../../../hooks/useQuery";
import { useNavigate, useParams } from "react-router";
import StepOneForm from "../../../containers/creator/onboarding/StepOneForm";
import StepTwoForm from "../../../containers/creator/onboarding/StepTwoForm";
import StepThreeForm from "../../../containers/creator/onboarding/StepThreeForm";
import StepFourForm from "../../../containers/creator/onboarding/StepFourForm";
import { useUpsertOnboarding } from "../../../hooks/forms/useUpsertOnboarding";
import FormProviderWrapper from "../../../components/FormProviderWrapper";
import CreatorAPIInstance from "../../../api/creatorAPIInstance";

const Onboarding: FC = () => {
  const { creatorId } = useParams();
  const { token } = useQuery();
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const navigator = useNavigate();

  const { stepOneMethods, stepTwoMethods, stepThreeMethods } =
    useUpsertOnboarding();

  const handleStepOneSubmit = () => {
    setActiveStep(1);
  };

  const handleStepTwoSubmit = () => {
    setActiveStep(2);
  };

  const handleStepThreeSubmit = () => {
    setActiveStep(3);
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleFinalSubmit = () => {
    const stepOneValues = stepOneMethods.getValues();
    const stepTwoValues = stepTwoMethods.getValues();
    const stepThreeValues = stepThreeMethods.getValues();
    console.log(stepOneValues);
    console.log(stepTwoValues);
    console.log(stepThreeValues);
    setLoading(true);
    CreatorAPIInstance.post("updatePreferences", {
      ...stepOneValues,
      ...stepTwoValues,
      ...stepThreeValues,
      creatorId,
    })
      .then(() => {
        navigator("/creator/dashboard");
      })
      .finally(() => setLoading(false));
  };

  const { audience } = stepTwoMethods.getValues();

  return (
    <div className="w-full h-full flex flex-col items-center font-[inter] bg-white">
      <div className="px-32 py-14 w-full">
        {/* Back */}
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
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span className="text-black text-[18px] -tracking-[.0.54px] font-medium">
            Back
          </span>
        </div>

        {/* First Step  */}

        <div className={`${activeStep === 0 ? "" : "hidden"}`}>
          <FormProviderWrapper
            methods={stepOneMethods}
            onSubmit={handleStepOneSubmit}
          >
            <StepOneForm />
          </FormProviderWrapper>
        </div>

        {/* Second Step */}
        <div className={`${activeStep === 1 ? "" : "hidden"}`}>
          <FormProviderWrapper
            methods={stepTwoMethods}
            onSubmit={handleStepTwoSubmit}
          >
            <StepTwoForm />
          </FormProviderWrapper>
        </div>

        {/* Third Step */}
        <div className={`${activeStep === 2 ? "" : "hidden"}`}>
          <FormProviderWrapper
            methods={stepThreeMethods}
            onSubmit={handleStepThreeSubmit}
          >
            <StepThreeForm audience={audience} />
          </FormProviderWrapper>
        </div>

        {/* Fourth Step  */}
        {activeStep === 3 ? (
          <StepFourForm handleFinalSubmit={handleFinalSubmit} />
        ) : null}
      </div>
    </div>
  );
};

export default Onboarding;
