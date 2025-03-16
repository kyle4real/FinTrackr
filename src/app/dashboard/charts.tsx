"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { GetInstitutionsResponse, GetTransactionsResponse } from "@/lib/actions/bank";
import { format } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const colors = ["#2563eb", "#60a5fa", "#3b82f6", "#93c5fd", "#7e3af2"];

export type ChartsProps = {
  transactionsResponse: GetTransactionsResponse;
  institutionsResponse: GetInstitutionsResponse;
};

export function Charts(props: ChartsProps) {
  const { transactionsResponse } = props;

  const accountIds = new Set<string>();
  const chartData = Object.values(
    transactionsResponse.transactions.reduce((acc, t) => {
      const dateGrouping = format(t.date, "MM/yyyy");
      const accountId = t.account_id;

      accountIds.add(accountId);

      acc[dateGrouping] = acc[dateGrouping] || { date: dateGrouping };
      acc[dateGrouping][accountId] = (acc[dateGrouping][accountId] || 0) + t.running_balance;

      return acc;
    }, {} as Record<string, { date: string } & Record<string, number>>)
  ).sort((a, b) => b.date.localeCompare(a.date));

  const accounts = props.institutionsResponse.institutions
    .flatMap((i) => i.accounts)
    .filter((a) => accountIds.has(a.id));

  const config = accounts.reduce((acc, account, idx) => {
    acc[account.id] = {
      label: account.name,
      color: colors[idx % colors.length],
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Transactions per account - Timeline</CardTitle>
          <CardDescription>Running balance per account over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer className="min-h-[200px] w-full" config={config}>
            <AreaChart data={chartData}>
              <CartesianGrid vertical={false} />

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
    </div>
  );
}
