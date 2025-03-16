"use client";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GetInstitutionsResponse, GetTransactionsResponse } from "@/lib/actions/bank";
import { format } from "date-fns";

export type TransactionsTableProps = {
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

export function TransactionsTable(props: TransactionsTableProps) {
  const { transactionsResponse, institutionsResponse } = props;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Institution</TableHead>
          <TableHead>Account</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Acct Bal</TableHead>
          <TableHead>Net Worth</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Merchant</TableHead>
          <TableHead>Channel</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactionsResponse.transactions.map((transaction) => {
          const institution = institutionsResponse.institutions.find(
            (i) => i.institutionId === transaction.institutionId
          );

          const account = institution?.accounts.find((a) => a.id === transaction.account_id);

          return (
            <TableRow key={transaction.transaction_id}>
              <TableCell>{transaction.date ? format(transaction.date, "MM/dd/yyyy") : null}</TableCell>
              <TableCell>
                <Badge>{institution?.institutionName}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{account?.name}</Badge>
              </TableCell>
              <TableCell className="font-medium">{formatCurrency(transaction.amount)}</TableCell>
              <TableCell>{formatCurrency(transaction.running_balance)}</TableCell>
              <TableCell>{formatCurrency(transaction.total_running_balance)}</TableCell>
              <TableCell>
                <Badge variant="outline" className="lowercase">
                  {transaction.personal_finance_category?.primary}
                </Badge>
              </TableCell>
              <TableCell>{transaction.merchant_name}</TableCell>
              <TableCell>{transaction.payment_channel}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
