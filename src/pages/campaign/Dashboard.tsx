import { FC, Fragment, useEffect, useState } from 'react';
import validator from 'validator';
import { Dialog, Transition } from '@headlessui/react';

import APIInstance from '../../api';

const Dashboard: FC = () => {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [campaignName, setCampaignName] = useState('');
    const [url, setUrl] = useState('');
    const [currentTab, setCurrentTab] = useState('detail');
    const [currentTarget, setCurrentTarget] = useState('consumer');
    const [audience, setAudience] = useState([]);
    const [currentAudience, setCurrentAudience] = useState<string>('');
    const [pricing, setPricing] = useState([]);
    const [currentPrice, setCurrentPrice] = useState<string>('');
    // const [loading, setLoading] = useState(false);

    useEffect(() => {
        getAudience();
        getPricing();
    }, []);

    const getAudience = () => {
        APIInstance.get('data/newsletter').then(data => {
            console.log('newletter data:', data.data);
            setAudience(data.data.records);
        }).catch(err => {
            console.log('error:', err);
        });
    };

    const getPricing = () => {
        APIInstance.get('data/pricing').then(data => {
            console.log('pricing data:', data.data.records);
            setPricing(data.data.records);
        }).catch(err => {
            console.log('error:', err);
        });
    };

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e: any) => {
        setCurrentTab(e.target.id);
    };
    
    const handleNextOnCampaign = () => {
        if (!validator.isEmpty(campaignName) && validator.isURL(url)) setCurrentTab('audience');
    };

    return (
        <div className='px-[85px] py-[40px] text-left'>
            <h1 className='font-semibold font-[Inter] text-[32px]'>My Campaigns</h1>
            <p className='my-4 text-[#43474A]'>Manage and edit your campaigns, as well as track their status below</p>

            <div className='my-7 p-5 min-h-[250px] shadow-md shadow-[black]/[.25] rounded-[20px] bg-white'>
                <h2 className='font-[Inter] text-[20px] font-semibold'>My Campaign Overview</h2>
            </div>

            <button className='rounded-[10px] bg-[#6C63FF] font-[Inter] font-semibold text-[white] font-md px-4 py-3' onClick={() => setShowAddDialog(true)}>Create New Campaign</button>

            <div className='my-7 p-5 min-h-[250px] shadow-md shadow-[black]/[.25] rounded-[20px] bg-white'>
                <h2 className='font-[Inter] text-[20px] font-semibold'>My Campaign Analytics</h2>
            </div>

            <Transition.Root show={showAddDialog} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => {
                    setShowAddDialog(false);
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
                                <Dialog.Panel className="relative bg-[#F5F5F5] rounded-lg px-4 pb-4 pt-5 text-left shadow-xl sm:w-[1000px] sm:min-h-[500px]">
                                    <h2 className='font-[Inter] text-[20px] font-semibold m-4'>Create New Campaign</h2>
                                    <div className="mt-5 grid grid-cols-4">
                                        <div className='col-span-1 flex flex-col border-r-[1px] border-[#D9D9D9] px-2 h-full'>
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
                                                            placeholder="Let's give your campaign's name"
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
                                                    <button className='rounded-[5px] bg-[#6c63ff] px-3 py-2 text-white mt-7' onClick={handleNextOnCampaign}>Next Step</button>
                                                </>
                                            }
                                            {
                                                currentTab === 'audience' && <>
                                                    <div className='bg-white p-2'>
                                                        <p className='font-[Inter] font-normal text-lg my-3'>Targeting Options</p>
                                                        <div className='grid grid-cols-2 gap-4'>
                                                            <button
                                                                className={`col-span-1 flex rounded-[5px] bg-[#d9d9d9] p-4 flex flex-col border-[2px] ${currentTarget === 'consumer' ? 'border-[#6C63FF]' : 'border-gray-500'}`}
                                                                onClick={() => setCurrentTarget('consumer')}
                                                            >
                                                                <h2 className={`font-[Inter] ${currentTarget === 'consumer' ? 'text-[#6C63FF]' : 'text-gray-500'}`}>Consumer</h2>
                                                                <p className='font-[Inter] text-md text-gray-700'>Target by location, age, gender, income bracket etc</p>
                                                            </button>
                                                            <button
                                                                className={`col-span-1 flex rounded-[5px] bg-[#d9d9d9] p-4 flex flex-col border-[2px] ${currentTarget === 'professional' ? 'border-[#6C63FF]' : 'border-gray-500'}`}
                                                                onClick={() => setCurrentTarget('professional')}
                                                            >
                                                                <h2 className={`font-[Inter] ${currentTarget === 'professional' ? 'text-[#6C63FF]' : 'text-gray-500'}`}>Professional</h2>
                                                                <p className='font-[Inter] text-md text-gray-700'>Target by location, company size, industry, job title etc</p>
                                                            </button>
                                                        </div>
                                                        <div className="my-7">
                                                            <p className='my-2 text-gray-700 font-[Inter] text-lg'>Ideal Audience Tags</p>
                                                            <div className='p-4'>
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
                                                    <button className='rounded-[5px] bg-[#6c63ff] px-3 py-2 text-white mt-2' onClick={() => setCurrentTab('budget')}>Next Step</button>
                                                </>
                                            }
                                            {
                                                currentTab === 'budget' && <>
                                                    <div className='p-2 bg-white'>
                                                        <h2 className='font-[Inter] text-lg font-semibold'>Budget</h2>
                                                        <p className='font-[Inter] text-gray-800 text-md my-2'>Select your maximum budget for this campaign</p>
                                                        <p className='font-[Inter] text-gray-600 text-sm my-2'>*Keep in mind, these are all verified, targeted, engaged and trusting reader that will be clicking through directly to your landing page of choice</p>

                                                        <select className='w-full border-[1px] rounded border-gray0700 px-2 py-1' onChange={e => setCurrentPrice(e.target.value)}>
                                                            {
                                                                pricing.filter(price => price['fields']['Demographic'] === (currentTarget === 'consumer' ? 'B2C' : 'B2B')).sort((a, b) => b['fields']['Price'] - a['fields']['Price']).map((item: any) => {
                                                                    return <option value={item.id} key={item.id}>{item.fields['Budget']}</option>
                                                                })
                                                            }
                                                        </select>
                                                        {currentPrice.length >= 3 && <p className='font-[Inter] text-sm my-3 text-[#6C63FF]'>{`*Estimated clickes for the campaign are ${pricing.filter((item: any) => item.id === currentPrice)[0]['fields']['Average est. clicks']}`}</p>}
                                                    </div>
                                                    <button className='rounded-[5px] bg-[#6c63ff] px-3 py-2 text-white mt-2' onClick={() => setCurrentTab('review')}>Next Step</button>
                                                </>
                                            }
                                            {
                                                currentTab === 'review' && <>
                                                    <div className='p-2 bg-white'>
                                                        <h2 className='font-semibold text-lg font-[Inter]'>Review</h2>
                                                        { currentAudience.length > 3 && currentPrice.length > 3 &&
                                                            <div className='my-3'>
                                                                <p><span className='font-semibold me-2'>Dates:</span>The campaign will start from today until the budget is reached.</p>
                                                                <p><span className='font-semibold me-2'>Max Budget:</span>{pricing.filter(price => price['id'] === currentPrice)[0]['fields']['Budget']}</p>
                                                                <p><span className='font-semibold me-2'>Target Audience Demographic:</span>{currentTarget === 'consumer' ? 'Consumers' : 'Professional'}</p>
                                                                <p><span className='font-semibold me-2'>Target Audience Tags:</span>{audience.filter(item => item['id'] === currentAudience)[0]['fields']['Newsletter']}</p>
                                                            </div>
                                                        }
                                                    </div>
                                                    <button className='rounded-[5px] bg-[#6c63ff] px-3 py-2 text-white mt-2' onClick={() => setCurrentTab('review')}>Submit</button>
                                                </>
                                            }
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
};

export default Dashboard;