// @ts-nocheck
import { useState } from "react";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  StripeCardCvcElementChangeEvent,
  StripeCardExpiryElementChangeEvent,
  StripeCardNumberElementChangeEvent,
} from "@stripe/stripe-js";
import { useSelector } from "react-redux";
import { selectAuth } from "../../store/authSlice";
import StripeUtil from "../../utils/stripe";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import DialogUtils from "../../utils/DialogUtils";

interface ICardComponent {
  onSuccess: (cards: Array<any>) => void;
}

export const CardComponent: FC<ICardComponent> = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { email } = useSelector(selectAuth);
  const [loading, setLoading] = useState<boolean>(false);
  const [cardErrors, setCardErrors] = useState<any>({});

  const handleSubmit = async () => {
    setLoading(true);
    if (!stripe || !elements) {
      return;
    }

    const cardNumber = elements.getElement(CardNumberElement);

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumber,
    });

    if (error) {
      handleCardErrors(error);
      setLoading(false);
    } else {
      setCardErrors({});
      const customerId = await StripeUtil.getCustomerId(email);
      const { data } = await StripeUtil.attachCardToCustomer(
        customerId,
        paymentMethod.id
      );
      onSuccess(
        data.map((item) => ({
          create_time: item.created,
          card_id: item.id,
          last4: item.card?.last4,
          brand: item.card?.brand,
          customer_id: item.customer,
        }))
      );
      DialogUtils.show("success", "", "Card successfully added");
      setLoading(false);
    }
  };

  const errorType = (type: "cardNumber" | "cardExpiry" | "cardCvc") => {
    if (type === "cardNumber") return "card number";
    else if (type === "cardExpiry") return "expiry date";
    else if (type === "cardCvc") return "CVC";
  };

  const handleCardErrors = (error: StripeError) => {
    const newErrors = { ...cardErrors };
    switch (error.code) {
      case "incomplete_number":
      case "invalid_number":
      case "incorrect_number":
        newErrors["cardNumber"] = error.message;
        break;
      case "incomplete_expiry":
      case "invalid_expiry_month":
      case "invalid_expiry_year":
      case "expired_card":
        newErrors["cardExpiry"] = error.message;
        break;
      case "incomplete_cvc":
      case "invalid_cvc":
      case "incorrect_cvc":
        newErrors["cardCvc"] = error.message;
        break;
      default:
        newErrors["general"] = error.message;
        break;
    }
    setCardErrors(newErrors);
  };

  const handleCardElementChange = (
    event:
      | StripeCardNumberElementChangeEvent
      | StripeCardCvcElementChangeEvent
      | StripeCardExpiryElementChangeEvent
  ) => {
    const elementType = event.elementType;
    const newErrors = { ...cardErrors };
    if (event.error) {
      newErrors[elementType] = event.empty
        ? `Please enter ${errorType(elementType)}`
        : event.error.message;
    } else {
      delete newErrors[elementType];
    }
    setCardErrors(newErrors);
  };

  return (
    <div>
      {loading && <Loading />}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-[Inter] text-xs 2xl:text-base font-semibold flex">
            Card number
          </p>
          <CardNumberElement
            className={`w-full rounded-lg text-xs border-[1px] focus:ring-0 focus:border-main py-2 px-3`}
            onChange={(event) => handleCardElementChange(event)}
          />
          <ErrorMessage message={cardErrors.cardNumber} />
        </div>
        <div className="grid grid-cols-2 gap-7">
          <div className="flex flex-col gap-1">
            <p className="font-[Inter] text-xs 2xl:text-base font-semibold flex">
              Expiry
            </p>
            <CardExpiryElement
              className={`w-full rounded-lg text-xs border-[1px] focus:ring-0 focus:border-main py-2 px-3`}
              onChange={(event) => handleCardElementChange(event)}
            />
            <ErrorMessage message={cardErrors.cardExpiry} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-[Inter] text-xs 2xl:text-base font-semibold flex">
              CVC
            </p>
            <CardCvcElement
              className={`w-full rounded-lg text-xs border-[1px] focus:ring-0 focus:border-main py-2 px-3`}
              onChange={(event) => handleCardElementChange(event)}
            />
            <ErrorMessage message={cardErrors.CVC} />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="rounded-[5px] w-full text-primary bg-main px-[50px] 2xl:px-[60px] py-[10px] font-semibold mt-2 disabled:bg-gray-300 text-xs 2xl:text-md"
          disabled={loading}
        >
          Add Card
        </button>
      </div>
    </div>
  );
};
