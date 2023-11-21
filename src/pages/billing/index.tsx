import { FC } from 'react';
import { useSelector } from 'react-redux';

import { selectAuth } from '../../store/authSlice';

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
    <div className='text-left relative'>
      <h2 className='text-[32px] font-[Inter] text-black font-semibold'>{`${company}'s Billings 📈`}</h2>
      <p className='my-2 text-[#43474A] font-normal'>Access to your billing portal.</p>

      <div className='bg-white h-[200px] flex items-center justify-between mt-[100px] p-10'>
        <div>
          <h2 className='font-[Inter] text-black font-semibold text-[28px]'>Invoices</h2>
          <p className='font-[Inter] text-[#43474a] font-medium text-[18px]'>Access to billing portal to view and manage your payments</p>
        </div>
        <button className='px-4 py-2 text-[Inter] rounded-[5px] bg-black text-white' onClick={handleView}>View billing portal</button>
      </div>
    </div>
  );
};

export default Billing;