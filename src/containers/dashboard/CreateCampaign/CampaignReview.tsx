import { FC, useCallback, useEffect, useState, useRef } from "react";
import { Popconfirm } from "antd";
import APIInstance from "../../../api";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../store/authSlice";
import { AddCard } from "../../addCard";
import { Controller, useFormContext } from "react-hook-form";
import { ExclamationCircleFilled } from "@ant-design/icons";
import ErrorMessage from "../../../components/ErrorMessage";

interface ICampaignReview {
  currentAudience: (string | undefined)[];
  currentPrice: number;
  currentTarget: string;
  handleSaveDraft: () => void;
}

const CampaignReview: FC<ICampaignReview> = ({
  currentAudience,
  currentPrice,
  currentTarget,
  handleSaveDraft,
}) => {
  const {
    control,
    setValue,
    watch,
    formState: { isValid, errors },
  } = useFormContext();
  const [open, setOpen] = useState(false);
  const [cardList, setCardList] = useState<Array<any>>([]);
  const { email } = useSelector(selectAuth);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | ArrayBuffer | null>(
    null
  );
  const proofImage = watch('proofImage');

  const loadSavedCards = useCallback(async () => {
    const response = await APIInstance.get("stripe/card", {
      params: { email },
    });
    setCardList(response.data);
    setValue("currentCard", response.data?.[0]?.card_id);
  }, [email, setValue]);

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
    loadSavedCards();
  }, [loadSavedCards]);

  useEffect(() => {
    if (proofImage && typeof proofImage === "string") {
      setPreviewUrl(proofImage);
    }
    if (proofImage && typeof proofImage !== "string") {
      loadFilePreview(proofImage);
    }
  }, [proofImage, loadFilePreview]);

  const handleAddCard = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onAddCardSuccess = async (cards: Array<any>) => {
    setCardList(cards);
    setValue("currentCard", cards[0]?.card_id);
    handleClose();
  };

  return (
    <>
      <div className="w-[720px]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <p className="text-[15px] font-[Inter] font-semibold">
              What to Expect
            </p>
            <ul className="flex flex-col gap-3 list-decimal text-xs 2xl:text-xs font-[Inter] pl-4">
              <li>
                <b className="font-semibold">Campaign Activation:</b> Upon
                submission, your campaign is now in the queue for launch. Our
                team may reach out for any additional details to ensure we fully
                align with your objectives. Once everything is set, we'll
                proceed with the activation.
              </li>
              <li>
                <b className="font-semibold">Distribution and Tracking:</b> Your
                campaign will be disseminated across the most fitting
                newsletters to reach your intended audience. Rest assured, every
                click and interaction is meticulously tracked. Your dedicated
                dashboard will offer real-time analytics to monitor the
                campaign's impact.
              </li>
              <li>
                <b className="font-semibold">Ongoing Optimization:</b> We
                believe in dynamic campaigns. Our platform continually reviews
                performance data to refine and improve distribution, ensuring
                your budget is utilized for maximal impact and ROI.
              </li>
              <li>
                <b className="font-semibold">Weekly Reporting and Billing:</b>{" "}
                Expect transparent weekly reports with key metrics that reflect
                your campaign's traction. Billing will correspond to the weekly
                performance, providing a clear view of your investment's return.
              </li>
              <li>
                <b className="font-semibold">Campaign Conclusion:</b> When your
                campaign reaches the budget threshold, it will conclude. You'll
                be provided with a comprehensive report that captures
                performance, yields insights, and guides potential next steps
                for ongoing engagement and growth.
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-[15px] font-[Inter]">
              Review
            </h2>
            {!!(currentAudience || []).length && currentPrice && (
              <div className="">
                <p className="py-2 text-xs ">
                  <span className="font-medium me-2">⭐ Dates:</span>The
                  campaign will start from today until the budget is reached.
                </p>
                <p className="py-2 text-xs ">
                  <span className="font-medium me-2">⭐ Max Budget:</span>
                  {`$${currentPrice}`}
                </p>
                <p className="py-2 text-xs ">
                  <span className="font-medium me-2">
                    ⭐ Target Audience Demographic:
                  </span>
                  {currentTarget === "consumer" ? "Consumers" : "Professional"}
                </p>
                <p className="py-2 text-xs ">
                  <span className="font-medium me-2">
                    ⭐ Target Audience Tags:
                  </span>
                  {(currentAudience || []).map((item: any) => item).join(", ")}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold text-[15px] font-[Inter]">
              Billing Setup
            </h2>
            <p className="font-[Inter] text-xs font-normal text-secondry1 mb-0">
              All campaign activity is billed at the end of every week or when
              your account hits its billing threshold. You will only be charged
              for unique clicks to ensure all clicks are quality and verified.
            </p>
          </div>
          <div className="w-full grid grid-cols-[410px_repeat(1,1fr)]">
            <div className="flex flex-col text-left gap-1">
              <p className="font-[Inter] text-[14px] 2xl:text-base font-medium mb-0 flex items-center">
                Select Card Details
              </p>
              <Controller
                name="currentCard"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-[400px] pl-[16px] py-2 border-[1px] border-[#7f8182] rounded-[10px] font-[Inter] font-medium text-sm 2xl:text-md"
                  >
                    {cardList.map((item: any, index) => (
                      <option value={item.card_id} key={index}>
                        {item.brand.toUpperCase()}
                        {` **** **** **** ${item.last4}`}
                      </option>
                    ))}
                  </select>
                )}
              />
              <ErrorMessage message={errors["currentCard"]?.message} />
              {/* <button type="button" className="text-primary font-[Inter] mx-3">
                Refresh
              </button> */}
            </div>

            <div className="flex flex-col ms-[18px] gap-1">
              <p className="font-[Inter] text-[14px] 2xl:text-base font-medium mb-0 flex items-center">
                Add New Card
              </p>
              <button
                type="button"
                className="flex h-full px-[17px] items-center justify-center text-[#7f8182] w-full rounded-[10px] border-[1px] border-[#7f8182] text-xs 2xl:text-md"
                onClick={handleAddCard}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="me-[9px]"
                >
                  <path
                    d="M7 10H13M10 7V13M1 10C1 11.1819 1.23279 12.3522 1.68508 13.4442C2.13738 14.5361 2.80031 15.5282 3.63604 16.364C4.47177 17.1997 5.46392 17.8626 6.55585 18.3149C7.64778 18.7672 8.8181 19 10 19C11.1819 19 12.3522 18.7672 13.4442 18.3149C14.5361 17.8626 15.5282 17.1997 16.364 16.364C17.1997 15.5282 17.8626 14.5361 18.3149 13.4442C18.7672 12.3522 19 11.1819 19 10C19 7.61305 18.0518 5.32387 16.364 3.63604C14.6761 1.94821 12.3869 1 10 1C7.61305 1 5.32387 1.94821 3.63604 3.63604C1.94821 5.32387 1 7.61305 1 10Z"
                    stroke="#7F8182"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Add a Card
              </button>
            </div>
          </div>
          <div className="">
            <p className="font-[Inter] text-[14px] 2xl:text-base font-medium flex items-center">
              Paid Already?
            </p>
            <p className="font-[Inter] text-xs font-normal text-secondry1 mt-1">
              Upload Transfer Confirmation
            </p>
            <div className="flex mt-2">
              <button
                type="button"
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.click();
                }}
                className={`overflow-hidden truncate h-[42px] px-2 text-xs py-2 flex items-center justify-center text-gray-800 text-left font-[Inter] w-[160px] border-dashed border-[1px] bg-white rounded border-secondry2 ${!!errors["image"] ? "border-[red]" : ""
                  }`}
              >
                <>
                  <span className="text-secondry2 font-[Inter] text-xs">
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
              name="proofImage"
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
          </div>
          <div className="flex justify-top">
            <Controller
              name="termsTermPrivacyPolicy"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="me-[9px] text-main focus:ring-0 mt-1"
                  type="checkbox"
                />
              )}
            />

            <p className="text-xs text-primary font-[Inter] font-normal">
              I agree and authorize weekly automatic billing for accrued click
              costs per the{" "}
              <a
                target="_blank"
                href="https://www.presspool.ai/terms"
                rel="noreferrer"
                className="underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                className="underline"
                target="_blank"
                href="https://www.presspool.ai/privacy-policy"
                rel="noreferrer"
              >
                Privacy Policy
              </a>
              . This authorization will continue until I cancel in accordance
              with the provided terms.
            </p>
          </div>
        </div>

        <div className="mt-[35px] text-center gap-4 flex justify-center">
          {/* {currentAudience.length >= 1 && Number(currentPrice) >= 10000 && ( */}
          <Popconfirm
            title="Confirm"
            description={
              <p className="pr-2.5">
                Once your campaign is live, you can’t make edits.
                <br /> Are you sure everything is set? It’s a good idea to
                double-check.
              </p>
            }
            icon={
              <div className="ml-2.5">
                <ExclamationCircleFilled />
              </div>
            }
            // open={openConfirm}
            // onConfirm={handleSubmit}
            // onCancel={() => setOpenConfirm(false)}
            okButtonProps={{
              style: {
                background: "#7FFBAE",
                padding: "1rem 1rem 1rem 1rem",
                color: "black",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "10px",
              },
              htmlType: "submit",
            }}
            cancelButtonProps={{
              style: {
                padding: "1rem 1rem 1rem 1rem",
                color: "black",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              },
            }}
            okText="Confirm"
            cancelText="Cancel"
            getPopupContainer={() =>
              document.getElementById("confirm-submit-popup") as HTMLElement
            }
          >
            <button
              type="button"
              className="rounded-[10px] text-primary bg-main px-[50px] 2xl:px-[60px] py-[10px] font-semibold mt-2 disabled:bg-gray-300 text-sm 2xl:text-md"
              disabled={!isValid}
            >
              Submit
            </button>
          </Popconfirm>
          <button
            type="button"
            className="rounded-[10px] text-primary bg-transparent px-[50px] 2xl:px-[60px] py-[10px] font-semibold mt-2 disabled:bg-gray-300 text-sm 2xl:text-md"
            onClick={handleSaveDraft}
          >
            Save Draft
          </button>
        </div>
        <div id="confirm-submit-popup"></div>
      </div>
      {open ? (
        <AddCard
          open={open}
          onClose={handleClose}
          onSuccess={onAddCardSuccess}
        />
      ) : null}
    </>
  );
};

export default CampaignReview;
