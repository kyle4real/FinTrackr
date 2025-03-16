"use client";

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
          <TableHead>Institution</TableHead>
          <TableHead>Account</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Balance</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Date</TableHead>
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
              <TableCell>{institution?.institutionName}</TableCell>
              <TableCell>{account?.name}</TableCell>
              <TableCell>{formatCurrency(transaction.amount)}</TableCell>
              <TableCell>{formatCurrency(transaction.runningBalance)}</TableCell>
              <TableCell>{transaction.personal_finance_category?.primary}</TableCell>
              <TableCell>{transaction.date ? format(transaction.date, "MM/dd/yyyy") : null}</TableCell>
              <TableCell>{transaction.merchant_name}</TableCell>
              <TableCell>{transaction.payment_channel}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
