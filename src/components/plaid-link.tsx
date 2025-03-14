"use client";

import { createBankAccount } from "@/lib/actions/user";
import { useCallback } from "react";
import { PlaidLinkOnSuccess, usePlaidLink } from "react-plaid-link";

export type PlaidLinkProps = {
  children: React.ReactNode;
  token: string | null;
  userId: string;
};

export function PlaidLinkButton(props: PlaidLinkProps) {
  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    (publicToken) => {
      createBankAccount(publicToken, props.userId);
    },
    [props.userId]
  );

  const { open, ready } = usePlaidLink({
    token: props.token,
    onSuccess: onSuccess,
  });

  return (
    <button
      onClick={() => open()}
      className="not-disabled:cursor-pointer disabled:cursor-not-allowed"
      disabled={!ready}
    >
      {props.children}
    </button>
  );
}
