import { motion } from "framer-motion";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { FADE_RIGHT_ANIMATION_VARIANTS } from "../../../utils/TransitionConstants";
import CustomTooltip from "../../../components/CustomTooltip";
import ALogoImage from "../../../assets/icon/alogo.png";
import SampleLogo from "../../../assets/logo/logo.png";
import { Controller, useFormContext } from "react-hook-form";
import ErrorMessage from "../../../components/ErrorMessage";

const CampaignContent: FC = () => {
  const {
    control,
    setValue,
    watch,
    formState: { isValid, errors },
    trigger,
  } = useFormContext();

  const [previewUrl, setPreviewUrl] = useState<string | ArrayBuffer | null>(
    null
  );

  const addtionalFileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalFiles = watch("additionalFiles");
  const image = watch("image");
  const cta = watch("cta");

  const loadFilePreview = useCallback((file?: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  useEffect(() => {
    if (image && typeof image === "string") {
      setPreviewUrl(image);
    }
    if (image && typeof image !== "string") {
      loadFilePreview(image);
    }
  }, [image, loadFilePreview]);

  // useEffect(() => {
  //   trigger();
  // }, [trigger]);

  return (
    <motion.div
      variants={FADE_RIGHT_ANIMATION_VARIANTS}
      initial="hidden"
      animate="show"
    >
      <div className="grid grid-cols-[410px_repeat(1,1fr)] gap-8 h-full w-full">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-[Inter] text-sm 2xl:text-base font-semibold flex">
              Headline
              <span className="ms-1 text-[red] text-xs">*</span>
              <CustomTooltip
                title="The headline of your campaign. This should be roughly 7 words
                or less and have a specific outcome.
                (Ex. Presspool will 10x user growth without PR)"
              />
            </p>
            <Controller
              name="headLine"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className={`w-full rounded-lg text-sm border-[1px] focus:ring-0 focus:border-main py-2 px-3 ${
                    !!errors[field.name] ? "border-[#ff0000]" : ""
                  }`}
                  maxLength={60}
                />
              )}
            />
            <ErrorMessage message={errors["headLine"]?.message} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-[Inter] text-sm 2xl:text-base font-semibold flex">
              Body
              <span className="ms-1 text-[red] text-xs">*</span>
              <CustomTooltip title="The body of your campaign. This should be 500 characters or less and describe how you can help your ideal customer or audience achieve the promise from the headline." />
            </p>
            <Controller
              name="body"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  className={`mb-0 w-full text-sm rounded-lg border-[1px] focus:ring-0 focus:border-main py-2 px-3 ${
                    !!errors[field.name] ? "border-[#ff0000]" : ""
                  }`}
                  maxLength={500}
                  rows={5}
                  data-tooltip-id="body"
                />
              )}
            />
            <ErrorMessage message={errors["body"]?.message} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-[Inter] text-sm 2xl:text-base font-semibold mb-0 flex">
              CTA Text
              <span className="ms-1 text-[red] text-xs">*</span>
              <CustomTooltip title='The call to action for your button. This should be something like "Free trial" or "Learn more" or "Try for free"' />
            </p>
            <Controller
              name="cta"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className={`w-full rounded-lg text-sm border-[1px] focus:ring-0 focus:border-main py-2 px-3 ${
                    !!errors[field.name] ? "border-[#ff0000]" : ""
                  }`}
                  maxLength={20}
                />
              )}
            />
            <ErrorMessage message={errors["cta"]?.message} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-[Inter] text-sm 2xl:text-base font-semibold mb-0 flex items-center">
              CTA Link
              <span className="ms-1 text-[red] text-xs">*</span>
              <CustomTooltip
                title={
                  <p>
                    Where do you want to direct the clicks to? <br /> URL must
                    stars with "https://"
                  </p>
                }
              />
            </p>
            <Controller
              name="pageUrl"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className={`w-full rounded-lg border-[1px] text-sm focus:ring-0 focus:border-main py-2 px-3 ${
                    !!errors[field.name] ? "border-[red]" : ""
                  }`}
                />
              )}
            />
            <ErrorMessage message={errors["pageUrl"]?.message} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-[Inter] text-sm 2xl:text-base font-semibold mb-0 flex">
              Hero Image
              <span className="ms-1 text-[red] text-xs">*</span>
              <CustomTooltip title="Recommended dimensions: 1200px X 600px" />
            </p>
            <p className="text-[#7f8182] font-[Inter] text-[13px] font-medium">
              Click below to add your image
            </p>
            <div className="flex">
              <button
                type="button"
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.click();
                }}
                className={`overflow-hidden truncate px-2 text-sm py-2 flex items-center justify-center text-gray-800 text-left font-[Inter] w-[160px] border-dashed border-[1px] bg-white rounded ${
                  !image ? "border-[red]" : ""
                }`}
              >
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 -960 960 960"
                    width="24"
                    className="me-1 -ms-1"
                  >
                    <path
                      fill="#505050"
                      d="M460-336.923v-346l-93.231 93.231-28.308-28.769L480-760l141.539 141.539-28.308 28.769L500-682.923v346h-40ZM264.615-200Q237-200 218.5-218.5 200-237 200-264.615v-96.923h40v96.923q0 9.23 7.692 16.923Q255.385-240 264.615-240h430.77q9.23 0 16.923-7.692Q720-255.385 720-264.615v-96.923h40v96.923Q760-237 741.5-218.5 723-200 695.385-200h-430.77Z"
                    />
                  </svg>
                  <span className="text-[#7F8182] font-[Inter] text-sm">
                    Upload image
                  </span>
                </>
              </button>
              {previewUrl ? (
                <div
                  className="relative ms-2 cursor-pointer"
                  onClick={() => {
                    setValue("image", null);
                    setPreviewUrl(null);
                  }}
                >
                  <img
                    src={previewUrl as string}
                    alt="sample logo"
                    className="h-[42px] w-[50px] object-cover"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    className="w-[18px] h-[18px] absolute -top-2.5 -right-2.5"
                  >
                    <path
                      fill="red"
                      d="m336-307.692 144-144 144 144L652.308-336l-144-144 144-144L624-652.308l-144 144-144-144L307.692-624l144 144-144 144L336-307.692ZM480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120Z"
                    />
                  </svg>
                </div>
              ) : null}
            </div>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    field.onChange(e.target?.files?.[0]);
                    loadFilePreview(e.target?.files?.[0]);
                    e.target.value = null as any;
                  }}
                />
              )}
            />
            <ErrorMessage message={!image ? "Select hero image" : ""} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-[Inter] text-sm 2xl:text-base font-semibold mb-0 flex">
              Additional Assets
              <CustomTooltip title="Additional files for your campaign" />
            </p>
            <p className="text-[#7f8182] font-[Inter] text-[13px] font-medium mb-0">
              Click below to add your files
            </p>
            <div className="flex">
              <button
                type="button"
                onClick={() => {
                  if (addtionalFileInputRef.current)
                    addtionalFileInputRef.current.click();
                }}
                className="overflow-hidden truncate px-2 text-sm py-2 flex items-center justify-center text-gray-800 text-left font-[Inter] w-[160px] border-dashed border-[1px] bg-white rounded border-[#7F8182]"
              >
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 -960 960 960"
                    width="24"
                    className="me-1 -ms-1"
                  >
                    <path
                      fill="#505050"
                      d="M460-336.923v-346l-93.231 93.231-28.308-28.769L480-760l141.539 141.539-28.308 28.769L500-682.923v346h-40ZM264.615-200Q237-200 218.5-218.5 200-237 200-264.615v-96.923h40v96.923q0 9.23 7.692 16.923Q255.385-240 264.615-240h430.77q9.23 0 16.923-7.692Q720-255.385 720-264.615v-96.923h40v96.923Q760-237 741.5-218.5 723-200 695.385-200h-430.77Z"
                    />
                  </svg>
                  <span className="text-[#7F8182] font-[Inter] text-sm">
                    Upload files
                  </span>
                </>
              </button>
              {!!(additionalFiles?.length ?? 0) ? (
                <div
                  role="button"
                  className="relative ms-2 cursor-pointer flex items-center"
                  onClick={() => {
                    setValue("additionalFiles", null);
                  }}
                >
                  <p className="text-xs">
                    {`${additionalFiles?.length ?? 0} file${
                      (additionalFiles?.length ?? 0) > 1 ? "s" : ""
                    } are selected`}
                  </p>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    className="w-[18px] h-[18px] absolute -top-1 right-0"
                  >
                    <path
                      fill="red"
                      d="m336-307.692 144-144 144 144L652.308-336l-144-144 144-144L624-652.308l-144 144-144-144L307.692-624l144 144-144 144L336-307.692ZM480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120Z"
                    />
                  </svg>
                </div>
              ) : null}
            </div>
            <Controller
              name="additionalFiles"
              control={control}
              render={({ field }) => (
                <input
                  ref={addtionalFileInputRef}
                  type="file"
                  hidden
                  multiple
                  accept="*"
                  onChange={(e) => field.onChange(e.target?.files)}
                />
              )}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-[Inter] text-sm 2xl:text-base font-semibold flex">
            Preview
            <CustomTooltip title="The body of your campaign. This should be 500 characters or less and describe how you can help your ideal customer or audience achieve the promise from the headline." />
          </p>
          <div className="h-full overflow-hidden relative flex flex-col items-center bg-[#43474A] rounded-[5px] px-2.5 py-6">
            {/* Content for Campaign */}
            <div className="bg-[#D1CEFF] w-full flex items-center justify-center rounded-[14px]">
              {/* <p className='text-black border-black border-[5px] p-3 text-3xl 2xl:text-lg font-bold'>ALOGO</p> */}
              <img alt="alogo" src={ALogoImage} className="h-[100px]" />
            </div>
            <p className="text-gray-200 my-4 text-xs font-normal">
              Happy Friday AI legends,
              <br />
              <br />
              Today we are diving deep into some of the newest AI solutions that
              are taking place this week.
              <br />
              <br />
              With GPT’s just being released, the excitement has continued to
              grow at an unprecedented rate for AI products and solutions that
              are reshaping how consumers and executives alike do their work
              better, faster and easier.
            </p>
            <div className="bg-white z-10 w-full rounded-[14px] flex flex-col h-full">
              <div className="py-4 px-2 flex items-center justify-center">
                <img
                  src={(previewUrl as string) || SampleLogo}
                  alt="sample logo"
                  className="h-[140px] object-cover"
                />
              </div>
              <div className="pb-2 px-2 flex flex-col items-center justify-between flex-1">
                <div className="text-left w-full">
                  <h2 className="w-full text-left font-bold font-[Inter] text-base break-words">
                    {watch("headLine")}
                  </h2>
                  <p className="mt-4 w-full text-left font-[Inter] text-black text-sm break-words">
                    {watch("body")}
                  </p>
                </div>
                {cta && (
                  <div className="mt-4 flex justify-between w-full items-center">
                    <button
                      type="button"
                      className="font-[Inter] text-gray-500 px-4 py-2 rounded-[5px] border-[1px] text-sm font-medium border-[#D1CEFF]"
                    >
                      {cta}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-[35px] text-center">
        <button
          type="submit"
          className="rounded-[5px] text-black font-semibold bg-main px-[50px] py-[10px] text-sm disabled:bg-gray-400"
          disabled={!isValid}
        >
          Next Step
        </button>
      </div>
    </motion.div>
  );
};

export default CampaignContent;
