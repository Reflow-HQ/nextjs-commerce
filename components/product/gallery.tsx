"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { GridTileImage } from "components/grid/tile";
import { createUrl } from "lib/utils";
import {
  getYoutubeEmbed,
  getYoutubePreviewImage,
} from "lib/youtube-embed-utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function Gallery({
  media,
}: {
  media: { type: "image" | "video"; src: string; altText: string }[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mediaSearchParam = searchParams.get("media");
  const mediaIndex = mediaSearchParam ? parseInt(mediaSearchParam) : 0;

  const nextSearchParams = new URLSearchParams(searchParams.toString());
  const nextMediaIndex = mediaIndex + 1 < media.length ? mediaIndex + 1 : 0;
  nextSearchParams.set("media", nextMediaIndex.toString());
  const nextUrl = createUrl(pathname, nextSearchParams);

  const previousSearchParams = new URLSearchParams(searchParams.toString());
  const previousMediaIndex =
    mediaIndex === 0 ? media.length - 1 : mediaIndex - 1;
  previousSearchParams.set("media", previousMediaIndex.toString());
  const previousUrl = createUrl(pathname, previousSearchParams);

  const buttonClassName =
    "h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center";

  return (
    <>
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
        {media[mediaIndex] &&
          (media[mediaIndex]?.type == "image" ? (
            <Image
              className="h-full w-full object-contain"
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              alt={media[mediaIndex]?.altText as string}
              src={media[mediaIndex]?.src as string}
              priority={true}
            />
          ) : (
            <iframe
              className="h-full w-full"
              frameBorder="0"
              allowFullScreen={true}
              src={getYoutubeEmbed(media[mediaIndex]?.src)}
            />
          ))}

        {media.length > 1 ? (
          <div className="absolute bottom-[15%] flex w-full justify-center">
            <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur dark:border-black dark:bg-neutral-900/80">
              <Link
                aria-label="Previous"
                href={previousUrl}
                className={buttonClassName}
                scroll={false}
              >
                <ArrowLeftIcon className="h-5" />
              </Link>
              <div className="mx-1 h-6 w-px bg-neutral-500"></div>
              <Link
                aria-label="Next"
                href={nextUrl}
                className={buttonClassName}
                scroll={false}
              >
                <ArrowRightIcon className="h-5" />
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      {media.length > 1 ? (
        <ul className="my-12 flex items-center justify-center gap-2 overflow-auto py-1 lg:mb-0">
          {media.map((media, index) => {
            const isActive = index === mediaIndex;
            const mediaSearchParams = new URLSearchParams(
              searchParams.toString(),
            );

            mediaSearchParams.set("media", index.toString());

            return (
              <li key={media.src} className="h-20 w-20">
                <Link
                  aria-label="Enlarge"
                  href={createUrl(pathname, mediaSearchParams)}
                  scroll={false}
                  className="h-full w-full"
                >
                  <GridTileImage
                    alt={media.altText}
                    src={
                      media.type == "image"
                        ? media.src
                        : getYoutubePreviewImage(media.src).sm
                    }
                    width={80}
                    height={80}
                    active={isActive}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </>
  );
}
