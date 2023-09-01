import { getCategories, getProducts } from 'lib/reflow';
import { MetadataRoute } from 'next';

// TODO: this file

type Route = {
  url: string;
  lastModified: string;
};

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routesMap = [''].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString()
  }));

  const categoriesPromise = getCategories().then((categories) =>
    categories.map((category) => ({
      url: `${baseUrl}${category.path}`,
      lastModified: category.updatedAt
    }))
  );

  const productsPromise = getProducts({}).then((products) =>
    products.map((product) => ({
      url: `${baseUrl}/product/${product.handle}`,
      lastModified: product.updatedAt
    }))
  );

  let fetchedRoutes: Route[] = [];

  try {
    fetchedRoutes = (await Promise.all([categoriesPromise, productsPromise])).flat();
  } catch (error) {
    throw JSON.stringify(error, null, 2);
  }

  return [...routesMap, ...fetchedRoutes];
}
