import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE || '');
const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET || '');

const GoToPay = async (email: string, campaignId: string, backUrl: string, priceId: string) => {
  try {
    // await APIInstance.post('stripe/prepare', { email, campaignId });
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: email as string,
    });

    if (existingCustomers.data.length > 0) {
      // customer already exists
      customer = existingCustomers.data[0];
      // if (!customer.default_source) await stripe.customers.createSource(customer.id, { source: sourceId });
    } else {
      // create a new customer
      customer = await stripe.customers.create({
        email: email as string,
        // source: sourceId,
      });
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
    });

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: backUrl,
    });

    console.log('seesion:', session);

    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: 250 * 100,
    //   currency: 'usd',
    //   customer: customer.id,
    //   payment_method: setupIntent.payment_method as string,
    //   off_session: true,
    //   confirm: true,
    // });

    // const session = await stripe.checkout.sessions.create({
    //   customer: customer.id,
    //   success_url: backUrl,
    //   line_items: [{ price: priceId, quantity: 1 }],
    //   mode: 'payment',
    //   metadata: {
    //     custom_param: campaignId,
    //   },
    // });

    // window.location.href = 

    // return session.url;
  } catch (error) {
    console.log('creating stripe error:', error);
  }
};

const StripeUtil = {
  stripe,
  stripePromise,
  goToPay: GoToPay,
};

export default StripeUtil;