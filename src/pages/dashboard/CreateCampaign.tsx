import { FC, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import CreatableSelect from "react-select/creatable";
import { useDispatch, useSelector } from "react-redux";
import { StylesConfig } from "react-select";
import { useLocation, useNavigate } from "react-router";
import validator from "validator";
import { Tooltip, Popconfirm } from "antd";

import APIInstance from "../../api";
import StripeUtil from "../../utils/stripe";
import Loading from "../../components/Loading";
import { selectAuth } from "../../store/authSlice";
import { setCardList, selectData, addCampaign } from "../../store/dataSlice";
import CreateCampaignUI from "./CreateCampaignUI";
import DialogUtils from "../../utils/DialogUtils";
import {
  FADE_RIGHT_ANIMATION_VARIANTS,
  FADE_UP_ANIMATION_VARIANTS,
} from "../../utils/TransitionConstants";
import SampleLogo from "../../assets/logo/logo.png";
import ALogoImage from "../../assets/icon/alogo.png";
import CustomTooltip from "../../components/CustomTooltip";

const customStyles: StylesConfig = {
  control: (provided: Record<string, unknown>, state: any) => ({
    ...provided,
    fontSize: "14px",
    border: state.isFocused ? "1px solid #7F8182" : "1px solid #7F8182",
    borderRadius: "8px",
    // "&:hover": {
    //   border: "1px solid #ff8b67",
    //   boxShadow: "0px 0px 6px #ff8b67"
    // }
  }),
};

const CreateCampaign: FC = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("detail");
  const [campaignName, setCampaignName] = useState("");
  const [currentTarget, setCurrentTarget] = useState("consumer");
  const [currentPrice, setCurrentPrice] = useState("10000");
  const [audience, setAudience] = useState<Array<any>>([]);
  const [regions, setRegions] = useState<Array<any>>([]);
  const [currentAudience, setCurrentAudience] = useState<Array<any>>([]);
  const [currentRegions, setCurrentRegions] = useState<Array<any>>([]);
  const [uiData, setUiData] = useState<any>(undefined);
  const [url, setUrl] = useState("");
  const [currentCard, setCurrentCard] = useState("");
  const [currentId, setCurrentId] = useState("");
  const [templateAudience, setTemplateAudience] = useState<Array<any>>([]);
  const [checked, setChecked] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);
  const navigator = useNavigate();

  const { email } = useSelector(selectAuth);
  const { cardList } = useSelector(selectData);

  const uiRef = useRef<any>();

  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      APIInstance.get("data/audience"),
      APIInstance.get("stripe/card", { params: { email } }),
      APIInstance.get("data/region"),
    ])
      .then((results: Array<any>) => {
        const audienceData = results[0].data;
        setAudience(audienceData);
        setRegions(results[2].data);
        dispatch(setCardList({ cardList: results[1].data }));
        if (results[1].data.length >= 1) {
          setCurrentCard(results[1].data[0].card_id);
        }
      })
      .catch((err) => {
        console.log("err:", err);
      })
      .finally(() => setLoading(false));

    const index = location.pathname.lastIndexOf("/");
    if (index === 0 || index === location.pathname.length - 1) return;
    const id = location.pathname.substring(index + 1);
    setCurrentId(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (currentId.length <= 0) return;
    setLoading(true);
    APIInstance.get("data/campaign_detail", { params: { id: currentId } })
      .then((data) => {
        if (location.pathname.includes("new")) setCurrentTab("review");
        else if (location.pathname.includes("edit")) setCurrentTab("detail");
        setCampaignName(data.data.name);
        setCurrentTarget(data.data.demographic);
        setTemplateAudience(data.data.audience);
        setCurrentPrice(data.data.price);
        setUiData({
          id: data.data.ui_id,
          headline: data.data.headline,
          body: data.data.body,
          cta: data.data.cta,
          image: data.data.image,
          page_url: data.data.page_url,
        });
        setUrl(data.data.url);
      })
      .catch((err) => {
        console.log("error:", err);
      })
      .finally(() => setLoading(false));
  }, [currentId]);

  useEffect(() => {
    setCurrentAudience(
      templateAudience.map((item: string) => {
        return {
          value: item,
          label:
            audience.filter((i: any) => i.name === item).length > 0
              ? audience.filter((i: any) => i.name === item)[0].name
              : "",
        };
      })
    );
  }, [audience, templateAudience]);

  useEffect(() => {
    if (cardList.length > 0 && currentCard.length < 3) {
      setCurrentCard(cardList[0].card_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardList]);

  const handleRefreshCard = () => {
    setLoading(true);
    APIInstance.get("stripe/card", { params: { email } })
      .then((data) => {
        dispatch(setCardList({ cardList: data.data }));
      })
      .catch((err) => {
        console.log("get card error:", err);
      })
      .finally(() => setLoading(false));
  };

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e: any) => {
    // if (e.target.id === 'detail' && uiId) return;
    // if (e.target.id !== 'billing' && !currentCard) return;
    setCurrentTab(e.target.id);
  };

  const isSubmitable = () => {
    return (
      checked &&
      !validator.isEmpty(campaignName) &&
      validator.isURL(url) &&
      currentPrice &&
      currentCard.length > 3 &&
      uiData
    );
  };

  const handleNextOnCampaign = async () => {
    if (uiRef.current) {
      uiRef.current
        .handleSave()
        .then(() => {
          setCurrentTab("audience");
        })
        .catch((err: any) => {
          console.log("err:", err);
        });
    }
  };

  const handleSubmit = async () => {
    if (!uiData) {
      alert(
        "There is not UI assigned for this Campaign, Please save your UI first"
      );
      return;
    }
    setLoading(true);
    if (currentId.length <= 0) {
      APIInstance.post("data/campaign", {
        email,
        campaignName,
        url,
        currentTarget,
        currentAudience: currentAudience.map((item) => item.value),
        currentPrice,
        uiId: uiData.id,
        currentCard,
        state: "active",
      })
        .then((data) => {
          dispatch(addCampaign({ campaign: data.data }));
          setCurrentTab("detail");
          setCampaignName("");
          setCurrentTarget("consumer");
          setCurrentPrice("10000");
          setUiData(undefined);
          setUrl("");
          setCurrentAudience([]);

          DialogUtils.show(
            "success",
            "",
            "Your campaign has been submitted! Our team will review the details and notify you as soon as its live."
          );
          navigator("/");
        })
        .catch((err) => {
          console.log("err:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      APIInstance.put("data/campaign_detail", {
        type: "all",
        id: currentId,
        email,
        campaignName,
        url,
        currentTarget,
        currentAudience: currentAudience.map((item) => item.value),
        currentPrice,
        uiId: uiData.id,
        currentCard,
        state: "active",
      })
        .then((ret) => {
          dispatch(addCampaign({ campaign: ret.data }));
          setCurrentTab("detail");
          setCampaignName("");
          setCurrentTarget("consumer");
          setUiData(undefined);
          setUrl("");
          setCurrentAudience([]);

          DialogUtils.show(
            "success",
            "",
            "Your campaign has been submitted! Our team will review the details and notify you as soon as its live."
          );
          navigator("/");
        })
        .catch((err) => {
          console.log("err:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleSave = () => {
    if (!uiData) {
      alert(
        "There is not UI assigned for this Campaign, Please save your UI first"
      );
      return;
    }
    setLoading(true);
    if (currentId.length <= 0) {
      APIInstance.post("data/campaign", {
        email,
        campaignName,
        url,
        currentTarget,
        currentAudience: currentAudience.map((item) => item.value),
        currentPrice,
        currentCard,
        uiId: uiData.id,
        state: "draft",
      })
        .then((data) => {
          dispatch(addCampaign({ campaign: data.data }));
          setCurrentTab("detail");
          setCampaignName("");
          setCurrentTarget("consumer");
          setUiData(undefined);
          setUrl("");
          setCurrentAudience([]);
          navigator("/");
        })
        .catch((err) => {
          console.log("err:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      APIInstance.put("data/campaign_detail", {
        type: "all",
        id: currentId,
        email,
        campaignName,
        url,
        currentTarget,
        currentAudience: currentAudience.map((item) => item.value),
        currentPrice,
        uiId: uiData.id,
        currentCard,
      })
        .then((ret) => {
          dispatch(addCampaign({ campaign: ret.data }));
          setCurrentTab("detail");
          setCampaignName("");
          setCurrentTarget("consumer");
          setUiData(undefined);
          setUrl("");
          setCurrentAudience([]);
          navigator("/");
        })
        .catch((err) => {
          console.log("err:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleAddCard: React.MouseEventHandler<HTMLButtonElement> = async (
    e
  ) => {
    const customerId = await StripeUtil.getCustomerId(email);

    const session = await StripeUtil.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `https://go.presspool.ai/${
        location.pathname.includes("new") ? "new" : "edit"
      }/${currentId}`,
    });

    window.location.href = session.url + "/payment-methods";
    // window.open(session.url + '/payment-methods', '_blank');
  };

  const getOffsetBack = () => {
    // if (currentTab === 'billing') return 'left-1';
    if (currentTab === "detail") return "left-1";
    if (currentTab === "budget") return "left-[25%]";
    if (currentTab === "audience") return "left-[50%]";
    if (currentTab === "review") return "left-[74%]";
  };

  const handleBeforeReview: React.MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    e.preventDefault();

    if (!uiData) {
      alert(
        "There is not UI assigned for this Campaign, Please save your UI first"
      );
      return;
    }
    setLoading(true);
    if (currentId.length <= 0) {
      APIInstance.post("data/campaign", {
        email,
        campaignName,
        url,
        currentTarget,
        currentAudience: currentAudience.map((item) => item.value),
        currentRegion: currentRegions.map((item) => item.value),
        currentPrice,
        // currentCard,
        uiId: uiData.id,
        state: "draft",
      })
        .then((data) => {
          setCurrentId(data.data.id);
          if (location.pathname.includes("new")) setCurrentTab("review");
          else if (location.pathname.includes("edit")) setCurrentTab("detail");
        })
        .catch((err) => {
          console.log("err:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      APIInstance.put("data/campaign_detail", {
        type: "all",
        id: currentId,
        email,
        campaignName,
        url,
        currentTarget,
        currentAudience: currentAudience.map((item) => item.value),
        currentRegion: currentRegions.map((item) => item.value),
        currentPrice,
        uiId: uiData.id,
        currentCard,
      })
        .then((ret) => {
          console.log("ret:", ret.data);
          setCurrentTab("review");
        })
        .catch((err) => {
          console.log("err:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const getCPC = (budget: number) => {
    const beehiivBudget =
      Math.round((budget / ((4 * (1 + 0.1)) / (1 - 0.5))) * 4) - 2;
    return budget / (beehiivBudget / 4);
  };

  return (
    <motion.div
      className="text-left relative"
      initial="hidden"
      animate="show"
      variants={FADE_UP_ANIMATION_VARIANTS}
    >
      <div
        className={`relative bg-white rounded-lg text-left shadow-xl flex flex-col px-[70px] pt-[15px] pb-[26px]`}
      >
        {loading && <Loading />}
        <h2 className="font-[Inter] text-[18px] font-bold my-[24px] text-center w-full">
          New Campaign
        </h2>
        <div className="grid grid-cols-4 h-[62px] py-4 px-2 rounded-[5px] bg-[#f5f5f5] z-0 relative w-full">
          {/* <button
            className={`w-full h-full flex items-center justify-center font-[Inter] rounded-[5px] text-sm 2xl:text-md transition-colors duration-500 ${currentTab === 'billing' ? 'text-white' : 'text-black'}`}
            onClick={handleClick}
            id="billing"
          >
            Billing
          </button> */}
          <button
            className={`w-full h-full flex items-center justify-center font-[Inter] rounded-[5px] text-sm 2xl:text-md transition-colors duration-500 ${
              currentTab === "detail" ? "text-white" : "text-black"
            }`}
            onClick={handleClick}
            id="detail"
          >
            Campaign Details
          </button>
          <button
            className={`w-full h-full flex items-center justify-center font-[Inter] rounded-[5px] text-sm 2xl:text-md transition-colors duration-500 ${
              currentTab === "budget" ? "text-white" : "text-black"
            }`}
            onClick={handleClick}
            id="budget"
          >
            Budget
          </button>
          <button
            className={`w-full h-full flex items-center justify-center font-[Inter] rounded-[5px] text-sm 2xl:text-md transition-colors duration-500 ${
              currentTab === "audience" ? "text-white" : "text-black"
            }`}
            onClick={handleClick}
            id="audience"
          >
            Content
          </button>
          <button
            className={`w-full h-full flex items-center justify-center font-[Inter] rounded-[5px] text-sm 2xl:text-md transition-colors duration-500 ${
              currentTab === "review" ? "text-white" : "text-black"
            }`}
            onClick={handleClick}
            id="review"
          >
            Review
          </button>
          <div
            className={`absolute h-[50px] bg-[#2D2C2D] w-1/4 rounded-[5px] top-1.5 z-[-1] transition-all duration-500 transform ${getOffsetBack()}`}
          />
        </div>
        <div className="pt-[20px]">
          {currentTab === "detail" && (
            <motion.div
              variants={FADE_RIGHT_ANIMATION_VARIANTS}
              initial="hidden"
              animate="show"
              className="relative"
            >
              <CreateCampaignUI
                ref={uiRef}
                uiData={uiData}
                setUIContent={(data: any) => setUiData(data)}
                setLoading={(load: boolean) => setLoading(load)}
                setCampaignName={setCampaignName}
                setUrl={setUrl}
              />
              <div className="w-full mt-[35px]">
                <button
                  className="rounded-[5px] bg-main px-[50px] py-[10px] text-black font-semibold text-sm disabled:bg-gray-400"
                  disabled={
                    validator.isEmpty(campaignName) || !validator.isURL(url)
                  }
                  onClick={handleNextOnCampaign}
                >
                  Next Step
                </button>
              </div>
            </motion.div>
          )}
          {currentTab === "budget" && (
            <motion.div
              variants={FADE_RIGHT_ANIMATION_VARIANTS}
              initial="hidden"
              animate="show"
              className="w-[720px]"
            >
              <h2 className="font-[Inter] text-base 2xl:text-lg font-semibold text-black">
                Please type in your budget cap for this campaign
              </h2>
              <p className="font-[Inter] text-[#43474a] text-xs 2xl:text-sm mt-[14px]">
                *Keep in mind, these are all verified, targeted and engaged
                readers that will be clicking through directly to your landing
                page of choice. We only charge per{" "}
                <span className="font-bold">unique click</span> as they come in.
              </p>
              <div className="pl-2 pr-4 mt-[23px] border-[1px] rounded-lg border-black w-full flex justify-between items-center relative">
                <input
                  value={currentPrice}
                  prefix="$"
                  className="border-0 focus:border-0 focus:ring-0 focus-visible:outline-0 focus-visible:border-0 flex-1 text-sm 2xl:text-md"
                  onChange={(e) => setCurrentPrice(e.target.value)}
                  type="number"
                  min="10000"
                />
                <p className="text-[#f76363] font-normal text-xs right-[23px] top-[10px] ms-2">
                  *minimum input must be $10,000
                </p>
              </div>
              {currentPrice && (
                <div className="mt-[9px]">
                  <span className="font-[Inter] text-xs 2xl:text-sm my-3 text-black">
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

                  <span className="text-[#525252] text-xs font-medium">
                    We recommend setting your budget to $20,000 or more to
                    accelerate data collection, enabling quicker campaign
                    optimization and enhanced results.
                  </span>
                </div>
              )}
              <div className="mt-[35px] w-full">
                <button
                  className="rounded-[5px] bg-main px-[50px] py-[10px] text-black font-semibold disabled:bg-gray-400 text-sm"
                  onClick={handleBeforeReview}
                  disabled={Number(currentPrice) < 10000}
                >
                  Next Step
                </button>
              </div>
            </motion.div>
          )}
          {currentTab === "audience" && (
            <motion.div
              variants={FADE_RIGHT_ANIMATION_VARIANTS}
              initial="hidden"
              animate="show"
            >
              <div className="grid grid-cols-2 gap-8 h-full w-full">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <p className="font-[Inter] text-base 2xl:text-lg font-semibold flex items-center">
                      Headline
                      {/* {asterick && headLine.length <= 0 && (
              <span className="ms-1 text-[red] text-xs">*</span>
            )} */}
                      <CustomTooltip title="The headline of your campaign. This should be roughly 7 words or less and have a specific outcome.(Ex. Presspool will 10x user growth without PR)" />
                    </p>
                    <input
                      className={`w-full rounded-lg text-sm border-[1px] focus:ring-0 focus:border-main py-2 px-3`}
                      maxLength={60}
                      data-tooltip-id="headline"
                      // value={headLine}
                      // onChange={(e) => setHeadLine(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="font-[Inter] text-base 2xl:text-lg font-semibold flex items-center">
                      Body
                      {/* {asterick && body.length <= 0 && (
                        <span className="ms-1 text-[red] text-xs">*</span>
                      )} */}
                      <CustomTooltip title="The body of your campaign. This should be 500 characters or less and describe how you can help your ideal customer or audience achieve the promise from the headline." />
                    </p>
                    {/* ${asterick && body.length <= 0 ? "border-[red]" : "border-[#7F8182]"} */}
                    <textarea
                      className={`mb-0 w-full text-sm rounded-lg border-[1px] focus:ring-0 focus:border-main py-2 px-3`}
                      maxLength={500}
                      // value={body}
                      // onChange={(e) => setBody(e.target.value)}
                      // rows={5}
                      data-tooltip-id="body"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="font-[Inter] text-base 2xl:text-lg font-semibold mb-0 flex items-center">
                      CTA
                      {/* {asterick && cta.length <= 0 && (
              <span className="ms-1 text-[red] text-xs">*</span>
            )} */}
                      <CustomTooltip title='The call to action for your button. This should be something like "Free trial" or "Learn more" or "Try for free"' />
                    </p>
                    {/* ${asterick && cta.length <= 0 ? "border-[red]" : "border-[#7F8182]"} */}
                    <input
                      className={`w-full rounded-lg text-sm border-[1px] focus:ring-0 focus:border-main py-2 px-3`}
                      maxLength={20}
                      // value={cta}
                      data-tooltip-id="cta"
                      // onChange={(e) => setCta(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="font-[Inter] text-base 2xl:text-lg font-semibold mb-0 flex items-center">
                      Hero Image
                      {/* {asterick && (!image || (image && image.length <= 0)) && (
              <span className="ms-1 text-[red] text-xs">*</span>
            )} */}
                      <CustomTooltip title="Recommended dimensions: 1200px X 600px" />
                    </p>
                    <p className="text-[#7f8182] font-[Inter] text-[13px] font-medium">
                      Click below to add your image
                    </p>
                    <div className="flex">
                      <button
                        data-tooltip-id="hero"
                        // onClick={() => {
                        //   if (fileInputRef.current) fileInputRef.current.click();
                        // }}
                        // ${asterick && (!image || (image && image.length <= 0))
                        //   ? "border-[red]"
                        //   : "border-[#7F8182]"
                        // }
                        className={`overflow-hidden truncate px-2 text-sm py-2 flex items-center justify-center text-gray-800 text-left font-[Inter] w-[160px] border-dashed border-[1px] bg-white rounded `}
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
                      <div
                        className="relative ms-2 cursor-pointer"
                        // onClick={() => {
                        //   setFile("");
                        //   setImage(null);
                        // }}
                      >
                        <img
                          // src={image}
                          alt="sample logo"
                          className="h-[42px] object-cover"
                        />
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
                    </div>
                    <input
                      // ref={fileInputRef}
                      type="file"
                      hidden
                      accept="image/*"
                      // onChange={handleFileChange}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="font-[Inter] text-base 2xl:text-lg font-semibold mb-0 flex items-center">
                      Additional Assets
                      <CustomTooltip title="Additional files for your campaign" />
                    </p>
                    <p className="text-[#7f8182] font-[Inter] text-[13px] font-medium mb-0">
                      Click below to add your files
                    </p>
                    <div className="flex">
                      <button
                        data-tooltip-id="hero"
                        // onClick={() => {
                        //   if (addtionalFileInputRef.current)
                        //     addtionalFileInputRef.current.click();
                        // }}
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
                      <div
                        className="relative ms-2 cursor-pointer flex items-center"
                        // onClick={() => {
                        //   setAdditionalFiles([]);
                        //   setAdditionalFileCount(0);
                        // }}
                      >
                        {/* <p className="text-xs">{`${additionalFileCount} file${additionalFileCount > 1 ? "s" : ""
                    } are selected`}
                    </p> */}
                        <p className="text-xs">2 files selected</p>
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
                    </div>
                    <input
                      // ref={addtionalFileInputRef}
                      type="file"
                      hidden
                      multiple
                      accept="*"
                      // onChange={handleAdditionalFileChange}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="font-[Inter] text-base 2xl:text-lg font-semibold mb-0 flex items-center items-center">
                      URL for your landing page
                      {/* {asterick &&
                  (!pageUrl.startsWith("https://") ||
                    !validator.isURL(pageUrl)) && (
                    <span className="ms-1 text-[red] text-xs">*</span>
                  )} */}
                      <CustomTooltip
                        title={
                          <p>
                            Where do you want to direct the clicks to? <br />{" "}
                            URL must stars with "https://"
                          </p>
                        }
                      />
                    </p>
                    {/* ${asterick &&
                  (!pageUrl.startsWith("https://") || !validator.isURL(pageUrl))
                  ? "border-[red]"
                  : "border-[#7F8182]"
                  } */}
                    <input
                      type="url"
                      // value={pageUrl}
                      data-tooltip-id="url"
                      // onChange={(e) => setPageUrl(e.target.value)}
                      className={`w-full rounded-lg border-[1px] text-sm focus:ring-0 focus:border-main py-2 px-3 `}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-[Inter] text-base 2xl:text-lg font-semibold flex items-center">
                    Preview
                    <CustomTooltip
                        title="The body of your campaign. This should be 500 characters or less and describe how you can help your ideal customer or audience achieve the promise from the headline."
                      />
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
                      Today we are diving deep into some of the newest AI
                      solutions that are taking place this week.
                      <br />
                      <br />
                      With GPT’s just being released, the excitement has
                      continued to grow at an unprecedented rate for AI products
                      and solutions that are reshaping how consumers and
                      executives alike do their work better, faster and easier.
                    </p>
                    <div className="bg-white z-10 w-full rounded-[14px] flex flex-col h-full">
                      <div className="py-4 px-2 flex items-center justify-center">
                        <img
                          src={SampleLogo}
                          alt="sample logo"
                          className="h-[140px] object-cover"
                        />
                      </div>
                      <div className="pb-2 px-2 flex flex-col items-center justify-between flex-1">
                        <div>
                          <h2 className="w-full text-left font-bold font-[Inter] text-base break-words"></h2>
                          <p className="mt-2 w-full text-left font-[Inter] text-black text-xs break-words"></p>
                        </div>
                        <div className="mt-8 flex justify-between w-full items-center">
                          <button className="font-[Inter] text-gray-500 px-4 py-2 rounded-[5px] border-[1px] text-sm font-medium border-[#D1CEFF]">
                            Learn More
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full mt-[35px]">
                <button
                  className="rounded-[5px] text-black font-semibold bg-main px-[50px] py-[10px] text-sm disabled:bg-gray-400"
                  onClick={() => setCurrentTab("budget")}
                  disabled={
                    currentAudience.length <= 0 || currentRegions.length <= 0
                  }
                >
                  Next Step
                </button>
              </div>
            </motion.div>
          )}
          {currentTab === "review" && (
            <motion.div
              variants={FADE_RIGHT_ANIMATION_VARIANTS}
              initial="hidden"
              animate="show"
              className="w-full"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <p className="text-base 2xl:text-lg font-[Inter] font-semibold">
                    What to Expect
                  </p>
                  <ul className="flex flex-col gap-4 list-decimal text-sm 2xl:text-base font-[Inter] font-400 pl-4">
                    <li>
                      <b className="font-semibold">Campaign Activation:</b> Upon
                      submission, your campaign is now in the queue for launch.
                      Our team may reach out for any additional details to
                      ensure we fully align with your objectives. Once
                      everything is set, we'll proceed with the activation.
                    </li>
                    <li>
                      <b className="font-semibold">
                        Distribution and Tracking:
                      </b>{" "}
                      Your campaign will be disseminated across the most fitting
                      newsletters to reach your intended audience. Rest assured,
                      every click and interaction is meticulously tracked. Your
                      dedicated dashboard will offer real-time analytics to
                      monitor the campaign's impact.
                    </li>
                    <li>
                      <b className="font-semibold">Ongoing Optimization:</b> We
                      believe in dynamic campaigns. Our platform continually
                      reviews performance data to refine and improve
                      distribution, ensuring your budget is utilized for maximal
                      impact and ROI.
                    </li>
                    <li>
                      <b className="font-semibold">
                        Weekly Reporting and Billing:
                      </b>{" "}
                      Expect transparent weekly reports with key metrics that
                      reflect your campaign's traction. Billing will correspond
                      to the weekly performance, providing a clear view of your
                      investment's return.
                    </li>
                    <li>
                      <b className="font-semibold">Campaign Conclusion:</b> When
                      your campaign reaches the budget threshold, it will
                      conclude. You'll be provided with a comprehensive report
                      that captures performance, yields insights, and guides
                      potential next steps for ongoing engagement and growth.
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col gap-4 w-[720px]">
                  <h2 className="font-semibold text-base 2xl:text-lg font-[Inter]">
                    Review
                  </h2>
                  {currentAudience.length >= 1 && currentPrice && (
                    <div className="">
                      <p className="py-2 text-sm ">
                        <span className="font-medium me-2">⭐ Dates:</span>The
                        campaign will start from today until the budget is
                        reached.
                      </p>
                      <p className="py-2 text-sm ">
                        <span className="font-medium me-2">⭐ Max Budget:</span>
                        {`$${currentPrice}`}
                      </p>
                      <p className="py-2 text-sm ">
                        <span className="font-medium me-2">
                          ⭐ Target Audience Demographic:
                        </span>
                        {currentTarget === "consumer"
                          ? "Consumers"
                          : "Professional"}
                      </p>
                      <p className="py-2 text-sm ">
                        <span className="font-medium me-2">
                          ⭐ Target Audience Tags:
                        </span>
                        {currentAudience
                          .map((item: any) => item.label)
                          .join(", ")}
                      </p>
                      {/* <p className='py-2 text-sm '><span className='font-medium me-2'>⭐ Payment Method:</span>{`**** **** **** ${cardList.filter(item => item.card_id === currentCard)[0].last4}`}</p> */}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-4 w-[720px]">
                  <h2 className="font-semibold text-base 2xl:text-lg font-[Inter]">
                    Billing Setup
                  </h2>
                  <p className="font-[Inter] text-sm 2xl:text-base font-normal text-[#43474A] mb-0">
                    Billing is simple: weekly or when your account's threshold
                    is reached.
                  </p>
                </div>
                <div className="w-[720px] flex">
                  {cardList.length > 0 && (
                    <>
                      <div className="flex items-center justify-center">
                        <select
                          className="w-[400px] pl-[16px] py-2 border-[1px] border-[#7f8182] rounded-lg font-[Inter] text-sm 2xl:text-md"
                          value={currentCard}
                          onChange={(e) => setCurrentCard(e.target.value)}
                        >
                          {cardList.map((item: any) => (
                            <option value={item.card_id} key={item.id}>
                              {item.brand.toUpperCase()}
                              {` **** **** **** ${item.last4}`}
                            </option>
                          ))}
                        </select>
                        {/* <button className='text-black font-[Inter] mx-3' onClick={handleRefreshCard}>Refresh</button> */}
                      </div>

                      <div className="flex-1 ms-[18px]">
                        <button
                          className="flex h-full px-[17px] items-center justify-center text-[#7f8182] w-full rounded-lg border-[1px] border-[#7f8182] text-sm 2xl:text-md"
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
                    </>
                  )}
                  {cardList.length <= 0 && (
                    <>
                      <div className="flex-1 me-[18px]">
                        <button
                          className="flex py-[11px] px-[17px] items-center justify-center text-[#7f8182] w-full rounded-lg border-[1px] border-[#7f8182] text-sm 2xl:text-md"
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
                      <div className="flex items-center justify-center">
                        <select
                          className="w-[400px] pl-[16px] py-[11px] border-[1px] border-[#7f8182] rounded-lg font-[Inter] text-sm 2xl:text-md"
                          value={currentCard}
                          onChange={(e) => setCurrentCard(e.target.value)}
                        >
                          {cardList.map((item: any) => (
                            <option value={item.card_id} key={item.id}>
                              {item.brand.toUpperCase()}
                              {` **** **** **** ${item.last4}`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex justify-top">
                  <input
                    className="me-[9px] text-main focus:ring-0"
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                  />
                  <p className="text-[12px] text-black font-[Inter] font-normal">
                    I agree and authorize weekly automatic billing for accrued
                    click costs per the{" "}
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
                    . This authorization will continue until I cancel in
                    accordance with the provided terms.
                  </p>
                </div>
              </div>
              <div className="mt-[35px]">
                {currentAudience.length >= 1 &&
                  Number(currentPrice) >= 10000 && (
                    <Popconfirm
                      title="Confirm"
                      description={
                        <p>
                          Once your campaign is live, you can’t make edits.
                          <br /> Are you sure everything is set? It’s a good
                          idea to double-check.
                        </p>
                      }
                      open={openConfirm}
                      onConfirm={handleSubmit}
                      onCancel={() => setOpenConfirm(false)}
                      okButtonProps={{
                        style: {
                          background: "#bff7ae",
                          padding: "1rem 1rem 1rem 1rem",
                          color: "black",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        },
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
                    >
                      <button
                        className="rounded-[5px] text-black bg-main px-[50px] 2xl:px-[60px] py-[10px] font-semibold mt-2 disabled:bg-gray-300 text-sm 2xl:text-md"
                        disabled={!isSubmitable()}
                        onClick={() => setOpenConfirm(true)}
                      >
                        Submit
                      </button>
                    </Popconfirm>
                  )}
                <button
                  className="bg-transparent text-md text-gray-600 font-[Inter] px-[30px] 2xl:px-[60px] py-[10px] rounded-[5px] text-sm 2xl:text-md"
                  onClick={handleSave}
                >
                  Save Draft
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CreateCampaign;
