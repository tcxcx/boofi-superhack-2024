import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Link from "next/link";
import {
  DynamicEmbeddedWidget,
  useDynamicContext,
  useIsLoggedIn,
  DynamicNav,
} from "@dynamic-labs/sdk-react-core";
import { Portal } from "@/components/Portal";
import { Widget } from "./Widget";
import { CombinedUserProfile } from "@/lib/types/dynamic";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/authStore";
import PlaidLink from "@/components/bank/PlaidLink";
import { useLocale } from "next-intl";

export function WidgetContainer() {
  const { user } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();
  const router = useRouter();
  const { data: session } = useSession();
  const {
    isDialogOpen,
    isDialogVisible,
    isWorldIdVerifying,
    setDialogOpen,
    setDialogVisible,
    setWorldIdVerifying,
    setPlaidVerifying,
    isPlaidVerifying,
    isPlaidPortalOpen,
    setPlaidPortalOpen,
    isVerified,
  } = useAuthStore();

  const needsVerification =
    isLoggedIn &&
    (session?.sessionLevel !== 2 ||
      (user as CombinedUserProfile)?.newUser ||
      !session?.user.verificationStatus?.worldIdVerified ||
      !(user as CombinedUserProfile)?.plaidConnected);

  const handleWorldIdStart = () => {
    setWorldIdVerifying(true);
  };

  const locale = useLocale();

  const handleWorldIdClose = (success: boolean) => {
    setWorldIdVerifying(false);
    if (success && !needsVerification) {
      setDialogVisible(true);
      setDialogOpen(false);
    }
  };

  const handlePlaidStart = () => {
    setPlaidVerifying(true);
    setDialogVisible(false);
  };

  const handlePlaidClose = (success: boolean) => {
    setPlaidVerifying(false);
    setPlaidPortalOpen(false);
    if (success && !needsVerification) {
      setDialogVisible(true);
      setDialogOpen(false);
    } else {
      setDialogVisible(true);
    }
  };

  const goToDashboard = () => {
    if (user && user.userId) {
      console.log("Navigating to dashboard with user ID:", user.userId);
      const path = `/${locale}/dashboard?userId=${user.userId}`;
      router.push(path);
    } else {
      console.error("User ID not available");
    }
  };
  return (
    <div className="flex items-center space-x-2">
      <DynamicNav />
      {!isLoggedIn && (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="px-4 py-2 text-xs rounded-md bg-indigo-400 text-white dark:bg-indigo-600 dark:text-gray-900 transition-colors duration-200 hover:bg-indigo-500 dark:hover:bg-indigo-300">
              Login / Signup
            </Button>
          </DialogTrigger>
          <Portal id="login-dialog-portal">
            <DialogContent className="sm:max-w-[700px]">
              <div className="widget-container">
                <DialogTitle className="sr-only">
                  Welcome to BooFi Finance
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Please sign in or sign up to continue.
                </DialogDescription>
                <DynamicEmbeddedWidget />
              </div>
            </DialogContent>
          </Portal>
        </Dialog>
      )}
      {isLoggedIn && (
        <>
          {needsVerification && !isVerified ? (
            <>
              {isDialogVisible && (
                <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="px-4 py-2 text-xs rounded-md bg-indigo-400 text-white dark:bg-indigo-600 dark:text-white transition-colors duration-200 hover:bg-indigo-500 dark:hover:bg-indigo-300">
                      Complete Verification
                    </Button>
                  </DialogTrigger>
                  <Portal id="verification-dialog-portal">
                    <DialogContent className="sm:max-w-[700px] z-10">
                      <Widget
                        needsVerification={needsVerification}
                        isWorldIdVerifying={isWorldIdVerifying}
                        isPlaidVerifying={isPlaidVerifying}
                        onWorldIdStart={handleWorldIdStart}
                        onWorldIdClose={handleWorldIdClose}
                        onPlaidStart={handlePlaidStart}
                        onPlaidClose={handlePlaidClose}
                        sessionLevel={session?.sessionLevel}
                      />
                    </DialogContent>
                  </Portal>
                </Dialog>
              )}
              {isPlaidPortalOpen && (
                <Portal id="plaid-portal">
                  <div
                    className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50"
                    onClick={() => setPlaidPortalOpen(false)}
                  >
                    <PlaidLink
                      user={user as CombinedUserProfile}
                      variant="outline"
                      onStart={handlePlaidStart}
                      onVerified={() => handlePlaidClose(true)}
                      onFailed={() => handlePlaidClose(false)}
                    />
                  </div>
                </Portal>
              )}
            </>
          ) : (
            <Link href={`/${locale}/dashboard?userId=${user?.userId}`} passHref>
              <Button>Dashboard</Button>
            </Link>
          )}
        </>
      )}
    </div>
  );
}
