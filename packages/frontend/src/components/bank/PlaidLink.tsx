import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink,
} from "react-plaid-link";
import {
  createLinkToken,
  exchangePublicToken,
} from "@/lib/actions/user.actions";
import Image from "next/image";
import { CombinedUserProfile } from "@/lib/types/dynamic";
import { useAppwriteUser } from "@/hooks/use-fetch-user";
import { useAuthStore } from "@/store/authStore";
import Spinner from "../ui/spinner";
import { updateUserPlaidStatus } from "@/lib/actions/user.actions";

// Define the RequiredEnsUser type
export type RequiredEnsUser = CombinedUserProfile & { ens: any };

interface PlaidLinkProps {
  user: RequiredEnsUser;
  variant?: "primary" | "ghost" | "outline";
  onStart?: () => void;
  onVerified?: () => void;
  onFailed?: () => void;
}

const PlaidLink = ({
  user,
  variant,
  onStart,
  onVerified,
  onFailed,
}: PlaidLinkProps) => {
  const [token, setToken] = useState("");
  const userId = user?.userId;
  const { appwriteUser, loading, error } = useAppwriteUser(userId as string);
  const { setPlaidPortalOpen } = useAuthStore();

  useEffect(() => {
    const getLinkToken = async () => {
      if (appwriteUser) {
        const data = await createLinkToken(appwriteUser as RequiredEnsUser);
        setToken(data?.linkToken);
      }
    };

    if (appwriteUser) {
      getLinkToken();
    }
  }, [appwriteUser]);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token: string) => {
      if (appwriteUser) {
        await exchangePublicToken({
          publicToken: public_token,
          user: appwriteUser as RequiredEnsUser,
        });
        await updateUserPlaidStatus(appwriteUser.$id, true);
        setPlaidPortalOpen(false);
        if (onVerified) onVerified();
      }
    },
    [appwriteUser, onVerified, setPlaidPortalOpen]
  );

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  const handleClick = () => {
    if (onStart) onStart();
    setPlaidPortalOpen(true);
    open();
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    console.error("Error fetching user:", error);
    if (onFailed) onFailed();
    return <Button disabled>Error: Unable to connect bank</Button>;
  }
  return (
    <>
      {variant === "primary" ? (
        <Button
          onClick={handleClick}
          disabled={!ready || !appwriteUser}
          className="plaidlink-primary"
        >
          Connect bank
        </Button>
      ) : variant === "ghost" ? (
        <Button
          onClick={handleClick}
          variant="ghost"
          disabled={!ready || !appwriteUser}
          className="plaidlink-ghost"
        >
          <Image
            src="/icons/connect-bank.svg"
            alt="connect bank"
            width={24}
            height={24}
          />
          <p className="hiddenl text-[16px] font-semibold text-black-2 xl:block">
            Connect bank
          </p>
        </Button>
      ) : variant === "outline" ? (
        <Button
          onClick={handleClick}
          variant="outline"
          size={"xs"}
          disabled={!ready || !appwriteUser}
          className="text-blue-900/60"
        >
          Connect bank
        </Button>
      ) : (
        <Button
          onClick={handleClick}
          disabled={!ready || !appwriteUser}
          className="plaidlink-default"
        >
          <Image
            src="/icons/connect-bank.svg"
            alt="connect bank"
            width={24}
            height={24}
          />
          <p className="text-[16px] font-semibold text-black-2">Connect bank</p>
        </Button>
      )}
    </>
  );
};

export default PlaidLink;
