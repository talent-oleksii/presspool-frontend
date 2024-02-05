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
    if (currentTab === "audience") return "left-[25%]";
    if (currentTab === "budget") return "left-[50%]";
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
        className={`relative bg-white rounded-lg text-left shadow-xl items-center flex flex-col px-[70px] pt-[15px] pb-[26px]`}
      >
        {loading && <Loading />}
        <h2 className="font-[Inter] text-[18px] font-bold my-[24px] text-center w-full">
          New Campaign
        </h2>
        <div className="grid grid-cols-4 h-[62px] py-4 px-2 rounded-[5px] bg-[#f5f5f5] z-0 relative w-[800px]">
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
              currentTab === "audience" ? "text-white" : "text-black"
            }`}
            onClick={handleClick}
            id="audience"
          >
            Target Audience
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
          {/* {
            currentTab === 'billing' &&
            <motion.div
              variants={FADE_RIGHT_ANIMATION_VARIANTS}
              initial="hidden"
              animate="show"
              className='relative w-[1000px]'
            >
              <h2 className='font-medium text-md 2xl:text-lg font-[Inter]'>Billing</h2>
              <div className='w-full flex mt-[17px]'>
                <div className='flex-1 me-[18px]'>
                  <button
                    className='flex py-[11px] px-[17px] items-center justify-center text-[#7f8182] w-full rounded-lg border-[1px] border-[#7f8182] text-sm 2xl:text-md'
                    onClick={handleAddCard}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className='me-[9px]'>
                      <path d="M7 10H13M10 7V13M1 10C1 11.1819 1.23279 12.3522 1.68508 13.4442C2.13738 14.5361 2.80031 15.5282 3.63604 16.364C4.47177 17.1997 5.46392 17.8626 6.55585 18.3149C7.64778 18.7672 8.8181 19 10 19C11.1819 19 12.3522 18.7672 13.4442 18.3149C14.5361 17.8626 15.5282 17.1997 16.364 16.364C17.1997 15.5282 17.8626 14.5361 18.3149 13.4442C18.7672 12.3522 19 11.1819 19 10C19 7.61305 18.0518 5.32387 16.364 3.63604C14.6761 1.94821 12.3869 1 10 1C7.61305 1 5.32387 1.94821 3.63604 3.63604C1.94821 5.32387 1 7.61305 1 10Z" stroke="#7F8182" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Add a Card
                  </button>
                </div>
                <div className='flex items-center justify-center w-[60%]'>
                  <select
                    className='w-full pl-[16px] py-[11px] border-[1px] border-[#7f8182] rounded-lg font-[Inter] text-sm 2xl:text-md'
                    value={currentCard}
                    onChange={e => setCurrentCard(e.target.value)}
                  >
                    {
                      cardList.map((item: any) => (
                        <option value={item.card_id} key={item.id}>
                          {item.brand.toUpperCase()}
                          {` **** **** **** ${item.last4}`}
                        </option>
                      ))
                    }
                  </select>
                </div>
              </div>
              <div className='w-full text-center mt-[30px]'>
                <button
                  className='rounded-[5px] text-black font-semibold bg-main px-[50px] py-[10px] text-sm disabled:bg-gray-400'
                  onClick={() => setCurrentTab('detail')}
                  disabled={!currentCard}
                >
                  Next Step
                </button>
              </div>
            </motion.div>
          } */}
          {currentTab === "detail" && (
            <motion.div
              variants={FADE_RIGHT_ANIMATION_VARIANTS}
              initial="hidden"
              animate="show"
              className="relative"
            >
              <div className="absolute w-1/2 pr-8">
                <p className="text-sm font-[Inter] text-black font-semibold flex">
                  Campaign Name
                  <Tooltip
                    title="Please enter the name of your campaign"
                    color="#EDECF2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 -960 960 960"
                      className="h-[20px] w-[20px] ms-1"
                    >
                      <path d="M460-300h40v-220h-40v220Zm20-276.923q10.462 0 17.539-7.077 7.076-7.077 7.076-17.539 0-10.461-7.076-17.538-7.077-7.077-17.539-7.077-10.462 0-17.539 7.077-7.076 7.077-7.076 17.538 0 10.462 7.076 17.539 7.077 7.077 17.539 7.077ZM480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                    </svg>
                  </Tooltip>
                </p>
                <input
                  className="px-3 py-2 rounded-[8px] w-full border text-sm font-[Inter] border-[#7F8182] mt-1 focus:border-main focus:ring-0"
                  // placeholder="Give your campaign a name"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
                <p className="mt-2 text-sm font-[Inter] text-black font-semibold flex">
                  Website URL
                  <Tooltip
                    title="Please enter your full site URL. Example: https://www.test.com/"
                    color="#EDECF2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 -960 960 960"
                      className="h-[20px] w-[20px] ms-1"
                    >
                      <path d="M460-300h40v-220h-40v220Zm20-276.923q10.462 0 17.539-7.077 7.076-7.077 7.076-17.539 0-10.461-7.076-17.538-7.077-7.077-17.539-7.077-10.462 0-17.539 7.077-7.076 7.077-7.076 17.538 0 10.462 7.076 17.539 7.077 7.077 17.539 7.077ZM480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                    </svg>
                  </Tooltip>
                </p>
                <input
                  className="px-3 py-2 rounded-[8px] w-full border font-[Inter] text-sm border-[#7F8182] mt-1 focus:border-main focus:ring-0"
                  // placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <CreateCampaignUI
                ref={uiRef}
                uiData={uiData}
                setUIContent={(data: any) => setUiData(data)}
                setLoading={(load: boolean) => setLoading(load)}
              />
              <div className="w-full text-center mt-[30px]">
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
          {currentTab === "audience" && (
            <motion.div
              variants={FADE_RIGHT_ANIMATION_VARIANTS}
              initial="hidden"
              animate="show"
              className="w-[720px]"
            >
              <div className="bg-white">
                <p className="font-[Inter] font-normal text-md 2xl:text-lg font-semibold">
                  Who are you targeting
                </p>
                <div className="flex items-center mt-[18px] w-full gap-[28px]">
                  <button
                    className={`relative w-1/2 font-[Inter] font-semibold text-sm flex rounded-lg z-[1] px-4 py-[18px] flex flex-col items-center justify-center transition-all duration-300 border-black border-[1px] ${
                      currentTarget === "consumer"
                        ? "bg-black text-white"
                        : "bg-[#f5f5f5] text-black"
                    }`}
                    onClick={() => setCurrentTarget("consumer")}
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
                        stroke={`${
                          currentTarget === "consumer" ? "white" : "black"
                        }`}
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
                        fill={`${
                          currentTarget === "consumer" ? "#7FFBAE" : "white"
                        }`}
                      />
                    </svg>
                  </button>
                  <button
                    className={`relative w-1/2 font-[Inter] font-semibold text-sm flex rounded-lg px-4 z-[1] py-[18px] flex flex-col items-center justify-center transition-all duration-300 border-black border-[1px] ${
                      currentTarget === "professional"
                        ? "bg-black text-white"
                        : "bg-[#f5f5f5] text-black"
                    }`}
                    onClick={() => setCurrentTarget("professional")}
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
                        stroke={`${
                          currentTarget === "professional" ? "white" : "black"
                        }`}
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
                        fill={`${
                          currentTarget === "professional" ? "#7FFBAE" : "white"
                        }`}
                      />
                    </svg>
                  </button>
                </div>
                <div className="mt-[26px]">
                  <p className="text-md 2xl:text-lg font-[Inter] font-bold mb-[12px]">
                    Please add specific audience industry tags you would like to
                    target:
                  </p>
                  <CreatableSelect
                    styles={customStyles}
                    value={currentAudience}
                    placeholder="Type your tag(s) and press enter"
                    onChange={(e) =>
                      setCurrentAudience(
                        e.map((item) => ({
                          value: item.value,
                          label: item.label,
                        }))
                      )
                    }
                    isMulti
                    options={audience.map((item: any) => ({
                      value: item.name,
                      label: item.name,
                    }))}
                  />
                </div>
                <div className="mt-[26px]">
                  <p className="text-md 2xl:text-lg font-[Inter] font-bold mb-[12px]">
                    Please add specific geography/region tags you would like to
                    target:
                  </p>
                  <CreatableSelect
                    styles={customStyles}
                    value={currentRegions}
                    placeholder="Type your tag(s) and press enter"
                    onChange={(e) =>
                      setCurrentRegions(
                        e.map((item) => ({
                          value: item.value,
                          label: item.label,
                        }))
                      )
                    }
                    isMulti
                    options={regions.map((item: any) => ({
                      value: item.name,
                      label: item.name,
                    }))}
                  />
                </div>
              </div>
              <div className="w-full text-center mt-[45px]">
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
          {currentTab === "budget" && (
            <motion.div
              variants={FADE_RIGHT_ANIMATION_VARIANTS}
              initial="hidden"
              animate="show"
              className="w-[720px]"
            >
              <h2 className="font-[Inter] text-md 2xl:text-lg font-semibold text-black">
                Please type in your budget cap for this campaign
              </h2>
              <p className="font-[Inter] text-[#43474a] text-xs 2xl:text-sm mt-[14px]">
                *Keep in mind, these are all verified, targeted and engaged
                readers that will be clicking through directly to your landing
                page of choice. We only charge per{" "}
                <span className="font-bold">unique click</span> as they come in.
              </p>
              <div className="pl-2 pr-4 py-1 mt-[23px] border-[1px] rounded-lg border-black w-full flex justify-between items-center relative">
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
              <div className="mt-[35px] text-center w-full">
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
          {currentTab === "review" && (
            <motion.div
              variants={FADE_RIGHT_ANIMATION_VARIANTS}
              initial="hidden"
              animate="show"
              className="w-[720px]"
            >
              <h2 className="font-medium text-md 2xl:text-lg font-[Inter]">
                Review
              </h2>
              {currentAudience.length >= 1 && currentPrice && (
                <div className="mt-[7px] 2xl:mt-[15px]">
                  <p className="py-2 text-sm ">
                    <span className="font-medium me-2">⭐ Dates:</span>The
                    campaign will start from today until the budget is reached.
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
                    {currentAudience.map((item: any) => item.label).join(", ")}
                  </p>
                  {/* <p className='py-2 text-sm '><span className='font-medium me-2'>⭐ Payment Method:</span>{`**** **** **** ${cardList.filter(item => item.card_id === currentCard)[0].last4}`}</p> */}
                </div>
              )}
              <h2 className="font-medium text-md 2xl:text-lg font-[Inter] mt-[15px] 2xl:mt-[29px]">
                Billing Setup
              </h2>
              <p className="font-[Inter] text-xs 2xl:text-sm font-normal text-[#43474A] mt-[10px] mb-0">
                Billing is simple: weekly or when your account's threshold is
                reached.
              </p>
              <div className="w-full flex mt-[17px]">
                {cardList.length > 0 && (
                  <>
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
                      {/* <button className='text-black font-[Inter] mx-3' onClick={handleRefreshCard}>Refresh</button> */}
                    </div>

                    <div className="flex-1 ms-[18px]">
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
              <div className="mt-5 flex justify-top">
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
              <div className="w-full text-center mt-[50px]">
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
