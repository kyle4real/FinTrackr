import { User } from "@prisma/client";
import { plaidClient } from "../plaid";
import { CountryCode, Products } from "plaid";

export async function createPlaidLinkToken(user: User) {
  try {
    const res = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: user.id,
      },
      client_name: user.name || "Anonymous User",
      products: [Products.Auth],
      language: "en",
      country_codes: [CountryCode.Us],
    });

    const link = res.data.link_token;

    return link;
  } catch (error) {
    console.error(error);
  }
}
