"use client";

import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface DoughnutChartProps {
  accounts: { name: string; currentBalance: number }[];
}

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
  const chartData = accounts.map((account, index) => ({
    name: account.name,
    value: account.currentBalance,
    fill: `hsl(var(--chart-${index + 1}))`,
  }));

  const chartConfig: ChartConfig = accounts.reduce((config, account, index) => {
    config[account.name] = {
      label: account.name,
      color: `hsl(var(--chart-${index + 1}))`,
    };
    return config;
  }, {} as ChartConfig);

  chartConfig.value = { label: "Balance" };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Account Balances</CardTitle>
        <CardDescription>Current account balances</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={5}
              activeIndex={0}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Total balance:{" "}
          {accounts
            .reduce((sum, account) => sum + account.currentBalance, 0)
            .toFixed(2)}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing current balances for all accounts
        </div>
      </CardFooter>
    </Card>
  );
};

export default DoughnutChart;
