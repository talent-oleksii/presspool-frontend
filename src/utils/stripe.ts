import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE || '');
const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET || '');

const getCustomerId = async (email: string) => {
  let customer: Stripe.Customer;
  const existingCustomers = await stripe.customers.list({ email });

  if (existingCustomers.data.length > 0) {
    customer = existingCustomers.data[0];
  } else {
    customer = await stripe.customers.create({ email });
  }

  return customer.id;
};

const StripeUtil = {
  stripe,
  stripePromise,
  getCustomerId,
};

export default StripeUtil;