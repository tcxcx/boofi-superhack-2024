// /home/tcxcx/coding_projects/template-hackathon-2024/src/components/dashboard/home.tsx

import { useEffect, useState, useCallback } from "react";
import HeaderBox from "@/components/bank/HeaderBox";
import RecentTransactions from "@/components/bank/RecentTransactions";
import RightSidebar from "@/components/bank/RightSidebar";
import TotalBalanceBox from "@/components/bank/TotalBalanceBox";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { CombinedUserProfile } from "@/lib/types/dynamic";
import { ErrorBoundary } from "react-error-boundary";

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
  const currentPage = Number(page) || 1;

  const fetchAccounts = useCallback(async () => {
    const accountsData = await getAccounts({ userId });
    console.log("Here are the Accounts:", accountsData);

    if (accountsData) {
      setAccounts(accountsData);
      const appwriteItemId = accountsData.data[0]?.appwriteItemId;
      const accountData = await getAccount({ appwriteItemId });
      setAccount(accountData);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchAccounts();
    }
  }, [userId, fetchAccounts]);

  console.log("Home Component User ID:", userId);
  console.log("Home Component User:", user);
  console.log("Home Component Accounts:", accounts);
  console.log("Home Component Only Accounts:", account);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return <div>No user found</div>;
  }

  if (!accounts) {
    return <div>No accounts found</div>;
  }

  console.log("Array of Accounts Data:", accounts?.data);
  console.log("Simple Account Data:", account);
  console.log(
    "Appwrite passed as props from Home:",
    account?.data?.appwriteItemId
  );
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
          />
        </header>

        <RecentTransactions
          accounts={accounts.data}
          transactions={account?.transactions}
          appwriteItemId={account?.data?.appwriteItemId}
          page={currentPage}
          userId={userId}
        />
      </div>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <RightSidebar
          user={user}
          transactions={account?.transactions}
          banks={accounts.data?.slice(0, 2)}
        />
      </ErrorBoundary>
    </section>
  );
};

export default Home;
