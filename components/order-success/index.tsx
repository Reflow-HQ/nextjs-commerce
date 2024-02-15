"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function OrderSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderID =
    searchParams.get("order_id") || searchParams.get("session_id");

  useEffect(() => {
    if (!orderID) {
      return router.push("/");
    }
  }, [orderID, router]);

  return (
    <div>
      <div className="basis-full text-xl font-bold">
        We have received your order!
      </div>
      <div className="mt-2 basis-full text-lg">
        Please check your email for order confirmation and details.
      </div>
    </div>
  );
}
