import { FC, useEffect, useState } from 'react';
import APIInstance from '../api';
import Loading from '../components/Loading';
import moment from 'moment';

const QuickGuide: FC = () => {
  const [currentTab, setCurrentTab] = useState('video');
  const [data, setData] = useState<Array<any>>([]);
  const [showData, setShowData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState('');

  useEffect(() => {
    setLoading(true);
    APIInstance.get('/data/guide').then(data => {
      setData(data.data);
    }).catch(err => {
      console.log('err:', err);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setShowData(data.filter(item => item.file_type === currentTab && item.title.includes(searchKey)));
  }, [data, searchKey, currentTab]);

  return (
    <div className='text-left relative'>
      {loading && <Loading />}
      <h4 className='font-semibold -tracking-[.6px] text-[20px]'>Quick Guide</h4>
      <div className='mt-4 flex'>
        <div className='border-[1px] border-[#7f8182] rounded-lg px-3 py-2 flex items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
            <path d="M12.0016 1.07199C12.9542 1.62201 13.7832 2.36255 14.4368 3.24735C15.0903 4.13216 15.5544 5.14222 15.8 6.21444C16.0456 7.28666 16.0675 8.39801 15.8643 9.47908C15.6611 10.5601 15.2372 11.5877 14.619 12.4976L19.5637 17.4412C19.839 17.7125 19.9989 18.0795 20.0102 18.4659C20.0216 18.8522 19.8833 19.228 19.6244 19.5149C19.3655 19.8018 19.0058 19.9777 18.6203 20.006C18.2349 20.0342 17.8534 19.9126 17.5554 19.6665L17.4414 19.5635L12.4977 14.6188C11.3149 15.4222 9.93848 15.894 8.51156 15.9851C7.08464 16.0761 5.65938 15.7832 4.38408 15.1366C3.10878 14.4901 2.03003 13.5136 1.26007 12.3088C0.490105 11.104 0.0570647 9.71489 0.00600086 8.28598L0 8.00094L0.0050008 7.7159C0.0542013 6.33646 0.459431 4.99321 1.18131 3.8167C1.90318 2.64019 2.91715 1.67044 4.12465 1.00171C5.33216 0.332977 6.69213 -0.0119965 8.07239 0.00031853C9.45265 0.0126336 10.8063 0.381819 12.0016 1.07199Z" fill="#7F8182" />
            <circle cx="8.00781" cy="8.00391" r="6" fill="#F5F5F5" />
          </svg>
          <input
            placeholder='Search by Name'
            value={searchKey}
            onChange={e => setSearchKey(e.target.value)}
            className='border-0 bg-transparent p-0 ml-4 text-sm focus:ring-0'
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
          <p className='-tracking-[.6px] text-lg font-medium'>{`${showData.length} ${currentTab === 'video' ? 'Videos' : 'Documents'}`}</p>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {
            showData.map(item => (
              <div className="col-span-1 mb-4" key={item.id}>
                <div className='rounded-[10px] bg-[#edecf2] px-2 pt-2 pb-3'>
                  <img
                    src={item.thumbnail}
                    alt="thumbnail"
                    className='w-full h-[180px] object-cover rounded-[6px]'
                  />
                  <p className='mt-2 w-full text-left text-[15px] -tracking-[.45px] font-medium truncate'>{item.title}</p>
                  <p className='mt-3 w-full text-sm text-[#43474a]'>{item.description}</p>
                </div>
                <div className='flex items-center mt-4 justify-between'>
                  <p className='text-sm -tracking-[.36px] font-medium text-[#a3a3a3]'>{`Date: ${moment(Number(item.create_time)).format('DD MMM, yyyy')}`}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default QuickGuide;