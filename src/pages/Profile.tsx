import { FC } from 'react';
import { motion } from 'framer-motion';

import { FADE_UP_ANIMATION_VARIANTS } from '../utils/TransitionConstants';
import { Avatar } from 'antd';

import HeadShot from '../assets/image/Headshot 2.png';
import { useSelector } from 'react-redux';
import { selectAuth } from '../store/authSlice';

const Profile: FC = () => {

  const { fullName, email, company } = useSelector(selectAuth);

  return (
    <motion.div
      className='text-left relative'
      initial="hidden"
      animate="show"
      variants={FADE_UP_ANIMATION_VARIANTS}
    >
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
      <div className='mt-[30px] p-5 bg-white rounded-[10px] shadow-md grid grid-cols-2 gap-4'>
        <div className='col-span-1'>
          <h4 className='font-[Inter] text-black text-base font-semibold'>Personal Information</h4>
          <p className='text-sm font-[Inter] font-semibold text-black mt-8'>Full Name</p>
          <p className='p-3 rounded-[9.5px] border-[1px] border-[rgba(127, 129, 130, .13)] italic text-[#7f8182] -tracking-[.54px] mt-2 bg-[#fbfbfb]'>{fullName}</p>
          <p className='text-sm font-[Inter] font-semibold text-black mt-3'>Email Address</p>
          <p className='p-3 rounded-[9.5px] border-[1px] border-[rgba(127, 129, 130, .13)] italic text-[#7f8182] -tracking-[.54px] mt-2 bg-[#fbfbfb]'>{email}</p>
          <p className='text-sm font-[Inter] font-semibold text-black mt-3'>Company Name</p>
          <p className='p-3 rounded-[9.5px] border-[1px] border-[rgba(127, 129, 130, .13)] italic text-[#7f8182] -tracking-[.54px] mt-2 bg-[#fbfbfb]'>{company}</p>
        </div>
        <div className='col-span-1'>
          <h4 className='font-[Inter] text-black text-base font-semibold'>Payment Methods</h4>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;