import OpengraphImage from "components/opengraph-image";
import { getCategory } from "lib/reflow";

export const runtime = "edge";

export default async function Image({
  params,
}: {
  params: { category: string };
}) {
  const category = await getCategory(params.category);
  const title = category?.name;

  return await OpengraphImage({ title });
}
