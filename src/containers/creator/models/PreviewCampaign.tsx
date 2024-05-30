import { FC, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Avatar, message } from "antd";
import moment from "moment";
import { copyToClipboard, getPlaceHolder } from "../../../utils/commonUtils";
import { capitalize } from "lodash";
import { ConversionGoal } from "../../../constants/constant";
import PasteImage from "../../../assets/icon/paste.png";
import DownloadImage from "../../../assets/icon/downloads1.png";

interface typePreviewCampaign {
  show: boolean;
  onClose: Function;
  item: any;
}

const PreviewCampaign: FC<typePreviewCampaign> = ({
  show,
  onClose,
  item,
}: typePreviewCampaign) => {
  const [messageApi, contextHolder] = message.useMessage();
  const handleCopyToClipboard = async (text: string) => {
    try {
      await copyToClipboard(text);
      messageApi.open({
        type: "success",
        content: "Copied to clipboard!",
      });
    } catch (error) {}
  };

  const downloadImage = (url: string) => {
    window.open(url, "_blank");
  };

  const downloadAllImages = (files: string[]) => {
    files.forEach((url) => {
      window.open(url, "_blank");
    });
  };

  const files = !!item.additional_files ? item.additional_files.split(",") : [];

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {}}>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          {contextHolder}
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 bg-black/[.8]">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-100"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={`relative bg-white rounded-[10px] text-left flex flex-col shadow-xl border-[1px] border-black p-3 min-w-[500px] max-w-[500px]`}
              >
                <div className="flex flex-row gap-2 shrink-0 justify-between">
                  <div className="flex items-center">
                    <Avatar
                      src={item?.team_avatar}
                      className={`border border-solid border-secondry3 ${
                        item?.team_avatar ? "" : "bg-[#7f8182]"
                      }`}
                      size={66}
                    >
                      {!item?.team_avatar && getPlaceHolder(item.company)}
                    </Avatar>
                    <div className="ms-2">
                      <p className="text-primary text-[15px] font-[Inter] -tracking-[.36px]">
                        {item.name}
                      </p>
                      <p className="text-[#6C63FF] text-[10px] font-light font-[Inter] -tracking-[.36px] underline">
                        {item.url}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end	gap-[10px]">
                    <button onClick={() => onClose(false)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="34"
                        height="34"
                        viewBox="0 0 34 34"
                        fill="none"
                      >
                        <path
                          d="M13.4444 13.4444L20.5556 20.5556M20.5556 13.4444L13.4444 20.5556M17 1C29.8 1 33 4.2 33 17C33 29.8 29.8 33 17 33C4.2 33 1 29.8 1 17C1 4.2 4.2 1 17 1Z"
                          stroke="black"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <p className="font-normal text-[10px] text-secondry1">
                      Received on:{" "}
                      {moment(Number(item.create_time)).format("MM/DD/yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col h-full w-full mt-3">
                  <p className="text-primary font-[Inter] text-sm font-semibold font-normal flex gap-2">
                    Headline{" "}
                    <img
                      onClick={() => handleCopyToClipboard(item.headline)}
                      className="h-[16px] cursor-pointer"
                      src={PasteImage}
                      alt=""
                    />
                  </p>
                  <h2 className="font-[Inter] text-primary font-light text-[12px] -tracking-[.42px] mb-2">
                    {item?.headline}
                  </h2>
                  <p className="text-primary font-[Inter]  text-sm font-semibold flex gap-2">
                    Body{" "}
                    <img
                      onClick={() => handleCopyToClipboard(item.body)}
                      className="h-[16px] cursor-pointer"
                      src={PasteImage}
                      alt=""
                    />
                  </p>
                  <h2 className="font-[Inter] text-primary font-light text-[12px] -tracking-[.42px] mb-2">
                    {item?.body}
                  </h2>
                  <p className="text-primary font-[Inter]  text-sm font-semibold  flex gap-2">
                    CTA Text{" "}
                    <img
                      onClick={() => handleCopyToClipboard(item.cta)}
                      className="h-[16px] cursor-pointer"
                      src={PasteImage}
                      alt=""
                    />
                  </p>
                  <h2 className="font-[Inter] text-primary font-light text-[12px] -tracking-[.42px] mb-2">
                    {item?.cta}
                  </h2>
                  <p className="text-primary font-[Inter] text-sm font-semibold flex gap-2">
                    Tracking Link (MUST USE THIS EXACT LINK FOR ACCURATE
                    TRACKING){" "}
                    <img
                      onClick={() =>
                        handleCopyToClipboard(
                          `https://track.presspool.ai/${item?.uid}`
                        )
                      }
                      className="h-[16px] cursor-pointer"
                      src={PasteImage}
                      alt=""
                    />
                  </p>
                  <p className="text-[#6C63FF] font-[Inter] font-medium text-sm max-w-[700px] break-words mb-2">
                    {`https://track.presspool.ai/${item?.uid}`}
                  </p>

                  <p className="text-primary font-[Inter] text-[12px] font-semibold">
                    Conversion Goal
                  </p>
                  <h2 className="font-[Inter] text-primary font-light text-[12px] -tracking-[.42px] mb-2">
                    {item?.conversion
                      ? ConversionGoal[item?.conversion as never]
                      : ""}
                  </h2>
                  <div className="flex items-end justify-between w-full mb-2">
                    <div className="w-auto">
                      <p className="text-primary font-[Inter] text-[12px] font-semibold">
                        Target Audience
                      </p>
                      <p className="text-primary font-[Inter] font-medium -tracking-[.47px] flex gap-1">
                        <button className="bg-black px-2 py-1 rounded text-white font-medium text-[12px] font-[Inter]">
                          {capitalize(item.demographic)}
                        </button>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-end justify-between w-full mb-2">
                    <div className="w-auto">
                      <p className="text-primary font-[Inter] text-[12px] font-semibold">
                        Target Industrie(s)
                      </p>
                      <p className="text-primary font-[Inter] font-medium -tracking-[.47px] flex gap-1 flex-wrap">
                        {(item.audience || []).map(
                          (aud: string, index: number) => (
                            <button
                              key={index}
                              className="bg-black px-2 py-1 rounded text-white font-medium text-[12px] font-[Inter]"
                            >
                              {aud}
                            </button>
                          )
                        )}
                      </p>
                    </div>
                  </div>
                  {item.position && (
                    <div className="flex items-end justify-between w-full mb-2">
                      <div className="w-auto">
                        <p className="text-primary font-[Inter] text-[12px] font-semibold">
                          Target Demographic(s)
                        </p>
                        <p className="text-primary font-[Inter] font-medium -tracking-[.47px] flex gap-1 flex-wrap">
                          {(item.position || []).map(
                            (pos: string, index: number) => (
                              <button
                                key={index}
                                className="bg-black px-2 py-1 rounded text-white font-medium text-[12px] font-[Inter]"
                              >
                                {pos}
                              </button>
                            )
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-end justify-between w-full mb-2">
                    <div className="w-auto">
                      <p className="text-primary font-[Inter] text-[12px] font-semibold">
                        Target Region(s)
                      </p>
                      <p className="text-primary font-[Inter] font-medium -tracking-[.47px] flex gap-1 flex-wrap">
                        {(item.region || []).map(
                          (reg: string, index: number) => (
                            <button
                              key={index}
                              className="bg-black px-2 py-1 rounded text-white font-medium text-[12px] font-[Inter]"
                            >
                              {reg}
                            </button>
                          )
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="font-[Inter] leading-3.5 text-sm font-semibold mb-0 flex items-center pb-1 gap-2">
                    Logo Image{" "}
                    <img
                      onClick={() => downloadImage(item.image)}
                      className="h-[16px] cursor-pointer"
                      src={DownloadImage}
                      alt=""
                    />
                  </div>
                  <div className="font-[Inter] text-primary font-light text-[12px] -tracking-[.42px] mb-2">
                    <img
                      src={item?.image}
                      alt="sample logo"
                      className="h-[59px] w-[82px] object-cover rounded-[10px]"
                    />
                  </div>
                  {files.length > 0 ? (
                    <>
                      <div className="font-[Inter] leading-3.5 text-sm font-semibold mb-0 flex items-center pt-2 pb-1 gap-2">
                        Cover Image(s){" "}
                        <img
                          onClick={() => downloadAllImages(files)}
                          className="h-[16px] cursor-pointer"
                          src={DownloadImage}
                          alt=""
                        />
                      </div>
                      <div className="font-[Inter] text-primary font-medium text-[12px] -tracking-[.42px] mb-2 flex gap-[10px]">
                        {item?.additional_files
                          ? item.additional_files
                              ?.split(",")
                              .map((url: string) => (
                                <img
                                  src={url}
                                  alt="sample logo"
                                  className="h-[59px] w-[82px] object-cover rounded-[10px]"
                                />
                              ))
                          : null}
                      </div>
                    </>
                  ) : null}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default PreviewCampaign;
