import AnimatedCounter from "./AnimatedCounter";
import { DoughnutChart } from "./DoughnutChart";
import { calculateChainBalances } from "@/utils/multiChainBalance";
import { useTokenBalances } from "@dynamic-labs/sdk-react-core";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TotalBalanceBox = ({
  accounts = [],
  totalBanks,
  totalCurrentBalance,
}: TotalBalanceBoxProps) => {
  const { tokenBalances } = useTokenBalances();
  const { chainBalances, totalBalanceUSD } =
    calculateChainBalances(tokenBalances);

  const totalBalance = totalCurrentBalance + totalBalanceUSD;
  const totalAccounts = totalBanks + Object.keys(chainBalances).length;

  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [lastAttestation, setLastAttestation] = useState<string | null>(null);
  const [loanAmount, setLoanAmount] = useState<number | null>(null);

  const handleGetScore = async () => {
    const score = Math.floor(Math.random() * (850 - 300 + 1)) + 300;
    setCreditScore(score);
    setLastAttestation(new Date().toISOString());
    setLoanAmount(totalBalance * 0.7);
  };

  return (
    <section className="total-balance hover:glassmorphism bg-white bg-secondary p-6 justify-between">
      <div className="flex justify-between w-full">
        <div className="w-1/2 justify-start">
          <h2 className="header-2 mb-4">Total Accounts: {totalAccounts}</h2>
          <div className="flex mb-4">
            <div className="w-1/3">
              <DoughnutChart
                accounts={accounts}
                chainBalances={chainBalances}
              />
            </div>
            <div className="w-2/3 pl-6">
              <p className="total-balance-label">Total Balance</p>
              <div className="total-balance-amount text-2xl font-bold">
                <AnimatedCounter amount={totalBalance} />
              </div>
              <div className="mt-4">
                <p>Bank Accounts: {totalBanks}</p>
                <AnimatedCounter amount={totalCurrentBalance} />
              </div>
              <div className="mt-2">
                <p>Crypto Accounts: {Object.keys(chainBalances).length}</p>
                <AnimatedCounter amount={totalBalanceUSD} />
              </div>
            </div>
          </div>
        </div>

        <div className="w-px bg-primary self-stretch mx-12"></div>

        <div className="w-1/2 flex flex-col justify-end items-end">
          <h2 className="header-2 mb-4">Financial Statement Attestation</h2>
          <Card className="w-full p-6 space-y-4 bg-background text-foreground">
            {creditScore === null ? (
              <div className="text-center">
                <p className="text-lg mb-2">No attestation available</p>
                <p className="text-3xl mb-2">👻</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Get your credit score and financial attestation to unlock
                  potential loan opportunities.
                </p>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleGetScore}
                >
                  Get Credit Score
                </Button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center space-x-6">
                  <div>
                    <div className="text-6xl font-bold inline-flex items-baseline ">
                      {creditScore || "N/A"}{" "}
                      <p className="text-3xl translate-y-2">👻</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Credit Score
                    </div>
                  </div>
                  <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleGetScore}
                  >
                    {creditScore ? "Update Score" : "Get Credit Score"}
                  </Button>
                </div>
                <div className="flex justify-between items-center space-x-6">
                  <div>
                    <div className="text-sm font-medium">Last Attested</div>
                    <div className="text-sm text-muted-foreground">
                      {lastAttestation
                        ? new Date(lastAttestation).toLocaleDateString()
                        : "Not available"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      Potential Loan Amount
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {loanAmount ? (
                        <AnimatedCounter amount={loanAmount} />
                      ) : (
                        "Not calculated"
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TotalBalanceBox;
