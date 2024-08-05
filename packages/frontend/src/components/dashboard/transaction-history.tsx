import React, { useEffect, useState } from "react";
import HeaderBox from "@/components/bank/HeaderBox";
import { Pagination } from "@/components/bank/Pagination";
import TransactionsTable from "@/components/bank/TransactionsTable";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { FormatAmount } from "@/utils";
import { CombinedUserProfile } from "@/lib/types/dynamic";

interface TransactionHistoryProps {
  searchParams: {
    userId: string;
    page: string;
    id?: string;
  };
  user: CombinedUserProfile;
  error: Error | null;
}

const TransactionHistory = ({
  searchParams: { userId, page, id },
  error,
}: TransactionHistoryProps) => {
  const [accounts, setAccounts] = useState<any>(null);
  const [account, setAccount] = useState<any>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const currentPage = Number(page) || 1;

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          console.log("Fetching data for userId:", userId, "and id:", id);
          const accountsData = await getAccounts({ userId });
          if (accountsData) {
            setAccounts(accountsData);
            const appwriteItemId = id || accountsData.data[0]?.appwriteItemId;
            console.log("Using appwriteItemId:", appwriteItemId);
            const accountData = await getAccount({ appwriteItemId });
            setAccount(accountData);
          } else {
            setFetchError("No accounts found for this user");
          }
        } catch (err) {
          console.error("Error fetching account data:", err);
          setFetchError("Failed to fetch account data");
        }
      }
    };

    fetchData();
  }, [userId, id]);

  if (error) return <div>Error: {error.message}</div>;
  if (fetchError) return <div>{fetchError}</div>;
  if (!accounts || !account) return <div>No account data found</div>;

  const rowsPerPage = 10;
  const totalPages = Math.ceil(account.transactions.length / rowsPerPage);

  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = account.transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  return (
    <div className="transactions">
      <div className="transactions-header">
        <HeaderBox
          title="Transaction History"
          subtext="See your bank details and transactions."
        />
      </div>

      <div className="space-y-6">
        <div className="transactions-account">
          <div className="flex flex-col gap-2">
            <h2 className="text-18 font-bold text-white">
              {account.data.name}
            </h2>
            <p className="text-14 text-blue-25">{account.data.officialName}</p>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●● {account.data.mask}
            </p>
          </div>

          <div className="transactions-account-balance">
            <p className="text-14">Current balance</p>
            <p className="text-24 text-center font-bold">
              {FormatAmount(account.data.currentBalance)}
            </p>
          </div>
        </div>

        <section className="flex w-full flex-col gap-6">
          <TransactionsTable transactions={currentTransactions} />
          {totalPages > 1 && (
            <div className="my-4 w-full">
              <Pagination totalPages={totalPages} page={currentPage} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TransactionHistory;
