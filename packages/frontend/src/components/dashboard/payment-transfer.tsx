import React, { useEffect, useState } from "react";
import HeaderBox from "@/components/bank/HeaderBox";
import PaymentTransferForm from "@/components/bank/PaymentTransferForm";
import { getAccounts } from "@/lib/actions/bank.actions";
import { CombinedUserProfile } from "@/lib/types/dynamic";

interface PaymentTransferProps {
  userId: string;
  user: CombinedUserProfile;
  loading: boolean;
  error: Error | null;
}

const PaymentTransfer = ({
  userId,
  user,
  loading,
  error,
}: PaymentTransferProps) => {
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
    <section className="payment-transfer">
      <HeaderBox
        title="Payment Transfer"
        subtext="Please provide any specific details or notes related to the payment transfer"
      />

      <section className="size-full pt-5">
        <PaymentTransferForm accounts={accounts.data} />
      </section>
    </section>
  );
};

export default PaymentTransfer;
