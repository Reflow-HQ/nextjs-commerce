import Footer from "components/layout/footer";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const DynamicCart = dynamic(() => import("components/cart"), {
  ssr: false,
});

export const runtime = "edge";

export const metadata = {
  title: "Cart",
  description: "View shopping cart and checkout.",
};

export default async function CartPage() {
  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4 md:px-6">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-4 md:p-8 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
          <div className="basis-full">
            <DynamicCart />
          </div>
        </div>
      </div>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
