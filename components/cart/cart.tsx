'use client'

import useAuth from "@reflowhq/auth-react";
import CartView, { useCart } from "@reflowhq/cart-react";

export function Cart({
  className,
}: {
  className?: string;
}) {

  const config = {
    storeID: process.env.NEXT_PUBLIC_REFLOW_STORE_ID,
  };

  const auth = useAuth(config);
  const cart = useCart(config);

  return (
    <div>
      <CartView
        cart={cart}
        auth={auth}
        successURL={"https://example.com/success"}
        cancelURL={"https://example.com/cancel"}
        onMessage={(message: any) => {
          console.log(message.type, message.title, message.description);
        }}
      />
    </div>
  );
}
