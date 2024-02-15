import { GridTileImage } from "components/grid/tile";
import { getProducts } from "lib/reflow";
import type { ReflowProduct } from "lib/reflow/types";
import Link from "next/link";

function ThreeItemGridItem({
  item,
  size,
  priority,
}: {
  item: ReflowProduct;
  size: "full" | "half";
  priority?: boolean;
}) {
  return (
    <div
      className={
        size === "full"
          ? "md:col-span-4 md:row-span-2"
          : "md:col-span-2 md:row-span-1"
      }
    >
      <Link
        className="relative block aspect-square h-full w-full"
        href={`/product/${item.handle || item.id}`}
      >
        <GridTileImage
          src={item.image.lg}
          fill
          sizes={
            size === "full"
              ? "(min-width: 768px) 66vw, 100vw"
              : "(min-width: 768px) 33vw, 100vw"
          }
          priority={priority}
          alt={item.name}
          label={{
            position: size === "full" ? "center" : "bottom",
            title: item.name as string,
            amount: item.price_range.sort()[0],
            currency: item.currency,
          }}
        />
      </Link>
    </div>
  );
}

export async function ThreeItemGrid() {
  const homepageItems = (
    await getProducts({
      category: process.env.FEATURED_PRODUCTS_CATEGORY,
      page: 1,
      perpage: 3,
      order: "custom_desc",
    })
  ).data;

  if (!homepageItems[0] || !homepageItems[1] || !homepageItems[2]) return null;

  const [firstProduct, secondProduct, thirdProduct] = homepageItems;

  return (
    <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2 lg:px-6">
      <ThreeItemGridItem size="full" item={firstProduct} priority={true} />
      <ThreeItemGridItem size="half" item={secondProduct} priority={true} />
      <ThreeItemGridItem size="half" item={thirdProduct} />
    </section>
  );
}
