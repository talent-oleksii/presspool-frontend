import React, { FC, Fragment, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Dialog, Transition } from '@headlessui/react';

import EditUIBackground from '../../assets/image/sign upback.jpeg';
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

  useEffect(() => {
    if (uiData) {
      console.log('check:', uiData, uiData.no_need_check, Number(uiData.no_need_check) === 1 ? true : false);
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
              <Dialog.Panel className="relative rounded-lg p-4 text-left shadow-xl sm:w-[1200px] border-[1px] border-black bg-gray-100">
                {loading && <Loading />}
                <div className='grid grid-cols-3 h-full w-full'>
                  <div className='col-span-1 text-left'>
                    <div className='flex items-center px-4 justify-center'>
                      <button
                        className={`font-[Inter] px-2 py-1 rounded-md ${currentTab === 'create' ? 'bg-black text-white' : 'bg-white text-black'}`}
                        onClick={() => setCurrentTab('create')}
                      >
                        Create New Campaign
                      </button>
                      <button
                        className={`font-[Inter] px-2 py-1 rounded-md mx-2 ${currentTab === 'library' ? 'bg-black text-white' : 'bg-white text-black'}`}
                        onClick={() => setCurrentTab('library')}
                      >
                        Campaign Library
                      </button>
                    </div>

                    <div className='text-left bg-gray-100 me-2 my-4 p-4 rounded-md border-[1px]'>
                      <div className='flex justify-between'>
                        <p className='font-[Inter] text-sm font-semibold'>Headline</p>
                        <p className='font-[Inter] text-sm text-gray-400'>{`${headLine.length}/60`}</p>
                      </div>
                      <input
                        className='mt-2 w-full rounded-[10px] border-[1px] py-2 px-3'
                        maxLength={60}
                        value={headLine}
                        onChange={e => setHeadLine(e.target.value)}
                      />
                      <div className='flex justify-between mt-3'>
                        <p className='font-[Inter] text-sm font-semibold'>Body</p>
                        <p className='font-[Inter] text-sm text-gray-400'>{`${body.length}/110`}</p>
                      </div>
                      <textarea
                        className='mt-2 w-full rounded-[10px] border-[1px] py-2 px-3'
                        maxLength={110}
                        value={body}
                        onChange={e => setBody(e.target.value)}
                        rows={5}
                      />
                      <div className='flex justify-between mt-3'>
                        <p className='font-[Inter] text-sm font-semibold'>CTA</p>
                        <p className='font-[Inter] text-sm text-gray-400'>{`${cta.length}/20`}</p>
                      </div>
                      <input
                        className='mt-2 w-full rounded-[10px] border-[1px] py-2 px-3'
                        maxLength={20}
                        value={cta}
                        onChange={e => setCta(e.target.value)}
                      />
                      <div className='flex justify-between mt-3'>
                        <p className='font-[Inter] text-sm font-semibold'>Image File</p>
                      </div>
                      <button
                        onClick={() => { if (fileInputRef.current) fileInputRef.current.click(); }}
                        className='px-3 py-2 text-gray-500 text-left font-[Inter] w-full border-[1px] mt-2'
                      >
                        {file ? file.name : 'Select File'}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        accept='image/*'
                        onChange={handleFileChange}
                      />
                      <div className='flex justify-between mt-3'>
                        <p className='font-[Inter] text-sm font-semibold'>Landing Page URL</p>
                      </div>
                      <input
                        type="url"
                        value={pageUrl}
                        onChange={e => setPageUrl(e.target.value)}
                        className='mt-2 w-full rounded-[10px] border-[1px] py-2 px-3'
                      />
                    </div>

                    <div className='p-4'>
                      <p className='font-[Inter]'>Tick this box if you prefer to keep your headline and body copy as provided, without revision from our content experts.</p>

                      <input
                        checked={noNeedCheck}
                        onChange={e => setNoNeedCheck(e.target.checked)}
                        type="checkbox"
                        className='rounded border-black transform scale-150 mt-2'
                      />
                    </div>
                  </div>
                  <div className='col-span-2 bg-gray-400 h-full sm:max-h-[80vh] overflow-hidden relative flex justify-center items-center'>
                    <img
                      className='z-0 absolute'
                      src={EditUIBackground}
                      alt="ui-back"
                    />
                    {/* Content for Campaign */}
                    <div className='bg-white z-10 sm:w-[600px]'>
                      <div className='grid grid-cols-3 p-4'>
                        <div className='col-span-1 py-4 px-2 flex items-center justify-center'>
                          <img src={!image ? SampleLogo : image} alt="sample logo" className='h-full object-cover' />
                        </div>
                        <div className='col-span-2 py-3 px-2 flex flex-col items-center justify-center'>
                          <h2 className='w-full text-left font-bold text-[Inter] leadig-5 text-[20px]'>{headLine}</h2>
                          <p className='mt-4 w-full text-left font-[Inter] text-gray-500 text-md'>{body}</p>
                          <div className='mt-4 flex justify-between w-full items-center'>
                            <button className='font-[Inter] text-gray-500 px-4 py-2 rounded border-[1px]'>{cta}</button>
                            <p className='text-gray-500'>Sponsored</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-span-full text-right mt-3'>
                    <button
                      className='border-black bg-[#6c63ff] rounded-[10px] px-3 py-1 text-white'
                      onClick={handleSave}
                    >
                      Save Changes
                    </button>
                    <button className='font-[Inter] bg-transparent px-3 py-1 ms-3'
                      onClick={() => setShow(false)}
                    >
                      Close
                    </button>
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