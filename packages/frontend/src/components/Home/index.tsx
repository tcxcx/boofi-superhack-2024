"use client";

import React, { useState, useEffect } from "react";
import { Translations } from "@/lib/types/translations";
import PaymentLink from "../payment-link-card";
import { useAccount, useConnect, useSwitchChain } from "wagmi";
import { getNetwork } from "@dynamic-labs/sdk-react-core";
import { celoAlfajores } from "viem/chains";

interface HomeContentProps {
  translations: Translations["Home"];
}

// Extend the existing IEthereum interface instead of redeclaring Window
declare global {
  interface IEthereum {
    isMiniPay?: boolean;
  }
}

export const HomeContent: React.FC<HomeContentProps> = ({ translations }) => {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { switchChain } = useSwitchChain();
  const [isMiniPay, setIsMiniPay] = useState(false);

  useEffect(() => {
    const checkMiniPay = async () => {
      if (
        typeof window !== "undefined" &&
        window.ethereum &&
        (window.ethereum as IEthereum).isMiniPay
      ) {
        setIsMiniPay(true);

        const connector = connectors[0];
        if (connector) {
          await connect({ connector });

          // Replace `null` with the actual walletConnector instance you're using
          const networkId = await getNetwork(null);
          if (networkId && networkId !== celoAlfajores.id) {
            await switchChain({ chainId: celoAlfajores.id });
          }
        }
      }
    };

    checkMiniPay();
  }, [connect, connectors, switchChain]);

  const renderSlogan = () => (
    <p className="text-lg mb-8">
      <span className="text-purple-400">{translations.slogan.part1}</span>{" "}
      <span className="font-clash">
        {" "}
        {translations.slogan.part2}
        {translations.slogan.part3}{" "}
      </span>
      <span className="text-purple-400">{translations.slogan.part4}</span>.
    </p>
  );

  if (!isConnected && !isMiniPay) {
    return (
      <div className="p-4 overflow-hidden min-h-screen flex flex-col items-center justify-center">
        <div className="relative flex flex-col items-center justify-center w-full ">
          <div className="relative z-10 text-center bg-background dark:bg-background rounded-lg shadow-lg p-8 max-w-md w-full border-2 border-black dark:border-white">
            <h1 className="text-4xl font-bold m-4 text-primary dark:text-white">
              {translations.welcome}
            </h1>
            <p className="text-lg mb-8">
              {translations.to}
              <br />
              <span className="inline-block font-clash bg-gradient-to-r text-7xl from-indigo-300 via-purple-400 to-cyan-300 bg-clip-text text-transparent">
                BooFi
              </span>
            </p>
            {renderSlogan()}
            <p className="text-lg mb-8">
              Please connect your wallet <span className="text-3xl">👻</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 overflow-hidden min-h-screen flex flex-col items-center justify-center">
      <div className="relative flex flex-col items-center justify-center w-full ">
        <div className="relative z-1 text-center bg-background dark:bg-background rounded-lg shadow-lg p-8 max-w-md w-full border-2 border-black dark:border-white">
          <PaymentLink />
        </div>
      </div>
    </div>
  );
};
