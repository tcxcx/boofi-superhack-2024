"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { DoughnutChartProps } from "@/lib/types";

ChartJS.register(ArcElement, Tooltip, Legend);

export const DoughnutChart = ({
  accounts,
  chainBalances,
}: DoughnutChartProps) => {
  const bankNames = accounts.map((a) => a.name);
  const bankBalances = accounts.map((a) => a.currentBalance);

  const cryptoNames = Object.keys(chainBalances);
  const cryptoBalances = Object.values(chainBalances).map(
    (chain) => chain.totalUSD
  );

  const data = {
    datasets: [
      {
        label: "Accounts",
        data: [...bankBalances, ...cryptoBalances],
        backgroundColor: [
          "#b388ff",
          "#7c4dff",
          "#2f91fa",
          "#ff6b6b",
          "#feca57",
          "#48dbfb",
          "#ff9ff3",
          "#54a0ff",
          "#5f27cd",
        ],
      },
    ],
    labels: [...bankNames, ...cryptoNames],
  };

  return (
    <Doughnut
      data={data}
      options={{
        cutout: "60%",
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
    />
  );
};
