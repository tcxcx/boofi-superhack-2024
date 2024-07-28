"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DynamicEmbeddedWidget,
  useDynamicContext,
  useIsLoggedIn,
  DynamicNav,
} from "@dynamic-labs/sdk-react-core";
import { Portal } from "@/components/Portal";
import { Widget } from "./Widget";
import { ExtendedUserProfile } from "@/lib/types/dynamic";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function WidgetContainer() {
  const { user } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();
  const router = useRouter();
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isWorldIdVerifying, setIsWorldIdVerifying] = useState(false);

  const needsVerification =
    isLoggedIn &&
    (session?.sessionLevel !== 2 ||
      (user as ExtendedUserProfile)?.newUser ||
      !(user as ExtendedUserProfile)?.worldIdVerified ||
      !(user as ExtendedUserProfile)?.plaidConnected);

  const handleWorldIdStart = () => {
    setIsWorldIdVerifying(true);
    setIsDialogOpen(false);
  };

  const handleWorldIdClose = (success: boolean) => {
    setIsWorldIdVerifying(false);
    if (success) {
      setIsDialogOpen(false);
    }
  };

  const goToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex items-center space-x-2">
      <DynamicNav />
      {!isLoggedIn && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="px-4 py-2 text-xs rounded-md bg-indigo-600 text-white dark:bg-indigo-400 dark:text-gray-900 transition-colors duration-200 hover:bg-indigo-500 dark:hover:bg-indigo-300">
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
          {needsVerification ? (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="px-4 py-2 text-xs rounded-md bg-indigo-600 text-white dark:bg-indigo-400 dark:text-gray-900 transition-colors duration-200 hover:bg-indigo-500 dark:hover:bg-indigo-300">
                  Complete Verification
                </Button>
              </DialogTrigger>
              <Portal id="verification-dialog-portal">
                <DialogContent className="sm:max-w-[700px]">
                  <Widget
                    needsVerification={needsVerification}
                    onWorldIdStart={handleWorldIdStart}
                    onWorldIdClose={handleWorldIdClose}
                    sessionLevel={session?.sessionLevel}
                  />
                </DialogContent>
              </Portal>
            </Dialog>
          ) : (
            <Button
              onClick={goToDashboard}
              className="px-4 py-2 text-xs rounded-md bg-green-600 text-white dark:bg-green-400 dark:text-gray-900 transition-colors duration-200 hover:bg-green-500 dark:hover:bg-green-300"
            >
              Go to Dashboard
            </Button>
          )}
        </>
      )}
    </div>
  );
}
