import { FC, useCallback, useEffect, useRef, useState } from "react";
import Mark from "../../../../src/assets/logo/logo.png";
import { Controller, useFormContext } from "react-hook-form";
import { CheckCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import ErrorMessage from "../../../components/ErrorMessage";

const StepTwoForm: FC<{ showHeader?: boolean }> = ({showHeader}) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [previewUrl, setPreviewUrl] = useState<string | ArrayBuffer | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const image = watch("image");

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

  return (
    <div className="max-w-[570px] m-auto flex flex-col gap-8">
      {/* Page Title  */}
      {showHeader ? <div className="flex flex-col items-center">
        <img src={Mark} alt="mark" className="w-8" />
        <span className="text-black text-[30px] -tracking-[0.9px] font-bold leading-normal mt-6">
          Welcome to Presspool! Let’s get your account set up
        </span>
        <span className="text-[18px] font-normal -tracking-[0.54px] mt-2">
          First off, let’s dive in to your current audience size
        </span>
      </div>: null}
      {/* Page Content */}
      <div className="flex flex-col gap-5">
        <div
          className={`flex items-center justify-between gap-4 border border-solid border-[#7F8182] rounded-[10px] py-3 px-5`}
        >
          <div className="flex flex-col gap-2 items-start w-full">
            <span
              className={`text-[18px] text-left text-black font-semibold -tracking-[0.72px]`}
            >
              How many readers/subscribers do you current have?
            </span>
            <Controller
              name="subscribers"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  placeholder="Input exact current subscriber count here"
                  className={`px-3 py-2 rounded-[10px] w-full border font-medium text-sm font-[Inter] border-secondry2 focus:border-main focus:ring-0 ${!!errors[field.name] ? "border-[#ff0000]" : ""
                    }`}
                />
              )}
            />
            <ErrorMessage message={errors["subscribers"]?.message} />
          </div>
          <span className="bg-[#7FFBAE] min-w-[67px] h-[67px] rounded-[10px] flex items-center justify-center">
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
          className={`flex items-center justify-between gap-4 border border-solid border-[#7F8182] rounded-[10px] py-3 px-5`}
        >
          <div className="flex flex-col gap-2 items-start w-full">
            <span
              className={`text-[18px] text-left text-black font-semibold -tracking-[0.72px]`}
            >
              Subscriber Count Verification
            </span>
            <div
              role="button"
              onClick={() => {
                if (fileInputRef.current) fileInputRef.current.click();
              }}
              className="px-3 py-2 h-[90px] w-full border border-solid border-[#7F8182] rounded-[10px] cursor-pointer items-center flex justify-evenly p-[20px] gap-3 mb-2"
            >
              <PlusCircleOutlined style={{ fontSize: "22px" }} />
              <span className="text-left">
                Please upload any screenshot that verifies the above subscriber
                count
              </span>
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
            <ErrorMessage message={errors["image"]?.message} />
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
          <span className="bg-[#7FFBAE] min-w-[67px] h-[67px] rounded-[10px] flex items-center justify-center">
            <CheckCircleOutlined style={{ fontSize: "22px" }} />
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

export default StepTwoForm;
