import { FC, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';

import { FADE_UP_ANIMATION_VARIANTS } from '../utils/TransitionConstants';
import { Avatar } from 'antd';

import CardForm from '../components/StripeCardForm';
import StripeUtil from '../utils/stripe';
import HeadShot from '../assets/image/Headshot 2.png';
import { useSelector } from 'react-redux';
import { selectAuth, setAvatar } from '../store/authSlice';
import { deleteCard, selectData } from '../store/dataSlice';
import APIInstance from '../api';
import Loading from '../components/Loading';
import DialogUtils from '../utils/DialogUtils';

const Profile: FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { fullName, email, company } = useSelector(selectAuth);
  const { cardList } = useSelector(selectData);
  const [showAddCard, setShowAddCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<any>(null);
  const [file, setFile] = useState<any>(null);
  const [date, setDate] = useState<any>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    APIInstance.get('data/profile', { params: { email } }).then(data => {
      setImage(data.data.avatar);
      setDate(moment(new Date(Number(data.data.create_time))).format('d MMM, yyyy'));
    }).catch(err => {
      console.log('error:', err);
    }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemoveCard = (id: string) => {
    setLoading(true);
    APIInstance.delete('stripe/card', { params: { id } }).then(() => {
      dispatch(deleteCard({ id }));
    }).catch(err => {
      console.log('card deleting error:', err);
    }).finally(() => setLoading(false));
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (!file) return;
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    setLoading(true);
    if (!file) return;
    const formData = new FormData();
    formData.append('email', email);
    formData.append('avatar', file);
    APIInstance.put('data/profile', formData).then((data) => { // here comes the data, you can use it.
      dispatch(setAvatar({ avatar: data.data.avatar }));
      DialogUtils.show('success', '', 'Your profile has successfully updated!');
    }).catch(err => {
      console.log('error:', err);
    }).finally(() => setLoading(false));
  };

  const getPlaceHolder = () => {
    const names = fullName.split(' ');
    if (names.length === 2) {
      return `${names[0].at(0)}${names[1].at(0)}`;
    } else if (names.length === 1) {
      return `${names[0].at(0)}`;
    } else {
      return '';
    }
  };

  const handleManagePayment = async () => {
    const customerId = await StripeUtil.getCustomerId(email);

    const session = await StripeUtil.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: 'http://localhost:3000/#/profile',
    });

    // window.location.href = session.url + '/payment-methods';
    window.open(session.url, '_blank');
  };

  return (
    <motion.div
      className='text-left relative'
      initial="hidden"
      animate="show"
      variants={FADE_UP_ANIMATION_VARIANTS}
    >
      {loading && <Loading />}
      <div className='flex items-center justify-between pr-4'>
        <h1 className='font-semibold font-[Inter] text-[24px] 2xl:text-[30px] -tracking-[1.02px]'>My Profile</h1>
        <button className='rounded-[5px] text-black bg-[#7FFBAE] font-[Inter] text-sm px-4 py-1' onClick={handlePublish}>Publish</button>
      </div>
      <div className='pt-[30px] pb-[23px] flex items-end border-b-[1px] border-b-[#bcbcbc]'>
        <button className='relative items-center justify-center flex' onClick={() => { if (fileInputRef.current) fileInputRef.current.click(); }}>
          {image ?
            <Avatar
              src={image}
              className='z-[0] transition-all duration-150  hover:blur-[1.5px] w-[75px] h-[75px]'
            />
            : <div className='z-[0] transition-all duration-150 hover:blur-[1.5px] w-[75px] h-[75px] bg-[#7ffbae] rounded-full flex items-center justify-center font-[Inter] text-2xl'>
              {getPlaceHolder()}
            </div>
          }
          <span className='opacity-0 absolute p-[27px] top-1/2 left-1/2 hover:opacity-100 -translate-x-1/2 -translate-y-1/2 hover:bg-[#505050]/[.5] rounded-full'>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
              <path d="M482.769-216.923 579.077-313l-96.308-96.077L457.692-384 513-328.692q-46.462.23-82.577-10.923-36.115-11.154-57.884-32.924-22.308-22.307-33.577-50.615-11.27-28.308-11.27-56.615 0-17 3.731-34T342.385-546l-27.077-24Q303.692-548.846 298-526.167q-5.692 22.678-5.692 46.167 0 35.651 13.846 70.364t40.923 62.175q27.077 27.461 71.154 40.807 44.077 13.346 90.538 13.577L457.692-242l25.077 25.077ZM645.462-390q11.615-21.154 17.307-43.833 5.693-22.678 5.693-46.167 0-35.53-13.731-70.592t-41.192-62.177q-26.693-27.462-71.034-40.693-44.341-13.23-90.505-13.23L503.077-718 478-743.077 381.692-647 478-550.923 503.077-576l-55.538-55.538q46.23 0 82.692 11.269 36.461 11.269 58.227 33.094 21.765 21.826 33.192 50.198 11.427 28.373 11.427 56.746 0 17-3.731 34T618.385-414l27.077 24ZM480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120Z" />
            </svg>
          </span>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            className='w-[75px] h-[75px]'
            accept='image/*'
            onChange={handleFileChange}
          />
        </button>
        <div className='flex items-center justify-between w-full py-2 px-3'>
          <p className='font-[Inter] text-[#43474A] text-base font-medium -tracking-[.54px]'>{fullName}</p>
          <p className='font-[Inter] text-[#A3A3A3] text-sm font-medium text-base -tracking-[.48px]'>{`Date Joined: ${date}`}</p>
        </div>
      </div>
      <div className='mt-[30px] p-5 bg-white rounded-[10px] shadow-md grid grid-cols-2 gap-24'>
        <div className='col-span-1'>
          <h4 className='font-[Inter] text-black text-base font-semibold -tracking-[.6px]'>Personal Information</h4>
          <p className='text-sm font-[Inter] font-semibold text-black mt-8 -tracking-[.48px]'>Full Name</p>
          <input
            className='p-3 rounded-[9.5px] border-[1px] border-[rgba(127, 129, 130, .13)] italic text-[#7f8182] -tracking-[.54px] mt-2 bg-[#fbfbfb] w-full focus:ring-0 focus:border-[#7FFBAE]'
            value={fullName}
            disabled
          />
          <p className='text-sm font-[Inter] font-semibold text-black mt-3 -tracking-[.48px]'>Email Address</p>
          <input
            className='p-3 rounded-[9.5px] border-[1px] border-[rgba(127, 129, 130, .13)] italic text-[#7f8182] -tracking-[.54px] mt-2 bg-[#fbfbfb] w-full focus:ring-0 focus:border-[#7FFBAE]'
            value={email}
            disabled
          />
          <p className='text-sm font-[Inter] font-semibold text-black mt-3 -tracking-[.48px]'>Company Name</p>
          <input
            className='p-3 rounded-[9.5px] border-[1px] border-[rgba(127, 129, 130, .13)] italic text-[#7f8182] -tracking-[.54px] mt-2 bg-[#fbfbfb] w-full focus:ring-0 focus:border-[#7FFBAE]'
            value={company}
            disabled
          />
        </div>
        <div className='col-span-1'>
          <h4 className='font-[Inter] text-black text-base font-semibold -tracking-[.6px]'>Payment Methods</h4>
          <div className='mt-8'>
            {
              cardList.map(item => (
                <div key={item.id}>
                  <div className='flex justify-between w-full'>
                    <p className='font-[Inter] text-sm text-black -tracking-[.54px] font-medium'>{item.brand.toUpperCase()}</p>
                    <p className='font-[Inter] text-[#7f8182] text-xs -tracking-[.42px]'>{`Added Date: ${moment(new Date(Number(item.create_time))).format('d MMM, yyyy')}`}</p>
                  </div>
                  <div className='bg-[#fbfbfb] text-sm border-[1px] border-[rgba(127, 129, 130, 0.13)] rounded-[10px] px-3 py-2 my-1.5'>{`**** **** **** ${item.last4}`}</div>
                </div>
              ))
            }
            {
              cardList.length <= 0 &&
              <div className='text-sm font-[Inter] font-semibold text-black mt-8 -tracking-[.48px]'>
                You can add your card information here
              </div>
            }
          </div>
          <div className='flex justify-end my-4'>
            <button className='font-[Inter] text-black text-xs font-semibold flex items-center' onClick={handleManagePayment}>
              Manage Payment Methods
            </button>
          </div>
          {
            showAddCard &&
            <Elements stripe={StripeUtil.stripePromise}>
              <CardForm />
            </Elements>
          }
        </div>
      </div>
      <div className='mt-6 p-5 bg-white rounded-[10px] shadow-md'>
        <h4 className='font-[Inter] text-black text-base font-semibold -tracking-[.6px]'>My Team</h4>
      </div>
    </motion.div>
  );
};

export default Profile;