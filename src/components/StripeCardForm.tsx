// CardForm.js
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

import APIInstance from '../api';
import { selectAuth } from '../store/authSlice';
import { addCard } from '../store/dataSlice';
import { StripeCardElementChangeEvent } from '@stripe/stripe-js';

import Loading from './Loading';

const CardForm: FC = () => {
  const [loading, setLoading] = useState(false);
  const [addDisabled, setAddDisabled] = useState(true);
  const [checked, setChecked] = useState(true);
  const stripe = useStripe();
  const elements = useElements();

  const { email } = useSelector(selectAuth);
  const dispatch = useDispatch();

  const handleCardChange = (e: StripeCardElementChangeEvent) => {
    console.log(e.error);
    setAddDisabled(e.complete ? false : true);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setLoading(true);
    const { token } = await stripe.createToken(cardElement, { name: email });

    // Send the token and email to your server
    APIInstance.post('stripe/card', {
      email,
      token,
    }).then(data => {
      dispatch(addCard({ card: data.data }));
    }).catch(err => {
      console.log('err:', err);
    }).finally(() => setLoading(false));
  };

  return (
    <form onSubmit={handleSubmit}>
      {loading && <Loading />}
      <CardElement onChange={handleCardChange} />
      <button
        className='font-[Inter] text-sm text-white font-medium py-[10px] bg-[#6c63ff] w-full rounded-[5px] mt-[24px] disabled:bg-gray-400'
        type="submit"
        disabled={addDisabled}
      >
        Add Card
      </button>
      <div className='mt-[20px] flex justify-top '>
        <input
          className='me-[9px]'
          type="checkbox"
          checked={checked}
          onChange={e => setChecked(e.target.checked)}
        />
        <p className='text-[12px] text-[#6c63ff] font-[Inter] font-normal'>
          I agree and authorize weekly automatic billing for accrued click costs per the <a target='_blank' href='https://www.presspool.ai/terms' rel="noreferrer" className='underline'>Terms of Service</a> and <a className='underline' target='_blank' href="https://www.presspool.ai/privacy-policy" rel="noreferrer">Privacy Policy</a>. This authorization will continue until I cancel in accordance with the provided terms.
        </p>
      </div>
    </form>
  );
};

export default CardForm;
