import { FC, Fragment, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';

const Dashboard: FC = () => {
    const [showAddDialog, setShowAddDialog] = useState(false);

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
                                <Dialog.Panel className="relative bg-[#F5F5F5] transform overflow-hidden rounded-lg px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                    <div className="mt-5">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                                            onClick={() => { setShowAddDialog(false); }}
                                        >
                                            OK
                                        </button>
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