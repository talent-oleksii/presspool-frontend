import { FC, useCallback, useEffect, useRef, useState } from "react";
import Mark from "../../../../src/assets/logo/logo.png";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../store/authSlice";
import { Avatar } from "antd";
import { getPlaceHolder } from "../../../utils/commonUtils";
import ErrorMessage from "../../../components/ErrorMessage";

const StepFourForm: FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const companyfileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<any>(null);
  const [companyImage, setCompanyImage] = useState<any>(null);
  const { creatorData } = useSelector(selectAuth);
  const { avatar, team_avatar } = creatorData;
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();
  const selectedAvatar = watch("avatar");
  const selectedTeamAvatar = watch("teamAvatar");

  const loadFilePreview = useCallback(
    (callback: (image: any) => void, file?: File) => {
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          callback(reader.result);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  useEffect(() => {
    setImage(avatar);
    setCompanyImage(team_avatar);
  }, [avatar, team_avatar]);

  useEffect(() => {
    if (selectedAvatar && typeof selectedAvatar === "string") {
      setImage(selectedAvatar);
    }
    if (selectedAvatar && typeof selectedAvatar !== "string") {
      loadFilePreview(setImage, selectedAvatar);
    }
    if (selectedTeamAvatar && typeof selectedTeamAvatar === "string") {
      setCompanyImage(selectedTeamAvatar);
    }
    if (selectedTeamAvatar && typeof selectedTeamAvatar !== "string") {
      loadFilePreview(setCompanyImage, selectedTeamAvatar);
    }
  }, [selectedAvatar, loadFilePreview, selectedTeamAvatar]);

  return (
    <div className="max-w-[400px] m-auto flex flex-col gap-8">
      {/* Page Title  */}
      <div className="flex flex-col items-center">
        <img src={Mark} alt="mark" className="w-8" />
        <span className="text-black text-[30px] -tracking-[0.9px] font-bold leading-normal mt-6">
          Branding
        </span>
        <span className="text-[18px] font-normal -tracking-[0.54px] mt-2">
          Let’s get your branding down
        </span>
      </div>
      {/* Page Content */}
      <div className="flex flex-col gap-4">
        <div
          className={`flex flex-col items-center justify-between gap-4 border border-solid border-[#7F8182] rounded-[10px] py-3 px-5`}
        >
          <div className="w-full">
            <p className="text-primary text-left text-lg font-medium -tracking-[.6px]">
              Profile Avatar
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
                      {getPlaceHolder(creatorData?.name)}
                    </div>
                  )}
                  <Controller
                    name="avatar"
                    control={control}
                    render={({ field }) => (
                      <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        className="w-[75px] h-[75px]"
                        accept="image/*"
                        onChange={(e) => {
                          field.onChange(e.target?.files?.[0]);
                          loadFilePreview(setImage, e.target?.files?.[0]);
                          e.target.value = null as any;
                        }}
                      />
                    )}
                  />
                </button>
                <button
                  type="button"
                  className="text-[#0af] text-xs -tracking-[.36px] font-medium mt-4"
                  onClick={() => {
                    if (fileInputRef.current) fileInputRef.current.click();
                  }}
                >
                  Upload
                </button>
              </div>
              <div className="text-left ms-2 flex flex-col gap-1">
                <p className="font-[Inter] text-primary text-base font-semibold -tracking-[.36px] leading-[16px]">
                  {creatorData?.name}
                </p>
                <p className="font-[Inter] text-secondry1 text-sm font-normal -tracking-[.3px]">
                  {creatorData?.email}
                </p>
              </div>
            </div>
            <ErrorMessage message={errors["avatar"]?.message} />
          </div>
          <div className="w-full">
            <p className="text-primary text-left text-lg font-medium -tracking-[.6px]">
              Publication Logo
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
                      {getPlaceHolder(creatorData?.newsletter)}
                    </div>
                  )}
                  <Controller
                    name="teamAvatar"
                    control={control}
                    render={({ field }) => (
                      <input
                        ref={companyfileInputRef}
                        type="file"
                        hidden
                        className="w-[75px] h-[75px]"
                        accept="image/*"
                        onChange={(e) => {
                          field.onChange(e.target?.files?.[0]);
                          loadFilePreview(
                            setCompanyImage,
                            e.target?.files?.[0]
                          );
                          e.target.value = null as any;
                        }}
                      />
                    )}
                  />
                </button>
                <button
                  type="button"
                  className="text-[#0af] text-xs -tracking-[.36px] font-medium mt-4"
                  onClick={() => {
                    if (companyfileInputRef.current)
                      companyfileInputRef.current.click();
                  }}
                >
                  Upload
                </button>
              </div>
              <div className="text-left ms-2 flex flex-col gap-1">
                <p className="font-[Inter] text-primary text-base font-semibold -tracking-[.36px] leading-[16px]">
                  {creatorData?.newsletter}
                </p>
                <p className="font-[Inter] text-secondry1 text-sm font-normal -tracking-[.3px]">
                  {creatorData?.website_url}
                </p>
              </div>
            </div>
            <ErrorMessage message={errors["teamAvatar"]?.message} />
          </div>
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
