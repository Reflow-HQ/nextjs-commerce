import Grid from "components/grid";
import { GridTileImage } from "components/grid/tile";
import { ReflowProduct } from "lib/reflow/types";
import Link from "next/link";

export default function ProductGridItems({
  products,
}: {
  products: ReflowProduct[];
}) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.handle} className="animate-fadeIn">
          <Link
            className="relative inline-block h-full w-full"
            href={`/product/${product.handle || product.id}`}
          >
            <GridTileImage
              alt={product.name}
              label={{
                title: product.name,
                amount: product.price_range.sort()[0],
                currency: product.currency,
              }}
              src={product.image.md}
              fill
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </Link>
        </Grid.Item>
      ))}
    </>
  );
}
