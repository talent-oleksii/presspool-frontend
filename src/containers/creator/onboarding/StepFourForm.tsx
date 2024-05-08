import { FC, useEffect, useState } from "react";
import Mark from "../../../../src/assets/logo/logo.png";
import { Controller, useFormContext } from "react-hook-form";
import APIInstance from "../../../api";
import CreatableSelect from "react-select/creatable";
import ErrorMessage from "../../../components/ErrorMessage";
import { CampaignTargetType } from "../../../constants/constant";

const customStyles = (isError: boolean) => ({
  control: (provided: Record<string, unknown>) => ({
    ...provided,
    fontSize: "14px",
    border: !isError
      ? "1px solid #7F8182 !important"
      : "ipx solid red !important",
    borderRadius: "8px",
    // "&:hover": {
    //   border: "1px solid #ff8b67",
    //   boxShadow: "0px 0px 6px #ff8b67"
    // }
  }),
});

const StepFourForm: FC<{ audience: string; showHeader?: boolean }> = (
  props
) => {
  const [audiences, setAudiences] = useState<any>([]);
  const [regions, setRegions] = useState();
  const [positions, setPositions] = useState();
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const loadAudiences = async () => {
    const response = await APIInstance.get("data/audience");
    setAudiences(response.data || []);
  };

  const loadRegions = async () => {
    const response = await APIInstance.get("data/region");
    setRegions(
      (response.data || []).map((x: { name: string }) => ({
        value: x.name,
        label: x.name,
      }))
    );
  };

  const loadPositions = async () => {
    const response = await APIInstance.get("data/position");
    setPositions(
      (response.data || []).map((x: { name: string }) => ({
        value: x.name,
        label: x.name,
      }))
    );
  };

  useEffect(() => {
    loadAudiences();
    loadRegions();
    loadPositions();
  }, []);

  const processed = (data: any) => {
    const processedData: string[] = [];
    data.forEach((item: { value: string; label: string }) => {
      const values = item.value.split(",");
      values.forEach((value) => {
        if (!processedData.includes(value)) {
          processedData.push(value.trim());
        }
      });
    });
    return processedData;
  };

  return (
    <div className="max-w-[570px] m-auto flex flex-col gap-8">
      {/* Page Title  */}
      {props.showHeader ? (
        <div className="flex flex-col items-center">
          <img src={Mark} alt="mark" className="w-8" />
          <span className="text-black text-[30px] -tracking-[0.9px] font-bold leading-normal mt-6">
            Almost there...
          </span>
          <span className="text-[18px] font-normal -tracking-[0.54px] mt-2">
            Let’s dive a bit deeper into your audience.
          </span>
        </div>
      ) : null}
      {/* Page Content */}
      <div className="flex flex-col gap-4">
        <div className="self-start text-left !w-full">
          <label
            className={`flex flex-col font-[Inter] text-[14px] md:text-base 2xl:text-base font-medium -tracking-[.5px]`}
          >
            Please add specific industry tags that represent your audience base*
            <span className="text-[#7F8182] mb-1">
              (ex. AI, Cybersecurity, Health, Fintech etc)
            </span>
          </label>
          <Controller
            name="industry"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <CreatableSelect
                styles={customStyles(!!errors[name])}
                value={(value || []).map((x: string) => ({
                  value: x,
                  label: x,
                }))}
                placeholder="Type your tag(s) and press enter"
                onChange={(items) => onChange(processed(items))}
                isMulti
                options={audiences.map((x: { name: string }) => ({
                  value: x.name,
                  label: x.name,
                }))}
                closeMenuOnSelect={false}
              />
            )}
          />
          <ErrorMessage message={errors["industry"]?.message} />
        </div>
        {props.audience !== CampaignTargetType.CUSTOMER ? (
          <div className="self-start text-left !w-full">
            <label
              className={`flex flex-col font-[Inter] text-[14px] md:text-base 2xl:text-base font-medium -tracking-[.5px]`}
            >
              Please add the executive positions for your audience?
              <span className="text-[#7F8182]">
                (B2B examples: CMO, CTO, etc) (B2C examples: High net worth,
                female, etc.)
              </span>
            </label>
            <Controller
              name="position"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <CreatableSelect
                  styles={customStyles(!!errors[name])}
                  value={(value || []).map((x: string) => ({
                    value: x,
                    label: x,
                  }))}
                  placeholder="Type your tag(s) and press enter"
                  onChange={(items) => onChange(processed(items))}
                  isMulti
                  options={positions}
                  closeMenuOnSelect={false}
                />
              )}
            />
            <ErrorMessage message={errors["position"]?.message} />
          </div>
        ) : null}
        <div className="self-start text-left !w-full">
          <label
            className={`flex flex-col font-[Inter] text-[14px] md:text-base 2xl:text-base font-medium -tracking-[.5px]`}
          >
            Please add geography tags where your audience resides*
            <span className="text-[#7F8182]">
              (ex. United States, United Kingdom, Canada, etc)
            </span>
          </label>
          <Controller
            name="geography"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <CreatableSelect
                styles={customStyles(!!errors[name])}
                value={(value || []).map((x: string) => ({
                  value: x,
                  label: x,
                }))}
                placeholder="Type your tag(s) and press enter"
                onChange={(items) => onChange(processed(items))}
                isMulti
                options={regions}
                closeMenuOnSelect={false}
              />
            )}
          />
          <ErrorMessage message={errors["geography"]?.message} />
        </div>
        <div className="self-start text-left !w-full">
          <label
            className={`flex flex-col font-[Inter] text-[14px] md:text-base 2xl:text-base font-medium -tracking-[.5px]`}
          >
            How many unique clicks does your average campaign generate within 72
            hours?*
          </label>
          <Controller
            name="averageUniqueClick"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                className={`px-3 py-2 rounded-[10px] w-full border font-medium text-sm font-[Inter] border-secondry2 focus:border-main focus:ring-0 ${
                  !!errors[field.name] ? "border-[#ff0000]" : ""
                }`}
              />
            )}
          />
          <ErrorMessage message={errors["averageUniqueClick"]?.message} />
        </div>
        <div className="self-start text-left !w-full">
          <label
            className={`flex flex-col font-[Inter] text-[14px] md:text-base 2xl:text-base font-medium -tracking-[.5px]`}
          >
            What is the best rate you are willing to charge per unique click?*
            <span className="text-[#7F8182]">
              (Newsletters charging under $2 per unique click get 3-5x as many
              campaigns sent to them)
            </span>
          </label>
          <div
            className={`pl-2 pr-4 border-[1px] rounded-[10px] border-black w-full flex justify-between items-center relative ${
              !!errors["cpc"] ? "border-[#ff0000]" : ""
            }`}
          >
            <span className="text-sm font-medium pr-1">$</span>
            <Controller
              name="cpc"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  max={4}
                  min={0.1}
                  step={0.1}
                  className={`border-0 focus:border-0 focus:ring-0 focus-visible:outline-0 focus-visible:border-0 flex-1 font-medium text-sm 2xl:text-md px-0`}
                />
              )}
            />
          </div>
          <ErrorMessage message={errors["cpc"]?.message} />
        </div>
      </div>
      {/* Continue Button  */}
      <button className="rounded-[6px] bg-main w-full h-[52px] text-base font-semibold">
        Continue
      </button>
    </div>
  );
};

export default StepFourForm;
