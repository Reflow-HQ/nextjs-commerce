import { REFLOW_API_URL, TAGS } from 'lib/constants';
import { ReflowApiError } from 'lib/type-guards';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  Cart,
  Category,
  Collection,
  Connection,
  Image,
  Menu,
  Product,
  ReflowPaginatedProductsResponse,
  ReflowProductsRequestBody,
  ShopifyCart,
  ShopifyCollection,
  ShopifyCollectionsOperation
} from './types';

const key = process.env.REFLOW_API_KEY!;

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
    let requestUrl = `${REFLOW_API_URL}/stores/${process.env.REFLOW_STORE_ID}/${endpoint}`;

    if (method == 'GET' && Object.values(requestData).length) {
      let searchParams = new URLSearchParams({ ...requestData });
      requestUrl = `${requestUrl}?${searchParams.toString()}`;
    }

    const result = await fetch(requestUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        // 'X-Shopify-Storefront-Access-Token': key, // TODO REFLOW KEY WHEN NEEDED IF EVER
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

const removeEdgesAndNodes = (array: Connection<any>) => {
  return array.edges.map((edge) => edge?.node);
};

const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: '0.0',
      currencyCode: 'USD'
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines)
  };
};

const reshapeCollection = (collection: ShopifyCollection): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/search/${collection.handle}`
  };
};

const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)[1];
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`
    };
  });
};

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation,
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines
    },
    cache: 'no-store'
  });
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds
    },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines
    },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function getCart(cartId: string): Promise<Cart | undefined> {
  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
    cache: 'no-store'
  });

  // Old carts becomes `null` when you checkout.
  if (!res.body.data.cart) {
    return undefined;
  }

  return reshapeCart(res.body.data.cart);
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
  const res = await shopifyFetch<ShopifyCollectionOperation>({
    query: getCollectionQuery,
    tags: [TAGS.collections],
    variables: {
      handle
    }
  });

  return reshapeCollection(res.body.data.collection);
}

export async function getProducts(requestBody: ReflowProductsRequestBody): Promise<Product[]> {
  const res = await reflowFetch<ReflowPaginatedProductsResponse>({
    method: 'GET',
    endpoint: 'products/',
    requestData: requestBody
  });

  let products = res.body.data;
  return products;
}

export async function getCollections(): Promise<Collection[]> {
  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery,
    tags: [TAGS.collections]
  });
  const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections);
  const collections = [
    {
      handle: '',
      title: 'All',
      description: 'All products',
      seo: {
        title: 'All',
        description: 'All products'
      },
      path: '/search',
      updatedAt: new Date().toISOString()
    },
    // Filter out the `hidden` collections.
    // Collections that start with `hidden-*` need to be hidden on the search page.
    ...reshapeCollections(shopifyCollections).filter(
      (collection) => !collection.handle.startsWith('hidden')
    )
  ];

  return collections;
}

export async function getCategoriesMenu(): Promise<Menu[]> {
  const menuCategories = process.env.MENU_CATEGORIES?.split(',') || [];
  const productsPath = '/products/';

  let reflowCategories = await reflowFetch<Category[]>({
    method: 'GET',
    endpoint: 'categories/'
  });

  let menuItems = [
    {
      title: 'All Products',
      path: productsPath
    }
  ];

  for (const menuCategory of menuCategories) {
    let category = reflowCategories.body.find((cat) => cat.id == menuCategory);
    if (!category) {
      console.error(`Cannot find menu category with reflow id ${menuCategory}`);
      continue;
    }
    menuItems.push({
      title: category.name,
      path: `${productsPath}/category/${category.id}`
    });
  }

  return menuItems;
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const res = await reflowFetch<Product>({
    method: 'GET',
    endpoint: 'products/' + handle
  });

  let product = res.body;
  return product;
}

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
