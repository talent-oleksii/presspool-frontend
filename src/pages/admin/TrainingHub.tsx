import { FC, useEffect, useState } from 'react';
import AddNewGuide from './ui/AddNewGuide';
import AdminAPIInstance from '../../api/adminApi';
import Loading from '../../components/Loading';
import moment from 'moment';

const TrainingHub: FC = () => {
  const [currentTab, setCurrentTab] = useState('video');
  const [openNewModal, setOpenNewModal] = useState(false);
  const [data, setData] = useState<Array<any>>([]);
  const [showData, setShowData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState('');

  useEffect(() => {
    setLoading(true);
    AdminAPIInstance.get('/guide').then(data => {
      setData(data.data);
    }).catch(err => {
      console.log('err:', err);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setShowData(data.filter(item => item.file_type === currentTab && item.title.includes(searchKey)));
  }, [data, searchKey, currentTab]);

  const handleDeleteGuide = (id: string) => {
    setLoading(true);
    AdminAPIInstance.delete(`/guide?id=${id}`).then(() => {
      setData(data.filter(item => item.id !== id));
    }).catch(err => {
      console.log('er:', err);
    }).finally(() => setLoading(false));
  };

  return (
    <div className='text-left relative'>
      {loading && <Loading />}
      <h4 className='font-semibold -tracking-[.6px]'>Training Hub</h4>
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
          <button className='flex bg-black px-4 py-2 rounded-lg items-center text-white text-sm -tracking-[.45px]' onClick={() => setOpenNewModal(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className='me-2'>
              <path d="M7 10H13M10 7V13M1 10C1 11.1819 1.23279 12.3522 1.68508 13.4442C2.13738 14.5361 2.80031 15.5282 3.63604 16.364C4.47177 17.1997 5.46392 17.8626 6.55585 18.3149C7.64778 18.7672 8.8181 19 10 19C11.1819 19 12.3522 18.7672 13.4442 18.3149C14.5361 17.8626 15.5282 17.1997 16.364 16.364C17.1997 15.5282 17.8626 14.5361 18.3149 13.4442C18.7672 12.3522 19 11.1819 19 10C19 7.61305 18.0518 5.32387 16.364 3.63604C14.6761 1.94821 12.3869 1 10 1C7.61305 1 5.32387 1.94821 3.63604 3.63604C1.94821 5.32387 1 7.61305 1 10Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Upload
          </button>
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
                  <button
                    onClick={() => handleDeleteGuide(item.id)}
                    className='flex items-center text-white font-medium text-xs bg-[#e3392e] px-3 py-1.5 rounded-lg'
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none" className='me-1'>
                      <path d="M11.5377 2.57167C11.702 2.57186 11.8601 2.6346 11.9796 2.74709C12.0991 2.85958 12.171 3.01333 12.1806 3.17691C12.1902 3.3405 12.1369 3.50158 12.0314 3.62724C11.9259 3.7529 11.7763 3.83366 11.6132 3.85301L11.5377 3.85751H11.4855L10.893 10.9296C10.893 11.4216 10.7045 11.895 10.3661 12.2529C10.0276 12.6108 9.56479 12.8263 9.07229 12.8552L8.95882 12.8584H3.80103C2.77076 12.8584 1.92875 12.0554 1.87202 11.0903L1.86879 10.983L1.27371 3.85751H1.22213C1.05781 3.85733 0.899752 3.79458 0.780261 3.68209C0.660771 3.5696 0.588864 3.41586 0.579234 3.25227C0.569604 3.08869 0.622976 2.92761 0.728447 2.80195C0.833917 2.67629 0.983525 2.59553 1.1467 2.57617L1.22213 2.57167H11.5377ZM5.41993 5.87628C5.28485 5.79609 5.12504 5.76788 4.97057 5.79696C4.81609 5.82604 4.67759 5.91039 4.58111 6.03416C4.48464 6.15794 4.43684 6.31259 4.4467 6.46905C4.45656 6.6255 4.5234 6.77298 4.63466 6.88373L5.46764 7.71502L4.63466 8.54632L4.58115 8.60675C4.48095 8.73597 4.43383 8.89838 4.44937 9.06099C4.4649 9.2236 4.54192 9.37421 4.66478 9.48224C4.78764 9.59028 4.94714 9.64762 5.11086 9.64264C5.27459 9.63765 5.43028 9.57071 5.5463 9.4554L6.37993 8.62475L7.21355 9.4554L7.27416 9.50876C7.40374 9.60868 7.56661 9.65567 7.72967 9.64018C7.89274 9.62469 8.04378 9.54788 8.15211 9.42536C8.26045 9.30285 8.31796 9.1438 8.31296 8.98053C8.30796 8.81726 8.24082 8.66201 8.12519 8.54632L7.29221 7.71502L8.12519 6.88373L8.17871 6.82329C8.2789 6.69407 8.32602 6.53166 8.31049 6.36906C8.29495 6.20645 8.21793 6.05583 8.09507 5.9478C7.97221 5.83977 7.81272 5.78242 7.64899 5.78741C7.48526 5.79239 7.32958 5.85934 7.21355 5.97464L6.37993 6.80529L5.5463 5.97464L5.48569 5.92128L5.41993 5.87628Z" fill="white" />
                      <path d="M7.66883 0C8.01081 0 8.33879 0.135472 8.58061 0.376613C8.82243 0.617754 8.95828 0.944812 8.95828 1.28584C8.9581 1.4497 8.89517 1.60732 8.78237 1.72647C8.66956 1.84563 8.51538 1.91733 8.35134 1.92694C8.18729 1.93654 8.02576 1.88332 7.89975 1.77814C7.77374 1.67297 7.69275 1.52378 7.67334 1.36106L7.66883 1.28584H5.08993L5.08542 1.36106C5.06601 1.52378 4.98503 1.67297 4.85901 1.77814C4.733 1.88332 4.57147 1.93654 4.40743 1.92694C4.24338 1.91733 4.0892 1.84563 3.9764 1.72647C3.86359 1.60732 3.80067 1.4497 3.80049 1.28584C3.80038 0.961435 3.92325 0.648983 4.14444 0.411115C4.36564 0.173248 4.66883 0.0275448 4.99323 0.00321467L5.08993 0H7.66883Z" fill="white" />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            ))
          }
        </div>
        <AddNewGuide show={openNewModal} onClose={() => setOpenNewModal(false)} currentTab={currentTab} onAdd={(newData: any) => {
          console.log('called:', newData)
          setData([...data, newData]);
        }} />
      </div>
    </div>
  );
};

export default TrainingHub;