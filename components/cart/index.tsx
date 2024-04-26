"use client";

import useAuth from "@reflowhq/auth-react";
import CartView, { useCart } from "@reflowhq/cart-react";
import { toast } from "react-toastify";

export default function Cart() {
  const config = {
    projectID: process.env.NEXT_PUBLIC_REFLOW_PROJECT_ID,
    testMode: process.env.NEXT_PUBLIC_REFLOW_MODE == "test",
  };

  const auth = useAuth(config);
  const cart = useCart(config);

  return (
    <div>
      <CartView
        cart={cart}
        auth={auth}
        successURL={"/order-success"}
        cancelURL={"/cart"}
        onMessage={(message: any) => {
          const toastMessageHTML = (
            <div>
              <h6>{message.title}</h6>
              {message.description ? (
                <p className="text-sm">{message.description}</p>
              ) : (
                ""
              )}
            </div>
          );

          if (message.type == "success") {
            toast.success(({}) => toastMessageHTML);
          } else if (message.type == "error") {
            toast.error(({}) => toastMessageHTML);
          }
        }}
      />
    </div>
  );
}
