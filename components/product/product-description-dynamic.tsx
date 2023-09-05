'use client'

// TODO: buffer components that is only used so we can call ProductDescription dynamically 
// so that the Reflow lib can have access to window.
// https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading#with-no-ssr

// There is probably a better way to implement this

import { ReflowProduct } from 'lib/reflow/types';
import dynamic from 'next/dynamic';

const ProductDescription = dynamic(() =>
  import('components/product/product-description').then((mod) => mod.ProductDescription), {
  ssr: false
})

export function ProductDescriptionDynamic({ product }: { product: ReflowProduct }) {
  return (
    <ProductDescription product={product} />
  );
}
