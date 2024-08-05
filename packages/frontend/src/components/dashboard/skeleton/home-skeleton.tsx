import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const HomeSkeleton = () => {
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <Skeleton className="w-full h-24 mb-4" />
          <Skeleton className="w-full h-32" />
        </header>

        <div className="mt-8">
          <Skeleton className="w-full h-12 mb-4" />
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="w-full h-24" />
            ))}
          </div>
        </div>
      </div>
      <div className="w-64 ml-4">
        <Skeleton className="w-full h-screen" />
      </div>
    </section>
  );
};

export default HomeSkeleton;
