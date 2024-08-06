"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "@/store/wagmi";
import { BitcoinWalletConnectors } from "@dynamic-labs/bitcoin";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import {
  DynamicContextProvider,
  getAuthToken,
  UserProfile,
} from "@dynamic-labs/sdk-react-core";
import { APP_NAME, APP_LOGO_URL } from "@/lib/constants";
import { getCsrfToken, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Wallet, HandleConnectedWallet } from "@dynamic-labs/sdk-react-core";
import {
  CombinedUserProfile,
  CombinedUserProfileWithSetProperties,
} from "@/lib/types/dynamic";
import { useAuthStore } from "@/store/authStore";

const queryClient = new QueryClient();

interface ProvidersProps {
  children?: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  const router = useRouter();
  const setUserId = useAuthStore((state) => state.setUserId);

  const handleUserVerification = async (user: CombinedUserProfile) => {
    if (!user.worldIdVerified || !user.plaidConnected) {
      // Set properties to indicate that verification is needed
      if ("setProperties" in user) {
        await (user as CombinedUserProfileWithSetProperties).setProperties({
          worldIdVerified: user.worldIdVerified || false,
          plaidConnected: user.plaidConnected || false,
          kycVerificationNeeded: true,
        });
      }
      return false;
    }
    return true;
  };

  const handleSessionAuthentication = async (user: CombinedUserProfile) => {
    const authToken = getAuthToken();
    const csrfToken = await getCsrfToken();
    if (!csrfToken) {
      console.error("CSRF token not found");
      return;
    }

    try {
      const response = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `csrfToken=${encodeURIComponent(
          csrfToken
        )}&token=${encodeURIComponent(authToken)}`,
      });

      if (response.ok) {
        await getSession();
        console.log("Logged in successfully");
      } else {
        console.error("Failed to log in");
      }
    } catch (error) {
      console.error("Error logging in", error);
    }
  };

  return (
    <DynamicContextProvider
      settings={{
        appName: APP_NAME,
        appLogoUrl: APP_LOGO_URL,
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,

        walletConnectors: [EthereumWalletConnectors, BitcoinWalletConnectors],
        recommendedWallets: [
          { walletKey: "coinbaseWallet", label: "Coinbase Wallet" },
        ],
        handlers: {
          handleConnectedWallet: (async (wallet: Wallet) => {
            return false;
          }) as HandleConnectedWallet,

          handleVerifiedUser: async (args: { user: UserProfile }) => {
            const user = args.user as CombinedUserProfile;

            const isVerified = await handleUserVerification(user);
            if (isVerified) {
              await handleSessionAuthentication(user);
            } else {
              console.log("User needs to complete verification");
            }
          },
        },
        events: {
          onAuthSuccess: async (event) => {
            const user = event.user as CombinedUserProfile;
            console.log("Auth success, user:", user);
            setUserId(user.id);
          },
        },
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
};
