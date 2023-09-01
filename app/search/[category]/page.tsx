import { getProducts } from 'lib/reflow';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';

export const runtime = 'edge';

export async function generateMetadata({
  params
}: {
  params: { category: string };
}): Promise<Metadata> {
  return {
    title: 'Category name',
    description: 'Category description'
  };

  // TODO: add get category API route
  // TODO: add handles to categories
  // TODO: add descriptions to categories

  const category = await getCategory(params.category);

  if (!category) return notFound();

  return {
    title: category.seo?.title || category.title,
    description: category.seo?.description || category.description || `${category.title} products`
  };
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: { category: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort } = searchParams as { [key: string]: string };
  const { orderKey } = sorting.find((item) => item.slug === sort) || defaultSort;
  const products = await getProducts({ category: params.category, order: orderKey });

  return (
    <section>
      {products.length === 0 ? (
        <p className="py-3 text-lg">{`No products found in this category`}</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      )}
    </section>
  );
}
