import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import Footer from 'components/layout/footer';
import { Gallery } from 'components/product/gallery';
import { ProductDescription } from 'components/product/product-description';
import { getProduct } from 'lib/reflow';
import { Media } from 'lib/reflow/types';

export const runtime = 'edge';

export async function generateMetadata({
  params
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const imageURL = product.image.lg;
  const imageAlt = product.name;
  const indexable = true;

  return {
    title: product.name,
    description: product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable
      }
    },
    openGraph: imageURL
      ? {
          images: [
            {
              url: imageURL,
              alt: imageAlt
            }
          ]
        }
      : null
  };
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  let priceRange = product.price_range.sort();
  let priceRangeLow = priceRange[0];
  let priceRangeHigh = priceRange.at(-1);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image.lg,
    offers: {
      '@type': 'AggregateOffer',
      availability: product.in_stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.currency.code,
      highPrice: product.currency.zero_decimal ? priceRangeHigh : priceRangeHigh / 100,
      lowPrice: product.currency.zero_decimal ? priceRangeLow : priceRangeLow / 100
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black md:p-12 lg:flex-row lg:gap-8">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Gallery
              // TODO video
              images={product.media
                .filter((m: Media) => m.type == 'image')
                .map((m: Media) => {
                  return {
                    src: m.src.lg,
                    altText: product.name
                  };
                })}
            />
          </div>

          <div className="basis-full lg:basis-2/6">
            <ProductDescription product={product} />
          </div>
        </div>
      </div>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
