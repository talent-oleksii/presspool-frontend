import { FC, Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import Loading from '../../../components/Loading';
import PIN from '../../../assets/image/ping.png';
import AdminAPIInstance from '../../../api/adminApi';
import DialogUtils from '../../../utils/DialogUtils';

interface typeInviteAccountManager {
  show: boolean;
  onClose: Function;
}

const InviteAccountManager: FC<typeInviteAccountManager> = ({ show, onClose }: typeInviteAccountManager) => {
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState('');

  const handleSendInvite = () => {
    setLoading(true);
    AdminAPIInstance.post('invite-am', {
      emails,
    }).then(() => {
      DialogUtils.show('success', 'Account Manager Added', 'You have successfully added a new Account Manager. They will receive an \n email shortly to complete their account creation');
      if (onClose) onClose();
    }).finally(() => setLoading(false));
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
              <Dialog.Panel className={`relative bg-white rounded-[22px] text-left flex items-center justify-center flex-col shadow-xl border-[1px] border-black px-[36px] pt-[45px] pb-[26px] min-w-[500px]`}>
                {loading && <Loading />}
                <button onClick={() => onClose(false)} className='absolute right-4 top-4'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
                    <path d="M13.4444 13.4444L20.5556 20.5556M20.5556 13.4444L13.4444 20.5556M17 1C29.8 1 33 4.2 33 17C33 29.8 29.8 33 17 33C4.2 33 1 29.8 1 17C1 4.2 4.2 1 17 1Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <h2 className='text-xl font-semibold -tracking-[.72px]'>Add Account Manager</h2>
                <p className='mt-4 text-xs w-full -tracking-[.48px] text-black font-medium'>Email Address</p>
                <input
                  className='mt-2 w-full px-4 py-2.5 flex border-[1px] rounded-[9.675px] border-[#7f8182] items-center justify-between'
                  placeholder="Enter here"
                  value={emails}
                  onChange={e => setEmails(e.target.value)}
                />
                <button
                  className='bg-[#7ffbae] rounded-[6.047px] text-xs font-semibold w-full mt-6 flex items-center justify-center py-3'
                  onClick={handleSendInvite}
                >
                  Add Member
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default InviteAccountManager;