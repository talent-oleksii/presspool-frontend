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
    let customer;

    const existingCustomers = await StripeUtil.stripe.customers.list({
      email: email || ''
    });

    if (existingCustomers.data.length > 0) {
      // customer already exists
      customer = existingCustomers.data[0];
    } else {
      // create a new customer
      customer = await StripeUtil.stripe.customers.create({
        email: email || '',
        // add any other customer details here as necessary
      });
    }

    const session = await StripeUtil.stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: 'https://presspool-frontend.onrender.com/#/campaign/all',
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
      <p className='mt-[6px] text-[#43474A] font-normal text-sm'>Access to your billing portal.</p>

      <div className='bg-white flex items-center justify-between mt-[30px] px-[64px] py-[50px] rounded-[10px] shadow-md'>
        <div>
          <h2 className='font-[Inter] text-black font-semibold text-[18px] 2xl:text-[22px]'>Invoices</h2>
          <p className='font-[Inter] text-[#43474a] font-medium mt-[22px] text-sm 2xl:text-md'>Access to billing portal to view and manage your payments</p>
        </div>
        <button className='px-4 py-2 font-[Inter] rounded-[5px] bg-black text-white text-sm 2xl:text-md font-medium' onClick={handleView}>View billing portal</button>
      </div>
    </motion.div>
  );
};

export default Billing;