"use server";

import { plaidClient } from "../plaid";
import { CountryCode, Products } from "plaid";
import prisma from "../prisma";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "../constants";

export async function createPlaidLinkToken(data: { id: string; name: string }) {
  try {
    const res = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: data.id,
      },
      client_name: data.name,
      products: [Products.Auth],
      language: "en",
      country_codes: [CountryCode.Us],
    });

    const link = res.data.link_token;

    return link;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createBankAccount(publicToken: string, userId: string) {
  try {
    const {
      data: { item_id: itemId, access_token: accessToken },
    } = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const {
      data: { accounts },
    } = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    if (!accounts || accounts.length === 0) {
      return null;
    }

    const account = accounts[0];

    const data = await prisma.bankAccount.create({
      data: {
        bankId: itemId,
        accessToken: accessToken,
        accountId: account.account_id,
        userId: userId,
        name: account.name,
        mask: account.mask,
        officialName: account.official_name,
        subtype: account.subtype,
        type: account.type,
      },
    });

    revalidateTag(CACHE_TAGS.ACCOUNTS);

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
