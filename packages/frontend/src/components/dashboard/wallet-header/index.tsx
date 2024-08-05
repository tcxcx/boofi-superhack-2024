import React from "react";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

const WalletHeader: React.FC = () => {
  return (
    <div className="relative z-20">
      <nav className="absolute top-4 right-12">
        <DynamicWidget variant="modal" />
      </nav>
    </div>
  );
};

export default WalletHeader;
