import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import moment from 'moment';

import { Elements } from '@stripe/react-stripe-js';

import { FADE_UP_ANIMATION_VARIANTS } from '../utils/TransitionConstants';
import { Avatar } from 'antd';

import CardForm from '../components/StripeCardForm';
import StripeUtil from '../utils/stripe';
import HeadShot from '../assets/image/Headshot 2.png';
import { useSelector } from 'react-redux';
import { selectAuth } from '../store/authSlice';
import { deleteCard, selectData } from '../store/dataSlice';
import APIInstance from '../api';
import Loading from '../components/Loading';
import { useDispatch } from 'react-redux';

const Profile: FC = () => {

  const { fullName, email, company } = useSelector(selectAuth);
  const { cardList } = useSelector(selectData);
  const [showAddCard, setShowAddCard] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleRemoveCard = (id: string) => {
    console.log('remove id:', id);
    setLoading(true);
    APIInstance.delete('stripe/card', { params: { id } }).then(() => {
      dispatch(deleteCard({ id }));
    }).catch(err => {
      console.log('card deleting error:', err);
    }).finally(() => setLoading(false));
  };

  return (
    <motion.div
      className='text-left relative'
      initial="hidden"
      animate="show"
      variants={FADE_UP_ANIMATION_VARIANTS}
    >
      {loading && <Loading />}
      <h1 className='font-semibold font-[Inter] text-[24px] 2xl:text-[30px] -tracking-[1.02px]'>My Profile</h1>
      <div className='pt-[30px] pb-[23px] flex items-end border-b-[1px] border-b-[#bcbcbc]'>
        <button>
          <Avatar
            size={75}
            src={HeadShot}
          />
        </button>
        <div className='flex items-center justify-between w-full py-2 px-3'>
          <p className='font-[Inter] text-[#43474A] text-base font-medium -tracking-[.54px]'>{fullName}</p>
          <p className='font-[Inter] text-[#A3A3A3] text-sm font-medium text-base -tracking-[.48px]'>Date Joined: 09 Nov, 2023</p>
        </div>
      </div>
      <div className='mt-[30px] p-5 bg-white rounded-[10px] shadow-md grid grid-cols-2 gap-24'>
        <div className='col-span-1'>
          <h4 className='font-[Inter] text-black text-base font-semibold -tracking-[.6px]'>Personal Information</h4>
          <p className='text-sm font-[Inter] font-semibold text-black mt-8 -tracking-[.48px]'>Full Name</p>
          <p className='p-3 rounded-[9.5px] border-[1px] border-[rgba(127, 129, 130, .13)] italic text-[#7f8182] -tracking-[.54px] mt-2 bg-[#fbfbfb]'>{fullName}</p>
          <p className='text-sm font-[Inter] font-semibold text-black mt-3 -tracking-[.48px]'>Email Address</p>
          <p className='p-3 rounded-[9.5px] border-[1px] border-[rgba(127, 129, 130, .13)] italic text-[#7f8182] -tracking-[.54px] mt-2 bg-[#fbfbfb]'>{email}</p>
          <p className='text-sm font-[Inter] font-semibold text-black mt-3 -tracking-[.48px]'>Company Name</p>
          <p className='p-3 rounded-[9.5px] border-[1px] border-[rgba(127, 129, 130, .13)] italic text-[#7f8182] -tracking-[.54px] mt-2 bg-[#fbfbfb]'>{company}</p>
        </div>
        <div className='col-span-1'>
          <h4 className='font-[Inter] text-black text-base font-semibold'>Payment Methods</h4>
          <div className='mt-8'>
            {
              cardList.map(item => (
                <div key={item.id}>
                  <div className='flex justify-between w-full'>
                    <p className='font-[Inter] text-sm text-black -tracking-[.54px] font-medium'>{item.brand}</p>
                    <p className='font-[Inter] text-[#7f8182] text-xs -tracking-[.42px]'>{`Added Date: ${moment(new Date(Number(item.create_time))).format('d MMM, yyyy')}`}</p>
                  </div>
                  <div className='bg-[#fbfbfb] text-sm border-[1px] border-[rgba(127, 129, 130, 0.13)] rounded-[10px] px-3 py-2 my-1.5'>{`**** **** **** ${item.last4}`}</div>
                  <div className='mb-1 text-right w-full flex justify-end'>
                    <button className='bg-[#e3392e] rounded-md text-xs 2xl:text-sm text-white px-2 py-1 flex items-center' onClick={() => handleRemoveCard(item.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className='-ms-1 me-1 w-[20px] h-[20px] 2xl:w-[24px] 2xl:h-[24px]'>
                        <path fill='white' d="m376-327.692 104-104 104 104L612.308-356l-104-104 104-104L584-592.308l-104 104-104-104L347.692-564l104 104-104 104L376-327.692ZM304.615-160Q277-160 258.5-178.5 240-197 240-224.615V-720h-40v-40h160v-30.77h240V-760h160v40h-40v495.385Q720-197 701.5-178.5 683-160 655.385-160h-350.77Z" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
          <div className='flex justify-end my-4'>
            <button className='font-[Inter] text-black text-xs font-semibold flex items-center' onClick={() => setShowAddCard(!showAddCard)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-[20px] h-[20px] 2xl:w-[24px] 2xl:h-[24px] -ms-1 me-1">
                <path d="M450.001-290.001h59.998v-160h160v-59.998h-160v-160h-59.998v160h-160v59.998h160v160Zm30.066 190q-78.836 0-148.204-29.92-69.369-29.92-120.682-81.21-51.314-51.291-81.247-120.629-29.933-69.337-29.933-148.173t29.92-148.204q29.92-69.369 81.21-120.682 51.291-51.314 120.629-81.247 69.337-29.933 148.173-29.933t148.204 29.92q69.369 29.92 120.682 81.21 51.314 51.291 81.247 120.629 29.933 69.337 29.933 148.173t-29.92 148.204q-29.92 69.369-81.21 120.682-51.291 51.314-120.629 81.247-69.337 29.933-148.173 29.933Z" />
              </svg>
              Add a new card
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