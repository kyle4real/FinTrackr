import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { plaidClient } from "../plaid";
import prisma from "../prisma";
import { CACHE_TAGS } from "../constants";

export async function getAccounts(userId: string) {
  "use cache";
  cacheTag(CACHE_TAGS.ACCOUNTS, userId);

  try {
    const banks = await prisma.bankAccount.findMany({ where: { userId: userId } });

    const accounts = await Promise.all(
      banks.map(async (bank) => {
        const {
          data: { accounts, item },
        } = await plaidClient.accountsGet({ access_token: bank.accessToken });
        const account = accounts[0];

        // const institution = await plaidClient.institutionsGetById({
        //   institution_id: item.institution_id!,
        //   country_codes: [CountryCode.Us],
        // });

        return {
          accountId: bank.accountId,
          availableBalance: account.balances.available ?? 0,
          currentBalance: account.balances.current ?? 0,
          institutionId: item.institution_id!,
          name: account.name,
          officialName: account.official_name,
          mask: account.mask,
          type: account.type,
          subtype: account.subtype,

          id: bank.id,
        };
      })
    );

    const totalCurrentBalance = accounts.reduce((acc, a) => acc + a.currentBalance, 0);

    return {
      totalAccounts: accounts.length,
      totalCurrentBalance: totalCurrentBalance,
      accounts: accounts,
    };
  } catch (error) {
    console.error(error);
    return {
      totalAccounts: 0,
      totalCurrentBalance: 0,
      accounts: [],
    };
  }
}
