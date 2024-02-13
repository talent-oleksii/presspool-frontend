import { FC } from 'react';
import { useSelector } from 'react-redux';
import { motion } from "framer-motion";

import { selectAuth } from '../../store/authSlice';
import { FADE_UP_ANIMATION_VARIANTS } from '../../utils/TransitionConstants';

import StripeUtil from '../../utils/stripe';

const Billing: FC = () => {
  const { company } = useSelector(selectAuth);

  const { email } = useSelector(selectAuth);

  const handleView = async () => {
    const customerId = await StripeUtil.getCustomerId(email);

    const session = await StripeUtil.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: 'https://go.presspool.ai/campaign/all',
    });

    window.location.href = session.url;
  };

  return (
    <motion.div
      className='text-left relative'
      initial="hidden"
      animate="show"
      variants={FADE_UP_ANIMATION_VARIANTS}
    >
      <h2 className='text-[20px] 2xl:text-[24px] font-[Inter] text-black font-semibold -tracking-[.6px]'>{`${company}'s Billings 📈`}</h2>
      <p className='mt-[6px] text-[#43474A] font-normal text-xs'>Access to your billing portal.</p>

      <div className='bg-white flex items-center justify-between mt-[30px] px-[64px] py-[50px] rounded-[10px]'>
        <div>
          <h2 className='font-[Inter] text-black font-semibold text-[18px] 2xl:text-[22px] -tracking-[.54px]'>Invoices</h2>
          <p className='font-[Inter] text-[#43474a] font-medium mt-[22px] text-xs 2xl:text-md -tracking-[.42px]'>Access to billing portal to view and manage your payments</p>
        </div>
        <button className='px-4 py-2 font-[Inter] rounded-[5px] bg-black text-white text-xs 2xl:text-md font-medium' onClick={handleView}>View billing portal</button>
      </div>
    </motion.div>
  );
};

export default Billing;