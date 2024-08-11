"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { cn, formUrlQuery } from "@/utils";
import { useCallback } from "react";

interface WalletTabItemProps {
  wallet: string;
}

export const WalletTabItem = ({ wallet }: WalletTabItemProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isActive = searchParams.get("id") === wallet;

  const truncateHash = useCallback(
    (hash: string | undefined | null): string => {
      if (!hash) return "";
      if (hash.length > 10) {
        return `${hash.slice(0, 7)}...${hash.slice(-4)}`;
      }
      return hash;
    },
    []
  );

  const handleWalletChange = () => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: wallet,
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <div
      onClick={handleWalletChange}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer card",
        {
          " text-indigo-600": isActive,
          "text-gray-500 hover:shadow-sm": !isActive,
        }
      )}
    >
      <div className="flex-center h-fit rounded-full">
        <div
          className={cn(
            "w-6 h-6 flex items-center justify-center rounded-full",
            {
              "bg-indigo-600": isActive,
              "bg-gray-300": !isActive,
            }
          )}
        >
          <span className="text-white text-xs font-bold">
            {truncateHash(wallet).slice(0, 2)}
          </span>
        </div>
      </div>
      <p
        className={cn("text-16 font-medium", {
          "text-indigo-600": isActive,
          "text-gray-500": !isActive,
        })}
      >
        {truncateHash(wallet)}
      </p>
    </div>
  );
};
