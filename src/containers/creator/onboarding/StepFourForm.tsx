import { FC } from "react";
import Mark from "../../../../src/assets/logo/logo.png";
const examplePDF = require("../../../../src/assets/files/creatortermsconditions.pdf");

const StepFourForm: FC<{ handleFinalSubmit: () => void }> = (props) => {
  return (
    <div className="max-w-[570px] m-auto flex flex-col gap-8">
      {/* Page Title  */}
      <div className="flex flex-col gap-6 items-center">
        <img src={Mark} alt="mark" className="w-8" />
        <span className="text-black text-[30px] -tracking-[0.9px] font-bold leading-normal">
          Terms & Conditions
        </span>
        <span className="text-[#7F8182] text-[18px] font-normal -tracking-[0.54px]">
          Please review and accept the terms of our platform to complete your
          sign up process.
        </span>
      </div>
      {/* Page Content */}
      <div className="rounded-[8px] border border-solid border-black py-5 px-7 h-[540px]">
        <iframe
          title="PDF Viewer"
          src={examplePDF}
          style={{ width: "100%", height: "500px", border: "none" }}
        />
      </div>
      {/* Continue Button  */}
      <button
        className="rounded-[6px] bg-main w-full h-[52px] text-base font-semibold"
        onClick={props.handleFinalSubmit}
      >
        I AGREE AND ACCEPT THE TERMS
      </button>
    </div>
  );
};

export default StepFourForm;
