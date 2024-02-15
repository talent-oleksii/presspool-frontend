import { FC, useState } from 'react';
import AddNewGuide from './ui/AddNewGuide';

const TrainingHub: FC = () => {
  const [currentTab, setCurrentTab] = useState('video');
  const [openNewModal, setOpenNewModal] = useState(false);

  return (
    <div className='text-left'>
      <h4 className='font-semibold -tracking-[.6px]'>Training Hub</h4>
      <div className='mt-4 flex'>
        <div className='border-[1px] border-[#7f8182] rounded-lg px-3 py-2 flex items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
            <path d="M12.0016 1.07199C12.9542 1.62201 13.7832 2.36255 14.4368 3.24735C15.0903 4.13216 15.5544 5.14222 15.8 6.21444C16.0456 7.28666 16.0675 8.39801 15.8643 9.47908C15.6611 10.5601 15.2372 11.5877 14.619 12.4976L19.5637 17.4412C19.839 17.7125 19.9989 18.0795 20.0102 18.4659C20.0216 18.8522 19.8833 19.228 19.6244 19.5149C19.3655 19.8018 19.0058 19.9777 18.6203 20.006C18.2349 20.0342 17.8534 19.9126 17.5554 19.6665L17.4414 19.5635L12.4977 14.6188C11.3149 15.4222 9.93848 15.894 8.51156 15.9851C7.08464 16.0761 5.65938 15.7832 4.38408 15.1366C3.10878 14.4901 2.03003 13.5136 1.26007 12.3088C0.490105 11.104 0.0570647 9.71489 0.00600086 8.28598L0 8.00094L0.0050008 7.7159C0.0542013 6.33646 0.459431 4.99321 1.18131 3.8167C1.90318 2.64019 2.91715 1.67044 4.12465 1.00171C5.33216 0.332977 6.69213 -0.0119965 8.07239 0.00031853C9.45265 0.0126336 10.8063 0.381819 12.0016 1.07199Z" fill="#7F8182" />
            <circle cx="8.00781" cy="8.00391" r="6" fill="#F5F5F5" />
          </svg>
          <input
            placeholder='Search by Name'
            className='border-0 bg-transparent p-0 ml-4 text-sm'
          />
        </div>
      </div>
      <div className='mt-8'>
        <button
          className={`mr-4 border-[1px] rounded-lg border-[#7f8182] min-w-[150px] py-1.5 font-semibold ${currentTab === 'video' ? 'text-black bg-[#7ffbae]' : 'text-[#7f8182] bg-transparent'}`}
          onClick={() => setCurrentTab('video')}
        >
          Videos
        </button>
        <button
          className={`mr-4 border-[1px] rounded-lg border-[#7f8182] min-w-[150px] py-1.5 font-semibold ${currentTab === 'document' ? 'text-black bg-[#7ffbae]' : 'text-[#7f8182] bg-transparent'}`}
          onClick={() => setCurrentTab('document')}
        >
          Documents
        </button>
      </div>
      <div className="mt-4 p-4 rounded-[10px] bg-white">
        <div className='flex items-center justify-between'>
          <p className='-tracking-[.6px] text-lg font-medium'>{`${0} Videos`}</p>
          <button className='flex bg-black px-4 py-2 rounded-lg items-center text-white text-sm -tracking-[.45px]' onClick={() => setOpenNewModal(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className='me-2'>
              <path d="M7 10H13M10 7V13M1 10C1 11.1819 1.23279 12.3522 1.68508 13.4442C2.13738 14.5361 2.80031 15.5282 3.63604 16.364C4.47177 17.1997 5.46392 17.8626 6.55585 18.3149C7.64778 18.7672 8.8181 19 10 19C11.1819 19 12.3522 18.7672 13.4442 18.3149C14.5361 17.8626 15.5282 17.1997 16.364 16.364C17.1997 15.5282 17.8626 14.5361 18.3149 13.4442C18.7672 12.3522 19 11.1819 19 10C19 7.61305 18.0518 5.32387 16.364 3.63604C14.6761 1.94821 12.3869 1 10 1C7.61305 1 5.32387 1.94821 3.63604 3.63604C1.94821 5.32387 1 7.61305 1 10Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Upload
          </button>
        </div>
        <AddNewGuide show={openNewModal} onClose={() => setOpenNewModal(false)} currentTab={currentTab} />
      </div>
    </div>
  );
};

export default TrainingHub;