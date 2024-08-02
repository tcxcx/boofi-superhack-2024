"use client";

import { GridPattern } from "@/components/grid-pattern";
import { AuthFlow } from "./AuthFlow";
export const Wallet: React.FC = () => {
  const gridBlocks = [
    [2, 5],
    [3, 1],
    [4, 3],
  ];

  return (
    <div className="w-full bg-zinc-900/10">
      <div className="dark:border-stone-800/40 border-stone-600/40 overflow-hidden relative bg-gradient-to-r from-indigo-200 via-cyan-200 to-indigo-300 dark:bg-gradient-to-r dark:from-indigo-800/5 dark:via-pink-800 dark:to-stone-800/20 hover:border-primary/40 dark:hover:border-stone-800/90 border p-4 rounded-xl w-full min-h-[384px] sm:h-full flex flex-col flex-1 transition-colors duration-300 ease-in-out delay-50">
        <GridPattern
          size={75}
          offsetX={0}
          offsetY={0}
          className="absolute -top-1/4 right-1 h-[200%] w-2/3 skew-y-12 dark:stroke-white/10 stroke-indigo-600/20 stroke-[2] [mask-image:linear-gradient(-85deg,black,transparent)]"
        >
          {gridBlocks.map(([row, column], index) => (
            <GridPattern.Block
              key={index}
              row={row}
              column={column}
              className="dark:fill-white/2.5 fill-indigo-600/2.5 transition duration-800 hover:fill-primary"
            />
          ))}
        </GridPattern>
        <div className="mb-4 pt-10 lg:pt-2"></div>
        <AuthFlow />
      </div>
    </div>
  );
};
