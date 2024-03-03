import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

const CampaignBudget: FC = () => {
  const {
    control,
    watch,
    formState: { isValid },
  } = useFormContext();
  const getCPC = (budget: number) => {
    const beehiivBudget =
      Math.round((budget / ((4 * (1 + 0.1)) / (1 - 0.6))) * 4) - 2;
    return budget / (beehiivBudget / 4);
  };

  const currentPrice = watch("currentPrice");
  return (
    <div className="w-[720px]">
      <h2 className="font-[Inter] text-base 2xl:text-base font-semibold text-black">
        Please type in your budget cap for this campaign (This is not a one-time
        charge)
      </h2>
      <p className="font-[Inter] text-[#43474a] font-light text-sm 2xl:text-sm mt-[14px]">
        *Keep in mind, these are all verified, targeted and engaged readers that
        will be clicking through directly to your landing page of choice. We
        only charge per <span className="font-bold">unique click</span> as they
        come in.
      </p>
      <div className="pl-2 pr-4 mt-[23px] border-[1px] rounded-lg border-black w-full flex justify-between items-center relative">
        <span className="text-sm font-medium">$</span>
        <Controller
          name="currentPrice"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              className="border-0 focus:border-0 focus:ring-0 focus-visible:outline-0 focus-visible:border-0 flex-1 font-medium text-sm 2xl:text-md px-0"
              type="number"
              min="10000"
            />
          )}
        />
        <p className="text-[#f76363] font-normal text-xs right-[23px] top-[10px] ms-2">
          *minimum input must be $10,000
        </p>
      </div>
      {currentPrice && (
        <div className="mt-[9px]">
          <span className="font-[Inter] font-normal text-xs 2xl:text-xs my-3 text-black">
            {`*Estimated clicks for the campaign are ${Math.floor(
              Number(currentPrice) / getCPC(Number(currentPrice))
            )}`}
          </span>
        </div>
      )}
      {Number(currentPrice) < 20000 && (
        <div className="mt-4 bg-[#fcd9d7] rounded-lg p-2 flex">
          <div>
            <svg
              enableBackground="new 0 0 91.8 92.6"
              version="1.0"
              viewBox="0 0 91.8 92.6"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[16px] me-1"
            >
              <path
                d="M45.9,3.6c-23.5,0-42.5,19-42.5,42.5c0,23.5,19,42.5,42.5,42.5c23.5,0,42.5-19,42.5-42.5  C88.4,22.7,69.4,3.6,45.9,3.6z M43.7,21.1h4.3c0.5,0,0.9,0.4,0.9,0.9l-0.6,34.5c0,0.5-0.4,0.9-0.9,0.9h-3c-0.5,0-0.9-0.4-0.9-0.9  L42.8,22C42.8,21.5,43.2,21.1,43.7,21.1z M48.6,71.2c-0.8,0.8-1.7,1.1-2.7,1.1c-1,0-1.9-0.3-2.6-1c-0.8-0.7-1.3-1.8-1.3-2.9  c0-1,0.4-1.9,1.1-2.7c0.7-0.8,1.8-1.2,2.9-1.2c1.2,0,2.2,0.5,3,1.4c0.5,0.6,0.8,1.3,0.9,2.1C49.9,69.3,49.5,70.3,48.6,71.2z"
                fill="#525252"
              />
            </svg>
          </div>

          <span className="text-[#525252] text-xs font-medium font-[Inter]">
            We recommend setting your budget to $20,000 or more to accelerate
            data collection, enabling quicker campaign optimization and enhanced
            results.
          </span>
        </div>
      )}
      <div className="mt-[35px] w-full text-center">
        <button
          className="rounded-[5px] bg-main px-[50px] py-[10px] text-black font-semibold disabled:bg-gray-400 text-sm"
          disabled={!isValid}
        >
          Next Step
        </button>
      </div>
    </div>
  );
};

export default CampaignBudget;
