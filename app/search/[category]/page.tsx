import { getProducts } from "lib/reflow";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import ProductPagination from "components/layout/product-pagination";
import { defaultSort, sorting } from "lib/constants";
import { getCategory } from "lib/reflow";

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const category = await getCategory(params.category);

  if (!category) return notFound();

  return {
    title: category.name,
    description: category.description || `${category.name} products`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, page } = searchParams as { [key: string]: string };
  const { orderKey } =
    sorting.find((item) => item.slug === sort) || defaultSort;
  const products = await getProducts({
    category: params.category,
    order: orderKey,
    page: page ? parseInt(page) : undefined,
  });

  return (
    <section>
      {products.data.length === 0 ? (
        <p className="py-3 text-lg">{`No products found in this category`}</p>
      ) : (
        <>
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ProductGridItems products={products.data} />
          </Grid>
          <ProductPagination paginationMeta={products.meta} />
        </>
      )}
    </section>
  );
}
