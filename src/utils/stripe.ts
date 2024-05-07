import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE || ""
);
const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET || "");

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

const attachCardToCustomer = async (customerId: string, paymentId: string) => {
  await stripe.paymentMethods.attach(paymentId, {
    customer: customerId,
  });
  return await stripe.paymentMethods.list({
    customer: customerId,
    type: "card",
  });
};

const deleteCard = async (customerId: string, paymentId: string) => {
  await stripe.paymentMethods.detach(paymentId);
  return await stripe.paymentMethods.list({
    customer: customerId,
    type: "card",
  });
};

const isCustomerExist = async (email: string) => {
  const existingCustomers = await stripe.customers.list({
    email,
  });
  return existingCustomers.data.length > 0;
};

const isAccountLinked = async (email: string) => {
  let isConnected = false;
  const accounts = await stripe.accounts.list({ limit: 1000 });
    for (const account of accounts.data) {
      console.log('email:', account.metadata?.work_email);
      if (account.metadata?.work_email === email) {
        isConnected = account.charges_enabled;
        break;
      }
    }
  return isConnected;
};

const StripeUtil = {
  stripe,
  stripePromise,
  getCustomerId,
  attachCardToCustomer,
  deleteCard,
  isCustomerExist,
  isAccountLinked
};

export default StripeUtil;
