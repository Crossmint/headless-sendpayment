"use client";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function StripePaymentElementPage() {
  const [stripePublishableKey, setStripePublishableKey] = useState("");
  const [stripeClientSecret, setStripeClientSecret] = useState("");

  const clientSecretValid =
    stripeClientSecret.startsWith("pi_") && stripeClientSecret.length >= 20;
  const publishableKeyValid =
    stripePublishableKey.startsWith("pk_") && stripePublishableKey.length >= 20;

  const hasStripeKeys = publishableKeyValid && clientSecretValid;

  return (
    <div className="flex w-full flex-col items-center justify-start p-5">
      <div className="flex w-full flex-col items-center justify-start gap-y-3 text-black mb-10">
        <input
          type="text"
          placeholder="order.payment.preparation.stripeClientSecret"
          className="w-full px-4 py-3 rounded"
          onChange={(e) => setStripeClientSecret(e.target.value)}
        />
        <input
          type="text"
          placeholder="order.payment.preparation.stripePublishableKey"
          className="w-full px-4 py-3 rounded"
          onChange={(e) => setStripePublishableKey(e.target.value)}
        />
      </div>

      {hasStripeKeys && (
        <div className="flex w-full max-w-[475px] flex-col items-center justify-start gap-y-6">
          <PaymentElementWrapper
            stripePublishableKey={stripePublishableKey}
            stripeClientSecret={stripeClientSecret}
          />
        </div>
      )}
    </div>
  );
}

function PaymentElementWrapper({
  stripePublishableKey,
  stripeClientSecret,
}: {
  stripePublishableKey: string;
  stripeClientSecret: string;
}) {
  return (
    <ElementsProviderWrapper
      stripePublishableKey={stripePublishableKey}
      stripeClientSecret={stripeClientSecret}
    >
      <PaymentElement className="w-full" />
      <SubmitButton />
    </ElementsProviderWrapper>
  );
}

function ElementsProviderWrapper({
  stripePublishableKey,
  stripeClientSecret,
  children,
}: {
  stripePublishableKey: string;
  stripeClientSecret: string;
  children: React.ReactNode;
}) {
  const stripePromise = loadStripe(stripePublishableKey);

  return (
    <Elements
      key={`${stripeClientSecret}-${stripePublishableKey}`}
      stripe={stripePromise}
      options={{
        clientSecret: stripeClientSecret,
        appearance: {
          rules: {
            ".Label": {
              color: "white",
            },
          },
        },
      }}
    >
      {children}
    </Elements>
  );
}

function SubmitButton() {
  const [message, setMessage] = useState<
    { text: string; color: string } | undefined
  >(undefined);

  const stripe = useStripe();
  const elements = useElements();

  async function handleSubmit() {
    setMessage(undefined);
    if (!stripe || !elements) {
      setMessage({ text: "Stripe or Elements not loaded", color: "red" });
      console.error("[handleSubmit] 'stripe' or 'elements' has not loaded");
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/success", // Should be your own url
      },
      redirect: "if_required", // Can be 'if-required', or 'always' if you prefer to always redirect to the next page
    });

    if (error) {
      console.error("[handleSubmit] Failed to confirm payment", error);
      // Optionally: display the message to the user via the UI
      setMessage({ text: "Failed to confirm payment", color: "red" });
      return;
    }

    console.log("[handleSubmit] Successfully confirmed payment");
    setMessage({ text: "Successfully confirmed payment", color: "green" });
  }

  return (
    <>
      <button
        onClick={handleSubmit}
        className="w-full px-4 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors duration-200"
      >
        Submit
      </button>

      {message && (
        <div
          style={{
            color: message.color,
          }}
        >
          {message.text}
        </div>
      )}
    </>
  );
}
