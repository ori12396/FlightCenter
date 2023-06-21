import { PayPalButtons } from "@paypal/react-paypal-js";
import { useState, useEffect } from "react";
import Spinner from '../../spinner/Spinner'
function PaypalCheckoutButton(props) {
  const { toDisable, product, buyyerpay, userSale, handleClick } = props;
  const [paidFor, setPaidFor] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (paidFor) {

    }
  }, [paidFor]);
  const handleApprove = (orderId) => {
    setPaidFor(true);


  };
  useEffect(() => {
    if (paidFor) {
      buyyerpay(product);
    }
  }, [paidFor]);


  if (error) {
    alert(error);
  }
  const buttonClicked = () => {
    if (toDisable) {
      handleClick();
    }
  };

  return (
    <PayPalButtons
      style={{ }}
      onClick={buttonClicked}
      disabled={toDisable}
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              description: "Flight number: " + product.flightnumber,
              amount: {
                value: product.price,
              },
            },
          ],
        });
      }}
      onApprove={async (data, actions) => {
        const order = await actions.order.capture();
        handleApprove(data.orderID);
        console.log("order", order);
      }}
      onError={(error) => {
        setError(error);
        console.error("Payment checkout onError", error);
      }}
      onCancel={() => { }}
    />
  );
}

export default PaypalCheckoutButton;
