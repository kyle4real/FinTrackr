"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { GetInstitutionsResponse, GetTransactionsResponse } from "@/lib/actions/bank";
import { addMonths, format, isAfter, parseISO } from "date-fns";
import { Area, AreaChart, CartesianGrid, Pie, PieChart, XAxis, YAxis } from "recharts";

const colors = ["#2563eb", "#60a5fa", "#3b82f6", "#93c5fd", "#7e3af2"];

export type ChartsProps = {
  transactionsResponse: GetTransactionsResponse;
  institutionsResponse: GetInstitutionsResponse;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
};

export function Charts(props: ChartsProps) {
  const accounts: ChartAccountType[] = props.institutionsResponse.institutions
    .flatMap((i) =>
      i.accounts.map((a) => ({
        ...a,
        institutionId: i.institutionId,
        institutionName: i.institutionName,
      }))
    )
    .map((a, idx) => ({ ...a, color: colors[idx % colors.length] }));

  return (
    <div className="flex flex-col gap-6">
      <div className="md:min-w-[460px] md:w-fit w-full">
        <AccountsTotalChart {...props} accounts={accounts} />
      </div>
      <div className="flex-1">
        <AccountTransactionsTimelineChart {...props} accounts={accounts} />
      </div>
    </div>
  );
}

type ChartAccountType = GetInstitutionsResponse["institutions"][number]["accounts"][number] & {
  institutionId: string;
  institutionName: string;
  color: string;
};

export type ChartProps = ChartsProps & {
  accounts: ChartAccountType[];
};

function AccountsTotalChart(props: ChartProps) {
  const { institutionsResponse, accounts } = props;
  const config = accounts.reduce((acc, account) => {
    acc[account.id] = {
      label: account.institutionName + " - " + account.name,
      color: account.color,
    };
    return acc;
  }, {} as ChartConfig);

  const chartData = accounts.map((account) => ({
    id: account.id,
    balance: account.currentBalance,
    fill: `var(--color-${account.id})`,
  }));

  return (
    <Card>
      <CardContent className="flex gap-4">
        <ChartContainer className="min-h-[150px] aspect-square w-[150px]" config={config}>
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="balance"
              nameKey="id"
              innerRadius="70%"
              paddingAngle={0}
              labelLine={false}
              outerRadius="100%"
            />
          </PieChart>
        </ChartContainer>
        <div className="my-3">
          <CardTitle className="mb-3">Total accounts: {institutionsResponse.totalAccounts}</CardTitle>
          <div>
            <span className="block text-sm">Current Balance</span>
            <span className="block font-semibold text-xl">
              {formatCurrency(institutionsResponse.totalCurrentBalance)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function transformTransactionsToChartData(
  transactions: GetTransactionsResponse["transactions"],
  accounts: GetInstitutionsResponse["institutions"][number]["accounts"]
) {
  const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const chartData: Record<string, { date: string } & Record<string, number>> = {};

  // Initialize all accounts with their latest known balance from institutionsResponse
  const accountBalances = accounts.reduce((acc, account) => {
    acc[account.id] = account.currentBalance;
    return acc;
  }, {} as Record<string, number>);

  // Populate transaction data
  sortedTransactions.forEach((t) => {
    const dateGrouping = format(parseISO(t.date), "yyyy-MM");
    const accountId = t.account_id;

    chartData[dateGrouping] = chartData[dateGrouping] || { date: dateGrouping };
    chartData[dateGrouping][accountId] = t.running_balance;

    accountBalances[accountId] = t.running_balance; // Update last known balance
  });

  // Get all unique months from transactions
  const allMonths = Object.keys(chartData).sort();
  let currentMonth = allMonths.length > 0 ? parseISO(allMonths[0]) : new Date();

  // Ensure continuity by filling missing months & accounts
  while (!isAfter(currentMonth, new Date())) {
    const monthKey = format(currentMonth, "yyyy-MM");

    chartData[monthKey] = chartData[monthKey] || { date: monthKey };
    // Ensure every account has a balance entry for this month
    accounts.forEach((account) => {
      const accountId = account.id;
      chartData[monthKey][accountId] = chartData[monthKey][accountId] ?? accountBalances[accountId];
    });

    currentMonth = addMonths(currentMonth, 1); // Move to the next month
  }

  // Convert to final chart format
  return Object.values(chartData);
}

function AccountTransactionsTimelineChart(props: ChartProps) {
  const { transactionsResponse, accounts } = props;

  const chartData = transformTransactionsToChartData(transactionsResponse.transactions, accounts);

  const config = accounts.reduce((acc, account) => {
    acc[account.id] = {
      label: account.institutionName + " - " + account.name,
      color: account.color,
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions per account - Timeline</CardTitle>
        <CardDescription>Running balance per account over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="min-h-[200px] max-h-[400px] w-full" config={config}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray={"3 3"} />
            <YAxis axisLine={false} tickMargin={8} />
            <XAxis dataKey="date" axisLine={false} tickMargin={8} tickFormatter={(value) => value} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            {accounts.map(({ id }) => (
              <Area
                key={id}
                dataKey={id}
                type="natural"
                fill={`var(--color-${id})`}
                fillOpacity={0.4}
                stroke={`var(--color-${id})`}
                stackId="a"
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
