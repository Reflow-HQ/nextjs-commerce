"use client";

import { AddToCart, useCart } from "@reflowhq/cart-react";
import Price from "components/price";
import Prose from "components/prose";
import { ReflowProduct } from "lib/reflow/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ProductDescription({
  product,
}: {
  product: ReflowProduct;
}) {
  const cart = useCart({
    projectID: process.env.NEXT_PUBLIC_REFLOW_PROJECT_ID,
    testMode: process.env.NEXT_PUBLIC_REFLOW_MODE == "test",
  });

  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.enabled ? product.variants.items[0] : null,
  );
  const [displayPrice, setDisplayPrice] = useState(
    selectedVariant ? selectedVariant.price : product.price,
  );

  useEffect(() => {
    setDisplayPrice(selectedVariant ? selectedVariant.price : product.price);
  }, [selectedVariant, product.price]);

  return (
    <>
      <div className="mb-6 mt-8 flex flex-col border-b pb-6 dark:border-neutral-700">
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

      <AddToCart
        key={product.id}
        cart={cart}
        product={product}
        onVariantSelect={(variant: any) => {
          setSelectedVariant(variant);
        }}
        onMessage={(message: any) => {
          toast(AddedToCartToast(message));
        }}
      />
    </>
  );
}

const AddedToCartToast = (message: { title: string; description?: string }) => (
  <div>
    <button>{message.title}</button>
    {message.title == "Product added to cart." ? (
      <a
        className="my-2 block w-24 rounded bg-blue-500 p-2 text-center text-sm text-white"
        href="/cart"
      >
        View Cart
      </a>
    ) : (
      ""
    )}
  </div>
);
