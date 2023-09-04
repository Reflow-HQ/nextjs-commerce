import OpengraphImage from 'components/opengraph-image';
import { getCategory } from 'lib/reflow';

export const runtime = 'edge';

export default async function Image({ params }: { params: { collection: string } }) {
  // TODO: get category route
  return true;

  const collection = await getCategory(params.collection);
  const title = collection?.seo?.title || collection?.title;

  return await OpengraphImage({ title });
}
