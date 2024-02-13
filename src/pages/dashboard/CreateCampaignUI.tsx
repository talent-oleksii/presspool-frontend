import React, {
  useEffect,
  useImperativeHandle,
  useRef,
  forwardRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { Tooltip } from "antd";
import validator from "validator";

import SampleLogo from "../../assets/logo/logo.png";
import ALogoImage from "../../assets/icon/alogo.png";

import APIInstance from "../../api";
import { selectAuth } from "../../store/authSlice";
import CreatableSelect from "react-select/creatable";
import CustomTooltip from "../../components/CustomTooltip";

interface typeCreateCampaignUI {
  setLoading: Function;
  setUIContent?: Function;
  uiData?: any;
  afterChange?: Function;
  setUrl: Function;
  setCampaignName: Function;
  url?: string;
  campaignName?: string;
}

const CreateCampaignUI = forwardRef((props: typeCreateCampaignUI, ref) => {
  const { setUrl, setCampaignName, url, campaignName } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addtionalFileInputRef = useRef<HTMLInputElement>(null);
  const { email } = useSelector(selectAuth);

  const [headLine, setHeadLine] = useState("");
  const [body, setBody] = useState("");
  const [cta, setCta] = useState("");
  const [image, setImage] = useState<any>(null);
  const [file, setFile] = useState<any>("");
  const [pageUrl, setPageUrl] = useState("");
  const [asterick, setAsterick] = useState(false);
  const [additionalFiles, setAdditionalFiles] = useState<any>([]);
  const [additionalFileCount, setAdditionalFileCount] = useState<number>(0);

  useEffect(() => {
    if (props.uiData) {
      setHeadLine(props.uiData.headline);
      setBody(props.uiData.body);
      setCta(props.uiData.cta);
      setImage(props.uiData.image);
      const aFiles = props.uiData.additional_files
        ? props.uiData.additional_files.split(",")
        : [""];
      setAdditionalFileCount(aFiles[0] !== "" ? aFiles.length : 0);
      setPageUrl(props.uiData.page_url || "");
    }
  }, [props]);

  useEffect(() => {
    if (additionalFiles.length > 0)
      setAdditionalFileCount(additionalFiles.length);
  }, [additionalFiles]);

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (!file) return;
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalFileChange: React.ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    if (e.target.files) {
      setAdditionalFiles(e.target.files);
    }
  };

  useImperativeHandle(ref, () => ({
    handleSave,
  }));

  const handleSave = () => {
    return new Promise((resolve, reject) => {
      if (
        headLine.length <= 0 ||
        body.length <= 0 ||
        cta.length <= 0 ||
        !image ||
        (image && image.length <= 0) ||
        !validator.isURL(pageUrl) ||
        !pageUrl.startsWith("https://")
      ) {
        setAsterick(true);
        return;
      }
      setAsterick(false);
      props.setLoading(true);
      const formData = new FormData();
      formData.append("email", email);
      formData.append("headLine", headLine);
      formData.append("cta", cta);
      formData.append("body", body);
      formData.append("image", file);
      for (const aFile of additionalFiles) {
        formData.append("additional_file", aFile);
      }
      formData.append("pageUrl", pageUrl);
      if (!props.uiData) {
        APIInstance.post("data/campaign_ui", formData)
          .then((data) => {
            if (props.setUIContent) props.setUIContent(data.data);
            resolve(true);
          })
          .catch((err) => {
            console.log("errr:", err);
            reject();
          })
          .finally(() => {
            props.setLoading(false);
          });
      } else {
        formData.append("id", props.uiData.id);
        APIInstance.put("data/campaign_ui", formData)
          .then((data) => {
            if (props.setUIContent) props.setUIContent(data.data);
            resolve(true);
          })
          .catch((error: any) => {
            console.log("update campaign ui error:", error);
            reject();
          })
          .finally(() => props.setLoading(false));
      }
    });
  };

  return (
    <div className="h-full w-[720px] flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-7">
        <div className="flex flex-col gap-2">
          <p className="text-base 2xl:font-lg font-[Inter] text-black font-semibold flex">
            Campaign Name
            <CustomTooltip title="Please enter the name of your campaign" />
          </p>
          <input
            className="px-3 py-2 rounded-[8px] w-full border text-sm font-[Inter] border-[#7F8182]  focus:border-main focus:ring-0"
            // placeholder="Give your campaign a name"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-base 2xl:font-lg font-[Inter] text-black font-semibold flex">
            Website URL
            <CustomTooltip title="Please enter your full site URL. Example: https://www.test.com/" />
          </p>
          <input
            className="px-3 py-2 rounded-[8px] w-full border font-[Inter] text-sm border-[#7F8182]  focus:border-main focus:ring-0"
            // placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-base 2xl:font-lg font-[Inter] font-semibold">
          Who are you targeting
        </p>
        <div className="grid grid-cols-2 w-full gap-7">
          {/* ${currentTarget === "consumer"
                    ? "bg-black text-white"
                    : "bg-[#f5f5f5] text-black"
            } */}
          <button
            className={`relative w-1/2 font-[Inter] font-semibold text-sm flex w-full rounded-lg z-[1] px-4 py-[18px] flex-col items-center justify-center transition-all duration-300 border-black border-[1px]`}
            // onClick={() => setCurrentTarget("consumer")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="37"
              height="36"
              viewBox="0 0 37 36"
              fill="none"
              className="mb-[10px]"
            >
              <path
                d="M10.7222 35V33.1111C10.7222 32.1092 11.1319 31.1483 11.8613 30.4398C12.5906 29.7313 13.5797 29.3333 14.6111 29.3333H22.3889C23.4203 29.3333 24.4094 29.7313 25.1387 30.4398C25.8681 31.1483 26.2778 32.1092 26.2778 33.1111V35M28.2222 14.2222H32.1111C33.1425 14.2222 34.1317 14.6202 34.861 15.3287C35.5903 16.0372 36 16.9981 36 18V19.8889M1 19.8889V18C1 16.9981 1.40972 16.0372 2.13903 15.3287C2.86834 14.6202 3.85749 14.2222 4.88889 14.2222H8.77778M14.6111 19.8889C14.6111 20.8908 15.0208 21.8517 15.7501 22.5602C16.4794 23.2687 17.4686 23.6667 18.5 23.6667C19.5314 23.6667 20.5206 23.2687 21.2499 22.5602C21.9792 21.8517 22.3889 20.8908 22.3889 19.8889C22.3889 18.887 21.9792 17.9261 21.2499 17.2176C20.5206 16.5091 19.5314 16.1111 18.5 16.1111C17.4686 16.1111 16.4794 16.5091 15.7501 17.2176C15.0208 17.9261 14.6111 18.887 14.6111 19.8889ZM24.3333 4.77778C24.3333 5.77971 24.7431 6.7406 25.4724 7.44907C26.2017 8.15754 27.1908 8.55556 28.2222 8.55556C29.2536 8.55556 30.2428 8.15754 30.9721 7.44907C31.7014 6.7406 32.1111 5.77971 32.1111 4.77778C32.1111 3.77585 31.7014 2.81496 30.9721 2.10649C30.2428 1.39801 29.2536 1 28.2222 1C27.1908 1 26.2017 1.39801 25.4724 2.10649C24.7431 2.81496 24.3333 3.77585 24.3333 4.77778ZM4.88889 4.77778C4.88889 5.77971 5.29861 6.7406 6.02792 7.44907C6.75723 8.15754 7.74638 8.55556 8.77778 8.55556C9.80918 8.55556 10.7983 8.15754 11.5276 7.44907C12.2569 6.7406 12.6667 5.77971 12.6667 4.77778C12.6667 3.77585 12.2569 2.81496 11.5276 2.10649C10.7983 1.39801 9.80918 1 8.77778 1C7.74638 1 6.75723 1.39801 6.02792 2.10649C5.29861 2.81496 4.88889 3.77585 4.88889 4.77778Z"
                // stroke={`${currentTarget === "consumer" ? "white" : "black"
                //   }`}
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Consumers
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="absolute right-[6px] top-[6px]"
            >
              <path
                d="M12.0001 1.07191C13.2068 1.7686 14.2105 2.76833 14.912 3.97215C15.6135 5.17597 15.9885 6.54213 15.9997 7.93538C16.011 9.32864 15.6582 10.7007 14.9762 11.9157C14.2942 13.1307 13.3068 14.1465 12.1115 14.8626C10.9163 15.5787 9.55481 15.9702 8.16178 15.9984C6.76875 16.0266 5.39251 15.6904 4.16929 15.0233C2.94608 14.3562 1.91832 13.3811 1.18775 12.1947C0.457175 11.0083 0.049128 9.65168 0.00400014 8.25911L0 7.99991L0.00400014 7.74071C0.0488032 6.3591 0.450844 5.01268 1.17093 3.83271C1.89101 2.65273 2.90456 1.67948 4.11276 1.00782C5.32097 0.336164 6.6826 -0.0109686 8.0649 0.000264196C9.44721 0.011497 10.803 0.380712 12.0001 1.07191ZM10.9657 5.83431C10.828 5.69657 10.6447 5.61383 10.4503 5.6016C10.2559 5.58938 10.0636 5.64851 9.90972 5.76791L9.83452 5.83431L7.20009 8.46791L6.16568 7.43431L6.09048 7.36791C5.93654 7.2486 5.74437 7.18953 5.54999 7.20179C5.35562 7.21406 5.17239 7.29681 5.03467 7.43452C4.89695 7.57224 4.81421 7.75546 4.80194 7.94984C4.78968 8.14421 4.84874 8.33638 4.96806 8.49031L5.03446 8.56551L6.63448 10.1655L6.70968 10.2319C6.84998 10.3408 7.02251 10.3998 7.20009 10.3998C7.37767 10.3998 7.55019 10.3408 7.69049 10.2319L7.7657 10.1655L10.9657 6.96551L11.0321 6.89031C11.1515 6.73639 11.2107 6.54419 11.1984 6.34977C11.1862 6.15535 11.1035 5.97207 10.9657 5.83431Z"
                // fill={`${currentTarget === "consumer" ? "#7FFBAE" : "white"
                //   }`}
              />
            </svg>
          </button>
          {/* ${currentTarget === "professional"
                    ? "bg-black text-white"
                    : "bg-[#f5f5f5] text-black"
              } */}
          <button
            className={`relative w-1/2 font-[Inter] font-semibold text-sm flex rounded-lg px-4 z-[1] py-[18px] w-full flex-col items-center justify-center transition-all duration-300 border-black border-[1px]`}
            // onClick={() => setCurrentTarget("professional")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="37"
              height="36"
              viewBox="0 0 37 36"
              fill="none"
              className="mb-[10px]"
            >
              <path
                d="M16.5556 6.66667C16.5556 8.16956 17.5799 9.6109 19.4031 10.6736C21.2264 11.7363 23.6993 12.3333 26.2778 12.3333C28.8563 12.3333 31.3292 11.7363 33.1524 10.6736C34.9757 9.6109 36 8.16956 36 6.66667M16.5556 6.66667C16.5556 5.16377 17.5799 3.72243 19.4031 2.65973C21.2264 1.59702 23.6993 1 26.2778 1C28.8563 1 31.3292 1.59702 33.1524 2.65973C34.9757 3.72243 36 5.16377 36 6.66667M16.5556 6.66667V14.2222M36 6.66667V14.2222M16.5556 14.2222C16.5556 17.3521 20.9092 19.8889 26.2778 19.8889C31.6464 19.8889 36 17.3521 36 14.2222M16.5556 14.2222V21.7778M36 14.2222V21.7778M16.5556 21.7778C16.5556 24.9077 20.9092 27.4444 26.2778 27.4444C31.6464 27.4444 36 24.9077 36 21.7778M16.5556 21.7778V29.3333C16.5556 32.4632 20.9092 35 26.2778 35C31.6464 35 36 32.4632 36 29.3333V21.7778M8.77778 12.3333H3.91667C3.14312 12.3333 2.40125 12.6318 1.85427 13.1632C1.30729 13.6945 1 14.4152 1 15.1667C1 15.9181 1.30729 16.6388 1.85427 17.1701C2.40125 17.7015 3.14312 18 3.91667 18H5.86111C6.63466 18 7.37653 18.2985 7.92351 18.8299C8.47049 19.3612 8.77778 20.0819 8.77778 20.8333C8.77778 21.5848 8.47049 22.3054 7.92351 22.8368C7.37653 23.3682 6.63466 23.6667 5.86111 23.6667H1M4.88889 23.6667V25.5556M4.88889 10.4444V12.3333"
                // stroke={`${currentTarget === "professional" ? "white" : "black"
                //   }`}
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Professionals
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="absolute right-[6px] top-[6px]"
            >
              <path
                d="M12.0001 1.07191C13.2068 1.7686 14.2105 2.76833 14.912 3.97215C15.6135 5.17597 15.9885 6.54213 15.9997 7.93538C16.011 9.32864 15.6582 10.7007 14.9762 11.9157C14.2942 13.1307 13.3068 14.1465 12.1115 14.8626C10.9163 15.5787 9.55481 15.9702 8.16178 15.9984C6.76875 16.0266 5.39251 15.6904 4.16929 15.0233C2.94608 14.3562 1.91832 13.3811 1.18775 12.1947C0.457175 11.0083 0.049128 9.65168 0.00400014 8.25911L0 7.99991L0.00400014 7.74071C0.0488032 6.3591 0.450844 5.01268 1.17093 3.83271C1.89101 2.65273 2.90456 1.67948 4.11276 1.00782C5.32097 0.336164 6.6826 -0.0109686 8.0649 0.000264196C9.44721 0.011497 10.803 0.380712 12.0001 1.07191ZM10.9657 5.83431C10.828 5.69657 10.6447 5.61383 10.4503 5.6016C10.2559 5.58938 10.0636 5.64851 9.90972 5.76791L9.83452 5.83431L7.20009 8.46791L6.16568 7.43431L6.09048 7.36791C5.93654 7.2486 5.74437 7.18953 5.54999 7.20179C5.35562 7.21406 5.17239 7.29681 5.03467 7.43452C4.89695 7.57224 4.81421 7.75546 4.80194 7.94984C4.78968 8.14421 4.84874 8.33638 4.96806 8.49031L5.03446 8.56551L6.63448 10.1655L6.70968 10.2319C6.84998 10.3408 7.02251 10.3998 7.20009 10.3998C7.37767 10.3998 7.55019 10.3408 7.69049 10.2319L7.7657 10.1655L10.9657 6.96551L11.0321 6.89031C11.1515 6.73639 11.2107 6.54419 11.1984 6.34977C11.1862 6.15535 11.1035 5.97207 10.9657 5.83431Z"
                // fill={`${currentTarget === "professional" ? "#7FFBAE" : "white"
                //   }`}
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-base 2xl:font-lg font-[Inter] font-semibold">
          Please add specific audience industry tags you would like to target:
        </p>
        <CreatableSelect
          // styles={customStyles}
          // value={currentAudience}
          placeholder="Type your tag(s) and press enter"
          // onChange={(e) =>
          //   setCurrentAudience(
          //     e.map((item) => ({
          //       value: item.value,
          //       label: item.label,
          //     }))
          //   )
          // }
          isMulti
          // options={audience.map((item: any) => ({
          //   value: item.name,
          //   label: item.name,
          // }))}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-base 2xl:font-lg font-[Inter] font-semibold">
          Please add specific geography/region tags you would like to target:
        </p>
        <CreatableSelect
          // styles={customStyles}
          // value={currentRegions}
          placeholder="Type your tag(s) and press enter"
          // onChange={(e) =>
          //   setCurrentRegions(
          //     e.map((item) => ({
          //       value: item.value,
          //       label: item.label,
          //     }))
          //   )
          // }
          isMulti
          // options={regions.map((item: any) => ({
          //   value: item.name,
          //   label: item.name,
          // }))}
        />
      </div>
    </div>
    // <div className='col-span-full mt-5 text-center'>
    //   <button
    //     className='border-black bg-main rounded-[5px] px-5 py-2 text-white'
    //     onClick={handleSave}
    //   >
    //     Save & Continue
    //   </button>
    // </div>
    //           </Dialog.Panel>
    //         </Transition.Child>
    //       </div>
    //     </div>
    //   </Dialog >
    // </Transition.Root >
  );
});

export default CreateCampaignUI;
