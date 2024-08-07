import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import styled from "styled-components";
import { Eth } from "@styled-icons/crypto/Eth";
import { Usdc } from "@styled-icons/crypto/Usdc";
import { Dai } from "@styled-icons/crypto/Dai";
import { Usdt } from "@styled-icons/crypto/Usdt";
import { z } from "zod";
import { InputMoney } from "@/components/ui/input";

interface CurrencyDisplayerProps {
  tokenAmount: number;
  onValueChange: (usdAmount: number, tokenAmount: number) => void;
}

const tokenPriceInUSD = 0.02959; // Example token price

const currencySchema = z.object({
  amount: z.number().min(0, "Amount must be a positive number"),
  token: z.string(),
});

const CurrencyDisplayer: React.FC<CurrencyDisplayerProps> = ({
  tokenAmount,
  onValueChange,
}) => {
  const [usdAmount, setUsdAmount] = useState<number>(0);
  const [selectedToken, setSelectedToken] = useState<string>("ETH");
  const [inputValue, setInputValue] = useState<number>(0);
  const [errors, setErrors] = useState<string | null>(null);

  useEffect(() => {
    const usdValue = tokenAmount * tokenPriceInUSD;
    setUsdAmount(isFinite(usdValue) ? parseFloat(usdValue.toFixed(2)) : 0);
    onValueChange(
      isFinite(usdValue) ? parseFloat(usdValue.toFixed(2)) : 0,
      tokenAmount
    );
  }, [tokenAmount]);

  const EthIcon = styled(Eth)`
    color: #627eea;
    &:hover,
    &:active {
      color: #627eea;
    }
  `;

  const UsdcIcon = styled(Usdc)`
    color: #2775ca;
    &:hover,
    &:active {
      color: #2775ca;
    }
  `;

  const DaiIcon = styled(Dai)`
    color: #f4b731;
    &:hover,
    &:active {
      color: #f4b731;
    }
  `;

  const UsdtIcon = styled(Usdt)`
    color: #26a17b;
    &:hover,
    &:active {
      color: #26a17b;
    }
  `;

  const handleSelectChange = (value: string) => {
    setSelectedToken(value.toUpperCase());
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    const result = currencySchema.safeParse({
      amount: value,
      token: selectedToken,
    });

    if (result.success) {
      setErrors(null);
      setInputValue(value);
      const usdValue = value * tokenPriceInUSD;
      setUsdAmount(isFinite(usdValue) ? parseFloat(usdValue.toFixed(2)) : 0);
      onValueChange(
        isFinite(usdValue) ? parseFloat(usdValue.toFixed(2)) : 0,
        value
      );
    } else {
      setErrors(result.error.errors[0].message);
    }
  };

  return (
    <div className="mx-auto flex w-52 flex-col items-center">
      <div className="relative mb-2 text-center text-4xl">
        <div className="relative flex justify-center text-6xl">
          <InputMoney
            placeholder="$0"
            value={inputValue}
            onChange={handleInputChange}
            className="text-center w-full"
          />
        </div>
        {errors && <div className="text-red-500 text-xs">{errors}</div>}
        <div className="flex justify-between mt-2 w-full">
          <Button variant={"link"} className="text-xs">
            Available balance: {tokenAmount}{" "}
            <span className="uppercase ml-1">{selectedToken}</span>
          </Button>
          <Button variant={"link"} className="text-xs uppercase">
            Max
          </Button>
        </div>
        <div className="mx-auto mt-2 inline-block text-xs">
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger className="w-auto justify-between px-4 space-x-2 mx-auto mt-2">
              <SelectValue placeholder="Select a currency" />
            </SelectTrigger>
            <SelectContent className="w-full justify-between">
              <SelectGroup className="justify-stretch">
                <SelectLabel>Stablecoins</SelectLabel>
                <SelectItem value="usdc">
                  <UsdcIcon size={20} /> USDC
                </SelectItem>
                <SelectItem value="dai" disabled>
                  <DaiIcon size={20} /> DAI
                </SelectItem>
                <SelectItem value="usdt" disabled>
                  <UsdtIcon size={20} /> USDT
                </SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Cryptocurrencies</SelectLabel>
                <SelectItem value="eth">
                  <EthIcon size={20} /> Ethereum (ETH)
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default CurrencyDisplayer;
