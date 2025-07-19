import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISH);

export const Checkout = () => {
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4242/start-checkout", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((err) => {
        console.error("Failed to get clientSecret:", err);
      });
  }, []);

  const options = {
    clientSecret
  };

  return (
    <>
      {clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <div>Hello</div>
          {/* Your custom payment form goes here */}
        </Elements>
      ) : (
        <p>Loading payment form...</p>
      )}
    </>
  );
};
