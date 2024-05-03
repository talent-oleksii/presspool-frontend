import { FC } from "react";
import Mark from "../../../../src/assets/logo/logo.png";
import { useFormContext } from "react-hook-form";
import { CampaignTargetType } from "../../../constants/constant";

const StepThreeForm: FC = () => {
  const { setValue, watch } = useFormContext();

  const handleAudienceChange = (target: string) => {
    setValue("audience", target);
  };

  const audience = watch("audience");
  return (
    <div className="max-w-[570px] m-auto flex flex-col gap-8">
      {/* Page Title  */}
      <div className="flex flex-col items-center">
        <img src={Mark} alt="mark" className="w-8" />
        <span className="text-black text-[30px] -tracking-[0.9px] font-bold leading-normal mt-6">
          Step two, let’s dive deeper...
        </span>
        <span className="text-[18px] font-normal -tracking-[0.54px] mt-2">
          Let’s dive a bit deeper into your audience.
        </span>
      </div>
      {/* Page Content */}
      <div className="flex flex-col gap-5">
        <span className="text-base font-medium -tracking-[0.48px] self-start text-[#7F8182]">
          Does your audience consist of more consumers or professionals?*
        </span>
        <div
          className={`cursor-pointer flex items-center justify-between gap-4 border border-solid border-[#7F8182] rounded-[10px] py-3 px-5 ${CampaignTargetType.CUSTOMER === audience ? "bg-black" : ""
            }`}
          onClick={() => handleAudienceChange(CampaignTargetType.CUSTOMER)}
        >
          <span
            className={`text-[24px] ${CampaignTargetType.CUSTOMER === audience
              ? "text-white"
              : "text-black"
              } font-semibold -tracking-[0.72px]`}
          >
            Consumers
          </span>
          <span className="bg-[#7FFBAE] w-[53px] h-[53px] rounded-[10px] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="31"
              height="30"
              viewBox="0 0 31 30"
              fill="none"
            >
              <path
                d="M9.05556 28.4611V26.9598C9.05556 26.1634 9.39504 25.3997 9.99932 24.8366C10.6036 24.2735 11.4232 23.9571 12.2778 23.9571H18.7222C19.5768 23.9571 20.3964 24.2735 21.0007 24.8366C21.605 25.3997 21.9444 26.1634 21.9444 26.9598V28.4611M23.5556 11.9467H26.7778C27.6324 11.9467 28.4519 12.263 29.0562 12.8261C29.6605 13.3892 30 14.1529 30 14.9493V16.4506M1 16.4506V14.9493C1 14.1529 1.33948 13.3892 1.94377 12.8261C2.54805 12.263 3.36764 11.9467 4.22222 11.9467H7.44444M12.2778 16.4506C12.2778 17.2469 12.6173 18.0107 13.2215 18.5738C13.8258 19.1369 14.6454 19.4532 15.5 19.4532C16.3546 19.4532 17.1742 19.1369 17.7785 18.5738C18.3827 18.0107 18.7222 17.2469 18.7222 16.4506C18.7222 15.6542 18.3827 14.8905 17.7785 14.3274C17.1742 13.7643 16.3546 13.448 15.5 13.448C14.6454 13.448 13.8258 13.7643 13.2215 14.3274C12.6173 14.8905 12.2778 15.6542 12.2778 16.4506ZM20.3333 4.44012C20.3333 5.23646 20.6728 6.00019 21.2771 6.56329C21.8814 7.12639 22.701 7.44274 23.5556 7.44274C24.4101 7.44274 25.2297 7.12639 25.834 6.56329C26.4383 6.00019 26.7778 5.23646 26.7778 4.44012C26.7778 3.64377 26.4383 2.88005 25.834 2.31695C25.2297 1.75385 24.4101 1.4375 23.5556 1.4375C22.701 1.4375 21.8814 1.75385 21.2771 2.31695C20.6728 2.88005 20.3333 3.64377 20.3333 4.44012ZM4.22222 4.44012C4.22222 5.23646 4.56171 6.00019 5.16599 6.56329C5.77027 7.12639 6.58986 7.44274 7.44444 7.44274C8.29903 7.44274 9.11862 7.12639 9.7229 6.56329C10.3272 6.00019 10.6667 5.23646 10.6667 4.44012C10.6667 3.64377 10.3272 2.88005 9.7229 2.31695C9.11862 1.75385 8.29903 1.4375 7.44444 1.4375C6.58986 1.4375 5.77027 1.75385 5.16599 2.31695C4.56171 2.88005 4.22222 3.64377 4.22222 4.44012Z"
                stroke="black"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
        <div
          className={`cursor-pointer flex items-center justify-between gap-4 border border-solid border-[#7F8182] rounded-[10px] py-3 px-5 ${CampaignTargetType.PROFESSIONAL === audience ? "bg-black" : ""
            }`}
          onClick={() => handleAudienceChange(CampaignTargetType.PROFESSIONAL)}
        >
          <span
            className={`text-[24px] ${CampaignTargetType.PROFESSIONAL === audience
              ? "text-white"
              : "text-black"
              } font-semibold -tracking-[0.72px]`}
          >
            Professionals
          </span>
          <span className="bg-[#7FFBAE] w-[53px] h-[53px] rounded-[10px] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="31"
              height="30"
              viewBox="0 0 31 30"
              fill="none"
            >
              <path
                d="M13.8889 5.76174C13.8889 6.95626 14.7376 8.10185 16.2483 8.9465C17.759 9.79115 19.808 10.2657 21.9444 10.2657C24.0809 10.2657 26.1299 9.79115 27.6406 8.9465C29.1513 8.10185 30 6.95626 30 5.76174M13.8889 5.76174C13.8889 4.56722 14.7376 3.42163 16.2483 2.57698C17.759 1.73233 19.808 1.25781 21.9444 1.25781C24.0809 1.25781 26.1299 1.73233 27.6406 2.57698C29.1513 3.42163 30 4.56722 30 5.76174M13.8889 5.76174V11.767M30 5.76174V11.767M13.8889 11.767C13.8889 14.2546 17.4962 16.2709 21.9444 16.2709C26.3927 16.2709 30 14.2546 30 11.767M13.8889 11.767V17.7722M30 11.767V17.7722M13.8889 17.7722C13.8889 20.2599 17.4962 22.2761 21.9444 22.2761C26.3927 22.2761 30 20.2599 30 17.7722M13.8889 17.7722V23.7774C13.8889 26.2651 17.4962 28.2814 21.9444 28.2814C26.3927 28.2814 30 26.2651 30 23.7774V17.7722M7.44444 10.2657H3.41667C2.77573 10.2657 2.16104 10.5029 1.70783 10.9253C1.25461 11.3476 1 11.9204 1 12.5176C1 13.1149 1.25461 13.6877 1.70783 14.11C2.16104 14.5323 2.77573 14.7696 3.41667 14.7696H5.02778C5.66872 14.7696 6.28341 15.0069 6.73662 15.4292C7.18983 15.8515 7.44444 16.4243 7.44444 17.0216C7.44444 17.6188 7.18983 18.1916 6.73662 18.6139C6.28341 19.0363 5.66872 19.2735 5.02778 19.2735H1M4.22222 19.2735V20.7748M4.22222 8.76436V10.2657"
                stroke="black"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
        <div
          className={`cursor-pointer flex items-center justify-between gap-4 border border-solid border-[#7F8182] rounded-[10px] py-3 px-5 ${CampaignTargetType.BOTH === audience ? "bg-black" : ""
            }`}
          onClick={() => handleAudienceChange(CampaignTargetType.BOTH)}
        >
          <span
            className={`text-[24px] ${CampaignTargetType.BOTH === audience ? "text-white" : "text-black"
              } font-semibold -tracking-[0.72px]`}
          >
            Both (Our audience is about 50/50)
          </span>
          <span className="bg-[#7FFBAE] w-[53px] h-[53px] rounded-[10px] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="29"
              viewBox="0 0 24 29"
              fill="none"
            >
              <path
                d="M23.7071 8.70711C24.0976 8.31658 24.0976 7.68342 23.7071 7.29289L17.3431 0.928932C16.9526 0.538408 16.3195 0.538408 15.9289 0.928932C15.5384 1.31946 15.5384 1.95262 15.9289 2.34315L21.5858 8L15.9289 13.6569C15.5384 14.0474 15.5384 14.6805 15.9289 15.0711C16.3195 15.4616 16.9526 15.4616 17.3431 15.0711L23.7071 8.70711ZM1 9H23V7H1V9Z"
                fill="black"
              />
              <path
                d="M0.292892 20.2929C-0.0976315 20.6834 -0.0976315 21.3166 0.292892 21.7071L6.65685 28.0711C7.04738 28.4616 7.68054 28.4616 8.07107 28.0711C8.46159 27.6805 8.46159 27.0474 8.07107 26.6569L2.41421 21L8.07107 15.3431C8.46159 14.9526 8.46159 14.3195 8.07107 13.9289C7.68054 13.5384 7.04738 13.5384 6.65685 13.9289L0.292892 20.2929ZM23 20L1 20V22L23 22V20Z"
                fill="black"
              />
            </svg>
          </span>
        </div>
      </div>
      {/* Continue Button  */}
      <button className="rounded-[6px] bg-main w-full h-[52px] text-base font-semibold">
        Continue
      </button>
    </div>
  );
};

export default StepThreeForm;
