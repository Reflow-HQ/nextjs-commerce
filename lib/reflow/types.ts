export type Maybe<T> = T | null;

export type Connection<T> = {
  edges: Array<Edge<T>>;
};

export type Edge<T> = {
  node: T;
};

export type NonEmptyArray<Type> = [Type, ...Array<Type>];

export type Currency = {
  code: string;
  name: string;
  zero_decimal: boolean;
};

export type ImageSources = {
  sm: string;
  md: string;
  lg: string;
};

export type Media =
  | {
      id: string;
      type: 'image';
      src: ImageSources;
    }
  | {
      id: string;
      type: 'video';
      url: string;
    };

export type Category = {
  object: 'category';
  id: string;
  name: string;
  subcategories: object[];
};

export type Product = {
  object: 'product';
  id: string;
  name: string;
  handle?: string;
  excerpt?: string;
  description?: string;
  description_html?: string;
  promo_badge?: string;
  currency: Currency;
  price: number;
  price_formatted: string;
  price_range: NonEmptyArray<number>;
  price_range_formatted: string;
  image: ImageSources;
  media: Media[];
  variants: object;
  categories: Category[];
  inventory_type: string;
  in_stock: boolean;
  available_quantity?: number;
  personalization: object;
  min_quantity?: number;
  max_quantity?: number;
  on_sale: object;
  sku?: string;
  livemode: boolean;
};

export type ReflowProductsRequestBody = {
  page?: number;
  perpage?: number;
  category?: string;
  search?: string;
  order?:
    | 'name_asc'
    | 'name_desc'
    | 'price_asc'
    | 'price_desc'
    | 'date_asc'
    | 'date_desc'
    | 'custom_asc'
    | 'custom_desc';
};

export type ReflowPaginatedProductsResponse = {
  data: Product[];
  links: object; // Pagination links
  meta: object; // Pagination metadata
};

// _------------------------------------

export type Cart = Omit<ShopifyCart, 'lines'> & {
  lines: CartItem[];
};

export type CartItem = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: Product;
  };
};

export type Collection = ShopifyCollection & {
  path: string;
};

export type Menu = {
  title: string;
  path: string;
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
};

export type SEO = {
  title: string;
  description: string;
};

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: Connection<CartItem>;
  totalQuantity: number;
};

export type ShopifyCollection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  updatedAt: string;
};

export type ShopifyCartOperation = {
  data: {
    cart: ShopifyCart;
  };
  variables: {
    cartId: string;
  };
};

export type ShopifyCreateCartOperation = {
  data: { cartCreate: { cart: ShopifyCart } };
};

export type ShopifyAddToCartOperation = {
  data: {
    cartLinesAdd: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type ShopifyRemoveFromCartOperation = {
  data: {
    cartLinesRemove: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lineIds: string[];
  };
};

export type ShopifyUpdateCartOperation = {
  data: {
    cartLinesUpdate: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      id: string;
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type ShopifyCollectionOperation = {
  data: {
    collection: ShopifyCollection;
  };
  variables: {
    handle: string;
  };
};

export type ShopifyCollectionsOperation = {
  data: {
    collections: Connection<ShopifyCollection>;
  };
};
