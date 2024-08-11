import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BankTabItem } from "./BankTabItem";
import { WalletTabItem } from "./WalletTabItem";
import BankInfo from "./BankInfo";
import TransactionsTable from "./TransactionsTable";
import { Pagination } from "./Pagination";
import BlurFade from "../magicui/blur-fade";
import { Account, UnifiedTransaction, CryptoTransaction } from "@/lib/types";

interface RecentTransactionsProps {
  accounts: Account[];
  transactions: UnifiedTransaction[];
  appwriteItemId: string;
  page: number;
  userId: string;
  wallets: string[];
  walletTransactions: Record<string, CryptoTransaction[]>;
}

const RecentTransactions = ({
  accounts,
  transactions = [],
  appwriteItemId,
  page = 1,
  userId,
  wallets = [],
  walletTransactions = {},
}: RecentTransactionsProps) => {
  const rowsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);
  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <h2 className="recent-transactions-label">Recent transactions</h2>
        <Link
          href={`/dashboard/transaction-history?id=${appwriteItemId}&userId=${userId}`}
          className="view-all-btn"
        >
          View all
        </Link>
      </header>

      <Tabs defaultValue={appwriteItemId} className="w-full">
        <TabsList className="recent-transactions-tablist">
          {accounts.map((account: Account) => (
            <TabsTrigger key={account.id} value={account.appwriteItemId}>
              <BankTabItem
                key={account.id}
                account={account}
                appwriteItemId={appwriteItemId}
              />
            </TabsTrigger>
          ))}
          {wallets.map((wallet) => (
            <TabsTrigger key={wallet} value={wallet}>
              <WalletTabItem wallet={wallet} />
            </TabsTrigger>
          ))}
        </TabsList>

        {accounts.map((account: Account) => (
          <TabsContent
            value={account.appwriteItemId}
            key={account.id}
            className="space-y-4"
          >
            <BankInfo
              account={account}
              appwriteItemId={appwriteItemId}
              type="full"
            />

            <TransactionsTable transactions={currentTransactions} />

            {totalPages > 1 && (
              <div className="my-4 w-full">
                <Pagination totalPages={totalPages} page={page} />
              </div>
            )}
          </TabsContent>
        ))}

        {wallets.map((wallet) => (
          <TabsContent value={wallet} key={wallet} className="space-y-4">
            <TransactionsTable
              transactions={walletTransactions[wallet] || []}
              isCrypto
            />

            {walletTransactions[wallet]?.length > rowsPerPage && (
              <div className="my-4 w-full">
                <Pagination
                  totalPages={Math.ceil(
                    walletTransactions[wallet].length / rowsPerPage
                  )}
                  page={page}
                />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default RecentTransactions;
