import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import ProductPagination from "components/layout/product-pagination";
import { defaultSort, sorting } from "lib/constants";
import { getProducts } from "lib/reflow";

export const runtime = "edge";

export const metadata = {
  title: "Search",
  description: "Search for products in the store.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const {
    sort,
    q: searchValue,
    page,
  } = searchParams as { [key: string]: string };
  const { orderKey } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({
    order: orderKey,
    search: searchValue || "",
    page: page ? parseInt(page) : undefined,
  });
  const resultsText = products.data.length > 1 ? "results" : "result";

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {products.data.length === 0
            ? "There are no products that match "
            : `Showing ${products.data.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.data.length > 0 ? (
        <>
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ProductGridItems products={products.data} />
          </Grid>
          <ProductPagination paginationMeta={products.meta} />
        </>
      ) : null}
    </>
  );
}
