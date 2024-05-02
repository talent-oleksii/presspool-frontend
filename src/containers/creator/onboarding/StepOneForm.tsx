import { FC } from "react";
import Mark from "../../../../src/assets/logo/logo.png";
import { useFormContext } from "react-hook-form";
import { AudienceSize } from "../../../constants/constant";

const StepOneForm: FC = () => {
  const { setValue, watch } = useFormContext();

  const handleAudienceSizeChange = (target: string) => {
    setValue("audienceSize", target);
  };

  const audienceSize = watch("audienceSize");
  return (
    <div className="m-auto flex flex-col gap-8 items-center">
      {/* Page Title  */}
      <div className="flex flex-col items-center">
        <img src={Mark} alt="mark" className="w-8" />
        <span className="text-black text-[30px] -tracking-[0.9px] font-bold leading-normal mt-6">
          Welcome to Presspool! Let’s get your account setup
        </span>
        <span className="text-[18px] font-normal -tracking-[0.54px] mt-2">
          First off, what represents your current audience size?
        </span>
      </div>
      {/* Page Content */}
      <div className="w-[570px] mt-2">
        <div className="flex flex-col gap-5">
          <div
            className={`cursor-pointer flex items-center justify-between gap-4 border border-solid border-[#7F8182] rounded-[10px] py-3 px-5 ${AudienceSize.MASSIVE === audienceSize ? "bg-black" : ""
              }`}
            onClick={() => handleAudienceSizeChange(AudienceSize.MASSIVE)}
          >
            <div className="flex flex-col gap-2 items-start">
              <span
                className={`text-[24px] ${AudienceSize.MASSIVE === audienceSize
                  ? "text-white"
                  : "text-black"
                  } font-semibold -tracking-[0.72px]`}
              >
                Massive
              </span>
              <span className="text-[19px] text-[#949494] font-medium -tracking-[0.58px]">
                500k to 1million+ audience size
              </span>
            </div>
            <span className="bg-[#7FFBAE] w-[67px] h-[67px] rounded-[10px] flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="25"
                viewBox="0 0 26 25"
                fill="none"
              >
                <path
                  d="M13.0084 20.0704L5.59163 24L7.00841 15.677L1 9.78318L9.29161 8.57221L13 1L16.7084 8.57221L25 9.78318L18.9916 15.677L20.4084 24L13.0084 20.0704Z"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
          <div
            className={`cursor-pointer flex items-center justify-between gap-4 border border-solid border-[#7F8182] rounded-[10px] py-3 px-5 ${AudienceSize.HUGE === audienceSize ? "bg-black" : ""
              }`}
            onClick={() => handleAudienceSizeChange(AudienceSize.HUGE)}
          >
            <div className="flex flex-col gap-2 items-start">
              <span
                className={`text-[24px] ${AudienceSize.HUGE === audienceSize ? "text-white" : "text-black"
                  } font-semibold -tracking-[0.72px]`}
              >
                Huge
              </span>
              <span className="text-[19px] text-[#949494] font-medium -tracking-[0.58px]">
                250k - 500k audience size
              </span>
            </div>
            <span className="bg-[#7FFBAE] w-[67px] h-[67px] rounded-[10px] flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="21"
                viewBox="0 0 22 21"
                fill="none"
              >
                <path
                  d="M4.80103 12.8378C3.5041 13.5334 2.45539 14.581 1.78935 15.8465C1.1233 17.1119 0.870255 18.5375 1.06266 19.9405C2.53951 20.1233 4.04018 19.8829 5.37227 19.2501C6.70437 18.6174 7.8072 17.6212 8.53939 16.3891M1.06206 11.654C3.28401 11.9049 5.35252 12.8586 6.93473 14.3616C8.51694 15.8647 9.52085 17.8297 9.78491 19.9405C10.8864 19.3372 11.8077 18.4771 12.4619 17.4414C13.116 16.4058 13.4813 15.2287 13.5233 14.0216C15.6156 13.3223 17.4428 12.0494 18.7736 10.3637C20.1045 8.67803 20.8792 6.65532 21 4.55134C21 3.60947 20.6061 2.70617 19.9051 2.04016C19.204 1.37416 18.2531 1 17.2616 1C15.0469 1.11472 12.9176 1.85074 11.1432 3.115C9.36871 4.37926 8.02873 6.11498 7.29267 8.10268C6.02195 8.14254 4.78293 8.48958 3.6927 9.11099C2.60248 9.7324 1.69707 10.6076 1.06206 11.654ZM13.5233 6.9189C13.5233 7.23286 13.6546 7.53395 13.8883 7.75596C14.1219 7.97796 14.4389 8.10268 14.7694 8.10268C15.0999 8.10268 15.4168 7.97796 15.6505 7.75596C15.8842 7.53395 16.0155 7.23286 16.0155 6.9189C16.0155 6.60494 15.8842 6.30384 15.6505 6.08184C15.4168 5.85984 15.0999 5.73512 14.7694 5.73512C14.4389 5.73512 14.1219 5.85984 13.8883 6.08184C13.6546 6.30384 13.5233 6.60494 13.5233 6.9189Z"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
          <div
            className={`cursor-pointer flex items-center justify-between gap-4 border border-solid border-[#7F8182] rounded-[10px] py-3 px-5 ${AudienceSize.BIG === audienceSize ? "bg-black" : ""
              }`}
            onClick={() => handleAudienceSizeChange(AudienceSize.BIG)}
          >
            <div className="flex flex-col gap-2 items-start">
              <span
                className={`text-[24px] ${AudienceSize.BIG === audienceSize ? "text-white" : "text-black"
                  } font-semibold -tracking-[0.72px]`}
              >
                Big
              </span>
              <span className="text-[19px] text-[#949494] font-medium -tracking-[0.58px]">
                100k - 250k audience size
              </span>
            </div>
            <span className="bg-[#7FFBAE] w-[67px] h-[67px] rounded-[10px] flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M1 12H2.22222M12 1V2.22222M21.7778 12H23M4.17778 4.17778L5.03333 5.03333M19.8222 4.17778L18.9667 5.03333M9.18913 18.1111H14.8114M8.33333 16.8889C7.30724 16.1193 6.5493 15.0464 6.16686 13.8221C5.78443 12.5979 5.79689 11.2843 6.20249 10.0675C6.60809 8.8507 7.38626 7.79237 8.42677 7.04241C9.46728 6.29245 10.7174 5.88889 12 5.88889C13.2826 5.88889 14.5327 6.29245 15.5732 7.04241C16.6137 7.79237 17.3919 8.8507 17.7975 10.0675C18.2031 11.2843 18.2156 12.5979 17.8331 13.8221C17.4507 15.0464 16.6928 16.1193 15.6667 16.8889C15.1895 17.3613 14.8302 17.9393 14.6178 18.5763C14.4055 19.2133 14.3461 19.8913 14.4444 20.5556C14.4444 21.2039 14.1869 21.8256 13.7285 22.284C13.2701 22.7425 12.6483 23 12 23C11.3517 23 10.7299 22.7425 10.2715 22.284C9.81309 21.8256 9.55556 21.2039 9.55556 20.5556C9.65389 19.8913 9.59449 19.2133 9.38216 18.5763C9.16983 17.9393 8.81053 17.3613 8.33333 16.8889Z"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
          <div
            className={`cursor-pointer flex items-center justify-between gap-4 border border-solid border-[#7F8182] rounded-[10px] py-3 px-5 ${AudienceSize.GROWING === audienceSize ? "bg-black" : ""
              }`}
            onClick={() => handleAudienceSizeChange(AudienceSize.GROWING)}
          >
            <div className="flex flex-col gap-2 items-start">
              <span
                className={`text-[24px] ${AudienceSize.GROWING === audienceSize
                  ? "text-white"
                  : "text-black"
                  } font-semibold -tracking-[0.72px]`}
              >
                Growing
              </span>
              <span className="text-[19px] text-[#949494] font-medium -tracking-[0.58px]">
                {`<100k audience size`}
              </span>
            </div>
            <span className="bg-[#7FFBAE] w-[67px] h-[67px] rounded-[10px] flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M1 12H2.22222M12 1V2.22222M21.7778 12H23M4.17778 4.17778L5.03333 5.03333M19.8222 4.17778L18.9667 5.03333M9.18913 18.1111H14.8114M8.33333 16.8889C7.30724 16.1193 6.5493 15.0464 6.16686 13.8221C5.78443 12.5979 5.79689 11.2843 6.20249 10.0675C6.60809 8.8507 7.38626 7.79237 8.42677 7.04241C9.46728 6.29245 10.7174 5.88889 12 5.88889C13.2826 5.88889 14.5327 6.29245 15.5732 7.04241C16.6137 7.79237 17.3919 8.8507 17.7975 10.0675C18.2031 11.2843 18.2156 12.5979 17.8331 13.8221C17.4507 15.0464 16.6928 16.1193 15.6667 16.8889C15.1895 17.3613 14.8302 17.9393 14.6178 18.5763C14.4055 19.2133 14.3461 19.8913 14.4444 20.5556C14.4444 21.2039 14.1869 21.8256 13.7285 22.284C13.2701 22.7425 12.6483 23 12 23C11.3517 23 10.7299 22.7425 10.2715 22.284C9.81309 21.8256 9.55556 21.2039 9.55556 20.5556C9.65389 19.8913 9.59449 19.2133 9.38216 18.5763C9.16983 17.9393 8.81053 17.3613 8.33333 16.8889Z"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
        {/* Continue Button  */}
        <button className="rounded-[6px] bg-main w-full h-[52px] mt-8 text-base font-semibold">
          Continue
        </button>
      </div>
    </div>
  );
};

export default StepOneForm;
