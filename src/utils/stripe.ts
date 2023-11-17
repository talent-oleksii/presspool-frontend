import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

import APIInstance from '../api';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE || '');
const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET || '');

const getCampaignPayUrl = async (email: string, campaignId: string, backUrl: string, priceId: string) => {
  try {
    await APIInstance.post('stripe/prepare', { email, campaignId });
    const session = await stripe.checkout.sessions.create({
      success_url: backUrl,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      customer_email: email,
      metadata: {
        custom_param: campaignId,
      }
    });

    return session.url;
  } catch (error) {
    console.log('creating stripe error:', error);
  }
};

const StripeUtil = {
  stripe,
  stripePromise,
  getCampaignPayUrl
};

export default StripeUtil;