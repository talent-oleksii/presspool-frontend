import { FC, Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import validator from 'validator';
import APIInstance from '../api';
import { Spin } from 'antd';
import DialogUtils from '../utils/DialogUtils';
import { useSelector } from 'react-redux';
import { selectAuth } from '../store/authSlice';

interface typeRequestNewsletter {
  show: boolean;
  setShow: Function;
}

const RequestNewsletter: FC<typeRequestNewsletter> = ({ show, setShow }: typeRequestNewsletter) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showText, setShowText] = useState('Upload File');
  const [file, setFile] = useState<any>(null);
  const { email } = useSelector(selectAuth);

  const handleSubmit = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('email', email);
    formData.append('name', name);
    formData.append('url', url);
    formData.append('file', file);
    APIInstance.post('data/request-newsletter', formData).then(() => {
      DialogUtils.show("success", "Newsletter(s) Requested!", "Thanks for submitting that info. We will look into this request and reach out to you if we have any questions.");
    }).catch(err => { }).finally(() => setLoading(false));
  };

  const handleUploadFile = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => { }}>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 bg-black/[.8]">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-100"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={`relative bg-white rounded-[10px] text-left shadow-xl items-center flex flex-col w-[600px] px-[40px] pt-[30px] pb-[26px]`}
              >
                <button
                  onClick={() => setShow(false)}
                  className="absolute right-4 top-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="34"
                    height="34"
                    viewBox="0 0 34 34"
                    fill="none"
                  >
                    <path
                      d="M13.4444 13.4444L20.5556 20.5556M20.5556 13.4444L13.4444 20.5556M17 1C29.8 1 33 4.2 33 17C33 29.8 29.8 33 17 33C4.2 33 1 29.8 1 17C1 4.2 4.2 1 17 1Z"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div className="text-left w-full">
                  <div className='header flex flex-col items-center justify-center'>
                    <h3 className='text-2xl font-semibold -tracking-[.72px]'>Request Newsletters</h3>
                  </div>
                  <p className='text-center w-full -tracking-[.54px] text-lg font-semibold mt-8 mb-4'>Single Newsletter</p>
                  <p className="text-base font-[Inter] font-medium -tracking-[.48px]">
                    Newsletter Name
                  </p>
                  <input
                    value={name}
                    placeholder='Enter here...'
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full text-base font-[Inter] px-4 py-3 focus:ring-0 focus:border-black -tracking-[.48px] text-primary border-[#7F8182] border-[1px] rounded-[10px] bg-[#FBFBFB]"
                  />
                  <p className="mt-4 text-base font-[Inter] font-medium -tracking-[.48px]">
                    Newsletter URL
                  </p>
                  <input
                    value={url}
                    placeholder='Enter here...'
                    onChange={(e) => setUrl(e.target.value)}
                    className="mt-2 w-full text-base font-[Inter] px-4 py-3 focus:ring-0 focus:border-black -tracking-[.48px] text-primary border-[#7F8182] border-[1px] rounded-[10px] bg-[#FBFBFB]"
                  />
                  <p className='text-center w-full -tracking-[.54px] text-lg font-semibold mt-8 mb-4'>Multiple Newsletters</p>
                  <p className='-tracking-[.48px] text-base'>Upload CSV or Document</p>
                  <div className='mt-2'>
                    <button
                      onClick={handleUploadFile}
                      className='border-dashed border-[1px] -tracking-[.42px] text-sm px-8 py-2 border-[#7f8182] rounded-[3px] bg-white'
                    >
                      {showText}
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      hidden
                      onChange={(e) => {
                        if (e.target.files && e.target.files?.length > 0) {
                          setShowText(e.target.files[0].name);
                          setFile(e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                  <button
                    className="bg-[#7FFBAE] rounded-[6px] text-[17.93px] text-black font-semibold font-[Inter] py-3 w-full mt-8 disabled:bg-[#7f8183]"
                    onClick={handleSubmit}
                  // disabled={(name.length <= 0 || url.length <= 0 || !validator.isURL(url)) || (!file)}
                  >
                    {loading && <Spin className='me-2' />}
                    Submit Request
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root >
  );
};

export default RequestNewsletter;