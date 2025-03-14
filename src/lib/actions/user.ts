import { plaidClient } from "../plaid";
import { CountryCode, Products } from "plaid";

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

export async function createBankAccount() {}

export async function exchangePublicToken(publicToken: string) {
  try {
    const res = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
