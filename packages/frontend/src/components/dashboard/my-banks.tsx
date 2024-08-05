// /src/components/dashboard/my-banks.tsx

import React, { useEffect, useState } from "react";
import BankCard from "@/components/bank/BankCard";
import HeaderBox from "@/components/bank/HeaderBox";
import { getAccounts } from "@/lib/actions/bank.actions";
import { CombinedUserProfile } from "@/lib/types/dynamic";

interface MyBanksProps {
  userId: string;
  user: CombinedUserProfile;
  loading: boolean;
  error: Error | null;
}

const MyBanks = ({ userId, user, loading, error }: MyBanksProps) => {
  const [accounts, setAccounts] = useState<any>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (userId) {
        const accountsData = await getAccounts({ userId });
        if (accountsData) {
          setAccounts(accountsData);
        }
      }
    };

    fetchAccounts();
  }, [userId]);

  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>No user found</div>;
  if (!accounts) return <div>No accounts found</div>;

  return (
    <section className="flex">
      <div className="my-banks">
        <HeaderBox
          title="My Bank Accounts"
          subtext="Effortlessly manage your banking activities."
        />

        <div className="space-y-4">
          <h2 className="header-2">Your cards</h2>
          <div className="flex flex-wrap gap-6">
            {accounts.data.map((a: Account) => (
              <BankCard key={a.id} account={a} userName={user.firstName} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyBanks;
