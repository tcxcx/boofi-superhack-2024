import { Wallet } from "@dynamic-labs/sdk-react-core";
import { NetworkConfigurationMap } from "@dynamic-labs/types";
import { Chain } from "viem/chains";
import { TransactionButton } from "@/components/tx-button/index";

// Assuming you have the wallet, address, amount, networkConfigurations from your context or props
const MyComponent = ({
  wallet,
  address,
  amount,
  networkConfigurations,
}: {
  wallet: Wallet;
  address: string;
  amount: string;
  networkConfigurations: NetworkConfigurationMap;
}) => {
  return (
    <TransactionButton
      wallet={wallet}
      address={address}
      amount={amount}
      networkConfigurations={networkConfigurations}
    />
  );
};

export default MyComponent;
