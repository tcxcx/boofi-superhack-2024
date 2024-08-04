import React from "react";
import {
  DynamicEmbeddedWidget,
  useIsLoggedIn,
} from "@dynamic-labs/sdk-react-core";
import { AuthFlow } from "./AuthFlow";

interface WidgetProps {
  needsVerification: boolean;
  onWorldIdStart: () => void;
  onWorldIdClose: (success: boolean) => void;
  onPlaidStart: () => void;
  onPlaidClose: (success: boolean) => void;
  sessionLevel?: number;
  isWorldIdVerifying: boolean;
  isPlaidVerifying: boolean;
}

export const Widget: React.FC<WidgetProps> = ({
  needsVerification,
  isWorldIdVerifying,
  isPlaidVerifying,
  onWorldIdStart,
  onWorldIdClose,
  onPlaidStart,
  onPlaidClose,
  sessionLevel,
}) => {
  const isLoggedIn = useIsLoggedIn();
  return (
    <div className="widget-container">
      {isLoggedIn && (
        <>
          <DynamicEmbeddedWidget />
          <AuthFlow
            needsVerification={needsVerification}
            onWorldIdStart={onWorldIdStart}
            onWorldIdClose={onWorldIdClose}
            onPlaidStart={onPlaidStart}
            onPlaidClose={onPlaidClose}
            sessionLevel={sessionLevel}
            isWorldIdVerifying={isWorldIdVerifying}
            isPlaidVerifying={isPlaidVerifying}
          />
        </>
      )}
    </div>
  );
};
