import { REFLOW_API_URL, TAGS } from 'lib/constants';
import { ReflowApiError } from 'lib/type-guards';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  Menu,
  ReflowCategory,
  ReflowPaginatedProductsResponse,
  ReflowProduct,
  ReflowProductsRequestBody,
  SearchCategory
} from './types';

export async function reflowFetch<T>({
  cache = 'no-cache',
  headers,
  endpoint,
  method,
  requestData = {}
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  endpoint?: string;
  method?: 'GET' | 'POST' | 'DELETE';
  requestData?: object;
}): Promise<{ status: number; body: T } | never> {
  try {
    let requestUrl = `${REFLOW_API_URL}/stores/${process.env.NEXT_PUBLIC_REFLOW_STORE_ID}/${endpoint}`;

    if (method == 'GET' && Object.values(requestData).length) {
      let searchParams = new URLSearchParams({ ...requestData });
      requestUrl = `${requestUrl}?${searchParams.toString()}`;
    }

    const result = await fetch(requestUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: method == 'POST' ? JSON.stringify(requestData) : null,
      cache
    });

    const body = await result.json();

    if (!result.ok) {
      let err = new ReflowApiError(body.error || 'HTTP error');
      err.endpoint = requestUrl;
      err.status = result.status;
      err.body = body;
      throw err;
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    if (e instanceof ReflowApiError) {
      throw {
        endpoint: e.endpoint,
        status: e.status || 500,
        body: e.body
      };
    }

    throw {
      error: e
    };
  }
}

export async function getCategory(handle: string): Promise<Category | undefined> {
  // TODO
}

export async function getProducts(
  requestBody: ReflowProductsRequestBody
): Promise<ReflowProduct[]> {
  const res = await reflowFetch<ReflowPaginatedProductsResponse>({
    method: 'GET',
    endpoint: 'products/',
    requestData: requestBody
  });

  let products = res.body.data;
  return products;
}

export async function getProduct(handle: string): Promise<ReflowProduct | undefined> {
  const res = await reflowFetch<ReflowProduct>({
    method: 'GET',
    endpoint: 'products/' + handle
  });

  let product = res.body;
  return product;
}

export async function getCategories(): Promise<SearchCategory[]> {
  let reflowCategories = await reflowFetch<ReflowCategory[]>({
    method: 'GET',
    endpoint: 'categories/'
  });
  const categories = [
    {
      handle: '',
      title: 'All',
      seo: {
        title: 'All'
      },
      path: '/search',
      updatedAt: new Date().toISOString()
    },
    ...reflowCategories.body.map((category: ReflowCategory) => ({
      handle: category.id,
      title: category.name,
      seo: {
        title: category.name
      },
      path: `/search/${category.id}`,
      updatedAt: new Date().toISOString()
    }))
  ];

  return categories;
}

export async function getNavigationMenu(): Promise<Menu[]> {
  const navigation = process.env.NAV_CATEGORIES?.split(',') || [];
  const pagePath = '/search/';

  let reflowCategories = await reflowFetch<ReflowCategory[]>({
    method: 'GET',
    endpoint: 'categories/'
  });

  let menuItems = [
    {
      title: 'All Products',
      path: pagePath
    }
  ];

  for (const navCategory of navigation) {
    let category = reflowCategories.body.find((cat) => cat.id == navCategory);
    if (!category) {
      console.error(`Cannot find menu category with reflow id ${navCategory}`);
      continue;
    }
    menuItems.push({
      title: category.name,
      path: `${pagePath}${category.id}`
    });
  }

  return menuItems;
}


// TODO: this

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.
  const collectionWebhooks = ['collections/create', 'collections/delete', 'collections/update'];
  const productWebhooks = ['products/create', 'products/delete', 'products/update'];
  const topic = headers().get('x-shopify-topic') || 'unknown';
  const secret = req.nextUrl.searchParams.get('secret');
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error('Invalid revalidation secret.');
    return NextResponse.json({ status: 200 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
