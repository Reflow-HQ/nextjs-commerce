import { REFLOW_API_URL, REFLOW_TEST_MODE_API_URL, TAGS } from "lib/constants";
import { ReflowApiError } from "lib/type-guards";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  Menu,
  ReflowCategory,
  ReflowPaginatedProducts,
  ReflowProduct,
  ReflowProductsRequestBody,
  SearchCategory,
} from "./types";

export async function reflowFetch<T>({
  headers,
  endpoint,
  method,
  requestData = {},
  tags,
}: {
  headers?: HeadersInit;
  endpoint?: string;
  method?: "GET" | "POST" | "DELETE";
  requestData?: object;
  tags?: string[];
}): Promise<{ status: number; body: T } | never> {
  try {
    const apiURL =
      process.env.NEXT_PUBLIC_REFLOW_MODE == "live"
        ? REFLOW_API_URL
        : REFLOW_TEST_MODE_API_URL;

    let requestUrl = `${apiURL}/projects/${process.env.NEXT_PUBLIC_REFLOW_PROJECT_ID}/${endpoint}`;

    if (method == "GET" && Object.values(requestData).length) {
      const searchParams = new URLSearchParams({ ...requestData });
      requestUrl = `${requestUrl}?${searchParams.toString()}`;
    }

    const result = await fetch(requestUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: method == "POST" ? JSON.stringify(requestData) : null,
      ...(tags && { next: { tags } }),
    });

    const body = await result.json();

    if (!result.ok) {
      const err = new ReflowApiError(body.error || "HTTP error");
      err.endpoint = requestUrl;
      err.status = result.status;
      err.body = body;
      throw err;
    }

    return {
      status: result.status,
      body,
    };
  } catch (e) {
    if (e instanceof ReflowApiError) {
      throw {
        endpoint: e.endpoint,
        status: e.status || 500,
        body: e.body,
      };
    }

    throw {
      error: e,
    };
  }
}

export async function getCategory(
  handle: string,
): Promise<ReflowCategory | undefined> {
  const res = await reflowFetch<ReflowCategory>({
    method: "GET",
    endpoint: "categories/" + handle,
    tags: [TAGS.categories],
  });

  const category = res.body;
  return category;
}

export async function getProducts(
  requestBody: ReflowProductsRequestBody,
): Promise<ReflowPaginatedProducts> {
  const tags = [TAGS.products];
  if (requestBody.category) tags.push(TAGS.categories);

  const res = await reflowFetch<ReflowPaginatedProducts>({
    method: "GET",
    endpoint: "products/",
    requestData: requestBody,
    tags,
  });

  return res.body;
}

export async function getProduct(
  handle: string,
): Promise<ReflowProduct | undefined> {
  const res = await reflowFetch<ReflowProduct>({
    method: "GET",
    endpoint: "products/" + handle,
    tags: [TAGS.products],
  });

  const product = res.body;
  return product;
}

export async function getSearchCategories(): Promise<SearchCategory[]> {
  const featuredCategoryID = process.env.FEATURED_PRODUCTS_CATEGORY;
  const reflowCategories = await reflowFetch<ReflowCategory[]>({
    method: "GET",
    endpoint: "categories/",
    tags: [TAGS.categories],
  });
  const categories = [
    {
      handle: "",
      title: "All",
      path: "/search",
      updatedAt: new Date().toISOString(),
    },
    ...reflowCategories.body
      .map((category: ReflowCategory) => ({
        handle: category.id,
        title: category.name,
        path: `/search/${category.id}`,
        updatedAt: new Date().toISOString(),
      }))
      .sort((a, b) => {
        if (a.handle == featuredCategoryID) return -1;
        if (b.handle == featuredCategoryID) return 1;
        return 0;
      }),
  ];

  return categories;
}

export async function getNavigationMenu(): Promise<Menu[]> {
  const navigation = process.env.NAV_CATEGORIES?.split(",") || [];
  const pagePath = "/search/";

  const reflowCategories = await reflowFetch<ReflowCategory[]>({
    method: "GET",
    endpoint: "categories/",
    tags: [TAGS.categories],
  });

  const menuItems = [
    {
      title: "All Products",
      path: pagePath,
    },
  ];

  for (const navCategory of navigation) {
    const category = reflowCategories.body.find((cat) => cat.id == navCategory);
    if (!category) {
      console.error(`Cannot find menu category with reflow id ${navCategory}`);
      continue;
    }
    menuItems.push({
      title: category.name,
      path: `${pagePath}${category.id}`,
    });
  }

  return menuItems;
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Reflow,
  // otherwise it will continue to retry the request.

  const body = await req.json();

  // Validate event signature
  const signatureSecret = process.env.REFLOW_WEBHOOK_SIGNING_SECRET;
  if (signatureSecret) {
    try {
      const receivedSignature = headers().get("signature") || "unknown";
      const computedSignature = await getComputedSignature(
        signatureSecret,
        JSON.stringify(body),
      );

      if (computedSignature !== receivedSignature) {
        console.error("Invalid webhook signed signature.");
        return NextResponse.json(
          {
            response: "Invalid webhook signed signature",
            cache_revalidated: false,
          },
          { status: 200 },
        );
      }
    } catch (error) {
      console.error("Error calculating signed signature");
      return NextResponse.json(
        {
          response: "Error calculating signed signature",
          cache_revalidated: false,
        },
        { status: 200 },
      );
    }
  } else {
    console.warn(
      "Webhook signing secret not defined in .env file. Revalidation requests are not verified.",
    );
  }

  const isCategoriesUpdate = body?.type == "categories.changed";
  const isProductUpdate = body?.type == "products.changed";

  if (!isCategoriesUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json(
      {
        response: "This event does not require cache revalidation",
        cache_revalidated: false,
      },
      { status: 200 },
    );
  }

  if (isCategoriesUpdate) {
    revalidateTag(TAGS.categories);
  }

  if (isProductUpdate) {
    // Revalidate only if the webhook event livemode matches the one from .env.

    const appIsLiveMode = process.env.NEXT_PUBLIC_REFLOW_MODE == "live";
    const webhookIsLiveMode = body.livemode;

    if (appIsLiveMode != webhookIsLiveMode) {
      return NextResponse.json(
        {
          response:
            "This request does not match the .env testmode configuration.",
          cache_revalidated: false,
        },
        { status: 200 },
      );
    }

    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ cache_revalidated: true, now: Date.now() });
}

async function getComputedSignature(key: string, event: string) {
  const encoder = new TextEncoder();
  const encodedKey = encoder.encode(key);
  const encodedData = encoder.encode(event);

  const importedKey = await crypto.subtle.importKey(
    "raw",
    encodedKey,
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign"],
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    importedKey,
    encodedData,
  );
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const computedSignature = signatureArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return computedSignature;
}
