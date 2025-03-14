"use client";

import { PlaidLinkOnSuccess, usePlaidLink } from "react-plaid-link";

export type PlaidLinkProps = {
  children: React.ReactNode;
  token: string | null;
  onSuccess: PlaidLinkOnSuccess;
};

export function PlaidLinkButton(props: PlaidLinkProps) {
  const { open, ready } = usePlaidLink({
    token: props.token,
    onSuccess: props.onSuccess,
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
