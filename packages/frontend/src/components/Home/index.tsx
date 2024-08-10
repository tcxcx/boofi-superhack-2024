"use client";

import React, { useEffect } from "react";
import { Translations } from "@/lib/types/translations";
import PaymentLink from "../payment-link-card";
import { useAccount, useConnect, useSwitchChain } from "wagmi";
import { getNetwork } from "@dynamic-labs/sdk-react-core";
import { celoAlfajores } from "viem/chains";
import { useAuthStore } from "@/store/authStore";
import { initialSync } from "@/lib/actions/sync-db";

interface HomeContentProps {
  translations: Translations["Home"];
}

declare global {
  interface IEthereum {
    isMiniPay?: boolean;
  }
}

export const HomeContent: React.FC<HomeContentProps> = ({ translations }) => {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { switchChain } = useSwitchChain();
  const { isMiniPay, setMiniPay, setUserAddress } = useAuthStore();
  
  useEffect(() => {
    async function syncData() {
      try {
        await initialSync();
      } catch (error) {
        console.error("Initial sync failed:", error);
      }
    }

    syncData();
  }, []);

  useEffect(() => {
    const checkMiniPay = async () => {
      if (
        typeof window !== "undefined" &&
        window.ethereum &&
        (window.ethereum as IEthereum).isMiniPay
      ) {
        setMiniPay(true);

        const connector = connectors[0];
        if (connector) {
          await connect({ connector });

          // Only switch the chain if MiniPay is detected
          const networkId = await getNetwork(null);
          if (networkId !== celoAlfajores.id) {
            await switchChain({ chainId: celoAlfajores.id });
          }

          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
            params: [],
          });
          if (accounts && accounts.length > 0) {
            setUserAddress(accounts[0]);
          }
        }
      }
    };

    checkMiniPay();
  }, [connect, connectors, switchChain, setMiniPay, setUserAddress]);

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
          {isMiniPay && (
            <p className="text-green-500 font-bold mb-4">MiniPay detected!</p>
          )}
          {!isMiniPay && (
            <p className="hidden text-red-500 font-bold mb-4">
              MiniPay not detected.
            </p>
          )}
          <PaymentLink />
        </div>
      </div>
    </div>
  );
};
