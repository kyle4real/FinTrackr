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
