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
      type: "image";
      src: ImageSources;
    }
  | {
      id: string;
      type: "video";
      url: string;
    };

export type ReflowCategory = {
  object: "category";
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

export type ReflowProductVariant = {
  id: string;
  sku?: string;
  name: string;
  price: number;
  price_formatted: string;
  in_stock: boolean;
  quantity?: number;
  original_price?: number;
  original_price_formatted?: string;
};

export type ReflowProduct = {
  object: "product";
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
    enabled: boolean;
    option_name: string;
    items: ReflowProductVariant[];
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
    | "name_asc"
    | "name_desc"
    | "price_asc"
    | "price_desc"
    | "date_asc"
    | "date_desc"
    | "custom_asc"
    | "custom_desc";
};

export type ReflowPaginationLinks = {
  first?: string;
  last?: string;
  prev?: string;
  next?: string;
};

export type ReflowPaginationMeta = {
  current_page: number;
  from: number;
  last_page: number;
  links: object;
  path: string;
  per_page: number;
  to: number;
  total: number;
};

export type ReflowPaginatedProducts = {
  data: ReflowProduct[];
  links: ReflowPaginationLinks;
  meta: ReflowPaginationMeta;
};

export type Menu = {
  title: string;
  path: string;
};
