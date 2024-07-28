"use client";

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
  sessionLevel?: number;
}

export const Widget: React.FC<WidgetProps> = ({
  needsVerification,
  onWorldIdStart,
  onWorldIdClose,
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
            sessionLevel={sessionLevel}
          />
        </>
      )}
    </div>
  );
};
