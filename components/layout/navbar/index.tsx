import LogoSquare from "components/logo-square";
import { getNavigationMenu } from "lib/reflow";
import { Menu } from "lib/reflow/types";
import Link from "next/link";
import MobileMenu from "./mobile-menu";
import Search from "./search";
const { SITE_NAME } = process.env;

import dynamic from "next/dynamic";

const DynamicOpenCart = dynamic(() => import("./open-cart"), {
  ssr: false,
});

export default async function Navbar() {
  const menu = await getNavigationMenu();

  return (
    <nav className="relative mb-2 flex items-center justify-between p-4 md:px-6">
      <div className="block flex-none md:hidden">
        <MobileMenu menu={menu} />
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex w-1/2">
          <Link
            href="/"
            className="ml-4 mr-4 flex w-full items-center justify-start md:ml-0 md:w-auto lg:mr-6"
          >
            <LogoSquare />
            <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">
              {SITE_NAME}
            </div>
          </Link>
          {menu.length ? (
            <ul className="hidden gap-6 text-sm md:flex md:items-center">
              {menu.map((item: Menu) => (
                <li key={item.title}>
                  <Link
                    href={item.path}
                    className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="flex w-1/2 items-center justify-end">
          <div className="hidden w-full justify-end md:flex">
            <Search />
          </div>
          <div className="ml-4 flex w-10 justify-end">
            <DynamicOpenCart />
          </div>
        </div>
      </div>
    </nav>
  );
}
