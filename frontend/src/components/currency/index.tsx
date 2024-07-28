import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface CurrencyDisplayerProps {
  tokenAmount: number;
  onValueChange: (usdAmount: number, tokenAmount: number) => void;
}

const CurrencyDisplayer: React.FC<CurrencyDisplayerProps> = ({
  tokenAmount,
  onValueChange,
}) => {
  const tokenPriceInUSD = 0.02959; // Example token price
  const [usdAmount, setUsdAmount] = useState<number>(0);

  useEffect(() => {
    const usdValue = tokenAmount * tokenPriceInUSD;
    setUsdAmount(isFinite(usdValue) ? parseFloat(usdValue.toFixed(2)) : 0);
    onValueChange(
      isFinite(usdValue) ? parseFloat(usdValue.toFixed(2)) : 0,
      tokenAmount
    );
  }, [tokenAmount, tokenPriceInUSD]);

  return (
    <div className="mx-auto flex w-52 flex-col items-center">
      <div className="relative mb-2 text-center text-4xl">
        <div className="relative flex justify-center text-6xl">
          ${usdAmount}
        </div>
        <div className="mx-auto mt-2 block text-xs">
          <Button variant={"ghost"} className="mx-auto mt-2 block text-xs">
            {tokenAmount} ETH
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CurrencyDisplayer;
