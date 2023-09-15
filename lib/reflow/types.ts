export type Maybe<T> = T | null;

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

export type ReflowCategory = {
  object: 'category';
  id: string;
  handle: string;
  name: string;
  description: string;
  subcategories: object[];
};

export type SearchCategory = {
  handle: string;
  title: string;
  path: string;
  updatedAt: string;
};

export type ReflowProduct = {
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
  variants: {
    enabled: boolean,
    option_name: string,
    items: object[]
  };
  categories: ReflowCategory[];
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
  data: ReflowProduct[];
  links: object; // Pagination links
  meta: object; // Pagination metadata
};

export type Menu = {
  title: string;
  path: string;
};