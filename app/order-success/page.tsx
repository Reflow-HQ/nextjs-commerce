import Footer from "components/layout/footer";
import OrderSuccess from "components/order-success";
import { Suspense } from "react";

export const runtime = "edge";

export const metadata = {
  title: "Order Success",
  description:
    "Displays information about the placed order after a checkout is completed.",
};

export default async function OrderSuccessPage() {
  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="py-50 flex flex-col place-content-center rounded-lg border border-neutral-200 bg-white p-8 text-center md:p-12 md:py-40 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
          <OrderSuccess />
        </div>
      </div>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
