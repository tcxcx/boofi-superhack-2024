// src/components/dynamic-content/WidgetContainer.tsx

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
import { AuthFlow } from "./AuthFlow";
import { ExtendedUserProfile } from "@/lib/types/dynamic";

export function WidgetContainer() {
  const { user } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();

  const needsVerification =
    user &&
    (!(user as ExtendedUserProfile).worldIdVerified ||
      !(user as ExtendedUserProfile).plaidConnected);

  return (
    <>
      {isLoggedIn ? (
        <div className="z-1">
          <DynamicNav />
          {needsVerification && (
            <Dialog defaultOpen={true}>
              <Portal id="verification-portal">
                <DialogContent className="sm:max-w-[700px]">
                  <DialogTitle>Verification Required</DialogTitle>
                  <DialogDescription>
                    Please complete the following verification steps.
                  </DialogDescription>
                  <AuthFlow />
                </DialogContent>
              </Portal>
            </Dialog>
          )}
        </div>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="px-4 py-2 text-xs rounded-md bg-indigo-600 text-white dark:bg-indigo-400 dark:text-gray-900 transition-colors duration-200 hover:bg-indigo-500 dark:hover:bg-indigo-300">
              Login / Signup
            </Button>
          </DialogTrigger>
          <Portal id="dialog-portal">
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
    </>
  );
}
