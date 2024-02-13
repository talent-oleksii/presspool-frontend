import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

import StripeUtil from '../../utils/stripe';
import { selectData } from '../../store/dataSlice';
import { selectAuth } from '../../store/authSlice';
import Loading from '../../components/Loading';
import APIInstance from '../../api';
import DialogUtils from '../../utils/DialogUtils';

const RaiseBudget: FC = () => {
  const { id } = useParams();
  const navigator = useNavigate();
  const [currentTarget, setCurrentTarget] = useState('consumer');
  const [loading, setLoading] = useState(false);
  const [originPrice, setOriginPrice] = useState('10000');
  const [newPrice, setNewPrice] = useState('10000');
  const { cardList } = useSelector(selectData);
  const [checked, setChecked] = useState(true);
  const [currentCard, setCurrentCard] = useState('');
  const { email } = useSelector(selectAuth);

  const handleAddCard: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    const customerId = await StripeUtil.getCustomerId(email);

    const session = await StripeUtil.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `https://go.presspool.ai/raise-budget/${id}`,
    });

    window.location.href = session.url + '/payment-methods';
    // window.open(session.url + '/payment-methods', '_blank');
  };

  useEffect(() => {
    if (!id || id.length <= 0) return;
    setLoading(false);
    APIInstance.get('data/campaign_detail', { params: { id } }).then(data => {
      setOriginPrice(data.data.price);
      setNewPrice(data.data.price);
      setCurrentTarget(data.data.demographic);
      setCurrentCard(data.data.card_id);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = () => {
    setLoading(true);
    APIInstance.put('data/campaign_detail', {
      id,
      type: 'budget',
      newPrice,
      currentCard,
    }).then(() => {
      DialogUtils.show('success', '', 'Your Budget has been successfully changed.');
      navigator('/detail');
    }).finally(() => setLoading(false));
  };

  return (
    <div className='shadow-md rounded-[15px] px-[100px] py-[30px] bg-white max-w-[900px] relative'>
      {
        loading && <Loading />
      }
      <h3 className='text-center w-full font-[Inter] text-lg font-semibold -tracking-[.6px] text-black'>Raise Budget</h3>
      <div className='text-left'>
        <p className='mt-8 font-[Inter] text-sm -tracking-[.48px] font-semibold'>Please type in your updated budget cap for this campaign.</p>
        <p className='text-[#43474a] text-sm font-light mt-1'>
          *Keep in mind, these are all verified, targeted and engaged readers that will be clicking through directly to your landing page of choice. We only charge per <span className='font-bold'>unique click</span> as they come in.
        </p>
        <div className='pl-2 pr-4 py-1 mt-[23px] border-[1px] rounded-lg border-black w-full flex justify-between items-center relative'>
          <input
            value={newPrice}
            prefix='$'
            className='border-0 focus:border-0 focus:ring-0 focus-visible:outline-0 focus-visible:border-0 flex-1 text-sm 2xl:text-md'
            onChange={e => setNewPrice(e.target.value)}
            type="number"
            min="10000"
          />
          <p className='text-[#f76363] font-normal text-xs right-[23px] top-[10px] ms-2'>*minimum input must be $10,000</p>
        </div>
        {newPrice &&
          <div className='mt-[9px]'>
            <span className='font-[Inter] text-xs 2xl:text-sm my-3 text-black'>
              {`*Total estimated clicks for the campaign are ${Math.floor(Number(newPrice) / (currentTarget === 'consumer' ? 8 : 20))}`}
            </span>
          </div>
        }
        <div className='mt-4 rounded-lg flex mt-8'>
          <div>
            <svg enableBackground="new 0 0 91.8 92.6" version="1.0" viewBox="0 0 91.8 92.6" xmlns="http://www.w3.org/2000/svg" className='w-[16px] me-1'>
              <path d="M45.9,3.6c-23.5,0-42.5,19-42.5,42.5c0,23.5,19,42.5,42.5,42.5c23.5,0,42.5-19,42.5-42.5  C88.4,22.7,69.4,3.6,45.9,3.6z M43.7,21.1h4.3c0.5,0,0.9,0.4,0.9,0.9l-0.6,34.5c0,0.5-0.4,0.9-0.9,0.9h-3c-0.5,0-0.9-0.4-0.9-0.9  L42.8,22C42.8,21.5,43.2,21.1,43.7,21.1z M48.6,71.2c-0.8,0.8-1.7,1.1-2.7,1.1c-1,0-1.9-0.3-2.6-1c-0.8-0.7-1.3-1.8-1.3-2.9  c0-1,0.4-1.9,1.1-2.7c0.7-0.8,1.8-1.2,2.9-1.2c1.2,0,2.2,0.5,3,1.4c0.5,0.6,0.8,1.3,0.9,2.1C49.9,69.3,49.5,70.3,48.6,71.2z" fill="#525252" />
            </svg>
          </div>

          <span className='text-bold font-medium text-xs font-medium'>
            <span className='font-bold'>Updated Budget: </span>{`Your campaign is being raised from $${originPrice} to $${newPrice}`}
          </span>
        </div>
        <h3 className='text-black mt-8 font-[Inter] font-semibold -tracking-[.6px] text-lg'>Payment Method</h3>
        <div className='w-full flex mt-4'>
          {cardList.length > 0 && <>
            <div className='flex items-left justify-center flex-col'>
              <p className='text-sm -tracking-[.42px] font-[Inter] font-medium'>Select Card Details</p>
              <select
                className='w-[400px] pl-[16px] py-[11px] mt-2 border-[1px] border-[#7f8182] rounded-lg font-[Inter] text-sm 2xl:text-md'
                value={currentCard}
                onChange={e => setCurrentCard(e.target.value)}
              >
                {
                  cardList.map((item: any) => (
                    <option value={item.card_id} key={item.id}>
                      {item.brand.toUpperCase()}
                      {` **** **** **** ${item.last4}`}
                    </option>
                  ))
                }
              </select>
              {/* <button className='text-black font-[Inter] mx-3' onClick={handleRefreshCard}>Refresh</button> */}
            </div>

            <div className='flex-1 ms-[18px]'>
              <p className='text-sm -tracking-[.42px] font-[Inter] font-medium'>Add New Card</p>
              <button
                className='flex py-[11px] mt-2 px-[17px] items-center justify-center text-[#7f8182] w-full rounded-lg border-[1px] border-[#7f8182] text-sm 2xl:text-md'
                onClick={handleAddCard}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className='me-[9px]'>
                  <path d="M7 10H13M10 7V13M1 10C1 11.1819 1.23279 12.3522 1.68508 13.4442C2.13738 14.5361 2.80031 15.5282 3.63604 16.364C4.47177 17.1997 5.46392 17.8626 6.55585 18.3149C7.64778 18.7672 8.8181 19 10 19C11.1819 19 12.3522 18.7672 13.4442 18.3149C14.5361 17.8626 15.5282 17.1997 16.364 16.364C17.1997 15.5282 17.8626 14.5361 18.3149 13.4442C18.7672 12.3522 19 11.1819 19 10C19 7.61305 18.0518 5.32387 16.364 3.63604C14.6761 1.94821 12.3869 1 10 1C7.61305 1 5.32387 1.94821 3.63604 3.63604C1.94821 5.32387 1 7.61305 1 10Z" stroke="#7F8182" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Add New Card
              </button>
            </div>
          </>
          }
          {cardList.length <= 0 && <>
            <div className='flex-1 me-[18px]'>
              <p className='text-sm -tracking-[.42px] font-[Inter] font-medium'>Add New Card</p>
              <button
                className='flex py-[11px] px-[17px] items-center justify-center text-[#7f8182] w-full rounded-lg border-[1px] border-[#7f8182] text-sm 2xl:text-md'
                onClick={handleAddCard}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className='me-[9px]'>
                  <path d="M7 10H13M10 7V13M1 10C1 11.1819 1.23279 12.3522 1.68508 13.4442C2.13738 14.5361 2.80031 15.5282 3.63604 16.364C4.47177 17.1997 5.46392 17.8626 6.55585 18.3149C7.64778 18.7672 8.8181 19 10 19C11.1819 19 12.3522 18.7672 13.4442 18.3149C14.5361 17.8626 15.5282 17.1997 16.364 16.364C17.1997 15.5282 17.8626 14.5361 18.3149 13.4442C18.7672 12.3522 19 11.1819 19 10C19 7.61305 18.0518 5.32387 16.364 3.63604C14.6761 1.94821 12.3869 1 10 1C7.61305 1 5.32387 1.94821 3.63604 3.63604C1.94821 5.32387 1 7.61305 1 10Z" stroke="#7F8182" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Add a Card
              </button>
            </div>
            <div className='flex items-left justify-center flex-col'>
              <p className='text-sm -tracking-[.42px] font-[Inter] font-medium'>Select Card Details</p>
              <select
                className='w-[400px] pl-[16px] py-[11px] border-[1px] border-[#7f8182] rounded-lg font-[Inter] text-sm 2xl:text-md'
                value={currentCard}
                onChange={e => setCurrentCard(e.target.value)}
              >
                {
                  cardList.map((item: any) => (
                    <option value={item.card_id} key={item.id}>
                      {item.brand.toUpperCase()}
                      {` **** **** **** ${item.last4}`}
                    </option>
                  ))
                }
              </select>
            </div>
          </>
          }
        </div>
        <div className='mt-5 flex justify-top'>
          <input
            className='me-[9px] text-main focus:ring-0'
            type="checkbox"
            checked={checked}
            onChange={e => setChecked(e.target.checked)}
          />
          <p className='text-[12px] text-black font-[Inter] font-normal'>
            I agree and authorize weekly automatic billing for accrued click costs per the <a target='_blank' href='https://www.presspool.ai/terms' rel="noreferrer" className='underline'>Terms of Service</a> and <a className='underline' target='_blank' href="https://www.presspool.ai/privacy-policy" rel="noreferrer">Privacy Policy</a>. This authorization will continue until I cancel in accordance with the provided terms.
          </p>
        </div>
        <div className='w-full mt-8 text-center'>
          <button
            className='font-[Inter] text-sm font-semibold px-4 py-2 rounded-[5px] bg-main disabled:bg-[gray]'
            disabled={Number(newPrice) < 10000}
            onClick={handleSubmit}
          >
            Submit for Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default RaiseBudget;