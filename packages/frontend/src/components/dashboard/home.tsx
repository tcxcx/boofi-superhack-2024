import { useEffect, useState, useCallback } from "react";
import HeaderBox from "@/components/bank/HeaderBox";
import RecentTransactions from "@/components/bank/RecentTransactions";
import RightSidebar from "@/components/bank/RightSidebar";
import TotalBalanceBox from "@/components/bank/TotalBalanceBox";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import {
  getUserWallets,
  getUserTransactions,
} from "@/lib/actions/mirror-pipeline.actions";
import { CombinedUserProfile } from "@/lib/types/dynamic";
import { Transaction, CryptoTransaction } from "@/lib/types";
import { ErrorBoundary } from "react-error-boundary";
import { useTokenBalances } from "@dynamic-labs/sdk-react-core";
import { calculateChainBalances } from "@/utils/multiChainBalance";

interface SearchParamProps {
  userId: string;
  searchParams: {
    userId: string;
    page: string;
  };
  user: CombinedUserProfile | null;
  loading: boolean;
  error: Error | null;
}

const Home = ({
  searchParams: { userId, page },
  user,
  loading,
  error,
}: SearchParamProps) => {
  const [accounts, setAccounts] = useState<any>(null);
  const [account, setAccount] = useState<any>(null);
  const [walletTransactions, setWalletTransactions] = useState<
    Record<string, CryptoTransaction[]>
  >({});
  const currentPage = Number(page) || 1;

  const fetchAccounts = useCallback(async () => {
    try {
      const accountsData = await getAccounts({ userId });

      if (accountsData) {
        setAccounts(accountsData);
        const appwriteItemId = accountsData.data[0]?.appwriteItemId;
        const accountData = await getAccount({ appwriteItemId });
        setAccount(accountData);
      }

      const wallets = await getUserWallets(userId);
      console.log("User Wallets:", wallets);

      const walletTransactions = await Promise.all(
        wallets.map(async (wallet) => {
          const transactions = await getUserTransactions([wallet]);

          const typedTransactions = transactions.map((t: any) => ({
            from_address: t.from_address,
            to_address: t.to_address,
            value: t.value,
          })) as CryptoTransaction[];

          return { wallet, transactions: typedTransactions };
        })
      );

      const walletTransactionsMap = walletTransactions.reduce((acc, curr) => {
        acc[curr.wallet] = curr.transactions;
        return acc;
      }, {} as Record<string, CryptoTransaction[]>);

      console.log("User Transactions:", walletTransactionsMap);

      setWalletTransactions(walletTransactionsMap);
    } catch (error) {
      console.error("Error fetching accounts or transactions:", error);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchAccounts();
    }
  }, [userId, fetchAccounts]);

  const { tokenBalances } = useTokenBalances();
  const { chainBalances, totalBalanceUSD } =
    calculateChainBalances(tokenBalances);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return <div>No user found</div>;
  }

  if (!accounts) {
    return <div>No accounts found</div>;
  }

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={user.firstName || "Guest"}
            subtext="Access and manage your account and transactions efficiently."
          />

          <TotalBalanceBox
            accounts={accounts.data}
            totalBanks={accounts.totalBanks}
            totalCurrentBalance={accounts.totalCurrentBalance}
            chainBalances={chainBalances}
            totalBalanceUSD={totalBalanceUSD}
          />
        </header>

        <RecentTransactions
          accounts={accounts.data}
          transactions={account?.transactions}
          appwriteItemId={account?.data?.appwriteItemId}
          page={currentPage}
          userId={userId}
          wallets={Object.keys(walletTransactions)}
          walletTransactions={walletTransactions}
        />
      </div>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <RightSidebar
          user={{ ...user, ens: user.ens || "" }}
          transactions={account?.transactions}
          banks={accounts.data?.slice(0, 2)}
        />
      </ErrorBoundary>
    </section>
  );
};

export default Home;
