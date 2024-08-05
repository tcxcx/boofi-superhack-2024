import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const PaymentTransferSkeleton = () => {
  return (
    <section className="payment-transfer">
      <Skeleton className="w-full h-24 mb-8" />

      <section className="size-full pt-5">
        <div className="space-y-6">
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-36" />
          <Skeleton className="w-48 h-12" />
        </div>
      </section>
    </section>
  );
};

export default PaymentTransferSkeleton;
