'use client'

// TODO: buffer components that is only used so we can call ProductDescription dynamically 
// so that the Reflow lib can have access to window.
// https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading#with-no-ssr

// There is probably a better way to implement this

import dynamic from 'next/dynamic';

const OpenCart = dynamic(() =>
  import('./open-cart').then((mod) => mod.OpenCart), {
  ssr: false
})

export function OpenCartDynamic() {
  return (
    <OpenCart />
  );
}
