"use server";

import { plaidClient } from "../plaid";
import { CountryCode, Products } from "plaid";
import prisma from "../prisma";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "../constants";
import { PlaidLinkOnSuccessMetadata } from "react-plaid-link";

export async function createPlaidLinkToken(data: { id: string; name: string }) {
  try {
    const res = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: data.id,
      },
      client_name: data.name,
      products: [Products.Auth, Products.Transactions],
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

export async function linkInstitution(publicToken: string, metadata: PlaidLinkOnSuccessMetadata, userId: string) {
  try {
    const institutionId = metadata.institution?.institution_id;

    if (institutionId) {
      const isLinkedAlready = await prisma.linkedInstitution.findFirst({
        where: {
          institutionId: institutionId,
          userId: userId,
        },
      });

      if (isLinkedAlready) {
        return { error: "Institution already linked", severity: "warning" };
      }
    }

    const {
      data: { item_id: itemId, access_token: accessToken },
    } = await plaidClient.itemPublicTokenExchange({ public_token: publicToken });

    const {
      data: { item },
    } = await plaidClient.itemGet({ access_token: accessToken });

    const data = await prisma.linkedInstitution.create({
      data: {
        itemId: itemId,
        institutionId: item.institution_id!,
        institutionName: item.institution_name!,
        accessToken: accessToken,
        userId: userId,
      },
    });

    revalidateTag(CACHE_TAGS.LINKED_INSTITUTIONS);

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "There was an error", severity: "error" };
  }
}
