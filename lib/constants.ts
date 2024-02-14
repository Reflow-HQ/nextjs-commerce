export type SortFilterItem = {
  title: string;
  slug: string | null;
  orderKey: "price_desc" | "price_asc" | "date_desc" | "custom_desc";
};

export const defaultSort: SortFilterItem = {
  title: "Relevance",
  slug: null,
  orderKey: "custom_desc",
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  { title: "Latest arrivals", slug: "latest-desc", orderKey: "date_desc" },
  { title: "Price: Low to high", slug: "price-asc", orderKey: "price_asc" },
  { title: "Price: High to low", slug: "price-desc", orderKey: "price_desc" },
];

export const TAGS = {
  categories: "categories",
  products: "products",
};

export const DEFAULT_OPTION = "Default Title";
export const REFLOW_API_URL = "https://api.reflowhq.com/v2";
export const REFLOW_TEST_MODE_API_URL = "https://test-api.reflowhq.com/v2";
