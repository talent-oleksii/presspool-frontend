import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Modal } from "antd";
import { FC } from "react";
import { CardComponent } from "./CardComponent";

interface IAddCard {
  open: boolean;
  onClose: () => void;
  onSuccess:  (cards: Array<any>) => void;
}

export const AddCard: FC<IAddCard> = ({ open, onClose, onSuccess }) => {
  const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLISHABLE || ""
  );
  return (
    <Modal
      title={<div className="text-center">Add a card</div>}
      style={{ top: "25%" }}
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Elements stripe={stripePromise}>
        <CardComponent onSuccess={onSuccess} />
      </Elements>
    </Modal>
  );
};
