import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const TransactionHistorySkeleton = () => {
  return (
    <div className="transactions">
      <div className="transactions-header">
        <Skeleton className="w-full h-24 mb-8" />
      </div>

      <div className="space-y-6">
        <div className="transactions-account">
          <div className="flex flex-col gap-2">
            <Skeleton className="w-48 h-6" />
            <Skeleton className="w-64 h-4" />
            <Skeleton className="w-32 h-4" />
          </div>

          <div className="transactions-account-balance">
            <Skeleton className="w-24 h-4 mb-2" />
            <Skeleton className="w-32 h-8" />
          </div>
        </div>

        <section className="flex w-full flex-col gap-6">
          {[...Array(10)].map((_, index) => (
            <Skeleton key={index} className="w-full h-16" />
          ))}
          <div className="my-4 w-full">
            <Skeleton className="w-full h-12" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default TransactionHistorySkeleton;
