import { FC, Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import CreatableSelect from 'react-select/creatable';
import { useSelector } from 'react-redux';
import validator from 'validator';

import APIInstance from '../../api';
import StripeUtil from '../../utils/stripe';
import Loading from '../../components/Loading';
import { selectAuth } from '../../store/authSlice';
import EditCampaignUI from './EditCampaignUI';

import { NewspaperIcon, RadioIcon } from '@heroicons/react/20/solid';
import { StylesConfig } from 'react-select';

interface typeCreateCampaign {
  show: boolean;
  setShow: Function;
  afterAdd?: Function;
}

const customStyles: StylesConfig = {
  control: (provided: Record<string, unknown>, state: any) => ({
    ...provided,
    border: state.isFocused ? "1px solid black" : "1px solid black",
    // "&:hover": {
    //   border: "1px solid #ff8b67",
    //   boxShadow: "0px 0px 6px #ff8b67"
    // }
  })
};

const CreateCampaign: FC<typeCreateCampaign> = ({ show, setShow, afterAdd }: typeCreateCampaign) => {
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('detail');
  const [campaignName, setCampaignName] = useState('');
  const [currentTarget, setCurrentTarget] = useState('consumer');
  const [currentPrice, setCurrentPrice] = useState('10000');
  const [audience, setAudience] = useState([]);
  const [currentAudience, setCurrentAudience] = useState<Array<any>>([]);
  const [showUI, setShowUI] = useState(false);
  const [uiId, setUIID] = useState(undefined);
  const [url, setUrl] = useState('');

  const { email } = useSelector(selectAuth);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      APIInstance.get('data/audience'),
    ]).then((results: Array<any>) => {
      const audienceData = results[0].data;
      setAudience(audienceData);
    }).catch(err => {
      console.log('err:', err);
    }).finally(() => setLoading(false));
  }, []);

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

  const handleSubmit = async () => {
    let priceId: any = '';
    const price = currentPrice;

    if (!uiId) {
      alert('There is not UI assigned for this Campaign, Please save your UI first');
      return;
    }
    setLoading(true);
    APIInstance.post('data/campaign', {
      email, campaignName, url, currentTarget,
      currentAudience: currentAudience.map(item => item.value), currentPrice, uiId
    }).then(async data => {
      if (afterAdd) afterAdd(data.data);
      setCurrentTab('detail');
      setCampaignName('');
      setCurrentTarget('consumer');
      setCurrentPrice('10000');
      setUIID(undefined);
      setUrl('');
      setShow(false);

      const url = await StripeUtil.getCampaignPayUrl(email, data.data.id, 'https://presspool-frontend.onrender.com/#/campaign/all', priceId);
      if (!url) return;
      window.open(url, '_self');
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
    APIInstance.post('data/campaign', {
      email,
      campaignName,
      url,
      currentTarget,
      currentAudience: currentAudience.map(item => item.value),
      currentPrice,
      uiId,
    }).then(data => {
      if (afterAdd) afterAdd(data.data);
      setCurrentTab('detail');
      setCampaignName('');
      setCurrentTarget('consumer');
      setUIID(undefined);
      setUrl('');
      setShow(false);
    }).catch(err => {
      console.log('err:', err);
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {
        setShow(false);
      }}>
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
              <Dialog.Panel className="relative bg-white rounded-lg px-4 pb-4 pt-2 text-left shadow-xl sm:w-[1000px] sm:min-h-[500px] border-[1px] border-black">
                {loading && <Loading />}
                <h2 className='font-[Inter] text-[20px] font-semibold m-4'>Create New Campaign</h2>
                <div className="mt-5 flex flex-col items-center justify-center">
                  <div className='flex border-[#D9D9D9] h-full bg-[#F5F5F5] py-2 rounded'>
                    <button
                      className={`px-3 py-2 mx-4 font-[Inter] rounded font-semibold text-left ${currentTab === 'detail' ? 'bg-[#2D2C2D] text-gray-200' : 'text-black'}`}
                      onClick={handleClick}
                      id="detail"
                    >
                      Campaign Details
                    </button>
                    <button
                      className={`px-3 py-2 mx-4 font-[Inter] rounded font-semibold text-left ${currentTab === 'audience' ? 'bg-[#2D2C2D] text-gray-200' : 'text-black'}`}
                      onClick={handleClick}
                      id="audience"
                    >
                      Target Audience
                    </button>
                    <button
                      className={`px-3 py-2 mx-4 font-[Inter] rounded font-semibold text-left ${currentTab === 'budget' ? 'bg-[#2D2C2D] text-gray-200' : 'text-black'}`}
                      onClick={handleClick}
                      id="budget"
                    >
                      Budget
                    </button>
                    <button
                      className={`px-3 py-2 mx-4 font-[Inter] rounded font-semibold text-left ${currentTab === 'review' ? 'bg-[#2D2C2D] text-gray-200' : 'text-black'}`}
                      onClick={handleClick}
                      id="review"
                    >
                      Review
                    </button>
                  </div>
                  <div className='col-span-3'>
                    {
                      currentTab === 'detail' && <>
                        <div className='bg-white p-2'>
                          <p className='mt-4 mb-4 text-[20px] font-[Inter] text-black font-semibold'>What would you like to name your campaign?</p>
                          <input
                            className='px-3 py-2 rounded w-full border font-[Inter] border-black'
                            // placeholder="Give your campaign a name"
                            value={campaignName}
                            onChange={e => setCampaignName(e.target.value)}
                          />
                          <p className='mt-4 mb-4 text-[20px] font-[Inter] text-black font-semibold'>What is your website URL? (We will get your landing page later).</p>
                          <input
                            className='px-3 py-2 rounded w-full border font-[Inter] border-black'
                            // placeholder="https://example.com"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                          />
                        </div>
                        <button
                          className='rounded-[5px] bg-[#6c63ff] px-3 py-2 text-white mt-7'
                          disabled={validator.isEmpty(campaignName) || !validator.isURL(url)}
                          onClick={handleNextOnCampaign}
                        >
                          Next Step
                        </button>
                      </>
                    }
                    {
                      currentTab === 'audience' && <>
                        <div className='bg-white p-2'>
                          <p className='font-[Inter] font-normal text-[20px] my-3 font-semibold'>Who are you targeting</p>
                          <div className='flex items-center'>
                            <button
                              className={`w-[170px] flex rounded-[20px] px-4 py-6 flex flex-col items-center justify-center text-black ${currentTarget === 'consumer' ? 'bg-[#2D2C2D]' : 'bg-[#F5F5F5]'}`}
                              onClick={() => setCurrentTarget('consumer')}
                            >
                              <NewspaperIcon className='h-[20px] mb-3' />
                              <h2 className='font-[Inter] text-black font-semibold'>Consumer</h2>
                            </button>
                            <button
                              className={`w-[170px] ms-5 flex rounded-[20px] px-4 py-6 flex text-black flex-col items-center justify-center ${currentTarget === 'professional' ? 'bg-[#2D2C2D]' : 'bg-[#F5F5F5]'}`}
                              onClick={() => setCurrentTarget('professional')}
                            >
                              <RadioIcon className='h-[20px] mb-3' />
                              <h2 className='font-[Inter] text-black font-semibold'>Professional</h2>
                            </button>
                          </div>
                          <div className="my-5">
                            <p className='text-[20px] font-[Inter] font-bold my-5'>Please add specific audience industry tags you would like to target:</p>
                            <CreatableSelect
                              styles={customStyles}
                              value={currentAudience}
                              onChange={e => setCurrentAudience(e.map(item => ({ value: item.value, label: item.label })))}
                              isMulti
                              options={audience.map((item: any) => ({ value: item.id, label: item.name }))}
                            />
                          </div>
                        </div>
                        <button className='rounded-[5px] bg-[#6c63ff] px-3 py-2 text-white mt-4' onClick={() => setCurrentTab('budget')}>Next Step</button>
                      </>
                    }
                    {
                      currentTab === 'budget' && <>
                        <div className='p-2 bg-white'>
                          <h2 className='font-[Inter] text-[20px] font-semibold mt-4'>Please type in your budget cap for this campaign</h2>
                          <p className='font-[Inter] text-gray-600 text-sm my-4'>*Keep in mind, these are all verified, targeted, engaged and trusting readers that will be clicking<br /> through directly to your landing page of choice</p>
                          <input
                            value={currentPrice}
                            className='px-3 py-2 my-3 border-[1px] rounded border-black'
                            onChange={e => setCurrentPrice(e.target.value)}
                            type="number"
                            min={10000}
                          />
                          {currentPrice &&
                            <div className='mb-5'>
                              <span className='font-[Inter] text-sm my-3 text-[#6C63FF]'>
                                {`*Estimated clicks for the campaign are ${Math.floor(Number(currentPrice) / (currentTarget === 'consumer' ? 8 : 20))}`}
                              </span>
                            </div>
                          }
                        </div>
                        <button className='rounded-[5px] bg-[#6c63ff] px-3 py-2 text-white my-4' onClick={() => setCurrentTab('review')}>Next Step</button>
                      </>
                    }
                    {
                      currentTab === 'review' && <>
                        <div className='p-2 bg-white'>
                          <h2 className='font-bold text-[20px] font-[Inter] mt-3'>Review</h2>
                          {currentAudience.length >= 1 && currentPrice &&
                            <div className='my-3'>
                              <p className='py-2'><span className='font-medium me-2'>⭐ Dates:</span>The campaign will start from today until the budget is reached.</p>
                              <p className='py-2'><span className='font-medium me-2'>⭐ Max Budget:</span>{`$${currentPrice}`}</p>
                              <p className='py-2'><span className='font-medium me-2'>⭐ Target Audience Demographic:</span>{currentTarget === 'consumer' ? 'Consumers' : 'Professional'}</p>
                              <p className='py-2'><span className='font-medium me-2'>⭐ Target Audience Tags:</span>{currentAudience.map((item: any) => item.value).join(', ')}</p>
                            </div>
                          }
                        </div>
                        <div>
                          {currentAudience.length >= 1 && currentPrice.length > 3 && <button className='rounded-[5px] bg-[#6c63ff] px-5 py-2 text-white mt-2' disabled={!isSubmitable()} onClick={handleSubmit}>Submit</button>}
                          <button className='bg-transparent text-md text-gray-600 font-[Inter] px-4 py-2' onClick={handleSave}>Save Campaign</button>
                        </div>
                      </>
                    }
                  </div>
                  <EditCampaignUI show={showUI} setShow={(show: boolean) => setShowUI(show)} setUIContent={(data: any) => setUIID(data)} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CreateCampaign;