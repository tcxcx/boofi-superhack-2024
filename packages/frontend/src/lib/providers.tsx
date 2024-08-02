"use client";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import type { Session } from "next-auth";
import { config } from "@/store/wagmi";
import { BitcoinWalletConnectors } from "@dynamic-labs/bitcoin";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import {
  DynamicContextProvider,
  getAuthToken,
} from "@dynamic-labs/sdk-react-core";
import { APP_NAME, APP_LOGO_URL } from "@/lib/constants";
import { getCsrfToken, getSession } from "next-auth/react";

import { Wallet, HandleConnectedWallet } from "@dynamic-labs/sdk-react-core";
import {
  ExtendedUserProfile,
  ExtendedUserProfileWithSetProperties,
  UserOnboardingFieldRequest,
} from "@/lib/types/dynamic";

const queryClient = new QueryClient();

interface ProvidersProps {
  children?: React.ReactNode;
  session: Session | null;
}

export const Providers = ({ children, session }: ProvidersProps) => {
  const handleUserVerification = async (user: ExtendedUserProfile) => {
    if (!user.worldIdVerified || !user.plaidConnected) {
      // Set properties to indicate that verification is needed
      if ("setProperties" in user) {
        await (user as ExtendedUserProfileWithSetProperties).setProperties({
          worldIdVerified: user.worldIdVerified || false,
          plaidConnected: user.plaidConnected || false,
          kycVerificationNeeded: true,
        });
      }
      return false;
    }
    return true;
  };

  const handleSessionAuthentication = async (user: ExtendedUserProfile) => {
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
    <SessionProvider session={session}>
      <DynamicContextProvider
        settings={{
          appName: APP_NAME,
          appLogoUrl: APP_LOGO_URL,
          environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
          walletConnectors: [EthereumWalletConnectors, BitcoinWalletConnectors],
          handlers: {
            handleConnectedWallet: (async (wallet: Wallet) => {
              console.log("handleConnectedWallet was called", wallet);
              // At this stage, we don't have access to the user object yet
              // We'll return true to allow the connection process to continue
              return false;
            }) as HandleConnectedWallet,

            handleVerifiedUser: async (args: { user: ExtendedUserProfile }) => {
              console.log("handleVerifiedUser was called", args);
              const user = args.user;

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
              const user = event.user as ExtendedUserProfile;
              console.log("Auth success, user:", user);
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
    </SessionProvider>
  );
};
