import { FC, Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Select } from 'antd';

import AdminAPIInstance from '../../../api/adminApi';

import './AssignAccountManager.scss';
import Loading from '../../../components/Loading';

interface typeAssignAccountManager {
  show: boolean,
  company: string,
  userId: string,
  afterAdd: Function,
  onClose: Function,
}

const AssignAccountManager: FC<typeAssignAccountManager> = ({ show, company, onClose, userId, afterAdd }: typeAssignAccountManager) => {
  const [loading, setLoading] = useState(false);
  const [manager, setManager] = useState('');
  const [accountManagers, setAccountManagers] = useState([]);

  useEffect(() => {
    setLoading(true);
    AdminAPIInstance.get('/user/account-manager').then(data => {
      setAccountManagers(data.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = () => {
    if (manager.length <= 0) return;

    setLoading(true);
    AdminAPIInstance.post('/user/account-manager', { userId, manager }).then(data => {
      if (afterAdd) afterAdd(data.data);
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
              <Dialog.Panel className={`relative bg-white rounded-[10px] text-left flex items-center justify-center flex-col shadow-xl border-[1px] border-black px-[36px] pt-[45px] pb-[26px] min-w-[500px]`}>
                {loading && <Loading />}
                <button onClick={() => onClose(false)} className='absolute right-4 top-4'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
                    <path d="M13.4444 13.4444L20.5556 20.5556M20.5556 13.4444L13.4444 20.5556M17 1C29.8 1 33 4.2 33 17C33 29.8 29.8 33 17 33C4.2 33 1 29.8 1 17C1 4.2 4.2 1 17 1Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <h3 className='font-[Inter] -tracking-[.72px] text-center font-semibold text-lg'>Assign Account Manager</h3>
                <div className='text-left w-full'>
                  <p className='mt-8 text-xs font-[Inter] -tracking-[.48px] font-medium'>Company Name</p>
                  <p className='mt-1 rounded-[10px] border-[1px] border-[#7f8182] w-full px-4 py-2 text-[#7f8182] text-xs font-medium -tracking-[.5px]'>{company}</p>
                  <p className='mt-4 text-xs font-[Inter] -tracking-[.54px] font-medium'>Assigned Members</p>
                  <Select
                    className='select-account-manager w-full mt-1'
                    allowClear
                    value={manager}
                    onChange={e => setManager(e)}
                    options={accountManagers.map((item: any) => ({ value: item.id, label: item.name }))}
                  />
                </div>
                <button className='mt-4 text-xs font-semibold py-3 text-primary bg-main w-full rounded-[10px] disabled:bg-[gray]' onClick={handleSubmit} disabled={!manager || manager.toString().length <= 0}>Assign</button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AssignAccountManager;