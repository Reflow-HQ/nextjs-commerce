import { getProducts, getSearchCategories } from "lib/reflow";
import { MetadataRoute } from "next";

type Route = {
  url: string;
  lastModified: string;
};

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routesMap = [""].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  const categoriesPromise = getSearchCategories().then((categories) =>
    categories.map((category) => ({
      url: `${baseUrl}/search/${category.handle}`,
      lastModified: new Date().toISOString(),
    })),
  );

  const productsPromise = getProducts({}).then((products) =>
    products.data.map((product) => ({
      url: `${baseUrl}/product/${product.handle}`,
      lastModified: new Date().toISOString(),
    })),
  );

  let fetchedRoutes: Route[] = [];

  try {
    fetchedRoutes = (
      await Promise.all([categoriesPromise, productsPromise])
    ).flat();
  } catch (error) {
    throw JSON.stringify(error, null, 2);
  }

  return [...routesMap, ...fetchedRoutes];
}
