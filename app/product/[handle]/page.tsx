import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import Footer from "components/layout/footer";
import { Gallery } from "components/product/gallery";
import { getProduct } from "lib/reflow";
import { Media } from "lib/reflow/types";
import dynamic from "next/dynamic";

const DynamicProductDescription = dynamic(
  () => import("components/product/product-description"),
  {
    ssr: false,
  },
);

export const runtime = "edge";

export async function generateMetadata({
  params,
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
        follow: indexable,
      },
    },
    openGraph: imageURL
      ? {
          images: [
            {
              url: imageURL,
              alt: imageAlt,
            },
          ],
        }
      : null,
  };
}

export default async function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const priceRange = product.price_range.sort();
  const priceRangeLow = priceRange[0];
  const priceRangeHigh = priceRange.at(-1) || priceRangeLow;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image.lg,
    offers: {
      "@type": "AggregateOffer",
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.currency.code,
      highPrice: product.currency.zero_decimal
        ? priceRangeHigh
        : priceRangeHigh / 100,
      lowPrice: product.currency.zero_decimal
        ? priceRangeLow
        : priceRangeLow / 100,
    },
  };

  let galleryMedia: {
    type: "image" | "video";
    src: string;
    altText: string;
  }[] = [
    {
      type: "image",
      src: product.image.lg,
      altText: product.name,
    },
  ];
  if (product.media.length) {
    galleryMedia = product.media.map((m: Media) => {
      return {
        type: m.type,
        altText: product.name,
        src: m.type == "image" ? m.src.lg : m.url,
      };
    });
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      <div className="mx-auto max-w-screen-2xl px-4 md:px-6">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Gallery media={galleryMedia} />
          </div>

          <div className="basis-full lg:basis-2/6">
            <DynamicProductDescription product={product} />
          </div>
        </div>
      </div>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
