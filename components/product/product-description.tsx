import Price from 'components/price';
import Prose from 'components/prose';
import { Product } from 'lib/reflow/types';

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.name}</h1>
        <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
          <Price amount={product.price_range.sort()[0]} currency={product.currency} />
        </div>
      </div>
      {/* <VariantSelector options={product.options} variants={product.variants} /> */}

      {product.description_html ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.description_html}
        />
      ) : null}

      {/* <AddToCart variants={product.variants} availableForSale={product.availableForSale} /> */}
    </>
  );
}
