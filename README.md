# Reflow Next.js Commerce

A Next.js 14 ecommerce template featuring:

- Built-in [Reflow](https://reflowhq.com) integration.
- Great performance thanks to Next.js server caching.
- Optional user accounts during checkout.
- Support for Edge Runtime
- Optimized SEO using Next.js's Metadata
- Easy cache revalidation with Reflow webhooks.
- Styling with Tailwind CSS
- Automatic light/dark mode based on system settings

## Store Setup

The store can be configured using the environment variables found in `.evn.example`.

- For local development, make a copy of the `.env.example` file and rename it to `.env`.
- For serverless deployment (e.g. [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/)) enter the environment variables during deployment configuration.

Here is a list of the available env variables:

| Prop                            | Required | Description                                                                                                                                                                                                                     |
| ------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SITE_NAME`                     | _Yes_    | The name of the website. Displayed in various places and used for metadata generation.                                                                                                                                          |
| `COMPANY_NAME`                  | _No_     | The name of your company. Displayed in the website footer.                                                                                                                                                                      |
| `NEXT_PUBLIC_REFLOW_STORE_ID`   | _Yes_    | The ID of your Reflow store. You can obtain it from the URL of your store's overview page in the Reflow website.                                                                                                                |
| `NEXT_PUBLIC_REFLOW_MODE`       | _Yes_    | The mode in which you wish to run this app. Either `live` or `test`. [Learn more](#test-mode)                                                                                                                                   |
| `FEATURED_PRODUCTS_CATEGORY`    | _Yes_    | The ID of a [category](https://reflowhq.com/docs/guide/categories), the products of which you wish to be prominently displayed on the front page.                                                                               |
| `NAV_CATEGORIES`                | _Yes_    | A comma-separated list of category IDs that will be included in the site navigation, e.g. `"1111,2222,3333"`                                                                                                                    |
| `REFLOW_WEBHOOK_SIGNING_SECRET` | _No_     | If using [webhook cache revalidation](#webhook-cache-revalidation) the signing secret is used for verifying the webhook requests. [Learn more](https://reflowhq.com/docs/api/webhooks-integration#verifying-webhook-signatures) |

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control your Reflow store.

## Running Locally

After setting the environment variables in the `.env` file locally, you can run the following command to start the development server.

```bash
npm install
npm run dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

## Production Deployment

In production environments such as [Vercel](https://vercel.com/), the preset Next.js deployment settings should be enough to deploy the app without issues:

- Install command:`npm install`
- Build command: `npm run build`
- Development command:`next`
- Node version : `18.x`
- Root directory: `./`
- Output directory: Next.js default

## Webhook Cache Revalidation

> Note: Next.js cache is disabled when working in a dev environment. This section is applicable only to production builds.

This app takes advantage of Next's server side rendering and aggressive cache to offer the best possible experience to customers. Thanks to the cache, pages that have been visited are saved on the server, after which all subsequent requests are blazing fast.

The only downside is that once the site is cached, any changes in your Reflow store (e.g. adding new products) will not be reflected in your live site.

To revalidate the cache and update the store, a webhook request needs to be sent to `/api/revalidate`. You can learn more about Reflow webhooks and how to activate them from the [docs](https://reflowhq.com/docs/api/webhooks).

Below is an example of a successful revalidation webhook event:

#### Request

```json
{
  "id": "evt_304a10e2bae97d4bd8d981657b5d31df0ac1a53f",
  "object": "event",
  "api-version": "2023-01-30",
  "created": 1708361124,
  "data": {
    "action": "create",
    "items": ["1711595600"]
  },
  "livemode": true,
  "request_id": "req_b4030f2987186dd04a0fca3c8ed716912a9752a7",
  "type": "products.changed"
}
```

#### Response

```json
{
  "body": {
    "now": 1708361125284,
    "cache_revalidated": true
  },
  "status": 200
}
```
