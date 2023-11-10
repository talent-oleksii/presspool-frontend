import { FC, Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useSelector } from 'react-redux';
import validator from 'validator';

import APIInstance from '../../api';
import StripeUtil from '../../utils/stripe';
import Loading from '../../components/Loading';
import { selectAuth } from '../../store/authSlice';
import EditCampaignUI from './EditCampaignUI';

interface typeCreateCampaign {
  show: boolean;
  setShow: Function;
  afterAdd?: Function;
}

const CreateCampaign: FC<typeCreateCampaign> = ({ show, setShow, afterAdd }: typeCreateCampaign) => {
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('detail');
  const [campaignName, setCampaignName] = useState('');
  const [currentTarget, setCurrentTarget] = useState('consumer');
  const [currentPrice, setCurrentPrice] = useState<string>('');
  const [audience, setAudience] = useState([]);
  const [currentAudience, setCurrentAudience] = useState<string>('');
  const [pricing, setPricing] = useState([]);
  const [showUI, setShowUI] = useState(false);
  const [uiId, setUIID] = useState(undefined);
  const [url, setUrl] = useState('');

  const { email } = useSelector(selectAuth);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      APIInstance.get('data/audience'),
      APIInstance.get('data/pricing'),
    ]).then((results: Array<any>) => {
      console.log('data:', results);
      const audienceData = results[0].data.records;
      setAudience(audienceData);
      if (audienceData.length >= 1) setCurrentAudience(audienceData[0].id);
      const pricingData = results[1].data.records.sort((a: any, b: any) => b['fields']['Price'] - a['fields']['Price']);
      setPricing(pricingData);
      if (pricingData.length >= 1) setCurrentPrice(pricingData[0].id);

    }).catch(err => {
      console.log('err:', err);
    }).finally(() => setLoading(false));
  }, []);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e: any) => {
    setCurrentTab(e.target.id);
  };

  const isSubmitable = () => {
    return !validator.isEmpty(campaignName) && validator.isURL(url) && currentPrice.length > 3;
  };

  const handleNextOnCampaign = () => {
    setShowUI(true);
    setCurrentTab('audience');
  };

  const handleSubmit = async () => {
    let priceId: any = '';
    const price = pricing.filter((item: any) => item.id === currentPrice)[0]['fields']['Price'];
    if (price === 10000) priceId = process.env.REACT_APP_PRICE_10000;
    else if (price === 15000) priceId = process.env.REACT_APP_PRICE_15000;
    else if (price === 20000) priceId = process.env.REACT_APP_PRICE_20000;
    else if (price === 25000) priceId = process.env.REACT_APP_PRICE_25000;
    else priceId = process.env.REACT_APP_PRICE_50000;

    if (!uiId) {
      alert('There is not UI assigned for this Campaign, Please save your UI first');
      return;
    }
    setLoading(true);
    APIInstance.post('data/campaign', {
      email, campaignName, url, currentTarget,
      currentAudience, currentPrice, uiId
    }).then(async data => {
      if (afterAdd) afterAdd(data.data);
      setCurrentTab('detail');
      setCampaignName('');
      setCurrentAudience('consumer');
      setCurrentPrice('');
      setCurrentAudience('');
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
      currentAudience,
      currentPrice,
      uiId,
    }).then(data => {
      if (afterAdd) afterAdd(data.data);
      setCurrentTab('detail');
      setCampaignName('');
      setCurrentAudience('consumer');
      setCurrentPrice('');
      setCurrentAudience('');
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
              <Dialog.Panel className="relative bg-[#F5F5F5] rounded-lg px-4 pb-4 pt-5 text-left shadow-xl sm:w-[1000px] sm:min-h-[500px] border-[1px] border-black">
                {loading && <Loading />}
                <h2 className='font-[Inter] text-[20px] font-semibold m-4'>Create New Campaign</h2>
                <div className="mt-5 grid grid-cols-4">
                  <div className='col-span-1 flex flex-col border-[#D9D9D9] px-2 h-full'>
                    <button
                      className={`px-3 py-2 font-[Inter] rounded font-semibold text-left ${currentTab === 'detail' ? 'bg-[#D9D9D9]' : ''}`}
                      onClick={handleClick}
                      id="detail"
                    >
                      Campaign Details
                    </button>
                    <button
                      className={`px-3 py-2 font-[Inter] rounded font-semibold text-left ${currentTab === 'audience' ? 'bg-[#D9D9D9]' : ''}`}
                      onClick={handleClick}
                      id="audience"
                    >
                      Target Audience
                    </button>
                    <button
                      className={`px-3 py-2 font-[Inter] rounded font-semibold text-left ${currentTab === 'budget' ? 'bg-[#D9D9D9]' : ''}`}
                      onClick={handleClick}
                      id="budget"
                    >
                      Budget
                    </button>
                    <button
                      className={`px-3 py-2 font-[Inter] rounded font-semibold text-left ${currentTab === 'review' ? 'bg-[#D9D9D9]' : ''}`}
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
                          <input
                            className='px-3 py-2 rounded-[10px] w-full border font-[Inter]'
                            placeholder="Give your campaign a name"
                            value={campaignName}
                            onChange={e => setCampaignName(e.target.value)}
                          />
                          <p className='mt-4 mb-2 text-md font-[Inter] text-gray-900'>Site URL</p>
                          <input
                            className='px-3 py-2 rounded-[10px] w-full border font-[Inter]'
                            placeholder="https://example.com"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                          />
                          <p className='text-sm font-[Inter] text-gray-500 mt-2 font-normal'>We only need the domain of your site. We'll ask for the landing page shortly.</p>
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
                          <p className='font-[Inter] font-normal text-lg my-3'>Targeting Options</p>
                          <div className='grid grid-cols-2 gap-4'>
                            <button
                              className={`col-span-1 flex rounded-[5px] p-4 flex flex-col ${currentTarget === 'consumer' ? 'bg-[#6c63ff]' : 'bg-gray-600'}`}
                              onClick={() => setCurrentTarget('consumer')}
                            >
                              <h2 className='font-[Inter] text-white font-semibold'>Consumer</h2>
                              <p className='font-[Inter] text-md text-gray-100'>Target by location, age, gender, income bracket etc</p>
                            </button>
                            <button
                              className={`col-span-1 flex rounded-[5px] p-4 flex flex-col ${currentTarget === 'professional' ? 'bg-[#6c63ff]' : 'bg-gray-600'}`}
                              onClick={() => setCurrentTarget('professional')}
                            >
                              <h2 className='font-[Inter] text-white font-semibold'>Professional</h2>
                              <p className='font-[Inter] text-md text-gray-100'>Target by location, company size, industry, job title etc</p>
                            </button>
                          </div>
                          <div className="my-3">
                            <p className='my-2 text-gray-700 font-[Inter] text-lg'>Ideal Audience Tags</p>
                            <div className='p-2'>
                              <p className='text-md font-[Inter]'>You can get started by selecting one of our most frequently requested audiences or define your own below</p>
                              <select
                                className='w-full border-[1px] rounded border-gray-700 px-2 py-1'
                                value={currentAudience}
                                onChange={e => setCurrentAudience(e.target.value)}
                              >
                                {
                                  audience.map((item: any) => {
                                    return <option value={item.id} key={item.id}>{item.fields['Newsletter']}</option>
                                  })
                                }
                              </select>
                            </div>
                          </div>
                        </div>
                        <button className='rounded-[5px] bg-[#6c63ff] px-3 py-2 text-white mt-4' onClick={() => setCurrentTab('budget')}>Next Step</button>
                      </>
                    }
                    {
                      currentTab === 'budget' && <>
                        <div className='p-2 bg-white'>
                          <h2 className='font-[Inter] text-lg font-semibold'>Budget</h2>
                          <p className='font-[Inter] text-gray-800 text-md my-2'>Select your maximum budget for this campaign</p>
                          <p className='font-[Inter] text-gray-600 text-sm my-2'>*Keep in mind, these are all verified, targeted, engaged and trusting reader that will be clicking through directly to your landing page of choice</p>

                          <select className='w-full border-[1px] rounded border-black px-2 py-1 my-4' onChange={e => setCurrentPrice(e.target.value)}>
                            {
                              pricing.filter(price => price['fields']['Demographic'] === (currentTarget === 'consumer' ? 'B2C' : 'B2B')).sort((a, b) => b['fields']['Price'] - a['fields']['Price']).map((item: any) => {
                                return <option value={item.id} key={item.id}>{item.fields['Budget']}</option>
                              })
                            }
                          </select>
                          {currentPrice.length >= 3 &&
                            <div className='mb-5'>
                              <span className='font-[Inter] text-sm my-3 text-[#6C63FF]'>
                                {`*Estimated clicks for the campaign are ${pricing.filter((item: any) => item.id === currentPrice)[0]['fields']['Estimated Clicks']}`}
                              </span>
                              <span className='font-semibold font-[Inter] text-black text-sm ms-4'>{`For B2C = $${pricing.filter((item: any) => item.id === currentPrice)[0]['fields']['Price']} / $8, For B2B = $${pricing.filter((item: any) => item.id === currentPrice)[0]['fields']['Price']} / $20`}</span>
                            </div>
                          }
                        </div>
                        <button className='rounded-[5px] bg-[#6c63ff] px-3 py-2 text-white my-4' onClick={() => setCurrentTab('review')}>Next Step</button>
                      </>
                    }
                    {
                      currentTab === 'review' && <>
                        <div className='p-2 bg-white'>
                          <h2 className='font-bold text-lg font-[Inter]'>Review</h2>
                          {currentAudience.length >= 1 && currentPrice.length > 3 &&
                            <div className='my-3'>
                              <p className='py-2'><span className='font-semibold me-2'>Dates:</span>The campaign will start from today until the budget is reached.</p>
                              <p className='py-2'><span className='font-semibold me-2'>Max Budget:</span>{pricing.filter(price => price['id'] === currentPrice)[0]['fields']['Budget']}</p>
                              <p className='py-2'><span className='font-semibold me-2'>Target Audience Demographic:</span>{currentTarget === 'consumer' ? 'Consumers' : 'Professional'}</p>
                              <p className='py-2'><span className='font-semibold me-2'>Target Audience Tags:</span>{audience.filter(item => item['id'] === currentAudience)[0]['fields']['Newsletter']}</p>
                            </div>
                          }
                        </div>
                        <div>
                          {currentAudience.length > 3 && currentPrice.length > 3 && <button className='rounded-[5px] bg-[#6c63ff] px-4 py-2 text-white mt-2' disabled={!isSubmitable()} onClick={handleSubmit}>Submit</button>}
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