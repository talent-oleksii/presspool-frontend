import React, { FC, Fragment, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Dialog, Transition } from '@headlessui/react';
import { Tooltip } from 'react-tooltip';

import SampleLogo from '../../assets/logo/logo.png';

import APIInstance from '../../api';
import { selectAuth } from '../../store/authSlice';
import Loading from '../../components/Loading';

interface typeEditCampaignUI {
  show: boolean;
  setShow: Function;
  setUIContent?: Function;
  uiData?: any;
  afterChange?: Function;
}

const EditCampaignUI: FC<typeEditCampaignUI> = ({ show, setShow, setUIContent, uiData, afterChange }: typeEditCampaignUI) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { email } = useSelector(selectAuth);

  const [currentTab, setCurrentTab] = useState('create');
  const [headLine, setHeadLine] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit');
  const [body, setBody] = useState('Labore et dolore magina alqua, Ut enim ad minim veniam, quis nostrud exercitation ulamco laboris nisi ut aliquip');
  const [cta, setCta] = useState('Call To Action');
  const [image, setImage] = useState<any>(null);
  const [file, setFile] = useState<any>('');
  const [pageUrl, setPageUrl] = useState('');
  const [noNeedCheck, setNoNeedCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [asterick, setAsterick] = useState(false);

  useEffect(() => {
    if (uiData) {
      setHeadLine(uiData.headline);
      setBody(uiData.body);
      setCta(uiData.cta);
      setImage(uiData.image);
      setNoNeedCheck(Number(uiData.no_need_check) === 1 ? true : false);
      setPageUrl(uiData.page_url || '');
    }
  }, [uiData]);

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSave: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (headLine.length <= 0 || body.length <= 0 || cta.length <= 0 || (!image || (image && image.length <= 0)) || pageUrl.length <= 0) {
      setAsterick(true);
      return;
    }
    setAsterick(false);
    setLoading(true);
    if (!uiData) {
      APIInstance.post('data/campaign_ui', {
        email,
        headLine,
        cta,
        body,
        image,
        pageUrl,
        noNeedCheck: noNeedCheck ? 1 : 0
      }).then(data => {
        console.log('data:', data);
        if (setUIContent) setUIContent(data.data.id);
        setShow(false);
      }).catch(err => {
        console.log('errr:', err);
      }).finally(() => {
        setLoading(false);
      });
    } else {
      APIInstance.put('data/campaign_ui', {
        id: uiData.id,
        headLine,
        cta,
        body,
        image,
        pageUrl,
        noNeedCheck: noNeedCheck ? 1 : 0,
      }).then(data => {
        console.log('update campaign ui data:', data.data)
        if (afterChange) afterChange(data.data);
        setShow(false);
      }).catch(err => {
        console.log('error:', err);
      }).finally(() => setLoading(false));
    }
  };

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => { }}>
        <div className="fixed inset-0 z-20 overflow-y-auto">
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
              <Dialog.Panel className="relative rounded-lg p-4 text-left shadow-xl sm:w-[900px] border-[1px] border-black bg-[#d9d9d9]">
                {loading && <Loading />}
                <div className='grid grid-cols-2 h-full w-full bg-white p-2 rounded-[10px]'>
                  <div className='col-span-1 text-left'>
                    <div className='flex items-center justify-left'>
                      <button
                        className={`font-[Inter] px-2 py-1 rounded-md ${currentTab === 'create' ? 'bg-[#6C63FF] text-white' : 'bg-white text-[#6C63FF]'}`}
                        onClick={() => setCurrentTab('create')}
                      >
                        New Content
                      </button>
                      <button
                        className={`font-[Inter] px-2 py-1 rounded-md mx-2 ${currentTab === 'library' ? 'bg-[#6C63FF] text-white' : 'bg-white text-[#6C63FF]'}`}
                        onClick={() => setCurrentTab('library')}
                      >
                        My Assets
                      </button>
                    </div>

                    <div className='text-left me-2 my-4 pr-3 rounded-md'>
                      <div className='flex justify-between'>
                        <p className='font-[Inter] text-md font-semibold'>
                          Campaign Headline
                          {asterick && headLine.length <= 0 && <span className='ms-1 text-[red]'>*</span>}
                        </p>
                        {/* <p className='font-[Inter] text-sm text-gray-400'>{`${headLine.length}/60`}</p> */}
                      </div>
                      <input
                        className={`mt-2 w-full rounded border-[1px] py-2 px-3 ${asterick && headLine.length <= 0 ? 'border-[red]' : 'border-gray-400'}`}
                        maxLength={60}
                        data-tooltip-id='headline'
                        value={headLine}
                        onChange={e => setHeadLine(e.target.value)}
                      />
                      <Tooltip id='headline' place="bottom">
                        <div className="whitespace-pre-wrap break-normal w-[250px]">
                          The headline of your campaign. This should be roughly 7 words
                          or less and have a specific outcome.
                          (Ex. Presspool will 10x user growth without PR)
                        </div>
                      </Tooltip>
                      <div className='flex justify-between mt-3'>
                        <p className='font-[Inter] text-md font-semibold' data-tooltip-id='body'>
                          Campaign Body
                          {asterick && body.length <= 0 && <span className='ms-1 text-[red]'>*</span>}
                        </p>
                        {/* <p className='font-[Inter] text-sm text-gray-400'>{`${body.length}/110`}</p> */}
                      </div>
                      <textarea
                        className={`mt-2 w-full rounded border-[1px] py-2 px-3 ${asterick && body.length <= 0 ? 'border-[red]' : 'border-gray-400'}`}
                        maxLength={110}
                        value={body}
                        onChange={e => setBody(e.target.value)}
                        rows={5}
                        data-tooltip-id='body'
                      />
                      <Tooltip id='body' place="bottom">
                        <div className="whitespace-pre-wrap break-normal w-[250px]">
                          The body of your campaign. This should be 500 characters or less and describe how you can help your ideal customer or audience achieve the promise from the headline.
                        </div>
                      </Tooltip>
                      <div className='flex justify-between mt-3'>
                        <p className='font-[Inter] text-md font-semibold'>
                          CTA
                          {asterick && cta.length <= 0 && <span className='ms-1 text-[red]'>*</span>}
                        </p>
                        {/* <p className='font-[Inter] text-sm text-gray-400'>{`${cta.length}/20`}</p> */}
                      </div>
                      <input
                        className={`mt-2 w-full rounded border-[1px] py-2 px-3 ${asterick && cta.length <= 0 ? 'border-[red]' : 'border-gray-400'}`}
                        maxLength={20}
                        value={cta}
                        data-tooltip-id='cta'
                        onChange={e => setCta(e.target.value)}
                      />
                      <Tooltip id='cta' place="bottom">
                        <div className="whitespace-pre-wrap break-normal w-[250px]">
                          The call to action for your button. This should be something like "Free trial" or "Learn more" or "Try for free"
                        </div>
                      </Tooltip>
                      <div className='flex justify-between mt-3'>
                        <p className='font-[Inter] text-md font-semibold'>
                          Hero Image
                          {asterick && (!image || (image && image.length <= 0)) && <span className='ms-1 text-[red]'>*</span>}
                        </p>
                      </div>
                      <button
                        data-tooltip-id='hero'
                        onClick={() => { if (fileInputRef.current) fileInputRef.current.click(); }}
                        className={`px-3 py-2 text-gray-800 text-left font-[Inter] w-full border-[1px] bg-white rounded mt-2 text-md ${asterick && (!image || (image && image.length <= 0)) ? 'border-[red]' : 'border-gray-400'}`}
                      >
                        {file ? file.name : <><span className='text-[#6c63ff]'>Click here</span> to add your image</>}
                      </button>
                      <Tooltip id='hero' place="bottom">
                        <div className="whitespace-pre-wrap break-normal">
                          1200px x 600px
                        </div>
                      </Tooltip>
                      <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        accept='image/*'
                        onChange={handleFileChange}
                      />
                      <div className='flex justify-between mt-3'>
                        <p className='font-[Inter] text-md font-semibold'>
                          URL for your landing page
                          {asterick && pageUrl.length <= 0 && <span className='ms-1 text-[red]'>*</span>}
                        </p>
                      </div>
                      <input
                        type="url"
                        value={pageUrl}
                        data-tooltip-id='url'
                        onChange={e => setPageUrl(e.target.value)}
                        className={`mt-2 w-full rounded border-[1px] py-2 px-3 ${asterick && pageUrl.length <= 0 ? 'border-[red]' : 'border-gray-400'}`}
                      />
                      <Tooltip id='url' place="bottom">
                        <div className="whitespace-pre-wrap break-normal">
                          Where do you want to direct the clicks to?
                        </div>
                      </Tooltip>
                    </div>

                    {/* <div className='p-4 flex'>
                      <input
                        checked={noNeedCheck}
                        onChange={e => setNoNeedCheck(e.target.checked)}
                        type="checkbox"
                        className='rounded border-black transform scale-150 mt-2 mx-3'
                      />
                      <p className='font-[Inter]'>Tick this box if you prefer to keep your headline and body copy as provided, without revision from our content experts.</p>
                    </div> */}

                    <div className='col-span-full text-left mt-9'>
                      <button
                        className='border-black bg-[#6c63ff] rounded-[5px] px-4 py-2 text-white'
                        onClick={handleSave}
                      >
                        Save Changes
                      </button>
                      <button className='font-[Inter] bg-transparent px-4 py-2 ms-3'
                        onClick={() => setShow(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                  <div className='col-span-1 bg-gray-400 h-full sm:max-h-[80vh] overflow-hidden relative flex flex-col items-center bg-[#43474A] rounded-[5px] px-2 py-4'>
                    {/* Content for Campaign */}
                    <div className='bg-[#D1CEFF] w-full flex items-center justify-center py-5'>
                      <p className='text-black border-black border-[5px] p-3 text-[25px]'>ALOGO</p>
                    </div>

                    <p className='text-gray-200 my-4'>
                      Happy Friday AI legends,
                      <br />
                      Today we are diving deep into some of the newest AI solutions that are taking place this week.
                      <br />
                      With GPT’s just being released, the excitement has continued to grow at an unprecedented rate for AI products and solutions that are reshaping how consumers and executives alike do their work better, faster and easier.
                    </p>
                    <div className='bg-white z-10 w-full rounded-[5px]'>
                      <div className=''>
                        <div className='py-4 px-2 flex items-center justify-center'>
                          <img src={!image ? SampleLogo : image} alt="sample logo" className='h-[40px] object-cover' />
                        </div>
                        <div className='py-3 px-2 flex flex-col items-center justify-center'>
                          <h2 className='w-full text-left font-bold text-[Inter] leadig-5 text-[20px] break-words'>{headLine}</h2>
                          <p className='mt-4 w-full text-left font-[Inter] text-gray-500 text-md break-words'>{body}</p>
                          <div className='mt-4 flex justify-between w-full items-center'>
                            <button className='font-[Inter] text-gray-500 px-4 py-2 rounded border-[1px]'>{cta}</button>
                            {/* <p className='text-gray-500'>Sponsored</p> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog >
    </Transition.Root >
  );
};

export default EditCampaignUI;