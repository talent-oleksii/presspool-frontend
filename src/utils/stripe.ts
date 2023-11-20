import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

import APIInstance from '../api';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE || '');
const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET || '');

const goToPay = async (email: string, campaignId: string, backUrl: string, cardId: string, priceId: string) => {
  try {
    // await APIInstance.post('stripe/prepare', { email, campaignId });
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: email as string
    });

    if (existingCustomers.data.length > 0) {
      // customer already exists
      customer = existingCustomers.data[0];
    } else {
      // create a new customer
      customer = await stripe.customers.create({
        email: email as string,
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      success_url: backUrl,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      metadata: {
        custom_param: campaignId,
      },
      payment_method_types: ['card'],
    });

    (await stripePromise)?.redirectToCheckout({
      sessionId: session.id
    });

    // return session.url;
  } catch (error) {
    console.log('creating stripe error:', error);
  }
};

const StripeUtil = {
  stripe,
  stripePromise,
  goToPay
};

export default StripeUtil;