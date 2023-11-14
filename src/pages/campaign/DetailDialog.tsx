import { Dialog, Transition } from '@headlessui/react';
import { FC, Fragment } from 'react';

import logo from '../../assets/image/Headshot 1.png';

interface typeDetailDialog {
  data: any;
  show: boolean;
  setShow: Function;
}

const DetailDialog: FC<typeDetailDialog> = ({ data, show, setShow }: typeDetailDialog) => {
  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setShow(false)}>
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
              <Dialog.Panel className="relative bg-white rounded-lg p-5 text-left shadow-xl sm:w-[600px] sm:min-h-[300px] border-[1px] border-black">
                <p className='font-[Inter] text-sm font-semibold'>Total Run Time: 30 days</p>
                <div className='grid grid-cols-4 gap-4 mt-4'>
                  <div className='col-span-1'>
                    <p className='font-[Inter] text-sm font-semibold'>Headline</p>
                    <p className='font-[Inter] text-md'>Lorem ipsum dolor</p>
                    <p className='font-[Inter] text-sm font-semibold mt-3'>Hero Image</p>
                    <img
                      className='mt-3'
                      src={logo}
                      alt="logo"
                    />
                  </div>
                  <div className='col-span-1'>
                    <p className='font-[Inter] text-sm font-semibold'>Body</p>
                    <p className='font-[Inter] text-md'>Lorem Ipsum color</p>
                  </div>
                  <div className='col-span-2'>
                    <p className='font-[Inter] text-sm font-semibold'>Landing Page URL</p>
                    <p className='font-[Inter] text-md'>https://website.com</p>

                    <div className='p-3'>
                      <p className='font-[Inter] text-sm font-semibold'>Total Impressions: 100,000</p>
                      <p className='font-[Inter] text-sm font-semibold'>Total Clicks Generated: 3,000</p>
                      <p className='font-[Inter] text-sm font-semibold'>Total Amount Billed: $24,000</p>
                    </div>

                    <div className='flex items-center justify-center mt-3'>
                      <button
                        className='underline font-[Inter] text-[#6c63ff] px-4 py-2 me-2'
                      // onClick={handleBudget}
                      >
                        {`${data && data.state === 'purchased' ? 'Raise Budget' : 'Purchase'}`}
                      </button>
                      <button
                        className='bg-[#6c63ff] px-4 py-2 rounded text-white font-[Inter]'
                        onClick={() => {
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default DetailDialog;