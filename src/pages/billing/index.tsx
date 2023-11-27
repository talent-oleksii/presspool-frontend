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
      <h2 className='text-[26px] 2xl:text-[32px] font-[Inter] text-black font-semibold -tracking-[1.02px]'>{`${company}'s Billings 📈`}</h2>
      <p className='my-2 text-[#43474A] font-normal text-sm 2xl:text-md'>Access to your billing portal.</p>

      <div className='bg-white flex items-center justify-between mt-4 p-5 2xl:p-10 rounded-[10px]'>
        <div>
          <h2 className='font-[Inter] text-black font-semibold text-[22px] 2xl:text-[25px]'>Invoices</h2>
          <p className='font-[Inter] text-[#43474a] font-medium text-sm 2xl:text-md'>Access to billing portal to view and manage your payments</p>
        </div>
        <button className='px-4 py-2 text-[Inter] rounded-full bg-black text-white text-sm 2xl:text-md' onClick={handleView}>View billing portal</button>
      </div>
    </motion.div>
  );
};

export default Billing;