'use client'

import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from "@reflowhq/cart-react";
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

export default function OpenCart({
  className,
}: {
  className?: string;
}) {

  const cart = useCart({
    storeID: process.env.NEXT_PUBLIC_REFLOW_STORE_ID
  });

  if (!cart.isLoaded) {
    cart.refresh();
  }

  const quantityRef = useRef(cart.quantity);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {

    let newQ = cart.quantity || 0;
    let oldQ = quantityRef.current;

    if (newQ != oldQ) {
      setQuantity(newQ);
    }

    // Always update the quantity reference
    quantityRef.current = newQ;
  }, [quantity, cart, quantityRef]);

  return (
    <a href={'/cart'} className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
      <button aria-label="Open cart" >
        <ShoppingCartIcon
          className={clsx('h-4 transition-all ease-in-out hover:scale-110 ', className)}
        />

        {quantity ? (
          <div className="absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded bg-blue-600 text-[11px] font-medium text-white">
            {quantity}
          </div>
        ) : null}
      </button>
    </a>
  );
}
