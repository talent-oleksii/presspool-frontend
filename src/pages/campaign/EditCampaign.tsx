import { FC, Fragment, MouseEventHandler, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import CreatableSelect from 'react-select/creatable';
import { useDispatch, useSelector } from 'react-redux';
import { StylesConfig } from 'react-select';
import validator from 'validator';
import { Elements } from '@stripe/react-stripe-js';

import APIInstance from '../../api';
import StripeUtil from '../../utils/stripe';
import Loading from '../../components/Loading';
import { selectAuth } from '../../store/authSlice';
import { setCardList, selectData } from '../../store/dataSlice';
import EditCampaignUI from './EditCampaignUI';
import CardForm from '../../components/StripeCardForm';

interface typeEditCampaign {
  data: any;
  show: boolean;
  setShow: Function;
  afterAdd?: Function;
}

const customStyles: StylesConfig = {
  control: (provided: Record<string, unknown>, state: any) => ({
    ...provided,
    border: state.isFocused ? "1px solid #7F8182" : "1px solid #7F8182",
    borderRadius: '8px'
    // "&:hover": {
    //   border: "1px solid #ff8b67",
    //   boxShadow: "0px 0px 6px #ff8b67"
    // }
  })
};

const EditCampaign: FC<typeEditCampaign> = ({ data, show, setShow, afterAdd }: typeEditCampaign) => {
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('detail');
  const [campaignName, setCampaignName] = useState('');
  const [currentTarget, setCurrentTarget] = useState('consumer');
  const [currentPrice, setCurrentPrice] = useState('10000');
  const [audience, setAudience] = useState<any>([]);
  const [currentAudience, setCurrentAudience] = useState<Array<any>>([]);
  const [showUI, setShowUI] = useState(false);
  const [uiId, setUIID] = useState(undefined);
  const [url, setUrl] = useState('');
  const [showAddCard, setShowAddCard] = useState(false);
  const [currentCard, setCurrentCard] = useState('');

  const { email } = useSelector(selectAuth);
  const { cardList } = useSelector(selectData);

  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      APIInstance.get('data/audience'),
      APIInstance.get('stripe/card', { params: { email } }),
    ]).then((results: Array<any>) => {
      const audienceData = results[0].data;
      setAudience(audienceData);
      dispatch(setCardList({ cardList: results[1].data }));
      if (results[1].data.length >= 1) { setCurrentCard(results[1].data[0].card_id); }
    }).catch(err => {
      console.log('err:', err);
    }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (cardList.length > 0 && currentCard.length < 3) {
      setCurrentCard(cardList[0].card_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardList]);

  useEffect(() => {
    if (data) {
      setCampaignName(data.name);
      setCurrentTarget(data.demographic);
      setCurrentAudience(data.audience.map((item: string) => {
        return {
          value: item,
          label: audience.filter((i: any) => i.name === item).length > 0 ? audience.filter((i: any) => i.name === item)[0].name : '',
        };
      }));
      setCurrentPrice(data.price);
      setUIID(data.ui_id);
      setUrl(data.url);
      setCurrentCard(data.card_id);

      if (data.currentTab) {
        setCurrentTab(data.currentTab);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e: any) => {
    setCurrentTab(e.target.id);
  };

  const isSubmitable = () => {
    return !validator.isEmpty(campaignName) && validator.isURL(url) && currentPrice;
  };

  const handleNextOnCampaign = () => {
    setShowUI(true);
    setCurrentTab('audience');
  };

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    if (!uiId) {
      alert('There is not UI assigned for this Campaign, Please save your UI first');
      return;
    }
    setLoading(true);
    APIInstance.put('data/campaign_detail', {
      id: data.id, type: 'all',
      email, campaignName, url, currentTarget, currentCard,
      currentAudience: currentAudience.map(item => item.value), currentPrice, uiId
    }).then(async data => {
      if (afterAdd) afterAdd(data.data);
      setShow(false);
    }).catch(err => {
      console.log('err:', err);
    }).finally(() => {
      setLoading(false);
    });
  }

  const handleSave = () => {
    if (!uiId) {
      alert('There is not UI assigned for this Campaign, Please save your UI first');
      return;
    }
    setLoading(true);
    APIInstance.put('data/campaign_detail', {
      type: 'all',
      id: data.id,
      email,
      campaignName,
      url,
      currentTarget,
      currentAudience: currentAudience.map(item => item.value),
      currentPrice,
      uiId,
      currentCard,
    }).then(data => {
      if (afterAdd) afterAdd(data.data);
    }).catch(err => {
      console.log('err:', err);
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => { }}>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-100"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg text-left shadow-xl sm:w-[850px] sm:min-h-[500px] border-[1px] border-black px-[70px] pt-[100px] pb-[26px]">
                {loading && <Loading />}
                <div className='absolute flex w-full left-0 top-0 justify-between items-center px-[19px] py-[30px]'>
                  <h2 className='font-[Inter] text-[24px] font-semibold'>Edit Campaign</h2>
                  <button onClick={() => setShow(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
                      <path d="M13.4444 13.4444L20.5556 20.5556M20.5556 13.4444L13.4444 20.5556M17 1C29.8 1 33 4.2 33 17C33 29.8 29.8 33 17 33C4.2 33 1 29.8 1 17C1 4.2 4.2 1 17 1Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
                <div className='grid grid-cols-4 p-[10px] w-full bg-[#F5F5F5] rounded-[5px] h-[73px]'>
                  <button
                    className={`w-full h-full flex items-center justify-center font-[Inter] rounded-[5px] text-[14px] font-semibold text-left ${currentTab === 'detail' ? 'bg-[#2D2C2D] text-white' : 'text-black'}`}
                    onClick={handleClick}
                    id="detail"
                  >
                    Campaign Details
                  </button>
                  <button
                    className={`w-full h-full flex items-center justify-center font-[Inter] rounded-[5px] text-[14px] font-semibold ${currentTab === 'audience' ? 'bg-[#2D2C2D] text-white' : 'text-black'}`}
                    onClick={handleClick}
                    id="audience"
                  >
                    Target Audience
                  </button>
                  <button
                    className={`w-full h-full flex items-center justify-center font-[Inter] rounded-[5px] text-[14px] font-semibold ${currentTab === 'budget' ? 'bg-[#2D2C2D] text-white' : 'text-black'}`}
                    onClick={handleClick}
                    id="budget"
                  >
                    Budget
                  </button>
                  <button
                    className={`w-full h-full flex items-center justify-center font-[Inter] rounded-[5px] text-[14px] font-semibold ${currentTab === 'review' ? 'bg-[#2D2C2D] text-white' : 'text-black'}`}
                    onClick={handleClick}
                    id="review"
                  >
                    Review
                  </button>
                </div>
                <div className='pt-[34px]'>
                  {
                    currentTab === 'detail' && <>
                      <p className='text-[20px] font-[Inter] text-black font-semibold'>What would you like to name your campaign?</p>
                      <input
                        className='px-3 py-2 rounded-[8px] w-full border font-[Inter] border-[#7F8182] mt-[18px]'
                        // placeholder="Give your campaign a name"
                        value={campaignName}
                        onChange={e => setCampaignName(e.target.value)}
                      />
                      <p className='mt-[26px] text-[20px] font-[Inter] text-black font-semibold'>What is your website URL? (We will get your landing page later).</p>
                      <input
                        className='px-3 py-2 rounded-[8px] w-full border font-[Inter] border-[#7F8182] mt-[18px]'
                        // placeholder="https://example.com"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                      />
                      <div className='w-full text-center mt-[30px]'>
                        <button
                          className='rounded-[5px] bg-[#6c63ff] px-[50px] py-[10px] text-white text-sm disabled:bg-gray-400'
                          disabled={validator.isEmpty(campaignName) || !validator.isURL(url)}
                          onClick={handleNextOnCampaign}
                        >
                          Next Step
                        </button>
                      </div>
                    </>
                  }
                  {
                    currentTab === 'audience' && <>
                      <div className='bg-white'>
                        <p className='font-[Inter] font-normal text-[20px] font-semibold'>Who are you targeting</p>
                        <div className='flex items-center mt-[18px] w-full gap-[28px]'>
                          <button
                            className={`relative w-1/2 font-[Inter] font-semibold text-sm flex rounded-lg px-4 py-[18px] flex flex-col items-center justify-center ${currentTarget === 'consumer' ? 'bg-[#6C63FF] text-white' : 'bg-[#F5F5F5] text-black'}`}
                            onClick={() => setCurrentTarget('consumer')}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="37" height="36" viewBox="0 0 37 36" fill="none" className='mb-[10px]'>
                              <path d="M10.7222 35V33.1111C10.7222 32.1092 11.1319 31.1483 11.8613 30.4398C12.5906 29.7313 13.5797 29.3333 14.6111 29.3333H22.3889C23.4203 29.3333 24.4094 29.7313 25.1387 30.4398C25.8681 31.1483 26.2778 32.1092 26.2778 33.1111V35M28.2222 14.2222H32.1111C33.1425 14.2222 34.1317 14.6202 34.861 15.3287C35.5903 16.0372 36 16.9981 36 18V19.8889M1 19.8889V18C1 16.9981 1.40972 16.0372 2.13903 15.3287C2.86834 14.6202 3.85749 14.2222 4.88889 14.2222H8.77778M14.6111 19.8889C14.6111 20.8908 15.0208 21.8517 15.7501 22.5602C16.4794 23.2687 17.4686 23.6667 18.5 23.6667C19.5314 23.6667 20.5206 23.2687 21.2499 22.5602C21.9792 21.8517 22.3889 20.8908 22.3889 19.8889C22.3889 18.887 21.9792 17.9261 21.2499 17.2176C20.5206 16.5091 19.5314 16.1111 18.5 16.1111C17.4686 16.1111 16.4794 16.5091 15.7501 17.2176C15.0208 17.9261 14.6111 18.887 14.6111 19.8889ZM24.3333 4.77778C24.3333 5.77971 24.7431 6.7406 25.4724 7.44907C26.2017 8.15754 27.1908 8.55556 28.2222 8.55556C29.2536 8.55556 30.2428 8.15754 30.9721 7.44907C31.7014 6.7406 32.1111 5.77971 32.1111 4.77778C32.1111 3.77585 31.7014 2.81496 30.9721 2.10649C30.2428 1.39801 29.2536 1 28.2222 1C27.1908 1 26.2017 1.39801 25.4724 2.10649C24.7431 2.81496 24.3333 3.77585 24.3333 4.77778ZM4.88889 4.77778C4.88889 5.77971 5.29861 6.7406 6.02792 7.44907C6.75723 8.15754 7.74638 8.55556 8.77778 8.55556C9.80918 8.55556 10.7983 8.15754 11.5276 7.44907C12.2569 6.7406 12.6667 5.77971 12.6667 4.77778C12.6667 3.77585 12.2569 2.81496 11.5276 2.10649C10.7983 1.39801 9.80918 1 8.77778 1C7.74638 1 6.75723 1.39801 6.02792 2.10649C5.29861 2.81496 4.88889 3.77585 4.88889 4.77778Z" stroke={`${currentTarget === 'consumer' ? 'white' : 'black'}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Consumers
                            {currentTarget === 'consumer' &&
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className='absolute right-[6px] top-[6px]'>
                                <path d="M12.0001 1.07191C13.2068 1.7686 14.2105 2.76833 14.912 3.97215C15.6135 5.17597 15.9885 6.54213 15.9997 7.93538C16.011 9.32864 15.6582 10.7007 14.9762 11.9157C14.2942 13.1307 13.3068 14.1465 12.1115 14.8626C10.9163 15.5787 9.55481 15.9702 8.16178 15.9984C6.76875 16.0266 5.39251 15.6904 4.16929 15.0233C2.94608 14.3562 1.91832 13.3811 1.18775 12.1947C0.457175 11.0083 0.049128 9.65168 0.00400014 8.25911L0 7.99991L0.00400014 7.74071C0.0488032 6.3591 0.450844 5.01268 1.17093 3.83271C1.89101 2.65273 2.90456 1.67948 4.11276 1.00782C5.32097 0.336164 6.6826 -0.0109686 8.0649 0.000264196C9.44721 0.011497 10.803 0.380712 12.0001 1.07191ZM10.9657 5.83431C10.828 5.69657 10.6447 5.61383 10.4503 5.6016C10.2559 5.58938 10.0636 5.64851 9.90972 5.76791L9.83452 5.83431L7.20009 8.46791L6.16568 7.43431L6.09048 7.36791C5.93654 7.2486 5.74437 7.18953 5.54999 7.20179C5.35562 7.21406 5.17239 7.29681 5.03467 7.43452C4.89695 7.57224 4.81421 7.75546 4.80194 7.94984C4.78968 8.14421 4.84874 8.33638 4.96806 8.49031L5.03446 8.56551L6.63448 10.1655L6.70968 10.2319C6.84998 10.3408 7.02251 10.3998 7.20009 10.3998C7.37767 10.3998 7.55019 10.3408 7.69049 10.2319L7.7657 10.1655L10.9657 6.96551L11.0321 6.89031C11.1515 6.73639 11.2107 6.54419 11.1984 6.34977C11.1862 6.15535 11.1035 5.97207 10.9657 5.83431Z" fill="white" />
                              </svg>
                            }
                          </button>
                          <button
                            className={`relative w-1/2 font-[Inter] font-semibold text-sm flex rounded-lg px-4 py-[18px] flex flex-col items-center justify-center ${currentTarget === 'professional' ? 'bg-[#6C63FF] text-white' : 'bg-[#F5F5F5] text-black'}`}
                            onClick={() => setCurrentTarget('professional')}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="37" height="36" viewBox="0 0 37 36" fill="none" className='mb-[10px]'>
                              <path d="M16.5556 6.66667C16.5556 8.16956 17.5799 9.6109 19.4031 10.6736C21.2264 11.7363 23.6993 12.3333 26.2778 12.3333C28.8563 12.3333 31.3292 11.7363 33.1524 10.6736C34.9757 9.6109 36 8.16956 36 6.66667M16.5556 6.66667C16.5556 5.16377 17.5799 3.72243 19.4031 2.65973C21.2264 1.59702 23.6993 1 26.2778 1C28.8563 1 31.3292 1.59702 33.1524 2.65973C34.9757 3.72243 36 5.16377 36 6.66667M16.5556 6.66667V14.2222M36 6.66667V14.2222M16.5556 14.2222C16.5556 17.3521 20.9092 19.8889 26.2778 19.8889C31.6464 19.8889 36 17.3521 36 14.2222M16.5556 14.2222V21.7778M36 14.2222V21.7778M16.5556 21.7778C16.5556 24.9077 20.9092 27.4444 26.2778 27.4444C31.6464 27.4444 36 24.9077 36 21.7778M16.5556 21.7778V29.3333C16.5556 32.4632 20.9092 35 26.2778 35C31.6464 35 36 32.4632 36 29.3333V21.7778M8.77778 12.3333H3.91667C3.14312 12.3333 2.40125 12.6318 1.85427 13.1632C1.30729 13.6945 1 14.4152 1 15.1667C1 15.9181 1.30729 16.6388 1.85427 17.1701C2.40125 17.7015 3.14312 18 3.91667 18H5.86111C6.63466 18 7.37653 18.2985 7.92351 18.8299C8.47049 19.3612 8.77778 20.0819 8.77778 20.8333C8.77778 21.5848 8.47049 22.3054 7.92351 22.8368C7.37653 23.3682 6.63466 23.6667 5.86111 23.6667H1M4.88889 23.6667V25.5556M4.88889 10.4444V12.3333" stroke={`${currentTarget === 'professional' ? 'white' : 'black'}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Professionals
                            {currentTarget === 'professional' &&
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className='absolute right-[6px] top-[6px]'>
                                <path d="M12.0001 1.07191C13.2068 1.7686 14.2105 2.76833 14.912 3.97215C15.6135 5.17597 15.9885 6.54213 15.9997 7.93538C16.011 9.32864 15.6582 10.7007 14.9762 11.9157C14.2942 13.1307 13.3068 14.1465 12.1115 14.8626C10.9163 15.5787 9.55481 15.9702 8.16178 15.9984C6.76875 16.0266 5.39251 15.6904 4.16929 15.0233C2.94608 14.3562 1.91832 13.3811 1.18775 12.1947C0.457175 11.0083 0.049128 9.65168 0.00400014 8.25911L0 7.99991L0.00400014 7.74071C0.0488032 6.3591 0.450844 5.01268 1.17093 3.83271C1.89101 2.65273 2.90456 1.67948 4.11276 1.00782C5.32097 0.336164 6.6826 -0.0109686 8.0649 0.000264196C9.44721 0.011497 10.803 0.380712 12.0001 1.07191ZM10.9657 5.83431C10.828 5.69657 10.6447 5.61383 10.4503 5.6016C10.2559 5.58938 10.0636 5.64851 9.90972 5.76791L9.83452 5.83431L7.20009 8.46791L6.16568 7.43431L6.09048 7.36791C5.93654 7.2486 5.74437 7.18953 5.54999 7.20179C5.35562 7.21406 5.17239 7.29681 5.03467 7.43452C4.89695 7.57224 4.81421 7.75546 4.80194 7.94984C4.78968 8.14421 4.84874 8.33638 4.96806 8.49031L5.03446 8.56551L6.63448 10.1655L6.70968 10.2319C6.84998 10.3408 7.02251 10.3998 7.20009 10.3998C7.37767 10.3998 7.55019 10.3408 7.69049 10.2319L7.7657 10.1655L10.9657 6.96551L11.0321 6.89031C11.1515 6.73639 11.2107 6.54419 11.1984 6.34977C11.1862 6.15535 11.1035 5.97207 10.9657 5.83431Z" fill="white" />
                              </svg>
                            }
                          </button>
                        </div>
                        <div className="mt-[26px]">
                          <p className='text-[20px] font-[Inter] font-bold mb-[18px]'>Please add specific audience industry tags you would like to target:</p>
                          <CreatableSelect
                            styles={customStyles}
                            value={currentAudience}
                            placeholder="Type your tag(s) and press enter"
                            onChange={e => setCurrentAudience(e.map(item => ({ value: item.value, label: item.label })))}
                            isMulti
                            options={audience.map((item: any) => ({ value: item.id, label: item.name }))}
                          />
                        </div>
                      </div>
                      <div className='w-full text-center mt-[45px]'>
                        <button
                          className='rounded-[5px] bg-[#6c63ff] px-[50px] py-[10px] text-white text-sm disabled:bg-gray-400'
                          onClick={() => setCurrentTab('budget')}
                          disabled={currentAudience.length <= 0}
                        >
                          Next Step
                        </button>
                      </div>
                    </>
                  }
                  {
                    currentTab === 'budget' && <>
                      <h2 className='font-[Inter] text-[20px] font-semibold text-black'>Please type in your budget cap for this campaign</h2>
                      <p className='font-[Inter] text-gray-600 text-sm mt-[14px]'>*Keep in mind, these are all verified, targeted, engaged and trusting readers that will be clicking through directly to your landing page of choice</p>
                      <div className='px-4 py-2 mt-[23px] border-[1px] rounded-lg border-black w-full flex justify-between items-center relative'>
                        <input
                          value={currentPrice}
                          prefix='$'
                          className='border-0 focus:border-0 focus:ring-0 focus-visible:outline-0 focus-visible:border-0 flex-1'
                          onChange={e => setCurrentPrice(e.target.value)}
                          type="number"
                          min="10000"
                        />
                        <p className='text-[#f76363] font-normal text-xs right-[23px] top-[10px] ms-2'>*minimum input must be $10,000</p>
                      </div>
                      {currentPrice &&
                        <div className='mt-[9px]'>
                          <span className='font-[Inter] text-sm my-3 text-[#6C63FF]'>
                            {`*Estimated clicks for the campaign are ${Math.floor(Number(currentPrice) / (currentTarget === 'consumer' ? 8 : 20))}`}
                          </span>
                        </div>
                      }
                      <div className='mt-[35px] text-center w-full'>
                        <button
                          className='rounded-[5px] bg-[#6c63ff] px-[50px] py-[10px] text-white disabled:bg-gray-400 text-sm'
                          onClick={() => setCurrentTab('review')}
                          disabled={Number(currentPrice) < 10000}
                        >
                          Next Step
                        </button>
                      </div>
                    </>
                  }
                  {
                    currentTab === 'review' && <>
                      <h2 className='font-semibold text-base font-[Inter]'>Review</h2>
                      {currentAudience.length >= 1 && currentPrice &&
                        <div className='mt-[15px]'>
                          <p className='py-2'><span className='font-medium me-2'>⭐ Dates:</span>The campaign will start from today until the budget is reached.</p>
                          <p className='py-2'><span className='font-medium me-2'>⭐ Max Budget:</span>{`$${currentPrice}`}</p>
                          <p className='py-2'><span className='font-medium me-2'>⭐ Target Audience Demographic:</span>{currentTarget === 'consumer' ? 'Consumers' : 'Professional'}</p>
                          <p className='py-2'><span className='font-medium me-2'>⭐ Target Audience Tags:</span>{currentAudience.map((item: any) => item.label).join(', ')}</p>
                        </div>
                      }
                      <h2 className='font-bold text-base font-[Inter] mt-[29px]'>Billing Setup</h2>
                      <p className='font-[Inter] text-sm font-normal text-[#43474A] mt-[10px] mb-0'>We charge a one-time deposit of $250 which will be applied to your campaign as a credit. All further campaign activity is billed at the end of every week or when your account hits its billing threshold. </p>
                      <div className='w-full flex'>
                        <div className='flex-1 me-[18px]'>
                          <button
                            className='flex mt-[17px] py-[11px] px-[17px] items-center justify-center text-[#7f8182] w-full rounded-lg border-[1px] border-[#7f8182]'
                            onClick={() => setShowAddCard(!showAddCard)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className='me-[9px]'>
                              <path d="M7 10H13M10 7V13M1 10C1 11.1819 1.23279 12.3522 1.68508 13.4442C2.13738 14.5361 2.80031 15.5282 3.63604 16.364C4.47177 17.1997 5.46392 17.8626 6.55585 18.3149C7.64778 18.7672 8.8181 19 10 19C11.1819 19 12.3522 18.7672 13.4442 18.3149C14.5361 17.8626 15.5282 17.1997 16.364 16.364C17.1997 15.5282 17.8626 14.5361 18.3149 13.4442C18.7672 12.3522 19 11.1819 19 10C19 7.61305 18.0518 5.32387 16.364 3.63604C14.6761 1.94821 12.3869 1 10 1C7.61305 1 5.32387 1.94821 3.63604 3.63604C1.94821 5.32387 1 7.61305 1 10Z" stroke="#7F8182" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Add a Card
                          </button>
                        </div>
                        <div className='flex-col'>
                          <select
                            className='w-[500px] mt-[17px] pl-[16px] py-[11px] border-[1px] border-[#7f8182] rounded-lg font-[Inter] text-base'
                            value={currentCard}
                            onChange={e => setCurrentCard(e.target.value)}
                          >
                            {
                              cardList.map((item: any) => (
                                <option value={item.card_id} key={item.id}>
                                  {item.brand}
                                  {` **** **** **** ${item.last4}`}
                                </option>
                              ))
                            }
                          </select>
                        </div>
                      </div>
                      <div className='mt-[28px]'>
                        {
                          showAddCard &&
                          <>
                            <p className='font-[Inter] text-base font-semibold text-black mb-[19px]'>Add New Card</p>
                            <Elements stripe={StripeUtil.stripePromise}>
                              <CardForm />
                            </Elements>
                          </>
                        }
                      </div>
                      <div className='w-full text-center mt-[50px]'>
                        {currentAudience.length >= 1 && currentPrice.length > 3 && <button className='rounded-[5px] bg-[#6c63ff] px-[60px] py-[10px] text-white mt-2' disabled={!isSubmitable()} onClick={handleSubmit}>Submit</button>}
                        <button
                          className='bg-transparent text-md text-gray-600 font-[Inter] px-[60px] py-[10px]'
                          onClick={handleSave}>
                          Save Campaign
                        </button>
                      </div>
                    </>
                  }
                </div>
                <EditCampaignUI show={showUI} setShow={(show: boolean) => setShowUI(show)} uiData={data} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root >
  );
};

export default EditCampaign;