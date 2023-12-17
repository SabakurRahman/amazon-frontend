import React, { useContext, useEffect, useState } from "react";
import CheckOutSteps from "../components/CheckOutSteps";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";

export default function PaymentMethodScreen() {
  const { state, dispatch } = useContext(Store);
  const navigate = useNavigate();
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;
  const [paymentMethodName, setPaymentMethodName] = useState(
    paymentMethod || "Paypal"
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);
  const submitHandaller = (e) => {
    e.preventDefault();
    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethodName });
    localStorage.setItem("paymentMethod", JSON.stringify(paymentMethodName));
    navigate("/placeorder");
    console.log("submit");
  };
  return (
    <div>
      <CheckOutSteps step1 step2 step3 />
      <div className="conatiner small-container">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className="my-3">Payment Method</h1>
        <Form onSubmit={submitHandaller}>
          <Form.Group>
            <Form.Label as="legend">Select Method</Form.Label>
            <div className="mb-3">
              <Form.Check
                type="radio"
                label="Paypal or Credit Card"
                id="Paypal"
                name="paymentMethodName"
                value="Paypal"
                checked={paymentMethodName === "Paypal"}
                onChange={(e) => setPaymentMethodName(e.target.value)}
              ></Form.Check>
            </div>
            <div className="mb-3">
              <Form.Check
                type="radio"
                label="Stripe"
                id="Stripe"
                name="paymentMethodName"
                value="Stripe"
                checked={paymentMethodName === "Stripe"}
                onChange={(e) => setPaymentMethodName(e.target.value)}
              ></Form.Check>
            </div>
          </Form.Group>
          <Button type="submit" variant="primary">
            Continue
          </Button>
        </Form>
      </div>
    </div>
  );
}
