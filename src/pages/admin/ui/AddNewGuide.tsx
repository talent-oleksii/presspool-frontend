import { FC, Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import Loading from '../../../components/Loading';
import AdminAPIInstance from '../../../api/adminApi';

interface typeAddNewGuide {
  show: boolean;
  onClose: Function;
  currentTab: string;
}

const AddNewGuide: FC<typeAddNewGuide> = ({ show, onClose, currentTab }: typeAddNewGuide) => {
  const [loading, setLoading] = useState(false);
  const [option, setOption] = useState('file');
  const [video, setVideo] = useState<any>();

  const handleAdd = () => {
    AdminAPIInstance.post('');
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (!file) return;
      setVideo(file);
    }
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
              <Dialog.Panel className={`relative bg-white rounded-[22px] text-left shadow-xl border-[1px] border-black px-[36px] pt-[45px] pb-[26px] w-[500px]`}>
                {loading && <Loading />}
                <button onClick={() => onClose(false)} className='absolute right-4 top-4'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
                    <path d="M13.4444 13.4444L20.5556 20.5556M20.5556 13.4444L13.4444 20.5556M17 1C29.8 1 33 4.2 33 17C33 29.8 29.8 33 17 33C4.2 33 1 29.8 1 17C1 4.2 4.2 1 17 1Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <h2 className='text-xl font-semibold -tracking-[.72px] w-full text-center'>Add New Guide</h2>
                <p className='text-base -tracking-[.48px] font-medium'>Guide Title</p>
                <input
                  className='w-full px-4 border-[1px] border-[#7f8182] rounded-[9.675px] mt-1'
                  placeholder='Enter here...'
                />
                <p className='mt-2 text-base -tracking-[.48px] font-medium'>Description</p>
                <textarea
                  className='w-full px-4 border-[1px] border-[#7f8182] rounded-[9.675px] mt-1'
                  placeholder='Enter here...'
                  rows={3}
                />
                <p className='mt-2 text-base -tracking-[.48px] font-medium'>Choose an option</p>
                <div className='flex mt-2'>
                  <label className='text-[#7F8182] -tracking-[.48px] font-medium flex items-center'>
                    <input
                      type="radio"
                      className='me-1 border-[#7FFBAE] text-[#7ffbae] focus:ring-0 focus:outline-0'
                      checked={option === 'file'}
                      onClick={() => setOption('file')}
                      onChange={e => { if (e.target.checked) setOption('file') }}
                    />
                    Upload File
                  </label>
                  <label className='text-[#7F8182] -tracking-[.48px] font-medium flex items-center ms-4'>
                    <input
                      type="radio"
                      className='me-1 border-[#7FFBAE] text-[#7ffbae] focus:ring-0 focus:outline-0'
                      checked={option === 'link'}
                      onClick={() => setOption('link')}
                      onChange={e => { if (e.target.checked) setOption('link') }}
                    />
                    Embedded Link
                  </label>
                </div>
                <div className='mt-4 grid grid-cols-5 gap-4'>
                  <div className='col-span-3'>
                    {
                      option === 'file' ? <>
                        <p className='text-base -tracking-[.48px] font-medium'>{`Upload ${currentTab === 'video' ? 'Video' : 'Document'}`}</p>
                        <button className='px-4 py-2 flex items-center rounded-[9.675px] border-[1px] border-[#7f8182] w-full mt-1 -tracking-[.54px] text-base font-medium text-[#7f8182]'>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" className='me-2'>
                            <path d="M1 14V16C1 16.5304 1.21071 17.0391 1.58579 17.4142C1.96086 17.7893 2.46957 18 3 18H15C15.5304 18 16.0391 17.7893 16.4142 17.4142C16.7893 17.0391 17 16.5304 17 16V14" fill="#505050" />
                            <path d="M4 6L9 1L14 6" fill="#505050" />
                            <path d="M9 1V13V1Z" fill="#505050" />
                            <path d="M1 14V16C1 16.5304 1.21071 17.0391 1.58579 17.4142C1.96086 17.7893 2.46957 18 3 18H15C15.5304 18 16.0391 17.7893 16.4142 17.4142C16.7893 17.0391 17 16.5304 17 16V14M4 6L9 1M9 1L14 6M9 1V13" stroke="#505050" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Upload File
                        </button>
                      </> : <>
                        <p className='text-base -tracking-[.48px] font-medium'>Embedded Link</p>
                        <div className='px-4 py-2 flex items-center rounded-[9.675px] border-[1px] border-[#7f8182] w-full mt-1 -tracking-[.54px] text-base font-medium text-[#7f8182]'>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" className='me-2'>
                            <path d="M6 12.0004L12 6.00037M8 3.00031L8.463 2.46431C9.40081 1.52663 10.6727 0.999906 11.9989 1C13.325 1.00009 14.5968 1.527 15.5345 2.46481C16.4722 3.40261 16.9989 4.6745 16.9988 6.00066C16.9987 7.32682 16.4718 8.59863 15.534 9.53631L15 10.0003M10.0001 15.0004L9.60314 15.5344C8.65439 16.4726 7.37393 16.9987 6.03964 16.9987C4.70535 16.9987 3.42489 16.4726 2.47614 15.5344C2.0085 15.072 1.63724 14.5214 1.38385 13.9145C1.13047 13.3076 1 12.6565 1 11.9989C1 11.3412 1.13047 10.6901 1.38385 10.0832C1.63724 9.47635 2.0085 8.92577 2.47614 8.46337L3.00014 8.00037" stroke="#505050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <input
                            className='border-0 p-0 focus:ring-0 w-full'
                            placeholder='Enter here...'
                          />
                        </div>
                      </>
                    }
                  </div>
                  <div className='col-span-2'>

                    <p className='text-base -tracking-[.48px] font-medium'>Upload Thumbnail</p>
                    <button className='px-4 py-2 flex items-center rounded-[9.675px] border-[1px] border-[#7f8182] w-full mt-1 -tracking-[.54px] text-base font-medium text-[#7f8182]'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" className='me-2'>
                        <path d="M1 14V16C1 16.5304 1.21071 17.0391 1.58579 17.4142C1.96086 17.7893 2.46957 18 3 18H15C15.5304 18 16.0391 17.7893 16.4142 17.4142C16.7893 17.0391 17 16.5304 17 16V14" fill="#505050" />
                        <path d="M4 6L9 1L14 6" fill="#505050" />
                        <path d="M9 1V13V1Z" fill="#505050" />
                        <path d="M1 14V16C1 16.5304 1.21071 17.0391 1.58579 17.4142C1.96086 17.7893 2.46957 18 3 18H15C15.5304 18 16.0391 17.7893 16.4142 17.4142C16.7893 17.0391 17 16.5304 17 16V14M4 6L9 1M9 1L14 6M9 1V13" stroke="#505050" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Upload File
                    </button>
                  </div>
                </div>
                <button className='bg-[#7ffbae] text-lg font-semibold rounded-[6px] py-2 items-center w-full mt-4' onClick={handleAdd}>Add Guide</button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root >
  );
};

export default AddNewGuide;