import React from "react";
import { useSendTransaction } from "@/hooks/use-dynamic-tx";
import { TransactionToast } from "@/components/transaction-toast";
import { Wallet } from "@dynamic-labs/sdk-react-core";
import { NetworkConfigurationMap } from "@dynamic-labs/types";

interface TransactionButtonProps {
  address: any;
  amount: string;
  wallet: Wallet;
  networkConfigurations: NetworkConfigurationMap;
}

export const TransactionButton: React.FC<TransactionButtonProps> = ({
  address,
  amount,
  wallet,
  networkConfigurations,
}) => {
  const { sendTransaction, transactionHash, chain } = useSendTransaction();

  const handleClick = async () => {
    await sendTransaction(address, amount, wallet, networkConfigurations);
  };

  return (
    <>
      <button onClick={handleClick}>Send Transaction</button>
      {transactionHash && chain && (
        <TransactionToast transactionHash={transactionHash} chain={chain} />
      )}
    </>
  );
};
