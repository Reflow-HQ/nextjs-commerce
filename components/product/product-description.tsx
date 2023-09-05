'use client'

import Price from 'components/price';
import Prose from 'components/prose';
import { ReflowProduct } from 'lib/reflow/types';

import { AddToCart, useCart } from "@reflowhq/cart-react"; // TODO: this leads to minified code

export function ProductDescription({ product }: { product: ReflowProduct }) {

  // TODO: centralize this config somehwere global?
  const config = {
    storeID: process.env.NEXT_PUBLIC_REFLOW_STORE_ID,
  };

  const cart = useCart(config);

  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.name}</h1>
        <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
          <Price amount={product.price_range.sort()[0]} currency={product.currency} />
        </div>
      </div>

      {product.description_html ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.description_html}
        />
      ) : null}

      {/* TODO: change shown price on variant select */}

      <AddToCart
        key={product.id}
        cart={cart}
        product={product}
        onMessage={(message: any) => {
          alert(cart.total); // TODO: if we add cart side bar this should open it, if we dont maybe show a toast?
        }}
      />
    </>
  );
}
