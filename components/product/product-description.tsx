'use client'
// TODO: only addtocart should be 'use client' here

import { AddToCart, useCart } from "@reflowhq/cart-react"; // TODO: this leads to minified code
import Price from 'components/price';
import Prose from 'components/prose';
import { ReflowProduct } from 'lib/reflow/types';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export function ProductDescription({ product }: { product: ReflowProduct }) {

  const cart = useCart({
    storeID: process.env.NEXT_PUBLIC_REFLOW_STORE_ID
  });

  // TODO: maybe get selected variant from page url instead of state?

  const [selectedVariant, setSelectedVariant] = useState(product.variants.enabled ? product.variants.items[0] : null);
  const [displayPrice, setDisplayPrice] = useState(selectedVariant ? selectedVariant.price : product.price);

  useEffect(() => {
    setDisplayPrice(selectedVariant ? selectedVariant.price : product.price);
  }, [selectedVariant]);

  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.name}</h1>
        <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
          <Price amount={displayPrice} currency={product.currency} />
        </div>
      </div>

      {product.description_html ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.description_html}
        />
      ) : null}

      {/* TODO: change shown price on variant select. Product to test is Coffee Pot */}
      {/* TODO: decide what to do with add to cart out of stock variants */}

      <AddToCart
        key={product.id}
        cart={cart}
        product={product}
        onMessage={(message: any) => {
          toast("Added to cart!")
        }}
      />

      <button className="ref-button" onClick={() => setSelectedVariant(product.variants.enabled ? product.variants.items[1] : null)}>Test change variant display price</button>
    </>
  );
}
