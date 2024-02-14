"use client";

import { ReflowPaginationMeta } from "lib/reflow/types";
import { createUrl } from "lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function ProductPagination({
  paginationMeta,
}: {
  paginationMeta: ReflowPaginationMeta;
}) {
  return paginationMeta.last_page == 1 ? (
    <></>
  ) : (
    <div className="mt-6 flex flex-row justify-center	">
      {paginationMeta.current_page > 1 ? (
        <PaginationLink
          key="prev"
          page={paginationMeta.current_page - 1}
          text="Previous"
        />
      ) : (
        ""
      )}

      {Array.from({ length: paginationMeta.last_page }, (_, i) => (
        <PaginationLink
          key={i + 1}
          page={i + 1}
          text={(i + 1).toString()}
          current={i + 1 == paginationMeta.current_page}
        />
      ))}

      {paginationMeta.current_page < paginationMeta.last_page ? (
        <PaginationLink
          key="next"
          page={paginationMeta.current_page + 1}
          text="Next"
        />
      ) : (
        ""
      )}
    </div>
  );
}

function PaginationLink({
  page,
  text,
  current = false,
}: {
  page: number;
  text: string;
  current?: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams.toString());
  newParams.delete("page");
  newParams.append("page", page.toString());

  const href = createUrl(pathname, newParams);

  const DynamicTag = current ? "p" : Link;

  return (
    <DynamicTag
      prefetch={!current ? false : undefined}
      href={href}
      className={
        current
          ? "mx-1 rounded border-2 border-solid border-gray-200 bg-gray-200 px-2"
          : "mx-1 rounded border-2 border-solid border-neutral-200 px-2 dark:border-neutral-800"
      }
    >
      {text}
    </DynamicTag>
  );
}
