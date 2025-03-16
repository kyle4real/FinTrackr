import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { plaidClient } from "../plaid";
import prisma from "../prisma";
import { CACHE_TAGS } from "../constants";

export async function getInstitutions(userId: string) {
  "use cache";
  cacheTag(CACHE_TAGS.LINKED_INSTITUTIONS, userId);

  try {
    const linkedInstitutions = await prisma.linkedInstitution.findMany({ where: { userId: userId } });

    const institutions = await Promise.all(
      linkedInstitutions.map(async (institution) => {
        const {
          data: { accounts, item },
        } = await plaidClient.accountsGet({ access_token: institution.accessToken });

        const leanAccounts = accounts.map((a) => {
          return {
            id: a.account_id,
            name: a.name,
            type: a.type,
            subtype: a.subtype,
            mask: a.mask,
            currentBalance: a.balances.current ?? 0,
            availableBalance: a.balances.available ?? 0,
          };
        });

        const totalInstitutionBalance = leanAccounts.reduce((acc, a) => acc + a.currentBalance, 0);

        return {
          institutionId: item.institution_id!,
          institutionName: item.institution_name!,
          accounts: leanAccounts,
          totalAccounts: leanAccounts.length,
          totalInstitutionBalance: totalInstitutionBalance,
        };
      })
    );

    return {
      institutions: institutions,
      totalInstitutions: institutions.length,
      totalAccounts: institutions.reduce((acc, a) => acc + a.totalAccounts, 0),
      totalCurrentBalance: institutions.reduce((acc, a) => acc + a.totalInstitutionBalance, 0),
    };
  } catch (error) {
    console.error(error);
    return {
      institutions: [],
      totalInstitutions: 0,
      totalAccounts: 0,
      totalCurrentBalance: 0,
    };
  }
}

export type GetInstitutionsResponse = Awaited<ReturnType<typeof getInstitutions>>;

export async function getTransactions(userId: string) {
  "use cache";
  cacheTag(CACHE_TAGS.TRANSACTIONS, userId);

  try {
    const linkedInstitutions = await prisma.linkedInstitution.findMany({ where: { userId: userId } });

    const transactions = await Promise.all(
      linkedInstitutions.map(async (institution) => {
        const {
          data: { transactions, accounts },
        } = await plaidClient.transactionsGet({
          access_token: institution.accessToken,
          start_date: "2021-01-01",
          end_date: "2025-03-15",
        });

        const accountBalances: Record<string, number> = {};
        accounts.forEach((account) => {
          accountBalances[account.account_id] = account.balances.current ?? 0;
        });

        const transactionsWithRunningBalanaces = transactions.map((transaction) => {
          const accountId = transaction.account_id;
          if (!accountBalances[accountId]) {
            return {
              ...transaction,
              runningBalance: 0,
            };
          }

          accountBalances[accountId] -= transaction.amount;

          return {
            ...transaction,
            runningBalance: accountBalances[accountId],
          };
        });

        return transactionsWithRunningBalanaces.map((t) => ({
          ...t,
          institutionId: institution.institutionId,
        }));
      })
    );

    const allTransactions = transactions.flat().sort((a, b) => (a.date > b.date ? -1 : 1));

    return {
      transactions: allTransactions,
      totalTransactions: allTransactions.length,
    };
  } catch (error) {
    console.error(error);
    return {
      transactions: [],
      totalTransactions: 0,
    };
  }
}

export type GetTransactionsResponse = Awaited<ReturnType<typeof getTransactions>>;
