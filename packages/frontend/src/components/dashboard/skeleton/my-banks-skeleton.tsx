import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const MyBanksSkeleton = () => {
  return (
    <section className="flex">
      <div className="my-banks w-full">
        <Skeleton className="w-full h-24 mb-8" />

        <div className="space-y-4">
          <Skeleton className="w-48 h-8" />
          <div className="flex flex-wrap gap-6">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="w-64 h-40" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyBanksSkeleton;
